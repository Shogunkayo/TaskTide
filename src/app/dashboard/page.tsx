'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import Sidebar from './components/sidebar'
import styles from './style.module.scss'
import { useRouter } from 'next/navigation'
import { auth } from '../auth/firebase'
import { useEffect } from 'react'

type Props = {}

const Dashboard = (props: Props) => {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth)
    
    useEffect(() => {
        if (!user && !loading) router.push("/");
        if (user) console.log(user);
    }, [user, router, loading])
    
    if (loading) {
        return (
            <div>
                Hehehehaw
            </div>
        );
    }

    return (
        <div>
            <div className={styles['sidebar-container']}>
                <Sidebar username={user?.displayName} email={user?.email}></Sidebar>
            </div>
        </div>
    )
}

export default Dashboard
