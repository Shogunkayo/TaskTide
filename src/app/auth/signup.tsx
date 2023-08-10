'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from './firebase'
import { toast } from 'react-toastify'
import { changeOpen, changeType, setUser } from '../redux/features/authSlice'
import GoogleBtn from '../components/buttons/google'
import { RootState } from '../redux/store'

type Props = {}

const Signup = (props: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const uid = useSelector((state: RootState) => state.auth.user?.id)
    const [inputs, setInputs] = useState({email: '', password: '', password_verify: ''})
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth)

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.email || !inputs.password || !inputs.password_verify) {
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
            dispatch(setUser({'id': newUser.user.uid, 'email': newUser.user.email}))
            router.push('/creation')
        } catch (error: any) {
            toast.error(error.message, {position: "top-center", autoClose: 3000, theme: "dark"})
        }
    }

    useEffect(() => {
        const handleCreation = () => {
            console.log(uid)
            dispatch(changeOpen(false))
            router.push('/creation')
        }

        if (uid) return handleCreation() 
        if (error) toast.error(error.message, {position: "top-center", autoClose: 3000, theme: "dark"})            
    }, [error, uid, dispatch, router])

    return (
        <form onSubmit={handleSubmit}>
            <h3>Sign up to <span className='highlight-logo'>TaskTide</span></h3>
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
