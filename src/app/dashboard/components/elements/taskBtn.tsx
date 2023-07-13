'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import styles from '../topbar.module.scss'
type Props = {}

const TaskBtn = (props: Props) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [inputs, setInputs] = useState({'title': '', 'description': '', 'color': '', 'category': '', 'deadline': '', 'newCategory': ''});

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const createNewTask = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(inputs)
    }

    return (
        <div>
            <button className={`${isOpen ? 'button-primary' : 'button-accent'} `} onClick={() => {setIsOpen(!isOpen)}}>New Task</button>
            {isOpen && (
                <div className={styles['task-container']}>
                    <button onClick={() => setIsOpen(false)} className={`${styles['close-btn']} button-default`}><IoClose size={24}></IoClose></button> 
                    <form onSubmit={createNewTask} className={styles['task-open']}>
                        <div>
                            <label htmlFor='title'>Title <span className='required'>*</span></label>
                            <input name='title' required onChange={handleChange}/>
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
                            <input name='newCategory' required onChange={handleChange}/>
                        </div>)}
                        <div>
                            <label htmlFor='color'>Color</label>
                            <input type='color' name='color' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='deadline'>Deadline</label>
                            <input type='date' name='deadline' onChange={handleChange}/>
                        </div>
                        <button className='button-accent' type='submit'>Create Task</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default TaskBtn
