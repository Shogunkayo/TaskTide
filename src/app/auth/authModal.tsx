import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { changeOpen, changeType } from '../redux/features/authSlice'
import Login from './login'
import Signup from './signup'
import ResetPass from './resetpass'

type Props = {}

const AuthModal = (props: Props) => {
    const auth = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()

    return (
        <>
            <div onClick = {() => {dispatch(changeType('login')); dispatch(changeOpen(false));}} className="modal-outside"></div>
            <div className="auth-modal">
                <div>
                    <div className='close'>
                        <button onClick={() => {dispatch(changeOpen(false))}}><IoClose></IoClose></button>
                    </div> 
                        {auth.type == 'signup' && <Signup></Signup>}
                        {auth.type == 'login' && <Login></Login>}
                        {auth.type == 'reset' && <ResetPass></ResetPass>}
                </div>
            </div>
        </>
    )
}

export default AuthModal
