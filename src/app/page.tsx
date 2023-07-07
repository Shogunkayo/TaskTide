'use client'

import Image from 'next/image'
import './style.scss'
import Hero from '@/assets/hero.png'
import Kanban from '@/assets/kanban.png'
import Dashboard from '@/assets/dashboard.png'
import Computer from '@/assets/computer.png'

export default function Home() {
   
    const isBrowser = () => typeof window !== 'undefined';

    const scroll = (x: number) => {
        console.log(x);
        if (!isBrowser()) return;
        window.scrollTo({top: x, behavior: 'smooth'})
    }

    return (
        <div id='main'>
        <main>
            <nav>
                <div>
                    <h1>TaskTide</h1>
                </div>
                <div>
                    <button className='button-default' onClick={() => {scroll(window.innerHeight)}}>Features</button>
                    <button className='button-default' onClick={() => {scroll(window.innerHeight * 2 + 100)}}>Pricing</button>
                    <button className='button-default' onClick={() => {scroll(window.innerHeight * 3)}}>Contact</button>
                </div>
                <div>
                    <button className='button-default'>Log-in</button>
                    <button className='button-primary'>Sign up</button>
                </div>
            </nav>

            <div className='hero'>
                <Image src={Hero} alt='hero' width={640} height={640}></Image>
            </div>

            <div className='content-main'>
                <h1>The <span className='highlight'>modern</span> to do app.</h1>

                <p>Stay organized, boost productivity, and achieve your goals like never before with <span className='highlight'><b> TaskTide</b></span><br></br>
                Our intuitive and feature-packed to-do app combines the power of a <span className='highlight'><b> kanban board </b></span> and 
                <span className='highlight'><b> graph views </b></span> to revolutionize your task management experience.</p>
                
                <button className='button-accent'>Get Started</button>
            </div>

            <div className='content-side'>
                <p>Groups / Kanban / Graphs</p>
            </div>
        </main>

        <div id='features'>
            <div className='features-hero'>
                <Image src={Kanban} alt='kanban' width={640} height={640}></Image>
            </div>
            <div className='features'>
                <div>
                    <h3 className='highlight-invert'>Kanban Board</h3>
                    <p>Seamlessly organize and prioritize tasks with our intuitive drag-and-drop interface. Customize columns, add labels, 
                    and assign due dates to streamline your workflow.
                    </p>
                </div>

                <div>
                    <h3 className='highlight-invert'>Graph Views</h3>
                    <p>Gain a deeper understanding of your task management with visually appealing graphs. Track completion rates, 
                    identify peak productivity periods, and optimize your time for maximum efficiency.
                    </p>
                </div>

                <div>
                    <h3 className='highlight-invert'>Collaborative Workspace</h3>
                    <p>Collaborative Workspace: Share boards and tasks with colleagues, friends, or family members. Enjoy real-time collaboration and keep everyone 
                    in sync to achieve your common goals.
                    </p>
                </div>
                
                <div>
                    <h3 className='highlight-invert'>Reminders</h3>
                    <p>
                    Reminders and Notifications: Stay on track with reminders. Never miss a deadline or forget an important task again.
                    </p>
                </div>
            </div>

        </div>

        <div id='pricing'>
            <Image src={Dashboard} alt='dashboard' width={640} height={640}></Image>
        </div>

        <div id='contact'>
            <Image src={Computer} alt='computer' width={640} height={640}></Image>
        </div>

        </div>
    )
}
