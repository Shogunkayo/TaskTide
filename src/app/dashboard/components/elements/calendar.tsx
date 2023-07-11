'use client'

import { add, eachDayOfInterval, endOfMonth, endOfWeek, format, parse, startOfMonth, startOfToday } from 'date-fns'
import React, { useState } from 'react'
import {AiFillCaretDown} from 'react-icons/ai'
import styles from '../topbar.module.scss';

type Props = {}

const Calendar = (props: Props) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const [isOpen, setIsOpen] = useState(false)
    
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
    let newDays = eachDayOfInterval({ start: firstDayCurrentMonth, end: endOfWeek(endOfMonth(firstDayCurrentMonth))})
    
    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, {months: 1})
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    const prevMonth = () => {
        const firstDayLastMonth = add(firstDayCurrentMonth, {months: -1})
        setCurrentMonth(format(firstDayLastMonth, 'MMM-yyyy'))
    }

    return (
        <>
            <div className={`${styles['calendar-closed']} ${isOpen ? styles['calendar-top-open'] : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <h4>{format(today, "EEE, dd MMM")}</h4>
                <div><AiFillCaretDown size={24}></AiFillCaretDown></div>
            </div>
            {isOpen && (
                <div className={styles['calendar-open']}>
                    <div>
                        <h4>{format(firstDayCurrentMonth, 'MMM yyyy')}</h4>
                        <button onClick={nextMonth}>{'>'}</button>
                        <button onClick={prevMonth}>{'<'}</button>
                    </div>
                    <div>
                        <div>
                            {days.map((day, i) => (<p key={i}>{day}</p>))}
                        </div>
                        <div>
                            {newDays.map((day) => (
                                <div key={day.toString()}>
                                    <button><time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time></button>
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
