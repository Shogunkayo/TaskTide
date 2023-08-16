'use client'

import { RootState } from "@/app/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineCheck } from 'react-icons/ai'
import styles from './tasklist.module.scss'
import { MouseEvent } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/app/auth/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { completeTask, priorityMap, setTaskView } from "@/app/redux/features/taskSlice"
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths } from "date-fns"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { AiOutlineExpandAlt } from 'react-icons/ai'
import TaskView from "./elements/taskView"

type Props = {}

const Tasklist = (props: Props) => {
    const [user, _, __,] = useAuthState(auth)
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const taskView = useSelector((state: RootState) => state.task.taskView)
    const catView = useSelector((state: RootState) => state.task.categoryView)
    const categories = useSelector((state: RootState) => state.task.categories)
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
            <div className={styles['task-container']}>
            {Object.keys(tasks).map((task) => {
                if (catView === 'all' || tasks[task].category === catView)
                return (
                <div key={task} className={`${styles['task']} ${tasks[task].completed && styles['task-done']}`}
                    style={{boxShadow: `0 0 7px 1px ${tasks[task].color}`}}
                >
                    <div className={styles['task-expand']}
                    onClick={() => dispatch(setTaskView(task))}>
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
            {taskView && <TaskView></TaskView>}
        </div>
    )
}

export default Tasklist
