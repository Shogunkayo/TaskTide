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
import { addTaskToCol, moveColumn, moveTask, removeTaskFromCol } from "@/app/redux/features/kanbanSlice"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

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


    const handleDragEnd = async (result: any) => {
        if (result.reason === 'CANCEL' || !result.destination) return
        if (result.destination.droppableId === result.source.droppableId &&
            result.destination.index === result.source.index) return
        
        if (result.type === 'column') {
            dispatch(moveColumn(result))
        }
        else {
            dispatch(moveTask(result))
        }
    }

    return (
        <div className='kanban-body'>
            <nav className={styles['kanban-nav']}>
            {
                Object.keys(boards).map((board) => (
                    <button key={board} id={board} onClick={() => setToShow(board)} className={`${toShow === board ? 'button-accent' : 'button-primary'}`}>
                        {boards[board].title}
                    </button>
                ))
            }
            </nav>
            
            {toShow &&
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={toShow} direction='horizontal' type='column'>
                    {(provided) => (
                        <div className={styles['kanban-container']} {...provided.droppableProps} ref={provided.innerRef}>
                            {toShow && boards[toShow].kanCols.map((col, idx) => (
                            <Draggable key={col} draggableId={col} index={idx}>
                                {(provided) => (
                                <div
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                ><Droppable droppableId={col}>
                                    {(provided) => (
                                        <div id={col} className={styles['col-container']}
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            <div className={styles['col-title']} style={{backgroundColor: columns[col].color}}>
                                                <h3>{columns[col].title}</h3>
                                            </div>

                                            <div id='col-content' className={styles['col-content']}>
                                                {columns[col].tasks.map((task, i) => (
                                                    <Draggable key={task} draggableId={task} index={i}>
                                                        {(provided) => (
                                                        <div
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                        >
                                                            <div className={styles['col-task']} style={{boxShadow: `0 0 5px 1px ${tasks[task].color}`}}>
                                                                <button id={task} className={col} onClick={handleDelete}><IoClose></IoClose></button>
                                                                <div>
                                                                    <h4>{tasks[task].title.slice(0, 40)}</h4>
                                                                    <div>
                                                                        <div className={styles[priorityMap[tasks[task].priority]]}>{priorityMap[tasks[task].priority]}</div>
                                                                        {tasks[task].categoryName && <div style={{backgroundColor: tasks[task].color}}>{tasks[task].categoryName.slice(0, 8)}</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    </Draggable>
                                                ))}
                                                <div className={styles['col-add']}>
                                                    <button onClick={() => {setTaskView(true); setColToAdd(col)}}>Add Task</button>
                                                </div>
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable></div>
                                )}
                            </Draggable>

                        ))
                   }
                   {provided.placeholder}
                   </div>
                )}
                </Droppable>
            </DragDropContext>
            }

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
                                    {tasks[task].categoryName && <div style={{backgroundColor: tasks[task].color}}>{tasks[task].categoryName.slice(0, 8)}</div>}
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
