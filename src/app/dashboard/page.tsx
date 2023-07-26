'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import Sidebar from './components/sidebar'
import styles from './dashboard.module.scss'
import { useRouter } from 'next/navigation'
import { auth, db } from '../auth/firebase'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import Topbar from './components/topbar'
import { collection, doc, getDoc, query, getDocs, onSnapshot, orderBy } from 'firebase/firestore'
import { setCategories, setTaskDays, setTasks } from '../redux/features/taskSlice'
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
            const taskRef = query(collection(db, `users/${user?.uid}/tasks`), orderBy('deadline'), orderBy('category'), orderBy('priority'), orderBy('createdAt'))
            const catRef = query(collection(db, `users/${user?.uid}/categories`))
            const taskSnap = await getDocs(taskRef)
            const catSnap = await getDocs(catRef)

            const tasks: any = {}
            const cats: any = {}
            taskSnap.forEach((doc) => {
                tasks[doc.id] = doc.data() 
            })
            catSnap.forEach((doc) => {
                cats[doc.id] = doc.data()
            })
            dispatch(setTasks(tasks))
            dispatch(setCategories(cats))
            
            const temp: any = {}
            for (const task in tasks) {
                let date = tasks[task].deadline.toDate().toLocaleDateString()
                if (date in temp)
                    temp[date].push({id: task, data: tasks[task]})
                else
                    temp[date] = [{id: task, data: tasks[task]}]
            }
            dispatch(setTaskDays(temp))
        }

        if (!user && !loading) router.push("/");
        if (user) fetchData();
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
            <div className={styles['content-container']}>
                {view === 1 && <Tasklist></Tasklist>}
            </div>
        </div>
    )
}

export default Dashboard
