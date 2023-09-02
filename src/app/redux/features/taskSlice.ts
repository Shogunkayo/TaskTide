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
    tasks_days: {[key: string]: Array<string>},
    categories: {[key: string]: i_Category}
    taskView: string,
    categoryView: string,
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
    const taskRef = query(collection(db, `users/${userId}/tasks`), orderBy('completed'), orderBy('deadline'), orderBy('category'), orderBy('priority'), orderBy('createdAt'))
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
            temp[date].push(task)
        else
            temp[date] = [task]
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
            const date = action.payload.date.toDate().toLocaleDateString()
            if (date in temp)
                temp[date].push(action.payload.id)
            else
                temp[date] = [action.payload.id]
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
        },

        deleteTask: (state, action) => {
            const newTasks = {...state.tasks}
            delete newTasks[action.payload.taskId]
            state.tasks = newTasks
          
            if (action.payload.catId === "none") return

            const idx = state.categories[action.payload.catId].tasks.indexOf(action.payload.taskId)
            state.categories = {...state.categories, [action.payload.catId]: {
                ...state.categories[action.payload.catId], tasks: [
                    ...state.categories[action.payload.catId].tasks.slice(0, idx),
                    ...state.categories[action.payload.catId].tasks.slice(idx + 1)
                ]
            }}
        },

        deleteCategory: (state, action) => {
            const newCategories = {...state.categories}
            delete newCategories[action.payload.catId]
            state.categories = newCategories
        },

        deleteTaskDays: (state, action) => {
            if (!(action.payload.date in state.tasks_days)) return

            const date = action.payload.date.toDate().toLocaleDateString()
            if (state.tasks_days[date].length === 1) {
                const newDays = {...state.tasks_days}
                delete newDays[date]
                state.tasks_days = newDays
            }
            else {
                const idx = state.tasks_days[action.payload.date].indexOf(action.payload.taskId)
                if (idx < 0) return
                state.tasks_days = {...state.tasks_days, [action.payload.date]: [
                    ...state.tasks_days[action.payload.date].slice(0, idx),
                    ...state.tasks_days[action.payload.date].slice(idx + 1)
                ]}
            }
        }
    }
})

export const {addTasks, addCategories, setCategoriesView, addTaskDays, setTaskView, setTasks, setCategories, setTaskDays, addTaskToCategory, completeTask, deleteTask, deleteCategory, deleteTaskDays} = taskSlice.actions
export default taskSlice.reducer
