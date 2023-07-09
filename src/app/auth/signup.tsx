'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth'
import { useDispatch } from 'react-redux'
import { auth } from './firebase'
import { toast } from 'react-toastify'
import { changeType } from '../redux/features/authSlice'
import GoogleBtn from '../components/buttons/google'

type Props = {}

const Signup = (props: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [inputs, setInputs] = useState({username: '', email: '', password: '', password_verify: ''})
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth)
    const [updateProfile, updating, profileError] = useUpdateProfile(auth)

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.email || !inputs.password || !inputs.username || !inputs.password_verify) {
            toast.error("All fields are required", {position: "top-center", autoClose: 3000, theme: "dark"})
            return
        }
        if (inputs.password !== inputs.password_verify) {
            toast.error("Passwords should match", {position: "top-center", autoClose: 3000, theme: "dark"})
            return
        }

        try {
            const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password)
            if (!newUser) {
                toast.error("Email is already in use", {position: "top-center", autoClose: 3000, theme: "dark"})
                return
            };
            await updateProfile({displayName: inputs.username})
            router.push('/')
        } catch (error: any) {
            toast.error(error.message, {position: "top-center", autoClose: 3000, theme: "dark"})
        }
    }

    useEffect(() => {
        if (error) toast.error(error.message, {position: "top-center", autoClose: 3000, theme: "dark"})            
    }, [error])

    return (
        <form onSubmit={handleSubmit}>
            <h3>Sign up to <span className='highlight-logo'>TaskTide</span></h3>
            <div>
                <label htmlFor='username'>Username <span className='required'> * </span></label>
                <input name='username' placeholder='username' onChange={handleChangeInput}/>
            </div>
            <div>
                <label htmlFor='email'>E-mail <span className='required'> * </span></label>
                <input type='email' name='email' placeholder='name@website.com' onChange={handleChangeInput}/>
            </div>
            <div>
                <label htmlFor='password'>Password <span className='required'> * </span></label>
                <input type='password' name='password' placeholder='********' onChange={handleChangeInput}/>
            </div>
            <div>
                <label htmlFor='password_verify'>Verify <br></br> Password <span className='required'>*</span></label>
                <input type='password' name='password_verify' placeholder='********' onChange={handleChangeInput}/>
            </div>

           <button type="submit" className='button-accent'>{loading ? "Signing up...": "Sign up"}</button>

            <button onClick={() => dispatch(changeType('login'))} className='button-primary'>
                Log-in
            </button>

            <GoogleBtn></GoogleBtn>

        </form>
    )
}

export default Signup
