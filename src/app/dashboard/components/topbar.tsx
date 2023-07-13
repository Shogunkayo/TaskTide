import React from 'react'
import Clock from './elements/clock'
import Calendar from './elements/calendar'
import styles from './topbar.module.scss'
import TaskBtn from './elements/taskBtn'
import CatBtn from './elements/catBtn'
type Props = {}

const Topbar = (props: Props) => {
    const now = new Date()

    return (
        <nav className={styles.topbar}>
            <div className={styles.left}>
                <div className={styles.clock}><Clock time={now.getTime()}></Clock></div>
                <div className={styles.calendar}><Calendar></Calendar></div>
            </div>
            <div className={styles.right}>
                <TaskBtn></TaskBtn>
            </div>
        </nav>
    )
}

export default Topbar
