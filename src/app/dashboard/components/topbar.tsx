import React from 'react'
import Clock from './elements/clock'
import Calendar from './elements/calendar'

type Props = {}

const Topbar = (props: Props) => {
    const now = new Date()

    return (
        <nav>
            <div>
                <Clock time={now.getTime()}></Clock>
                <Calendar></Calendar>
            </div>
            <div>
                <button className='button-accent'>New Task</button>
                <button className='button-primary'>New Category</button>
            </div>
        </nav>
    )
}

export default Topbar
