'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import Sidebar from './components/sidebar'
import styles from './dashboard.module.scss'
import { useRouter } from 'next/navigation'
import { auth } from '../auth/firebase'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import Topbar from './components/topbar'

type Props = {}

const Dashboard = (props: Props) => {
    const active = useSelector((state: RootState) => state.view.active)
    const usr = useSelector((state: RootState) => state.auth.user)
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth)
    
    useEffect(() => {
        console.log("DASHBOARD", usr, user)
        if (!user && !loading) router.push("/");
    }, [user, router, loading])
    
    if (loading) {
        return (
            <div>
                Hehehehaw
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles['topbar-container']}>
                <Topbar></Topbar>
            </div>
            <div className={styles['sidebar-container']}>
                <Sidebar active={active}></Sidebar>
            </div>
        </div>
    )
}

export default Dashboard
