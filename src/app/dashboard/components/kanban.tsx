'use client'

import { priorityMap } from "@/app/redux/features/taskSlice"
import { RootState } from "@/app/redux/store"
import { MouseEvent, useRef, useState } from "react"
import { IoClose } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import styles from './kanban.module.scss'
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/app/auth/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { addTaskToCol, removeTaskFromCol } from "@/app/redux/features/kanbanSlice"

type Props = {}

const Kanban = (props: Props) => {
    const boards = useSelector((state: RootState) => state.kanban.kanBoards)
    const columns = useSelector((state: RootState) => state.kanban.kanCols)
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const [toShow, setToShow] = useState('')
    const [taskView, setTaskView] = useState(false)
    const [colToAdd, setColToAdd] = useState('')
    const [user, _, __] = useAuthState(auth)
    const dispatch = useDispatch()

    const handleTask = async (e: MouseEvent<HTMLDivElement>) => {
        if (!tasks[e.currentTarget.id] || !user || !colToAdd) return
        const taskId = e.currentTarget.id
        await updateDoc(doc(db, `users/${user.uid}/kanbanColumns/${colToAdd}`), {
            tasks: arrayUnion(taskId)
        })
        
        dispatch(addTaskToCol({colId: colToAdd, taskId: taskId}))
        setTaskView(false)
        setColToAdd('')
    }

    const handleDelete = async (e: MouseEvent) => {

        const colId = e.currentTarget.className
        const taskId = e.currentTarget.id
        const taskIdx = columns[e.currentTarget.className].tasks.indexOf(e.currentTarget.id)

        if (!tasks[taskId] || !user || !columns[colId] || taskIdx < 0) return
       
        await updateDoc(doc(db ,`users/${user.uid}/kanbanColumns/${colId}`), {
            tasks: arrayRemove(taskId)
        })

        dispatch(removeTaskFromCol({colId: colId, taskIdx: taskIdx}))
    }

    return (
        <div>
           <nav className={styles['kanban-nav']}>
            {
                Object.keys(boards).map((board) => (
                    <button key={board} id={board} onClick={() => setToShow(board)} className={`${toShow === board ? 'button-accent' : 'button-primary'}`}>
                        {boards[board].title}
                    </button>
                ))
            }
           </nav>
           <div className={styles['kanban-container']}>
           {toShow && boards[toShow].kanCols.map((col) => (
                    <div key={col} id={col} className={styles['col-container']}>
                        <div className={styles['col-title']} style={{backgroundColor: columns[col].color}}>
                            <h3>{columns[col].title}</h3>
                        </div>
                        <div className={styles['col-content']}>
                        {columns[col].tasks.map((task) => (
                            <div key={task} className={styles['col-task']} style={{boxShadow: `0 0 5px 1px ${tasks[task].color}`}}>
                                <button id={task} className={col} onClick={handleDelete}><IoClose></IoClose></button>
                                <div>
                                    <h4>{tasks[task].title.slice(0, 40)}</h4>
                                    <div>
                                        <div className={styles[priorityMap[tasks[task].priority]]}>{priorityMap[tasks[task].priority]}</div>
                                        <div style={{backgroundColor: tasks[task].color}}>{tasks[task].categoryName.slice(0, 8)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className={styles['col-add']}>
                            <button onClick={() => {setTaskView(true); setColToAdd(col)}}>Add Task</button>
                        </div>
                        </div>
                    </div>
                ))
           }
           </div>
           {taskView && (
                <div className={styles['task-modal']}>
                    <div className={styles['task-container']}>
                    <button onClick={() => {setTaskView(false); setColToAdd('')}}><IoClose></IoClose></button>
                    <div>
                        {Object.keys(tasks).map((task) => (
                            <div key={task} id={task} className={styles['task']} style={{boxShadow: `0 0 3px 2px ${tasks[task].color}`}} onClick={handleTask}>
                                <h4>{tasks[task].title}</h4>
                                <div className={styles['task-footer']}>
                                    <div className={styles[priorityMap[tasks[task].priority]]}>{priorityMap[tasks[task].priority]}</div>
                                    <div style={{backgroundColor: tasks[task].color}}>{tasks[task].categoryName.slice(0, 8)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Kanban
