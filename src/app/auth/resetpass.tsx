'use client'

import React, { useEffect, useState } from 'react'
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import { toast } from 'react-toastify'
import { changeType } from '../redux/features/authSlice'
import { useDispatch } from 'react-redux'
import GoogleBtn from '../components/buttons/google'

type Props = {}

const ResetPass = (props: Props) => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth)

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            return toast.error("All fields are required", {position: "top-center", autoClose: 3000, theme: "dark"})
        }
        const success = await sendPasswordResetEmail(email)
        if (success) {
            toast.success("Password reset email sent", {position: "top-center", autoClose: 3000, theme: "dark"})
        }
    }

    useEffect(() => {
        if(error) {
            toast.error(error.message, {position: "top-center", autoClose: 3000, theme: "dark"})
        }
    }, [error])

    return (
        <form onSubmit={handleReset}>
            <h3>Reset Password</h3>
            <div>
                <label htmlFor='email'>E-mail</label>
                <input type="email" name="email" placeholder="name@website.com" onChange={(e) => {setEmail(e.target.value)}}/>
            </div>

            <button type="submit" className="button-accent">Reset Password</button>
            <button onClick={() => dispatch(changeType('login'))} className='button-primary'>
                Log-in
            </button>
            <button onClick={() => dispatch(changeType('signup'))} className='button-primary'>
                Sign up
            </button>

            <GoogleBtn></GoogleBtn>
        </form> 
    )
}

export default ResetPass
