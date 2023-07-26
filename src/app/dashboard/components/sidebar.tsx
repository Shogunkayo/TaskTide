'use client'

import { RiBookletFill, RiDashboardFill, RiLogoutBoxFill } from 'react-icons/ri'
import { BsFillChatRightTextFill, BsKanbanFill } from 'react-icons/bs'
import { SiGraphql } from 'react-icons/si'
import { HiUserGroup } from 'react-icons/hi'
import { IoNotifications } from 'react-icons/io5'
import { LuMenu } from 'react-icons/lu'
import Image from 'next/image'
import { useState } from 'react'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { auth } from '@/app/auth/firebase'
import { useRouter } from 'next/navigation'
import styles from './sidebar.module.scss'
import { useDispatch, useSelector} from 'react-redux'
import { changeView } from '@/app/redux/features/viewSlice'

type Props = {
    active: number
}

const Sidebar = (props: Props) => {
    const [user, usrloading, usrerror] = useAuthState(auth)
    const dispatch = useDispatch();
    const router = useRouter();
    const [signout, loading, error] = useSignOut(auth);
    const [isOpen, setIsOpen] = useState(false)

    const iconSize = 24;

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
                    <div key={i} id={i.toString()} className={`${props.active === i ? styles.active : styles.inactive} }`} onClick={() => dispatch(changeView(i))}>
                        <div>{content['icon']}</div>
                        {isOpen && <p>{content['p']}</p>}
                    </div>
                ))}
            </div>

            <div className={styles.profile}>
                {isOpen && <>
                    <div><Image src={user?.photoURL ? user.photoURL : ''} alt='profile' width={64} height={64}></Image></div>
                    <h3>{user?.displayName}</h3>
                    <p>{user?.email}</p>
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
