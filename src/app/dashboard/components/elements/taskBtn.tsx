'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import styles from '../topbar.module.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/app/auth/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { useAuthState } from 'react-firebase-hooks/auth'
import { addCategories, addTaskDays, addTaskToCategory, addTasks } from '@/app/redux/features/taskSlice'
import { Timestamp } from 'firebase/firestore'

type Props = {}

const TaskBtn = (props: Props) => {
    const [catChange, triggerCatChange] = useState('none')
    const categories = useSelector((state: RootState) => state.task.categories)
    const dispatch = useDispatch()
    const [user, _, __] = useAuthState(auth)
    const [isOpen, setIsOpen] = useState(false);
    const initialState = {'title': '', 'description': '', 'color': '#d8dee9', 'category': 'none', 'deadline': '', 'categoryName': '', 'priority': 'low'}
    const [inputs, setInputs] = useState(initialState);

    const colors = ['#d8dee9', '#f2cdcd', '#f38ba8', '#fab387', '#a6e3a1', '#94e2d5', '#8fbcbb', '#7dc4e4', '#89b4fa', '#b4befe']

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
        if (e.target.name === 'category' && e.target.value !== 'none' && e.target.value !== 'new') {
            triggerCatChange(e.target.value)
        }
    }

    useEffect(() => {
        if (catChange !== 'none' && catChange !== 'new') {
            setInputs((prev) => ({...prev, ['color']: categories[inputs['category']].color}))
        }
    }, [catChange])

    const createNewTask = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs['title'] || (inputs['category'] === 'new' && !inputs['categoryName']))
            return toast.error("Please fill all required fields", {position: 'top-center', autoClose:3000, theme:'dark'})
        
        let taskData = {...inputs, completed: false, isSingle: inputs['category'] === 'none' ? true : false, taskOf: user?.uid, 
            ['deadline']: inputs['deadline'] ? Timestamp.fromDate(new Date(inputs['deadline'])) : Timestamp.fromDate(new Date('9999-12-31T23:59:59.999999999Z')), createdAt: new Date()}

        if (inputs['category'] === 'none') {
            taskData = {...taskData, 'categoryName': ''}
            const taskRef = await addDoc(collection(db, `users/${user?.uid}/tasks/`), taskData)

            dispatch(addTasks({'id': taskRef.id, 'data': taskData}))
            dispatch(addTaskDays({'id': taskRef.id, 'data': taskData}))
        }

        else if (inputs['category'] === 'new') {
            let duplicate = false;
            let cat_id;
            for (const category in categories) {
                if (categories[category].title === inputs['categoryName']) {
                    duplicate = true;
                    cat_id = category;
                    break;
                }
            }

            if (duplicate && cat_id) {
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
                dispatch(addCategories({'id': catRef.id, 'data': {...catData, 'tasks': [taskRef.id]}}))
            }
        }

        else {
            taskData = {...taskData, 'categoryName': categories[inputs['category']].title}
            const taskRef = await addDoc(collection(db, `users/${user?.uid}/tasks/`), taskData)
            
            updateDoc(doc(db, `users/${user?.uid}/categories/${inputs['category']}`), {
                tasks: arrayUnion(taskRef.id)
            })
            
            dispatch(addTasks({'id': taskRef.id, 'data': taskData}))
            dispatch(addTaskDays({'id': taskRef.id, 'data': taskData}))
            dispatch(addTaskToCategory({'catId': inputs['category'], 'taskId': taskRef.id}))
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
                                {
                                    Object.keys(categories).map((category) => (
                                        <option value={category} key={category}>{categories[category].title}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {inputs['category'] === 'new' && (
                        <div>
                            <label htmlFor='categoryName'>Category Name <span className='required'>*</span></label>
                            <input name='categoryName' onChange={handleChange}/>
                        </div>)}
                        <div>
                            <label htmlFor='color'>Color</label>
                            <div className={styles['color-container']}>
                            {colors.map((color) => (
                                <div key={color} style={{'backgroundColor': color}} 
                                    className={`${styles['color-picker']} ${inputs['color'] === color ? styles['color-selected'] : ''}`}
                                    onClick={() => setInputs((prev) => ({...prev, ['color']: color}))}
                                ></div>
                            ))}
                            </div>
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
