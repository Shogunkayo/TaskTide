'use client'

import { db } from "@/app/auth/firebase"
import { createSlice } from "@reduxjs/toolkit"
import { collection, doc, documentId, getDocs, query, updateDoc } from "firebase/firestore"

export interface KanbanState {
    kanBoards: {[key: string]: KanBoard},
    kanCols: {[key: string]: KanCol}
    currentBoard: string,
}

export interface KanBoard {
    title: string,
    kanCols: Array<string>,
    tasks: Array<string>
}

export interface KanCol {
    color: string,
    title: string,
    tasks: Array<string>,
    board: string,
    boardName: string
}

const initialState: KanbanState = {
    kanBoards: {},
    kanCols: {},
    currentBoard: ''
}

export const fetchColumnsAndBoards = async (userId: string) => {
    const colRef = query(collection(db, `users/${userId}/kanbanColumns`))
    const boardRef = query(collection(db, `users/${userId}/kanbanBoards`))
    const colSnap = await getDocs(colRef)
    const boardSnap = await getDocs(boardRef)

    const cols: any = {}
    const boards: any = {}

    colSnap.forEach((col) => {
        cols[col.id] = col.data()
    })
    boardSnap.forEach((board) => {
        boards[board.id] = board.data()
    })

    return [cols, boards]
}

export const kanbanSlice = createSlice({
    name: 'kanban',
    initialState,
    reducers: {
        createBoard: (state, action) => {
            state.kanBoards = {...state.kanBoards, [action.payload.boardId]: action.payload.board} 
        },

        addCol: (state, action) => {
            state.kanCols = {...state.kanCols, [action.payload.colId]:  action.payload.col};
            state.kanBoards = {...state.kanBoards, [action.payload.boardId]: {
                ...state.kanBoards[action.payload.boardId], kanCols: [...state.kanBoards[action.payload.boardId].kanCols, action.payload.colId]
            }}
        },

        setCol: (state, action) => {
            state.kanCols = action.payload
        },

        setCurrentBoard: (state, action) => {
            state.currentBoard = action.payload
        },

        setBoard: (state, action) => {
            state.kanBoards = action.payload
        },

        addTaskToCol: (state, action) => {
            state.kanCols = {...state.kanCols, [action.payload.colId]: {
                ...state.kanCols[action.payload.colId], tasks: [...state.kanCols[action.payload.colId].tasks, action.payload.taskId]
            }}
            state.kanBoards = {...state.kanBoards, [action.payload.boardId]: {
                ...state.kanBoards[action.payload.boardId], tasks: [...state.kanBoards[action.payload.boardId].tasks, action.payload.taskId]
            }}
        },

        removeTaskFromCol: (state, action) => {
            state.kanCols = {...state.kanCols, [action.payload.colId]: {
                ...state.kanCols[action.payload.colId], tasks: [...state.kanCols[action.payload.colId].tasks.slice(0, action.payload.taskIdx),
                ...state.kanCols[action.payload.colId].tasks.slice(action.payload.taskIdx + 1)]
            }}

            state.kanBoards = {...state.kanBoards, [action.payload.boardId]: {
                ...state.kanBoards[action.payload.boardId], tasks: [...state.kanBoards[action.payload.boardId].tasks.slice(0, action.payload.taskIdx),
                ...state.kanBoards[action.payload.boardId].tasks.slice(action.payload.taskIdx + 1)]
            }}
        },

        moveTask: (state, action) => {
            if (action.payload.source.droppableId === action.payload.destination.droppableId) {
                // Move task within same column
                const newTasks = Array.from(state.kanCols[action.payload.source.droppableId].tasks)
                newTasks.splice(action.payload.source.index, 1)
                newTasks.splice(action.payload.destination.index, 0, action.payload.draggableId)

                state.kanCols = {...state.kanCols, [action.payload.source.droppableId]: {
                    ...state.kanCols[action.payload.source.droppableId], tasks: newTasks
                }}
            }
            else {
                // Move task between different columns
                const sourceTasks = Array.from(state.kanCols[action.payload.source.droppableId].tasks)
                sourceTasks.splice(action.payload.source.index, 1)

                const destinationTasks = Array.from(state.kanCols[action.payload.destination.droppableId].tasks)
                destinationTasks.splice(action.payload.destination.index, 0, action.payload.draggableId)

                state.kanCols = {...state.kanCols, [action.payload.source.droppableId]: {
                    ...state.kanCols[action.payload.source.droppableId], tasks: sourceTasks
                }, [action.payload.destination.droppableId]: {
                    ...state.kanCols[action.payload.destination.droppableId], tasks: destinationTasks
                }}
            }
        },

        moveCol : (state, action) => {
            const newColumns = Array.from(state.kanBoards[action.payload.source.droppableId].kanCols)
            newColumns.splice(action.payload.source.index, 1)
            newColumns.splice(action.payload.destination.index, 0, action.payload.draggableId)

            state.kanBoards = {...state.kanBoards, [action.payload.source.droppableId]: {
                ...state.kanBoards[action.payload.source.droppableId], kanCols: newColumns
            }}
        },

        deleteCol: (state, action) => {
            state.kanBoards = {...state.kanBoards, [action.payload.boardId]: {
                ...state.kanBoards[action.payload.boardId], kanCols: [
                    ...state.kanBoards[action.payload.boardId].kanCols.slice(0, action.payload.colIdx),
                    ...state.kanBoards[action.payload.boardId].kanCols.slice(action.payload.colIdx + 1)
                ]
            }}
            
            const newCols = {...state.kanCols}
            delete newCols[action.payload.colId]
            state.kanCols = newCols
        },

        deleteBoard: (state, action) => {
            const newBoards = {...state.kanBoards}
            delete newBoards[action.payload.boardId]
            state.kanBoards = newBoards
        },

        handleDeleteTask: (state, action) => {
            const newCols = {...state.kanCols}
            Object.keys(state.kanCols).map((col) => {
                console.log(state.kanCols[col].tasks, action.payload.taskId)
                let idx = state.kanCols[col].tasks.indexOf(action.payload.taskId)
                if (idx > -1) {
                    newCols[col].tasks.splice(idx, 1)

                    const boardId = newCols[col].board
                    console.log(state.kanBoards[boardId].tasks.indexOf(action.payload.taskId))
                    state.kanBoards = {...state.kanBoards, [boardId]: {
                        ...state.kanBoards[boardId], tasks: [
                            ...state.kanBoards[boardId].tasks.slice(0, state.kanBoards[boardId].tasks.indexOf(action.payload.taskId)),
                            ...state.kanBoards[boardId].tasks.slice(state.kanBoards[boardId].tasks.indexOf(action.payload.taskId) + 1)
                        ]
                    }}

                    updateDoc(doc(db, `users/${action.payload.userId}/kanbanColumns/${col}`), {
                        tasks: newCols[col].tasks
                    })
                    updateDoc(doc(db, `users/${action.payload.userId}/kanbanBoards/${boardId}`), {
                        tasks: state.kanBoards[boardId].tasks
                    })
                }
            })
            state.kanCols = newCols
        }
    }
})

export const {addCol, deleteCol, createBoard, deleteBoard, setCurrentBoard, setCol, setBoard, addTaskToCol, removeTaskFromCol, moveTask, moveCol, handleDeleteTask} = kanbanSlice.actions
export default kanbanSlice.reducer
