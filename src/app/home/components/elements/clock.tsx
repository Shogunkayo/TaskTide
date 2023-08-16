'use client'

import { useEffect, useState } from 'react'

type Props = {
    time: number
}

const Clock = (props: Props) => {
    const [time, setTime] = useState(new Date(new Date(props.time)))

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <h4>{time.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit'
        })}</h4>
    )
}

export default Clock
