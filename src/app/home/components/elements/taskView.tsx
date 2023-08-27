import { useSelector } from 'react-redux'
import styles from '../tasklist.module.scss'
import { RootState } from '@/app/redux/store'
import { format } from 'date-fns'
import { FormEvent, MouseEvent, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { AiOutlineCheck } from 'react-icons/ai'
import { BiSolidEditAlt } from 'react-icons/bi'
import { BsFillTrashFill } from 'react-icons/bs'
import { completeTask, fetchTasksAndCategories, newTaskDays, priorityMap, setCategories, setTaskDays, setTaskView, setTasks } from '@/app/redux/features/taskSlice'
import { IoClose } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/auth/firebase'
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { removeTaskFromCol } from '@/app/redux/features/kanbanSlice'


type Props = {}

const TaskView = (props: Props) => {

    const tasks = useSelector((state: RootState) => state.task.tasks)
    const categories = useSelector((state: RootState) => state.task.categories)
    const columns = useSelector((state: RootState) => state.kanban.kanCols)
    const taskId = useSelector((state: RootState) => state.task.taskView)
    const [editView, setEditView] = useState(false)
    const [deleteView, setDeleteView] = useState(false)
    const [edit, setEdit] = useState(tasks[taskId].description)
    const dispatch = useDispatch()
    const [user, _, __] = useAuthState(auth)

    const handleDelete = async () => {
        if (!user || !taskId) return
        /*
            Delete category if only one task remaining (task to be deleted) else update
        */
        if (tasks[taskId].category !== 'none') {
            if (categories[tasks[taskId].category].tasks.length === 1) {
                await deleteDoc(doc(db, `users/${user.uid}/categories/${tasks[taskId].category}`))
            }
            else {
                await updateDoc(doc(db, `users/${user?.uid}/categories/${tasks[taskId].category}`), {
                    tasks: arrayRemove(taskId)
                })
            }
        }
        
        Object.keys(columns).map((column) => {
            let i = columns[column].tasks.indexOf(taskId)
            if (i > -1) {
                updateDoc(doc(db, `users/${user.uid}/kanbanColumns/${column}`), {
                    tasks: arrayRemove(taskId)
                })
                dispatch(removeTaskFromCol({colId: column, taskIdx: i}))
            }
        })

        await deleteDoc(doc(db, `users/${user?.uid}/tasks/${taskId}`))
    

        const [newTasks, newCategories] = await fetchTasksAndCategories(user?.uid)

    
        setDeleteView(false)
        setEdit('')
        setEditView(false)
        dispatch(setTaskView(''))
        dispatch(setTasks(newTasks))
        dispatch(setCategories(newCategories))
        dispatch(setTaskDays(newTaskDays(newTasks)))
    }

    const handleDone = (e: MouseEvent<HTMLButtonElement>) => {
        if (tasks[e.currentTarget.name].completed) return
        updateDoc(doc(db, `users/${user?.uid}/tasks/${e.currentTarget.name}`), {
            completed: true            
        })

        dispatch(completeTask({
            'taskId': e.currentTarget.name,
            'taskDay': tasks[e.currentTarget.name].deadline.toDate().toLocaleDateString()
        }))
    }

    const handleEdit = async (e: FormEvent) => {
        e.preventDefault()

        if (edit !== tasks[taskId].description)
            await updateDoc(doc(db, `users/${user?.uid}/tasks/${taskId}`), {
                description: edit
            })

        setEditView(false)
        dispatch(setTasks({...tasks, [taskId]: {...tasks[taskId], description: edit}}))
    }

    const handleTab = (e: KeyboardEvent) => {
        if (e.key == 'Tab') {
            e.preventDefault()
            const textarea = e.target
            if (textarea instanceof HTMLTextAreaElement) {
                const start = textarea.selectionStart
                const end = textarea.selectionEnd

                textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end)

                textarea.selectionStart = textarea.selectionEnd = start + 4
            }
        }
    }

    return (
        <>
        {deleteView && taskId && (
            <div className={styles['delete-container']}>
                <div>
                    <div>
                        <p>Are you sure you want to delete <span>&apos;{tasks[taskId].title}&apos;</span> ? Please note that this action is irreversible.</p>
                    </div>
                    <div className={styles['delete-foot']}>
                        <button onClick={handleDelete} className={styles['task-view-delete-btn']} style={{width: '120px'}}><BsFillTrashFill></BsFillTrashFill> Delete</button>
                        <button onClick={() => setDeleteView(false)} className='button-primary'>Cancel</button>
                    </div> 
                </div>
            </div>
        )}

        <div className={styles['task-view-container']}>
            <div>
                <div className={styles['task-view-title']}>
                    <h3>{tasks[taskId].title}</h3>
                </div>
                <button className={styles['task-view-close']} onClick={() => {dispatch(setTaskView('')); setEditView(false); setEdit('')}}><IoClose></IoClose></button>
                <div className={styles['task-view-ddln']}>
                    Created on: {format(tasks[taskId].createdAt.toDate(), 'dd/MM/yyyy h:mm a')}
                    <br></br>
                    Deadline: {tasks[taskId].deadline.toDate().toLocaleDateString('en-GB') !== '31/12/9999' ? format(tasks[taskId].deadline.toDate(), 'dd/MM/yyyy h:mm a') : '--.--'}
                </div>

                <div className={styles['task-view-desc']}>
                    {!editView && (<>
                        <div onClick={() => {setEditView(true)}} className={styles['task-view-edit-btn']}><BiSolidEditAlt></BiSolidEditAlt></div>
                        <div className={styles['markdown']}>
                            <ReactMarkdown>{tasks[taskId].description}</ReactMarkdown>
                        </div>
                    </>)}
                    {editView && (
                        <form className={styles['task-view-edit']} onSubmit={handleEdit}>
                            <button className={styles['task-view-edit-btn']} type='submit'><AiOutlineCheck></AiOutlineCheck></button>
                            <textarea onKeyDown={handleTab} defaultValue={edit} onChange={(e) => setEdit(e.target.value)}></textarea>
                        </form>
                    )}
                </div>
                <div className={styles['task-view-foot']}>
                    <div className={`${styles[priorityMap[tasks[taskId].priority]]} ${styles['task-prty']}`}>
                        {priorityMap[tasks[taskId].priority]}
                    </div>
                    {tasks[taskId].categoryName && (<div className={styles['task-category']} style={{'backgroundColor': tasks[taskId].color, 'textAlign': "center"}}>
                        {tasks[taskId].categoryName}
                    </div>)}
                    {!tasks[taskId].completed && (
                        <button className={styles['task-view-done-btn']} onClick={handleDone} name={taskId}><AiOutlineCheck></AiOutlineCheck><span>Finish</span></button>
                    )}
                    <button className={styles['task-view-delete-btn']} onClick={() => {setDeleteView(true);}} name={taskId}><BsFillTrashFill></BsFillTrashFill> <span>Delete</span></button>
                </div>
            </div>
        </div>
        </>
    )
}

export default TaskView
