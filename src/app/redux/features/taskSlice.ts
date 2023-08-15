'use client'

import { db } from "@/app/auth/firebase"
import { createSlice } from "@reduxjs/toolkit"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export interface i_Task {
    completed: boolean,
    isSingle: boolean,
    category: string,
    taskOf: string,
    color: string,
    title: string,
    description: string,
    categoryName: string,
    priority: number,
    createdAt: any,
    deadline: any,
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
    taskView: string,
    categoryView: string
}

const initialState: TaskState = {
    tasks: {},
    tasks_days: {},
    categories: {},
    taskView: '',
    categoryView: 'all',
}

export const priorityMap: {[key: number]: string} = {
    0: 'High',
    1: 'Medium',
    2: 'Low'
}

export const fetchTasksAndCategories = async (userId: string) => {
    const taskRef = query(collection(db, `users/${userId}/tasks`), orderBy('deadline'), orderBy('category'), orderBy('priority'), orderBy('createdAt'))
    const catRef = query(collection(db, `users/${userId}/categories`), orderBy('title'))
    const taskSnap = await getDocs(taskRef)
    const catSnap = await getDocs(catRef)

    const tasks: any = {}
    const cats: any = {}
    taskSnap.forEach((doc) => {
        tasks[doc.id] = doc.data() 
    })
    catSnap.forEach((doc) => {
        cats[doc.id] = doc.data()
    })

    return [tasks, cats]
}

export const newTaskDays = (tasks: {[key: string]: i_Task}) => {
    const temp: any = {}
    for (const task in tasks) {
        let date = tasks[task].deadline.toDate().toLocaleDateString()
        if (date in temp)
            temp[date].push({id: task, data: tasks[task]})
        else
            temp[date] = [{id: task, data: tasks[task]}]
    }
    return temp
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
            const date = action.payload.data.deadline.toDate().toLocaleDateString()
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
        },
        
        completeTask: (state, action) => {
            state.tasks = {...state.tasks, [action.payload.taskId]: {
                ...state.tasks[action.payload.taskId],
                'completed': true
            }}

            state.tasks_days = newTaskDays(state.tasks)
        },

        setTaskView: (state, action) => {
            state.taskView = action.payload
        },
        
        setCategoriesView: (state, action) => {
            state.categoryView = action.payload
        }
    }
})

export const {addTasks, addCategories, setCategoriesView, addTaskDays, setTaskView, setTasks, setCategories, setTaskDays, addTaskToCategory, completeTask} = taskSlice.actions
export default taskSlice.reducer
