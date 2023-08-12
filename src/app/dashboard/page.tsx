'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import Sidebar from './components/sidebar'
import styles from './dashboard.module.scss'
import { useRouter } from 'next/navigation'
import { auth } from '../auth/firebase'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import Topbar from './components/topbar'
import { fetchTasksAndCategories, newTaskDays, setCategories, setTaskDays, setTasks } from '../redux/features/taskSlice'
import Tasklist from './components/tasklist'

type Props = {}

const Dashboard = (props: Props) => {
    const active = useSelector((state: RootState) => state.view.active)
    const dispatch = useDispatch()
    const router = useRouter();
    const [user, loading, _] = useAuthState(auth)
    const view = useSelector((state: RootState) => state.view.active)

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.uid) return
            const [tasks, cats] = await fetchTasksAndCategories(user?.uid)
            dispatch(setTasks(tasks))
            dispatch(setCategories(cats))
            dispatch(setTaskDays(newTaskDays(tasks)))
        }

        if (!user && !loading) router.push("/");
        if (user) fetchData();
    }, [user, router, loading])
   
    return (
        <div className={styles.dashboard}>
            <div className={styles['topbar-container']}>
                <Topbar></Topbar>
            </div>
            <div className={styles['sidebar-container']}>
                <Sidebar active={active}></Sidebar>
            </div>
            <div className={styles['content-container']}>
                {view === 1 && <Tasklist></Tasklist>}
            </div>
        </div>
    )
}

export default Dashboard
