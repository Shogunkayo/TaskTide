'use client'

import { db } from "@/app/auth/firebase"
import { createSlice } from "@reduxjs/toolkit"
import { collection, getDocs, query } from "firebase/firestore"

export interface KanbanState {
    kanBoards: {[key: string]: KanBoard},
    kanCols: {[key: string]: KanCol}
}

export interface KanBoard {
    title: string,
    kanCols: string []
}

export interface KanCol {
    color: string,
    title: string,
    tasks: string []
}

const initialState: KanbanState = {
    kanBoards: {},
    kanCols: {}
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
                title: state.kanBoards[action.payload.boardId].title,
                kanCols: [...state.kanBoards[action.payload.boardId].kanCols, action.payload.colId]
            }}
        },

        setCol: (state, action) => {
            state.kanCols = action.payload
        },

        setBoard: (state, action) => {
            state.kanBoards = action.payload
        },

        addTaskToCol: (state, action) => {
            state.kanCols = {...state.kanCols, [action.payload.colId]: {
                ...state.kanCols[action.payload.colId], tasks: [...state.kanCols[action.payload.colId].tasks, action.payload.taskId]
            }}
        },

        removeTaskFromCol: (state, action) => {
            state.kanCols = {...state.kanCols, [action.payload.colId]: {
                ...state.kanCols[action.payload.colId], tasks: [...state.kanCols[action.payload.colId].tasks.slice(0, action.payload.taskIdx),
                ...state.kanCols[action.payload.colId].tasks.slice(action.payload.taskIdx + 1)]
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

        moveColumn : (state, action) => {
            const newColumns = Array.from(state.kanBoards[action.payload.source.droppableId].kanCols)
            newColumns.splice(action.payload.source.index, 1)
            newColumns.splice(action.payload.destination.index, 0, action.payload.draggableId)

            state.kanBoards = {...state.kanBoards, [action.payload.source.droppableId]: {
                ...state.kanBoards[action.payload.source.droppableId], kanCols: newColumns
            }}
        }
    }
})

export const {addCol, createBoard, setCol, setBoard, addTaskToCol, removeTaskFromCol, moveTask, moveColumn} = kanbanSlice.actions
export default kanbanSlice.reducer
