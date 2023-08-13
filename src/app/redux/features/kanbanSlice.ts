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
        }
    }
})

export const {addCol, createBoard, setCol, setBoard, addTaskToCol} = kanbanSlice.actions
export default kanbanSlice.reducer
