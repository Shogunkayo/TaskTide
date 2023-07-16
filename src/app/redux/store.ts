'use client'

import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import viewReducer from './features/viewSlice';
import taskReducer from './features/taskSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        view: viewReducer,
        task: taskReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
