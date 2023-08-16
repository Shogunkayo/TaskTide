import { setCategoriesView } from "@/app/redux/features/taskSlice"
import { RootState } from "@/app/redux/store"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"

import styles from '../tasklist.module.scss'
import { useState } from "react"
import { IoClose } from "react-icons/io5"

type Props = {}

const CatViewBtn = (props: Props) => {
    const categories = useSelector((state: RootState) => state.task.categories)
    const catView = useSelector((state: RootState) => state.task.categoryView)
    const dispatch = useDispatch()
    const [view, setView] = useState(false)

    return (
        <nav className={styles['categories-nav']}>
            <button className='button-primary' onClick={() => setView(!view)}>{catView === 'all' ? 'Categories' : categories[catView].title}</button>
            {view && <div className={styles['categories-modal']}>
                <button onClick={() => setView(!view)}><IoClose></IoClose></button>
                <div className={styles['categories-container']}>
                    <button id='all' onClick={() => {dispatch(setCategoriesView('all')); setView(false)}} className={`${catView === 'all' ? 'button-accent' : 'button-primary'}`}>All</button>
                    {Object.keys(categories).map((category) => (
                        <button key={category} id={category} onClick={() => {dispatch(setCategoriesView(category)); setView(false)}} className={`${catView === category ? 'button-accent' : 'button-primary'}`}>
                            {categories[category].title}
                        </button>
                    ))}
                </div>
            </div>}
        </nav>
    )
}

export default CatViewBtn
