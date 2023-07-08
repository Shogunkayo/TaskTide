'use client'

import { changeOpen, changeType } from '@/app/redux/features/authSlice';
import React from 'react'
import { useDispatch } from 'react-redux'

type Props = {}

const LoginBtn = (props: Props) => {
    const dispatch = useDispatch();
    return (
        <button className='button-default' onClick={() => {dispatch(changeType('login')); dispatch(changeOpen(true))}}>Log-in</button>
    )
}

export default LoginBtn
