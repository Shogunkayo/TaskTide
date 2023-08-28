import Image from 'next/image'
import React from 'react'
import styles from '../kanban.module.scss'
import Empty from '@/assets/empty.png'

type Props = {
    message: string
}

const EmptyView = (props: Props) => {
    return (
         <div className={styles['empty-body']}>
            <div>
                <Image src={Empty} alt='empty' width={820}></Image>
                <p>{props.message}</p>
            </div>
        </div>
    )
}

export default EmptyView
