import { RootState } from "@/app/redux/store"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styles from './prodGraphs.module.scss'

type Props = {}

const ProdGraphs = (props: Props) => {
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const categories = useSelector((state: RootState) => state.task.categories)
    const complete: Array<string> = [];
    const incomplete: Array<string> = [];

    const [gType, setGType] = useState('bar')
    const [catType, setCatType] = useState({name: 'Total', id: ''})
    const [view, setView] = useState('none')

    useEffect(() => {
        console.log("run")
        Object.keys(tasks).map((task) => {
            if (tasks[task].completed)
                complete.push(task)
            else
                incomplete.push(task)
        })

    }, [tasks])

    return (
        <div className={styles['graph-comp-container']}>
            <div className={styles['graph-head']}>
                <div className={styles['graph-choose']}>
                    <button onClick={() => setView(view === 'none' ?  'plotType' : 'none')}>Plot Type</button>
                    <button onClick={() => setView(view === 'none' ? 'categories' : 'none')}>Categories</button>
                </div>
                <div className={styles['graph-dropdown']}>
                    {view === 'plotType' && (
                        <ul>
                            <li onClick={() => {setGType('bar'); setView('none')}}>Bar</li>
                            <li onClick={() => {setGType('pie'); setView('none')}}>Pie</li>
                        </ul>
                    )}
                    {view === 'categories' && (
                        <ul>
                            <li onClick={() => {setCatType({name: 'Total', id: ''}); setView('none')}}>Total</li>
                            <li onClick={() => {setCatType({name: 'All', id: ''}); setView('none')}}>All</li>
                            {Object.keys(categories).map((cat) => (
                                <li id={cat} key={cat} onClick={() => {setCatType({name: categories[cat].title, id: cat}); setView('none')}}>{categories[cat].title}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className={styles['graph-container']}>
                
            </div>
        </div>
    )
}

export default ProdGraphs
