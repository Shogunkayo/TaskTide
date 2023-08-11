'use client'

import { RootState } from "@/app/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineCheck } from 'react-icons/ai'
import styles from './tasklist.module.scss'
import { MouseEvent, useState } from "react"
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/app/auth/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { completeTask, fetchTasksAndCategories, newTaskDays, setCategories, setTaskDays, setTasks } from "@/app/redux/features/taskSlice"
import { IoClose } from 'react-icons/io5'
import { BsFillTrashFill } from "react-icons/bs"

type Props = {}

const Tasklist = (props: Props) => {
    const [user, _, __,] = useAuthState(auth)
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const categories = useSelector((state: RootState) => state.task.categories)
    const [toShow, setToShow] = useState('all')
    const [deleteView, setDeleteView] = useState(false)
    const [toDelete, setToDelete] = useState('')
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
        if (!user?.uid || !toDelete || !tasks) return
        
        /*
            Delete category if only one task remaining (task to be deleted) else update
         */
        if (categories[tasks[toDelete].category].tasks.length === 1) {
            await deleteDoc(doc(db, `users/${user.uid}/categories/${tasks[toDelete].category}`))
        }
        else {
            await updateDoc(doc(db, `users/${user?.uid}/categories/${tasks[toDelete].category}`), {
                tasks: arrayRemove(toDelete)
            })
        }
        await deleteDoc(doc(db, `users/${user?.uid}/tasks/${toDelete}`))
    

        const [newTasks, newCategories] = await fetchTasksAndCategories(user?.uid)
             
    
        setToDelete('')
        setDeleteView(false)
        dispatch(setTasks(newTasks))
        dispatch(setCategories(newCategories))
        dispatch(setTaskDays(newTaskDays(newTasks)))
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
            {toShow === 'all' && Object.keys(tasks).map((task) => (
                <div key={task} className={`${styles['task']} ${tasks[task].completed && styles['task-done']}`}>
                    <div className={styles['task-title']}>
                        <h3>{tasks[task].title}</h3>
                    </div>
                    <button className={styles['task-delete']} onClick={() => {setDeleteView(true); setToDelete(task)}} name={task}><IoClose></IoClose></button>
                    <div className={styles['task-ddln']}>
                        Due: {tasks[task].deadline.toDate().toLocaleDateString('en-GB') !== '31/12/9999' ? tasks[task].deadline.toDate().toLocaleDateString('en-GB') : '--.--'}
                    </div>
                    <div className={styles['task-desc']}>
                        {tasks[task].description}
                    </div>
                    <div className={styles['task-foot']}>
                        <div className={`${styles[tasks[task].priority]} ${styles['task-prty']}`}>
                            {tasks[task].priority}
                        </div>
                        {tasks[task].categoryName && (<div className={styles['task-category']} style={{'backgroundColor': tasks[task].color}}>
                            {tasks[task].categoryName}
                        </div>)}
                        {!tasks[task].completed && (
                            <button className={styles['task-done-btn']} onClick={handleDone} name={task}><AiOutlineCheck></AiOutlineCheck></button>
                        )}
                    </div>
                </div>
            ))}
            {toShow !== 'all' && categories[toShow].tasks.map((task) => (
                <div key={task} className={`${styles['task']} ${tasks[task].completed && styles['task-done']}`}>
                    <div className={styles['task-title']}>
                        <h3>{tasks[task].title}</h3>
                    </div>
                    <button className={styles['task-delete']} onClick={() => {setDeleteView(true); setToDelete(task)}} name={task}><IoClose></IoClose></button>
                    <div className={styles['task-ddln']}>
                        Due: {tasks[task].deadline.toDate().toLocaleDateString('en-GB') !== '31/12/9999' ? tasks[task].deadline.toDate().toLocaleDateString('en-GB') : '--.--'}
                    </div>
                    <div className={styles['task-desc']}>
                        {tasks[task].description}
                    </div>
                    <div className={styles['task-foot']}>
                        <div className={`${styles[tasks[task].priority]} ${styles['task-prty']}`}>
                            {tasks[task].priority}
                        </div>
                        {!tasks[task].completed && (
                            <button className={styles['task-done-btn']} onClick={handleDone} name={task}><AiOutlineCheck></AiOutlineCheck></button>
                        )}
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default Tasklist
