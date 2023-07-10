'use client'

import { RiBookletFill, RiDashboardFill, RiLogoutBoxFill } from 'react-icons/ri'
import { BsFillChatRightTextFill, BsKanbanFill } from 'react-icons/bs'
import { SiGraphql } from 'react-icons/si'
import { HiUserGroup } from 'react-icons/hi'
import { IoNotifications } from 'react-icons/io5'
import { LuMenu } from 'react-icons/lu'
import Hero from '@/assets/hero.png' 
import Image from 'next/image'
import { useState } from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import { auth } from '@/app/auth/firebase'
import { useRouter } from 'next/navigation'
import styles from '../style.module.scss'
import { useDispatch } from 'react-redux'
import { changeView } from '@/app/redux/features/viewSlice'

type Props = {
    username ?: string | null,
    email ?: string | null,
    active: number
}

const Sidebar = (props: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [signout, loading, error] = useSignOut(auth);
    const [isOpen, setIsOpen] = useState(false)
    const [isActive, setIsActive] = useState({0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false})

    const iconSize = 32;

    const contents = [
        {'icon': (<RiDashboardFill size={iconSize}></RiDashboardFill>), 'p': 'Dashboard'},
        {'icon': (<RiBookletFill size={iconSize}></RiBookletFill>), 'p': 'Task List'},
        {'icon': (<BsKanbanFill size={iconSize}></BsKanbanFill>), 'p': 'Kanban Board'},
        {'icon': (<SiGraphql size={iconSize}></SiGraphql>), 'p': 'Graph View'},
        {'icon': (<HiUserGroup size={iconSize}></HiUserGroup>), 'p': 'Groups'},
        {'icon': (<IoNotifications size={iconSize}></IoNotifications>), 'p': 'Notifications'},
        {'icon': (<BsFillChatRightTextFill size={iconSize}></BsFillChatRightTextFill>), 'p': 'Chat'}
    ]

    return (
        <nav className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
            <div className={styles.logo}>
                <div onClick={() => setIsOpen(!isOpen)}>
                    <LuMenu size={32}></LuMenu>
                </div>
                {isOpen &&<h1 className='highlight-logo'>TaskTide</h1>}
                <hr></hr>
            </div>

            <div className={styles.content}>
                {contents.map((content, i) => (
                    <div key={i} id={i.toString()} className={`${props.active === i ? styles.active : ''}`} onClick={() => dispatch(changeView(i))}>
                        <div>{content['icon']}</div>
                        {isOpen && <p>{content['p']}</p>}
                    </div>
                ))}
            </div>

            <div className={styles.profile}>
                {isOpen && <>
                    <div><Image src={Hero} alt='profile' width={64} height={64}></Image></div>
                    <h3>{props.username}</h3>
                    <p>{props.email}</p>
                </>}
            </div>

            <div onClick={() => {signout(); router.push('/')}} className={styles.logout}>
                <hr></hr>
                <div><RiLogoutBoxFill size={32}></RiLogoutBoxFill></div>
                {isOpen && <p>Logout</p>}
            </div>

        </nav>
    )
}

export default Sidebar
