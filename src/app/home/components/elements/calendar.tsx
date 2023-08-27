'use client'

import { add, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isEqual, isSameDay, isSameMonth, parse, startOfMonth, startOfToday, startOfWeek } from 'date-fns'
import { useState } from 'react'
import {AiFillCaretDown, AiOutlineExpandAlt} from 'react-icons/ai'
import styles from '../topbar.module.scss';
import Success from '@/assets/success.png'
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { priorityMap, setTaskView } from '@/app/redux/features/taskSlice';
import { useDispatch } from 'react-redux';
type Props = {}

const Calendar = (props: Props) => {
    const tasks_days = useSelector((state: RootState) => state.task.tasks_days)
    const categories = useSelector((state: RootState) => state.task.categories)
    const init: any = []
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const [taskOnSelectedDay, setTaskOnSelectedDay] = useState(init)

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
        if (date.toLocaleDateString() in tasks_days){
            let flag = false
            for (let i=0; i<tasks_days[date.toLocaleDateString()].length; i++) {
                if (!tasks_days[date.toLocaleDateString()][i]['data'].completed)
                    flag = true
            }
            return flag
        }
        return false
    }

    const handleSelection = (date: Date) => {
        setSelectedDay(date)
        if (date.toLocaleDateString() in tasks_days)
            setTaskOnSelectedDay(tasks_days[date.toLocaleDateString() as keyof typeof tasks_days])
        else
            setTaskOnSelectedDay([])
    }

    const checkTaskOnSelectedDay = () => {
        /*
            Returns true if all tasks have been completed
         */
        if (!taskOnSelectedDay || taskOnSelectedDay.length === 0) return
        let flag = true
        for (let i=0; i<setTaskOnSelectedDay.length; i++) {
            if (taskOnSelectedDay[i]['data'].completed === false) {
                flag = false
                break
            }
        }
        return flag
    }

    return (
        <>
            <div className={`${styles['calendar-closed']} ${isOpen ? styles['calendar-top-open'] : ''}`} onClick={() => {setIsOpen(!isOpen); setCurrentMonth(format(today, 'MMM-yyyy')); handleSelection(today)}}>
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
                            {newDays.map((day) => (
                                <div key={day.toString()} style={{'gridColumnStart': ((getDay(day) + 6) % 7) + 1}}>
                                    <button className={`button-default no-hover 
                                        ${isEqual(day, today) ? styles.today : ''} 
                                        ${isEqual(day, selectedDay) ? styles['selected-date'] : ''}
                                        ${hasTasks(day) ? styles['task-indicator'] : ''}
                                        ${isSameMonth(day, firstDayCurrentMonth) ? '' : styles['diff-month']}`} 
                                        onClick={() => {
                                            if (!isSameDay(selectedDay, day)) handleSelection(day)
                                        }}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'dd')}</time>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['calendar-right']}>
                        {(taskOnSelectedDay.length === 0 || checkTaskOnSelectedDay()) && (
                            <div className={styles['tasks-empty']}>
                                <Image src={Success} alt='success' width={320} height={320}></Image>
                                <p>No tasks left!</p>
                            </div>
                        )}
                        <div className={styles['tasks']}>
                            {taskOnSelectedDay.length !== 0 && taskOnSelectedDay.map((task) => {
                                if (!task.data.completed) {
                                    let catStyle = {}
                                    
                                    if (task.data['categoryName']) {
                                        catStyle = {backgroundColor: categories[task.data.category].color}
                                    }
                                    
                                    return (
                                        <div key={task.id} className={styles['task-card']}>
                                            <h4>{task.data['title']}</h4>
                                            <p className={styles['category']} style={catStyle}>{task.data['categoryName']}</p>
                                            <p className={`${styles['priority']} ${styles[priorityMap[task.data.priority]]}`}>{priorityMap[task.data['priority']]}</p>
                                        </div>
                            )}})}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Calendar
