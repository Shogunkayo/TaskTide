'use client'

import { changeOpen, changeType } from '@/app/redux/features/authSlice'
import { useDispatch } from 'react-redux'

type Props = {
    text : string
    type ?: string 
}

const SignupBtn = (props: Props) => {
    const dispatch = useDispatch()
    return (
        <button className={props.type ? props.type : 'button-primary'} onClick={() => {dispatch(changeType('signup')); dispatch(changeOpen(true))}}>{props.text}</button>
    )
}

export default SignupBtn
