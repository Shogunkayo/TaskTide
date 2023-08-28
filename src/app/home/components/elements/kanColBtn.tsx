'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import styles from '../topbar.module.scss' 
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/auth/firebase'
import { DocumentReference, addDoc, arrayUnion, collection, doc, documentId, updateDoc } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { addCol, createBoard } from '@/app/redux/features/kanbanSlice'
import { RootState } from '@/app/redux/store'

type Props = {}

const KanColBtn = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const initialState = {title: '', color: '#d8dee9', board: 'new', boardName: '', tasks: []}
    const [inputs, setInputs] = useState(initialState)
    const [user, _, __] = useAuthState(auth)
    const colors = ['#d8dee9', '#f2cdcd', '#e98b98', '#fab387', '#a6e3a1', '#94e2d5', '#8fbcbb', '#7dc4e4', '#89b4fa', '#b4befe']
    const boards = useSelector((state: RootState) => state.kanban.kanBoards)
    const dispatch = useDispatch()

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e : FormEvent) => {
        e.preventDefault()
        if (!user || !inputs['title'] || !inputs['color'] || !inputs['board'] ||
            (inputs['board'] === 'new' && !inputs['boardName'])) return

        if (inputs['board'] === 'new') {
            let duplicate = false;
            let boardId;
            
            for (const board in boards) {
                if (boards[board].title === inputs['boardName']) {
                    duplicate = true;
                    boardId = board;
                    break
                }
            }
            
            if (duplicate) {
                let colData = {...inputs, 'board': boardId}
                const colRef = await addDoc(collection(db, `users/${user.uid}/kanbanColumns/`), colData)
                
                updateDoc(doc(db, `users/${user.uid}/kanbanBoards/${boardId}`), {
                    kanCols: arrayUnion(colRef.id)
                })

                dispatch(addCol({boardId: boardId, colId: colRef.id, col: colData}))
            }
            else {
                const boardData = {title: inputs['boardName'], kanCols: [], tasks: []}
                const boardRef = await addDoc(collection(db, `users/${user.uid}/kanbanBoards/`), boardData)

                let colData = {...inputs, 'board': boardRef.id}
                const colRef = await addDoc(collection(db, `users/${user.uid}/kanbanColumns`), colData)

                await updateDoc(doc(db, `users/${user.uid}/kanbanBoards/${boardRef.id}`), {
                    kanCols: [colRef.id]
                })

                dispatch(createBoard({boardId: boardRef.id, board: boardData}))
                dispatch(addCol({boardId: boardRef.id, colId: colRef.id, col: colData}))
            }
        }
        else {
            let colData = {...inputs, 'boardName': boards[inputs['board']].title}
            const colRef = await addDoc(collection(db, `users/${user.uid}/kanbanColumns/`), colData)
            
            updateDoc(doc(db, `users/${user.uid}/kanbanBoards/${inputs['board']}`), {
                kanCols: arrayUnion(colRef.id)
            })

            dispatch(addCol({boardId: inputs['board'], colId: colRef.id, col: colData}))
        }

        setIsOpen(false)
        setInputs(initialState)
    }

    return (
        <div>
            <button className='button-primary' onClick={() => setIsOpen(!isOpen)}>New Column</button>
            {isOpen && (
                <div className={styles['task-container']}>
                    <button onClick={() => setIsOpen(false)} className={`${styles['close-btn']} button-default no-hover`}><IoClose size={24}></IoClose></button> 
                    <form onSubmit={handleSubmit} className={styles['task-open']}>
                        <div>
                            <label htmlFor='title'>Title <span className='required'>*</span></label>
                            <input name='title' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='board'>Add to <br></br>Board</label>
                            <select onChange={handleChange} name='board'>
                                <option default value={'new'}>New Board</option>
                                {
                                    Object.keys(boards).map((board) => (
                                        <option value={board} key={board}>{boards[board].title}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {inputs['board'] === 'new' && (
                        <div>
                            <label htmlFor='boardName'>Board Name <span className='required'>*</span></label>
                            <input name='boardName' onChange={handleChange}/>
                        </div>)}
                        <div>
                            <label htmlFor='color'>Color</label>
                            <div className={styles['color-container']}>
                            {colors.map((color) => (
                                <div key={color} style={{'backgroundColor': color}} 
                                    className={`${styles['color-picker']} ${inputs['color'] === color ? styles['color-selected'] : ''}`}
                                    onClick={() => setInputs((prev) => ({...prev, ['color']: color}))}
                                ></div>
                            ))}
                            </div>
                        </div>
                        <button className='button-accent' type='submit'>Create Column</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default KanColBtn
