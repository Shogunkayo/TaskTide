import { auth } from '@/app/auth/firebase'
import { setUser } from '@/app/redux/features/authSlice'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

type Props = {}

const GoogleBtn = (props: Props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)

    const handleGoogleLogin = async () => {
        console.log("THIS WAS CALLED")
        const user = await signInWithGoogle();
        if (user?.user) {
            if (user.user.metadata.creationTime === user.user.metadata.lastSignInTime) {
                console.log("THIS WAS CALLED HEHE")
                dispatch(setUser({'id': user.user.uid, 'email': user.user.email}))
                router.push('/creation');
            }
            else {
                console.log("THIS WAS CALLED GRRRR")
                dispatch(setUser({'id': user.user.uid, 'email': user.user.email, 'photo': user.user.photoURL, 'username': user.user.displayName}))
                router.push('/home');
            }
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
