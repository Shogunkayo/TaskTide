'use client'

import { createSlice } from "@reduxjs/toolkit"

export interface TaskState {
    tasks: any[],
    tasks_days: {},
    categories: any[]
}

const initialState: TaskState = {
    tasks: [],
    tasks_days: {},
    categories: []
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTasks: (state, action) => {state.tasks = action.payload},
        addTasks: (state, action) => {state.tasks = [...state.tasks, action.payload]},
        
        setTaskDays: (state, action) => {state.tasks_days = action.payload},
        addTaskDays: (state, action) => {
            let temp:any = state.tasks_days
            const date = action.payload.data.deadline.toLocaleDateString()
            if (date in temp)
                temp[date].push(action.payload)
            else
                temp[date] = [action.payload]
            state.tasks_days = temp
        },

        setCategories: (state, action) => {state.categories = action.payload},
        addCategories: (state, action) => {state.categories = [...state.categories, action.payload]},
    
        addTaskToCategory: (state, action) => {
            let temp:any = state.categories
            const i = temp.findIndex(e => e.id === action.payload.catId)
            temp[i].data.tasks.push(action.payload.taskId)
        }
    }
})

export const {addTasks, addCategories, addTaskDays, 
    setTasks, setCategories, setTaskDays, addTaskToCategory} = taskSlice.actions
export default taskSlice.reducer
