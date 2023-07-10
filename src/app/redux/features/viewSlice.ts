'use client'

import { createSlice } from "@reduxjs/toolkit";

export interface Mapping {
    [key: number]: string;
}

export interface ViewState {
    active: number,
    mapping: Mapping
}

const initialState: ViewState = {
    active: 0,
    mapping : {
        0: 'dashboard',
        1: 'tasklist',
        2: 'kanban',
        3: 'graph',
        4: 'group',
        5: 'notif',
        6: 'chat'
    }
}

export const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        changeView: (state, action) => {state.active = action.payload},
    }
})

export const { changeView } = viewSlice.actions
export default viewSlice.reducer
