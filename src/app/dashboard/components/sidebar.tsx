'use client'

import { RiBookletFill, RiDashboardFill, RiLogoutBoxFill } from 'react-icons/ri'
import { BsFillChatRightTextFill, BsKanbanFill } from 'react-icons/bs'
import { SiGraphql } from 'react-icons/si'
import { HiUserGroup } from 'react-icons/hi'
import { IoNotificationsOutline, IoNotifications } from 'react-icons/io5'
import { LuMenu } from 'react-icons/lu'
import Hero from '@/assets/hero.png' 
import Image from 'next/image'
import { useState } from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import { auth } from '@/app/auth/firebase'
import { useRouter } from 'next/navigation'
import styles from '../style.module.scss'

type Props = {
    username ?: string | null,
    email ?: string | null
}

const Sidebar = (props: Props) => {

    const [signout, loading, error] = useSignOut(auth);
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false)

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
                <div>
                    <div><RiDashboardFill size={32}></RiDashboardFill></div>
                    {isOpen && <p>Dashboard</p>}
                </div>
                <div>
                    <div><RiBookletFill size={32}></RiBookletFill></div>
                    {isOpen && <p>Task List</p>}
                </div>
                <div>
                    <div><BsKanbanFill size={32}></BsKanbanFill></div>
                    {isOpen && <p>Kanban Board</p>}
                </div>
                <div>
                    <div><SiGraphql size={32}></SiGraphql></div>
                    {isOpen && <p>Graph View</p>}
                </div>
                <div>
                    <div><HiUserGroup size={32}></HiUserGroup></div>
                    {isOpen && <p>Groups</p>}
                </div>
                <div>
                    <div><IoNotifications size={32}></IoNotifications></div>
                    {isOpen && <p>Notifications</p>}
                </div>
                <div>
                    <div><BsFillChatRightTextFill size={32}></BsFillChatRightTextFill></div>
                    {isOpen && <p>Chat</p>}
                </div>
            </div>
            <div className={styles.profile}>
                {isOpen && <>
                    <div><Image src={Hero} alt='profile' width={96} height={96}></Image></div>
                    <h3>{props.username}</h3>
                    <p>{props.email}</p>
                </>}
            </div>
            <div onClick={() => {signout(); router.push('/')}} className={styles.logout}>
                <div><RiLogoutBoxFill size={32}></RiLogoutBoxFill></div>
                {isOpen && <p>Logout</p>}
            </div>

        </nav>
    )
}

export default Sidebar
