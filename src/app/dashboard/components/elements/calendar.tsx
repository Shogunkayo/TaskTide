'use client'

import { add, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isEqual, isSameMonth, parse, startOfMonth, startOfToday, startOfWeek } from 'date-fns'
import { MouseEvent, useState } from 'react'
import {AiFillCaretDown} from 'react-icons/ai'
import styles from '../topbar.module.scss';
import Success from '@/assets/success.png'
import Image from 'next/image';
import {MdDoneOutline} from 'react-icons/md'
type Props = {}

const Calendar = (props: Props) => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const [isOpen, setIsOpen] = useState(false)
    
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
    let newDays = eachDayOfInterval({ start: startOfWeek(firstDayCurrentMonth, {weekStartsOn: 1}), end: endOfWeek(endOfMonth(firstDayCurrentMonth), {weekStartsOn: 1})})
    
    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, {months: 1})
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    const prevMonth = () => {
        const firstDayLastMonth = add(firstDayCurrentMonth, {months: -1})
        setCurrentMonth(format(firstDayLastMonth, 'MMM-yyyy'))
    }

    const hasTasks = (date: Date) => {
        return false
    }

    const finishTask = (e: MouseEvent<HTMLDivElement>) => {
        console.log(e.currentTarget.id)
    }

    const tasks = [{'id': 1, 'title': 'Hehehehaw dsjakdb sad bsuadb sad bsaui dbas i', 'category': 'Grrrr', 'color': '#f45555'},
                {'id': 2, 'title': 'Hehehehaw', 'category': 'Grrrr', 'color': '#f45555'},
                {'id': 3, 'title': 'Hehehehaw', 'category': 'Grrrr', 'color': '#f45555'},
                {'id': 4, 'title': 'Hehehehaw', 'category': 'Grrrr', 'color': '#f45555'},
                {'id': 5, 'title': 'Hehehehaw', 'category': 'Grrrr', 'color': '#f45555'}]

    return (
        <>
            <div className={`${styles['calendar-closed']} ${isOpen ? styles['calendar-top-open'] : ''}`} onClick={() => {setIsOpen(!isOpen); setCurrentMonth(format(today, 'MMM-yyyy')); setSelectedDay(today)}}>
                <p>{format(today, "EEE, dd MMM")}</p>
                <div><AiFillCaretDown size={24}></AiFillCaretDown></div>
            </div>
            {isOpen && (
                <div className={styles['calendar-open']}>
                    <div className={styles['calendar-head-left']}>
                        <h4>{format(firstDayCurrentMonth, 'MMMM yyyy')}</h4>
                        <button onClick={prevMonth}>{'<'}</button>
                        <button onClick={nextMonth}>{'>'}</button>
                    </div>

                    <div className={styles['calendar-head-right']}>
                        <h4>Tasks due on {format(selectedDay, 'MMMM dd, yyyy')}</h4>
                    </div>

                    <div className={styles['calendar-left']}>
                        <div className={styles['days']}>
                            {days.map((day, i) => (<button className='button-default no-hover' key={i}>{day}</button>))}
                        </div>
                        <div className={styles['dates']}>
                            {newDays.map((day, dayIdx) => (
                                <div key={day.toString()} style={{'gridColumnStart': ((getDay(day) + 6) % 7) + 1}}>
                                    <button className={`button-default no-hover 
                                        ${isEqual(day, today) ? styles.today : ''} 
                                        ${isEqual(day, selectedDay) ? styles['selected-date'] : ''}
                                        ${hasTasks(day) ? styles['task-indicator'] : ''}
                                        ${isSameMonth(day, firstDayCurrentMonth) ? '' : styles['diff-month']}`} 
                                        onClick={() => setSelectedDay(day)}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'dd')}</time>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['calendar-right']}>
                        {tasks.length === 0 && (
                            <div className={styles['tasks-empty']}>
                                <Image src={Success} alt='success' width={320} height={320}></Image>
                                <p>No tasks left!</p>
                            </div>
                        )}
                        <div className={styles['tasks']}>
                            {tasks.length !== 0 && tasks.map((task) => (
                                <div key={task['id']} className={styles['task-card']}>
                                    <h4>{task['title']}</h4>
                                    <p style={{'backgroundColor': task['color']}}>{task['category']}</p>
                                    <div id={task['id'].toString()} onClick={finishTask}><MdDoneOutline size={24}></MdDoneOutline></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Calendar
