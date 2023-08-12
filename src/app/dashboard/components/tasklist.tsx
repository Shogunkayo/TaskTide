'use client'

import { RootState } from "@/app/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineCheck } from 'react-icons/ai'
import styles from './tasklist.module.scss'
import { FormEvent, MouseEvent, useState } from "react"
import { DocumentReference, arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/app/auth/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { completeTask, fetchTasksAndCategories, newTaskDays, priorityMap, setCategories, setTaskDays, setTasks } from "@/app/redux/features/taskSlice"
import { IoClose } from 'react-icons/io5'
import { BsFillTrashFill } from "react-icons/bs"
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, format } from "date-fns"
import { BiSolidEditAlt } from 'react-icons/bi'
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { AiOutlineExpandAlt } from 'react-icons/ai'

type Props = {}

const Tasklist = (props: Props) => {
    const [user, _, __,] = useAuthState(auth)
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const categories = useSelector((state: RootState) => state.task.categories)
    const [toShow, setToShow] = useState('all')
    const [deleteView, setDeleteView] = useState(false)
    const [toDelete, setToDelete] = useState('')
    const [taskView, setTaskView] = useState(false)
    const [taskToView, setTaskToView] = useState('')
    const [editView, setEditView] = useState(false)
    const [edit, setEdit] = useState('')
    const dispatch = useDispatch()

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

    const handleDelete = async () => {
        if (!user?.uid || !toDelete || !tasks[toDelete].category) return
        
        /*
            Delete category if only one task remaining (task to be deleted) else update
         */
        if (tasks[toDelete].category !== 'none') {
            console.log(tasks[toDelete].category)
            if (categories[tasks[toDelete].category].tasks.length === 1) {
                await deleteDoc(doc(db, `users/${user.uid}/categories/${tasks[toDelete].category}`))
            }
            else {
                await updateDoc(doc(db, `users/${user?.uid}/categories/${tasks[toDelete].category}`), {
                    tasks: arrayRemove(toDelete)
                })
            }
        }
        await deleteDoc(doc(db, `users/${user?.uid}/tasks/${toDelete}`))
    

        const [newTasks, newCategories] = await fetchTasksAndCategories(user?.uid)
             
    
        setToDelete('')
        setDeleteView(false)
        setTaskToView('')
        setTaskView(false)
        setEdit('')
        setEditView(false)
        dispatch(setTasks(newTasks))
        dispatch(setCategories(newCategories))
        dispatch(setTaskDays(newTaskDays(newTasks)))
    }

    const handleEdit = async (e: FormEvent) => {
        e.preventDefault()

        if (edit !== tasks[taskToView].description)
            await updateDoc(doc(db, `users/${user?.uid}/tasks/${taskToView}`), {
                description: edit
            })

        setEditView(false)
        dispatch(setTasks({...tasks, [taskToView]: {...tasks[taskToView], description: edit}}))
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

    const getRemainingTime = (date: Date) => {
        const now = new Date()

        if (now > date) {
            return 'Overdue'
        }

        let format = ' minute'
        let difference = differenceInMinutes(date, now)
        if (difference > 59) {
            difference = differenceInHours(date, now)
            format = ' hour'

            if (difference > 23) {
                difference = differenceInDays(date, now)
                format = ' day'
                
                if (difference > 30){
                    difference = differenceInMonths(date, now)
                    format = ' month'
                    
                    if (difference > 1) {
                        format += 's'
                    }
                }
            }
        } 

        return difference + format
    }

    return (
        <div className={styles['tasklist-container']}>
            {deleteView && toDelete && (
                <div className={styles['delete-container']}>
                    <div>
                        <div>
                            <p>Are you sure you want to delete <span>&apos;{tasks[toDelete].title}&apos;</span> ? Please note that this action is irreversible.</p>
                        </div>
                        <div className={styles['delete-foot']}>
                            <button onClick={handleDelete} className={`${styles['delete-btn']} button-primary`}><BsFillTrashFill></BsFillTrashFill> Delete</button>
                            <button onClick={() => setDeleteView(false)} className='button-primary'>Cancel</button>
                        </div> 
                    </div>
                </div>
            )}
            <nav>
                <button id='all' onClick={() => setToShow('all')} className={`${toShow === 'all' ? 'button-accent' : 'button-primary'}`}>All</button>
                {Object.keys(categories).map((category) => (
                    <button key={category} id={category} onClick={() => setToShow(category)} className={`${toShow === category ? 'button-accent' : 'button-primary'}`}>
                        {categories[category].title}
                    </button>
                ))}
            </nav>
            <div className={styles['task-container']}>
            {Object.keys(tasks).map((task) => {
                if (toShow === 'all' || tasks[task].category === toShow)
                return (
                <div key={task} className={`${styles['task']} ${tasks[task].completed && styles['task-done']}`}
                    style={{boxShadow: `0 0 5px 2px ${tasks[task].color}`}}
                >
                    <div className={styles['task-expand']}
                    onClick={() => {setTaskView(true); setTaskToView(task); setEdit(tasks[task].description)}}>
                        <AiOutlineExpandAlt></AiOutlineExpandAlt>
                    </div>
                    <div className={styles['task-title']}>
                        <h3>{tasks[task].title.slice(0, 24)}</h3>
                    </div>
                    <div className={styles['task-ddln']}>
                        Due: {tasks[task].deadline.toDate().toLocaleDateString('en-GB') !== '31/12/9999' ? getRemainingTime(tasks[task].deadline.toDate()) : '--.--'}
                    </div>
                    <div className={styles['task-desc']}>
                        <ReactMarkdown>{tasks[task].description}</ReactMarkdown>
                    </div>
                    <div className={styles['task-foot']}>
                        <div className={`${styles[priorityMap[tasks[task].priority]]} ${styles['task-prty']}`}>
                            {priorityMap[tasks[task].priority]}
                        </div>
                        {tasks[task].categoryName && (<div className={styles['task-category']} style={{'backgroundColor': tasks[task].color}}>
                            {tasks[task].categoryName.slice(0, 8)}
                        </div>)}
                        {!tasks[task].completed && (
                            <button className={styles['task-done-btn']} onClick={handleDone} name={task}><AiOutlineCheck></AiOutlineCheck></button>
                        )}
                    </div>
                </div>
            )})}
            </div>
            {taskView && taskToView && (
                <div className={styles['task-view-container']}>
                    <div>
                        <div className={styles['task-view-title']}>
                            <h3>{tasks[taskToView].title}</h3>
                        </div>
                        <button className={styles['task-view-close']} onClick={() => {setTaskView(false); setTaskToView(''); setEditView(false); setEdit('')}}><IoClose></IoClose></button>
                        <div className={styles['task-view-ddln']}>
                            Deadline: {tasks[taskToView].deadline.toDate().toLocaleDateString('en-GB') !== '31/12/9999' ? format(tasks[taskToView].deadline.toDate(), 'dd/MM/yyyy h:mm a') : '--.--'}
                            <br></br>
                            Created on: {format(tasks[taskToView].createdAt.toDate(), 'dd/MM/yyyy h:mm a')}
                        </div>
                        
                        <div className={styles['task-view-desc']}>
                            {!editView && (<>
                                <div onClick={() => {setEditView(true)}} className={styles['task-view-edit-btn']}><BiSolidEditAlt></BiSolidEditAlt></div>
                                <div className={styles['markdown']}>
                                    <ReactMarkdown>{tasks[taskToView].description}</ReactMarkdown>
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
                            <div className={`${styles[priorityMap[tasks[taskToView].priority]]} ${styles['task-prty']}`}>
                                {priorityMap[tasks[taskToView].priority]}
                            </div>
                            {tasks[taskToView].categoryName && (<div className={styles['task-category']} style={{'backgroundColor': tasks[taskToView].color, 'textAlign': "center"}}>
                                {tasks[taskToView].categoryName}
                            </div>)}
                            {!tasks[taskToView].completed && (
                                <button className={styles['task-view-done-btn']} onClick={handleDone} name={taskToView}><AiOutlineCheck></AiOutlineCheck><span>Finish</span></button>
                            )}
                            <button className={styles['task-view-delete-btn']} onClick={() => {setDeleteView(true); setToDelete(taskToView)}} name={taskToView}><BsFillTrashFill></BsFillTrashFill> <span>Delete</span></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Tasklist
