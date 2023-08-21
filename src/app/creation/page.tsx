'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { auth } from "../auth/firebase";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/features/authSlice";
import { RootState } from "../redux/store";
import styles from './creation.module.scss'

type Props = {}

const Creation = (props: Props) => {
    const [inputs, setInputs] = useState({'username': '', 'photo': ''})
    const router = useRouter()
    const dispatch = useDispatch()
    const [user, _, __] = useAuthState(auth)
    const [updateProfile, updating, profileError] = useUpdateProfile(auth)

    useEffect(() => {
        if (!user) router.push('/')
        if (user?.photoURL && user.displayName) router.push('/home')
        console.log(inputs)
    }, [user, router, inputs])

    const avatars = [
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar1.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar1'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar2.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar2'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar3.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar3'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar4.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar4'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar5.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar5'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar6.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar6'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar7.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar7'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar8.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar8'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar9.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar9'},
        {'src': 'https://firebasestorage.googleapis.com/v0/b/tasktide-1688766801877.appspot.com/o/avatars%2Favatar10.png?alt=media&token=cfe3dec4-17ca-44d5-9f1c-4c732dbaf541', 'name': 'avatar10'},
    ]

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, ['username']: e.target.value}))
    }

    const handleClick = (url: string) => {
        setInputs((prev) => ({...prev, ['photo']: url}))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputs['username'] || !inputs['photo']) 
            return toast.error('Please fill the required fields', {position: 'top-center', autoClose: 3000, theme:'dark'})
        try {
            await updateProfile({displayName: inputs['username'], photoURL: inputs['photo']})
            dispatch(setUser({'id': user?.uid, 'email': user?.email, 'username': inputs['username'], 'photo': inputs['photo']}))
            router.push('/home')
        } catch (error: any) {
            return toast.error(error.message, {position: 'top-center', autoClose: 3000, theme:'dark'})
        }
    }

    return (
        <div className={styles['creation-bg']}>
            <div className={styles['creation-container']}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='username'>Enter an awesome username! <span className='required'>*</span></label>
                        <input name='username' onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor='photo'>Choose a stunning profile photo!</label>
                        <div className={styles['photo-container']}>
                            {(user && !user.photoURL) && avatars.map((avatar, i) => (
                                <div key={i} onClick={() => handleClick(avatar.src)} className={`${inputs['photo'] === avatar.src ? styles['selected-photo'] : ''}`}>
                                    <div><Image src={avatar['src']} width={128} height={128} alt='avatar'></Image></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type='submit' className='button-primary'>Submit</button>
                </form>
            </div>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Creation
