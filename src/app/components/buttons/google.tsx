import { auth } from '@/app/auth/firebase'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'

type Props = {}

const GoogleBtn = (props: Props) => {
    const router = useRouter();
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)

    const handleGoogleLogin = async () => {
        await signInWithGoogle();
        if (user) {
            console.log(user); 
            router.push('/dashboard');
        }
    }

    useEffect(() => {
        if(error) toast.error(error.message, {position: 'top-center', autoClose: 3000, theme: 'dark'})
    }, [error])

    return (
        <button className='button-primary' onClick={handleGoogleLogin}>Use Google</button>

    )
}

export default GoogleBtn
