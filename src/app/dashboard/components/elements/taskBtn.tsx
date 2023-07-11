'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import styles from '../topbar.module.scss'
type Props = {}

const TaskBtn = (props: Props) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [inputs, setInputs] = useState({'title': '', 'description': '', 'color': '', 'category': '', 'deadline': ''});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const createNewTask = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(inputs)
    }

    return (
        <>
            <button className={`${isOpen ? 'button-primary' : 'button-accent'}`} onClick={() => {setIsOpen(true)}}>New Task</button>
            {isOpen && (
                <div>
                    <button onClick={() => setIsOpen(false)} className={styles['close-btn']}><IoClose></IoClose></button> 
                    <form onSubmit={createNewTask} className={styles['task-open']}>
                        <div>
                            <label htmlFor='title'>Title <span className='required'>*</span></label>
                            <input name='title' required onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='description'>Description</label>
                            <input name='description' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='color'>Color</label>
                            <input type='color' name='color' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='category'>Add to Category</label>
                            <select>
                                <option default>None</option>
                                <option>New Category</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor='deadline'>Deadline</label>
                            <input type='date' name='deadline' onChange={handleChange}/>
                        </div>
                        <button className='button-accent' type='submit'>Create Task</button>
                    </form>
                </div>
            )}
        </>
    )
}

export default TaskBtn
