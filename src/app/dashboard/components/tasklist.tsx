'use client'

import { RootState } from "@/app/redux/store"
import { useSelector } from "react-redux"
import { AiOutlineCheck } from 'react-icons/ai'
import styles from './tasklist.module.scss'
import { useState } from "react"

type Props = {}

const Tasklist = (props: Props) => {
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const categories = useSelector((state: RootState) => state.task.categories)
    const [toShow, setToShow] = useState('all')

    return (
        <div className={styles['tasklist-container']}>
            <nav>
                <button id='all' onClick={() => setToShow('all')} className={`${toShow === 'all' ? 'button-accent' : 'button-primary'}`}>All</button>
                {Object.keys(categories).map((category) => (
                    <button key={category} id={category} onClick={() => setToShow(category)} className={`${toShow === category ? 'button-accent' : 'button-primary'}`}>
                        {categories[category].title}
                    </button>
                ))}
            </nav>
            <div className={styles['task-container']}>
            {toShow === 'all' && Object.keys(tasks).map((task) => (
                <div key={task} className={styles['task']} style={{'backgroundColor': tasks[task].color}}>
                    <div className={styles['task-title']}>
                        <h3>{tasks[task].title}</h3>
                    </div>
                    <div className={styles['task-inner']}>
                        <div className={styles['task-category']}>
                            {tasks[task].categoryName}
                        </div>
                        <div className={styles['task-desc']}>
                            {tasks[task].description}
                        </div>
                        <div className={styles['task-prty']}>
                            {tasks[task].priority}
                        </div>
                        <div className={styles['task-ddln']}>
                            {tasks[task].deadline.toDate().toLocaleDateString('en-GB') !== '31/12/9999' ? tasks[task].deadline.toDate().toLocaleDateString('en-GB') : '--.--'}
                        </div>
                        <button className={styles['task-done']}><AiOutlineCheck></AiOutlineCheck></button>
                    </div>
                </div>
            ))}
            {toShow !== 'all' && categories[toShow].tasks.map((task) => (
                <div key={task} className={styles['task']} style={{'backgroundColor': tasks[task].color}}>
                    <div className={styles['task-title']}>
                        <h3>{tasks[task].title}</h3>
                    </div>
                    <div className={styles['task-desc']}>
                        {tasks[task].description}
                    </div>
                    <div className={styles['task-prty']}>
                        {tasks[task].priority}
                    </div>
                    <div className={styles['task-ddln']}>
                        {tasks[task].deadline.toDate().toLocaleDateString('en-GB') !== '31/12/9999' ? tasks[task].deadline.toDate().toLocaleDateString('en-GB') : '--.--'}
                    </div>
                    <button className={styles['task-done']}><AiOutlineCheck></AiOutlineCheck></button>
                </div>
            ))}
            </div>
        </div>
    )
}

export default Tasklist
