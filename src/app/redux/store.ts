'use client'

import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import viewReducer from './features/viewSlice';
import taskReducer from './features/taskSlice';
import kanbanReducer from './features/kanbanSlice';

export const store = configureStore({
    devTools: true,
    reducer: {
        auth: authReducer,
        view: viewReducer,
        task: taskReducer,
        kanban: kanbanReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
