'use client'

import { createSlice } from "@reduxjs/toolkit"

export interface AuthState {
    isOpen: boolean,
    type: string
}

const initialState: AuthState = {
    isOpen: false,
    type: 'login'
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeType: (state, action) => {state.type = action.payload},
        changeOpen: (state, action) => {state.isOpen = action.payload}
    }
})

export const {changeType, changeOpen} = authSlice.actions
export default authSlice.reducer
