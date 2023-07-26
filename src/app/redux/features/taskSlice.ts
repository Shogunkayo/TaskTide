'use client'

import { createSlice } from "@reduxjs/toolkit"

export interface i_Task {
    completed: boolean,
    isSingle: boolean,
    category: string | null,
    taskOf: string,
    color: string,
    title: string,
    description: string | null,
    categoryName: string,
    priority: string,
    createdAt: any,
    deadline: any
}

export interface i_Category {
    title: string,
    description: string | null,
    tasks: Array<string>
    color: string
}

export interface TaskState {
    tasks: {[key: string]: i_Task},
    tasks_days: {[key: string]: {id: string, data: i_Task}},
    categories: {[key: string]: i_Category}
}

const initialState: TaskState = {
    tasks: {},
    tasks_days: {},
    categories: {}
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTasks: (state, action) => {state.tasks = action.payload},
        addTasks: (state, action) => {state.tasks = {...state.tasks, [action.payload.id]: action.payload.data}},
        
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
        addCategories: (state, action) => {state.categories = {...state.categories, [action.payload.id]: action.payload.data}},
    
        addTaskToCategory: (state, action) => {
            state.categories = {...state.categories, [action.payload.catId]: {
                ...state.categories[action.payload.catId], 
                'tasks': [...state.categories[action.payload.catId].tasks, action.payload.taskId]}}
        }
    }
})

export const {addTasks, addCategories, addTaskDays, 
    setTasks, setCategories, setTaskDays, addTaskToCategory} = taskSlice.actions
export default taskSlice.reducer
