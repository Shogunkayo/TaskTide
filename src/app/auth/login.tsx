'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import { toast } from 'react-toastify'
import { changeType } from '../redux/features/authSlice'
import GoogleBtn from '../components/buttons/google'

type Props = {}

const Login = (props: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
    const [inputs, setInputs] = useState({email: '', password: ''});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({
                ...prev,
                [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!inputs.email || !inputs.password) {
            toast.error("All Fields are required", {position: "top-center", autoClose: 3000, theme: "dark"})
            console.log("All Fields are required")
            return
        } 
        try {
            const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password)
            if (!newUser) return
            router.push('/dashboard')

        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message, {position: "top-center", autoClose: 3000, theme: "dark"})
        }
    }

    useEffect(() => {
        if (error) toast.error(error.message, {position: "top-center", autoClose: 3000, theme: "dark"})
    }, [error])

    return (
        <form onSubmit={handleSubmit}>
            <h3>Log-in to <span className="highlight-logo">TaskTide</span></h3>
            <div>
                <label htmlFor="email">E-mail <span className='required'>*</span></label>
                <input type="email" name="email" placeholder="name@website.com" onChange={handleInputChange}/>
            </div>
            <div>
                <label htmlFor="password">Password <span className='required'>*</span></label>
                <input type="password" name="password" placeholder="********" onChange={handleInputChange}/>
            </div>

            <button type="submit" className='button-accent'>{loading ? "Logging in...": "Log-in"}</button>

            <button onClick={() => dispatch(changeType('reset'))} className='button-primary'>
                Forgot Password?
            </button>

            <button onClick={() => dispatch(changeType('signup'))} className='button-primary'>
                Sign up
            </button>

            <GoogleBtn></GoogleBtn>
        </form>
    )
}

export default Login
