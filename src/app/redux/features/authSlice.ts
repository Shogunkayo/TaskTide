'use client'

import { createSlice } from "@reduxjs/toolkit"

export interface AuthState {
    isOpen: boolean,
    type: string,
    user: User | null
}

export interface User {
    username: 'string' | null,
    photo: 'string' | null,
    id: 'string',
    email: 'string',
}

const initialState: AuthState = {
    isOpen: false,
    type: 'login',
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeType: (state, action) => {state.type = action.payload},
        changeOpen: (state, action) => {state.isOpen = action.payload},
        setUser: (state, action) => {state.user = action.payload}
    }
})

export const {changeType, changeOpen, setUser} = authSlice.actions
export default authSlice.reducer
