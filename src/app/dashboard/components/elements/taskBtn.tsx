'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import styles from '../topbar.module.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/app/auth/firebase'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'

type Props = {}

const TaskBtn = (props: Props) => {
    const uid = useSelector((state: RootState) => state.auth.user?.id)
    const [isOpen, setIsOpen] = useState(false);
    const [inputs, setInputs] = useState({'title': '', 'description': '', 'color': '', 'category': '', 'deadline': '', 'newCategory': ''});


    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const createNewTask = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs['title'] || (inputs['category'] === '-1' && !inputs['newCategory']))
            return toast.error("Please fill all required fields", {position: 'top-center', autoClose:3000, theme:'dark'})
        
        const taskData = {...inputs, completed: false, isSingle: inputs['category'] ? false : true, taskOf: uid, [inputs['deadline']]: new Date(inputs['deadline'])}
        const docRef = await addDoc(collection(db, 'users/'+uid+'/tasks/'), taskData) 
        if (inputs['category']) {
            const catData = {title: inputs['newCategory'], description: '', color: inputs['color'], tasks: [docRef.id]}
            await addDoc(collection(db, 'users/'+uid+'/categories/'), catData)
            setIsOpen(false)
        }
    }

    return (
        <div>
            <button className={`${isOpen ? 'button-primary' : 'button-accent'}`} onClick={() => {setIsOpen(!isOpen)}}>New Task</button>
            {isOpen && (
                <div className={styles['task-container']}>
                    <button onClick={() => setIsOpen(false)} className={`${styles['close-btn']} button-default no-hover`}><IoClose size={24}></IoClose></button> 
                    <form onSubmit={createNewTask} className={styles['task-open']}>
                        <div>
                            <label htmlFor='title'>Title <span className='required'>*</span></label>
                            <input name='title' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='description'>Description</label>
                            <textarea name='description' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='category'>Add to <br></br>Category</label>
                            <select onChange={handleChange} name='category'>
                                <option default value={0}>None</option>
                                <option value={-1}>New Category</option>
                            </select>
                        </div>
                        {inputs['category'] === '-1' && (
                        <div>
                            <label htmlFor='newCategory'>Category Name <span className='required'>*</span></label>
                            <input name='newCategory' onChange={handleChange}/>
                        </div>)}
                        <div>
                            <label htmlFor='color'>Color</label>
                            <input type='color' name='color' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='deadline'>Deadline</label>
                            <input type='datetime-local' name='deadline' onChange={handleChange}/>
                        </div>
                        <button className='button-accent' type='submit'>Create Task</button>
                    </form>
                </div>
            )}
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default TaskBtn
