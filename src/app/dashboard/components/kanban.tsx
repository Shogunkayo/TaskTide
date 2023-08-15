'use client'

import { priorityMap, setTaskView } from "@/app/redux/features/taskSlice"
import { RootState } from "@/app/redux/store"
import { MouseEvent, useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import styles from './kanban.module.scss'
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore"
import { auth, db } from "@/app/auth/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { addTaskToCol, deleteBoard, deleteCol, moveCol, moveTask, removeTaskFromCol, setCurrentBoard } from "@/app/redux/features/kanbanSlice"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { BsFillTrashFill, BsTrashFill } from "react-icons/bs"
import { AiOutlineExpandAlt } from "react-icons/ai"
import TaskView from "./elements/taskView"

type Props = {}

const Kanban = (props: Props) => {
    const boards = useSelector((state: RootState) => state.kanban.kanBoards)
    const columns = useSelector((state: RootState) => state.kanban.kanCols)
    const toShow = useSelector((state: RootState) => state.kanban.currentBoard)
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const taskView = useSelector((state: RootState) => state.task.taskView)
    const [addView, setAddView] = useState(false)
    const [colToAdd, setColToAdd] = useState('')
    const [user, _, __] = useAuthState(auth)
    const [hasColChanged, setHasColChanged] = useState(false)
    const [hasTaskChanged, setHasTaskChanged] = useState(false)

    const dispatch = useDispatch()

    const handleAddTask = async (e: MouseEvent<HTMLDivElement>) => {
        if (!tasks[e.currentTarget.id] || !user || !colToAdd) return
        const taskId = e.currentTarget.id
        await updateDoc(doc(db, `users/${user.uid}/kanbanColumns/${colToAdd}`), {
            tasks: arrayUnion(taskId)
        })
        
        dispatch(addTaskToCol({colId: colToAdd, taskId: taskId}))
        setAddView(false)
        setColToAdd('')
    }

    const handleDeleteTask = async (e: MouseEvent) => {
        const colId = e.currentTarget.className
        const taskId = e.currentTarget.id
        const taskIdx = columns[e.currentTarget.className].tasks.indexOf(e.currentTarget.id)

        if (!tasks[taskId] || !user || !columns[colId] || taskIdx < 0) return
       
        await updateDoc(doc(db ,`users/${user.uid}/kanbanColumns/${colId}`), {
            tasks: arrayRemove(taskId)
        })

        dispatch(removeTaskFromCol({colId: colId, taskIdx: taskIdx}))
    }

    const handleDeleteColumn = async (colId: string) => {
        const colIdx = boards[toShow].kanCols.indexOf(colId)
        if (!user || !columns[colId] || !colId || colIdx < 0) return 
    
        await updateDoc(doc(db, `users/${user.uid}/kanbanBoards/${toShow}`), {
            kanCols: arrayRemove(colId)
        })

        deleteDoc(doc(db, `users/${user.uid}/kanbanColumns/${colId}`))
        
        dispatch(deleteCol({colId: colId, boardId: toShow, colIdx: colIdx}))
    }

    const handleDeleteBoard = async () => {
        if (!user || !toShow || !boards[toShow]) return

        await deleteDoc(doc(db, `users/${user.uid}/kanbanBoards/${toShow}`))
        dispatch(deleteBoard({boardId: toShow}))
        dispatch(setCurrentBoard(''))
    }

    const handleDragEnd = async (result: any) => {
        if (result.reason === 'CANCEL' || !result.destination || !user) return
        if (result.destination.droppableId === result.source.droppableId &&
            result.destination.index === result.source.index) return
        
        if (result.type === 'column') {
            dispatch(moveCol(result))
            setHasColChanged(true)
        }
        else {
            dispatch(moveTask(result))
            setHasTaskChanged(true)
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            if (hasColChanged || hasTaskChanged) {
                if (!user) return
                
                if (hasColChanged) {
                    updateDoc(doc(db, `users/${user.uid}/kanbanBoards/${toShow}`), {
                        kanCols: boards[toShow].kanCols
                    })
                    setHasColChanged(false)
                }

                if (hasTaskChanged) {
                    const batch = writeBatch(db)
                    boards[toShow].kanCols.forEach((colId) => {
                        batch.update(doc(db, `users/${user.uid}/kanbanColumns/${colId}`), {
                            tasks: columns[colId].tasks
                        })
                    })

                    batch.commit()
                }
            }
        }, 60000)

        return () => clearInterval(timer)
    }, [boards, columns, hasColChanged, hasTaskChanged, toShow, user])

    return (
        <div className='kanban-body'>
            {
                toShow && boards[toShow].kanCols.length === 0 && (
                    <div>
                        <button onClick={handleDeleteBoard}><BsTrashFill></BsTrashFill>Delete Board</button>
                    </div>
                )
            }
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
                                                                <button id={task} className={col} onClick={handleDeleteTask}><IoClose></IoClose></button>
                                                                <button style={{right: '30px'}} onClick={() => {dispatch(setTaskView(task))}}><AiOutlineExpandAlt></AiOutlineExpandAlt></button>
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
                                                    <button onClick={() => {setAddView(true); setColToAdd(col)}}>Add Task</button>
                                                </div>
                                            </div>
                                            {provided.placeholder}
                                            <div className={styles['col-delete']}>
                                                <button onClick={() => {handleDeleteColumn(col)}}><BsFillTrashFill></BsFillTrashFill></button>
                                            </div>
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

           {addView && (
                <div className={styles['task-modal']}>
                    <div className={styles['task-container']}>
                    <button onClick={() => {setAddView(false); setColToAdd('')}}><IoClose></IoClose></button>
                    <div>
                        {Object.keys(tasks).map((task) => (
                            <div key={task} id={task} className={styles['task']} style={{boxShadow: `0 0 3px 2px ${tasks[task].color}`}} onClick={handleAddTask}>
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
            {taskView && <TaskView></TaskView>}
        </div>
    )
}

export default Kanban
