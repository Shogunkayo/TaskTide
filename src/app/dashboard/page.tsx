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
import { setCategories, setTasks } from '../redux/features/taskSlice'

type Props = {}

const Dashboard = (props: Props) => {
    const active = useSelector((state: RootState) => state.view.active)
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const categories = useSelector((state: RootState) => state.task.categories)
    const dispatch = useDispatch()
    const router = useRouter();
    const [user, loading, _] = useAuthState(auth)

    useEffect(() => {

        const fetchData = async () => {
            const taskRef = query(collection(db, `users/${user?.uid}/tasks`), orderBy('deadline'), orderBy('category'), orderBy('priority'), orderBy('createdAt'))
            const catRef = query(collection(db, `users/${user?.uid}/categories`))
            const taskSnap = await getDocs(taskRef)
            const catSnap = await getDocs(catRef)

            const tasks: any[] = []
            const cats: any[] = []
            taskSnap.forEach((doc) => {
                tasks.push({id: doc.id, data: doc.data()}) 
            })
            catSnap.forEach((doc) => {
                cats.push({id: doc.id, data: doc.data()})
            })
            console.log(tasks)
            console.log(cats)
            dispatch(setTasks(tasks))
            dispatch(setCategories(cats))
        }

        if (!user && !loading) router.push("/");
        if (user) fetchData();
    }, [user, router, loading])
   
    /*
    const unsub = onSnapshot(query(collection(db, `users/${user?.uid}/tasks`)), (querySnapshot) => {
        const tasks: any[] = [];
        querySnapshot.forEach((doc) => {
            tasks.push(doc.data())
        })
        console.log("Current tasks: ", tasks)
    })
    */
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
