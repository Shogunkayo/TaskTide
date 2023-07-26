import Image from 'next/image'
import './style.scss'
import Hero from '@/assets/hero.png'
import Kanban from '@/assets/kanban.png'
import Dashboard from '@/assets/dashboard.png'
import Computer from '@/assets/computer.png'
import Navbar from './components/navbar'
import SignupBtn from './components/buttons/signupBtn'
import LoginBtn from './components/buttons/loginBtn'
import Contact from './components/contact'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Home() { 
    return (
        <div id='main'>
            <main> 
                <Navbar></Navbar>

                <div className='hero'>
                    <Image src={Hero} alt='hero' width={640} height={640}></Image>
                </div>

                <div className='content-side'>
                    <p>Groups / Kanban / Graphs</p>
                </div>

                <div className='content-main'>
                    <h1>The <span className='highlight'>modern</span> to do app.</h1>

                    <p>Stay organized, boost productivity, and achieve your goals like never before with <span className='highlight-invert'><b> TaskTide</b></span><br></br>
                    Our intuitive and feature-packed to-do app combines the power of a <span className='highlight-invert'><b> kanban board </b></span> and 
                    <span className='highlight-invert'><b> graph views </b></span> to revolutionize your task management experience.</p>
                </div>
            </main>

            <div id='features'>
            </div>

            <div id='pricing'>
                <div className='pricing-content'>
                    <h1>It&apos;s Completely <span className="highlight">Free!</span></h1>
                    <p>Are you tired of mundane task management apps that leave you feeling uninspired? Ready to spice up your productivity and take charge of your to-do list like a true champion? Look no further! Create your account right away</p>
                    <div>
                        <LoginBtn></LoginBtn>
                        <SignupBtn text={"Sign up"}></SignupBtn>
                    </div>
                </div>
                 <div className='pricing-hero'>
                    <Image src={Dashboard} alt='dashboard' width={640} height={640}></Image>
                </div>
            </div>

            <div id='contact'>
                <div className='contact-hero'>
                    <Image src={Computer} alt='computer' width={640} height={640}></Image>
                </div>
                <div className='contact-content'>
                    <p>Whether you want to discuss the existence of magical creatures, brainstorm bizarre inventions, or simply exchange jokes that tickle your funny bone, my inbox is eagerly awaiting your arrival!</p>
                    <Contact></Contact>
                </div>
            </div>
            <ToastContainer></ToastContainer>
        </div>
    )
}
