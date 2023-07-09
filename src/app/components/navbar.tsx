'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { auth } from '../auth/firebase';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthModal from '../auth/authModal';
import LoginBtn from './buttons/loginBtn';
import SignupBtn from './buttons/signupBtn';
import {FaArrowDown, FaArrowUp, FaHome} from 'react-icons/fa'

type Props = {}

const Navbar = (props: Props) => {
    const authModal = useSelector((state: RootState) => state.auth);
    const [user, loading, error] = useAuthState(auth)
    const router = useRouter()
    const [pageLoading, setPageLoading] = useState(true)
    const isBrowser = () => typeof window !== 'undefined';
    const scroll = (x: number) => {
        if (!isBrowser()) return;
        window.scrollTo({top: x, behavior: 'smooth'})
    }

    useEffect(() => {
        if(user) router.push('/dashboard')
        if(!loading && !user) setPageLoading(false)
    }, [user, router, loading])

    if (pageLoading) return null;

    return (
        <>
         <nav>
                <div>
                    <h1>TaskTide</h1>
                </div>
                <div>
                    <button className='button-default' onClick={() => {scroll(window.innerHeight)}}>Features</button>
                    <button className='button-default' onClick={() => {scroll(window.innerHeight * 2 + 100)}}>Pricing</button>
                    <button className='button-default' onClick={() => {scroll(window.innerHeight * 3 + 400)}}>Contact</button>
                </div>
                <div>
                    <LoginBtn></LoginBtn>
                    <SignupBtn text={"Sign up"}></SignupBtn>
                </div>
        </nav>
        {authModal.isOpen && <AuthModal></AuthModal>}
        <div className='nav-arrows'>
            <button className='button-default' onClick={() => {scroll(0)}}><FaHome></FaHome></button>
        </div>
        </>
    )
}

export default Navbar
