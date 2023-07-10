'use client'

import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import viewReducer from './features/viewSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        view: viewReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
