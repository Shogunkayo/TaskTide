'use client'

import { createSlice } from "@reduxjs/toolkit"

export interface TaskState {
    tasks: any[],
    categories: any[]
}

const initialState: TaskState = {
    tasks: [],
    categories: []
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTasks: (state, action) => {state.tasks = action.payload},
        setCategories: (state, action) => {state.categories = action.payload},
        addTasks: (state, action) => {state.tasks = [...state.tasks, action.payload]},
        addCategories: (state, action) => {state.categories = [...state.categories, action.payload]}
    }
})

export const {addTasks, addCategories, setTasks, setCategories} = taskSlice.actions
export default taskSlice.reducer
