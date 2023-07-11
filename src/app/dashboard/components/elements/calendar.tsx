'use client'

import { add, eachDayOfInterval, endOfMonth, endOfWeek, format, parse, startOfMonth, startOfToday } from 'date-fns'
import React, { useState } from 'react'

type Props = {}

const Calendar = (props: Props) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    
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
        <div>
            <div>
                <div>
                    <h4>{format(firstDayCurrentMonth, 'MMM yyyy')}</h4>
                    <button onClick={nextMonth}>{'>'}</button>
                    <button onClick={prevMonth}>{'<'}</button>
                </div>
                <div>
                    <div>
                        {days.map((day) => (<p key={day}>{day}</p>))}
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
        </div>
    )
}

export default Calendar
