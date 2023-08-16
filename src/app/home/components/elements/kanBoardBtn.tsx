import { setCurrentBoard } from '@/app/redux/features/kanbanSlice'
import { RootState } from '@/app/redux/store'
import { FormEvent, MouseEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import styles from '../kanban.module.scss'
import { IoClose } from 'react-icons/io5'

type Props = {}

const KanBoardBtn = (props: Props) => {
    const [view, setView] = useState(false)
    const boards = useSelector((state: RootState) => state.kanban.kanBoards)
    const currentBoard = useSelector((state: RootState) => state.kanban.currentBoard)
    const dispatch = useDispatch()

    const handleChange = (e: MouseEvent) => {
        dispatch(setCurrentBoard(e.currentTarget.id))
        setView(false)
    }

    return (
        <nav className={styles['kanban-nav']}>
            <button className='button-primary' onClick={() => setView(!view)}>{currentBoard ? boards[currentBoard].title : 'Boards'}</button>
                {view && (
                <div className={styles['board-modal']}>
                    <button className={styles['board-close']} onClick={() => setView(!view)}><IoClose></IoClose></button>
                    <div className={styles['board-container']}>
                    {
                        Object.keys(boards).map((board) => (
                            <button key={board} id={board} onClick={handleChange}>
                                {boards[board].title}
                            </button>
                        ))
                    }
                    </div>
                </div>)}
        </nav>
    )
}

export default KanBoardBtn
