import { auth } from '@/app/auth/firebase'
import React from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'

type Props = {}

const GoogleBtn = (props: Props) => {

    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)

    return (
        <button className='button-primary' onClick={() => signInWithGoogle()}>Use Google</button>
    )
}

export default GoogleBtn
