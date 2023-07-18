'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import styles from '../topbar.module.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/app/auth/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { useAuthState } from 'react-firebase-hooks/auth'
import { addCategories, addTaskDays, addTaskToCategory, addTasks } from '@/app/redux/features/taskSlice'

type Props = {}

const TaskBtn = (props: Props) => {
    const categories = useSelector((state: RootState) => state.task.categories)
    const dispatch = useDispatch()
    const [user, loading, _] = useAuthState(auth)
    const [isOpen, setIsOpen] = useState(false);
    const initialState = {'title': '', 'description': '', 'color': '#000000', 'category': 'none', 'deadline': '', 'categoryName': '', 'priority': 'low'}
    const [inputs, setInputs] = useState(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const createNewTask = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs['title'] || (inputs['category'] === 'new' && !inputs['categoryName']))
            return toast.error("Please fill all required fields", {position: 'top-center', autoClose:3000, theme:'dark'})
        
        let taskData = {...inputs, completed: false, isSingle: inputs['category'] === 'none' ? true : false, taskOf: user?.uid, 
            ['deadline']: inputs['deadline'] ? new Date(inputs['deadline']) : new Date('9999-12-31T23:59:59.999999999Z'), createdAt: new Date()}

        if (inputs['category'] === 'none') {
            taskData = {...taskData, 'categoryName': ''}
            const taskRef = await addDoc(collection(db, `users/${user?.uid}/tasks/`), taskData)

            dispatch(addTasks({'id': taskRef.id, 'data': taskData}))
            dispatch(addTaskDays({'id': taskRef.id, 'data': taskData}))
        }

        else if (inputs['category'] === 'new') {
            const i = categories.findIndex(e => e.data.title === inputs['categoryName'])
            if (i > -1) {
                const cat_id = categories[i].id;
                taskData = {...taskData, 'category': cat_id}
                const taskRef = await addDoc(collection(db, `users/${user?.uid}/tasks/`), taskData)
                
                updateDoc(doc(db, `users/${user?.uid}/categories/${cat_id}`), {
                    tasks: arrayUnion(taskRef.id)
                })

                dispatch(addTasks({'id': taskRef.id, 'data': taskData}))
                dispatch(addTaskDays({'id': taskRef.id, 'data': taskData}))
                dispatch(addTaskToCategory({'catId': cat_id, 'taskId': taskRef.id}))
            }
            
            else {
                const catData = {title: inputs['categoryName'], description: '', color: inputs['color'], tasks: []}
                const catRef = await addDoc(collection(db, `users/${user?.uid}/categories/`), catData)

                taskData = {...taskData, 'category': catRef.id}
                const taskRef = await addDoc(collection(db, `users/${user?.uid}/tasks/`), taskData)

                await updateDoc(doc(db, `users/${user?.uid}/categories/${catRef.id}`), {
                    tasks: arrayUnion(taskRef.id)            
                })

                dispatch(addTasks({'id': taskRef.id, 'data': taskData}))
                dispatch(addTaskDays({'id': taskRef.id, 'data': taskData}))
                dispatch(addCategories({'id': catRef.id, 'data': catData}))
            }
        }

        else {
            const i = categories.findIndex(e => e.id === inputs['category'])
            const cat_id = categories[i].id;
            taskData = {...taskData, 'category': cat_id}
            const taskRef = await addDoc(collection(db, `users/${user?.uid}/tasks/`), taskData)
            
            updateDoc(doc(db, `users/${user?.uid}/categories/${cat_id}`), {
                tasks: arrayUnion(taskRef.id)
            })
            
            dispatch(addTasks({'id': taskRef.id, 'data': taskData}))
            dispatch(addTaskDays({'id': taskRef.id, 'data': taskData}))
            dispatch(addTaskToCategory({'catId': cat_id, 'taskId': taskRef.id}))
        }

        setIsOpen(false)
    }

    return (
        <div>
            <button className={`${isOpen ? 'button-primary' : 'button-accent'}`} onClick={() => {setIsOpen(!isOpen); setInputs(initialState)}}>New Task</button>
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
                            <label htmlFor='priority'>Priority </label>
                            <select onChange={handleChange} name='priority'>
                                <option default value={'low'}>Low</option>
                                <option value={'medium'}>Medium</option>
                                <option value={'high'}>High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor='category'>Add to <br></br>Category</label>
                            <select onChange={handleChange} name='category'>
                                <option default value={'none'}>None</option>
                                <option value={'new'}>New Category</option>
                                {categories.map((category, i) => (
                                    <option value={category.id} key={i}>{category.data.title}</option>
                                ))}
                            </select>
                        </div>
                        {inputs['category'] === 'new' && (
                        <div>
                            <label htmlFor='categoryName'>Category Name <span className='required'>*</span></label>
                            <input name='categoryName' onChange={handleChange}/>
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
