'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react'

type Props = {}

const Contact  = (props: Props) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [contactLoading, setContactLoading] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, message);
        
        setContactLoading('loading');
        try {
            fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify({'email': email, 'message': message}),
                headers: {'Content-Type': "application/json"}
            }).then((res) => {
                if (!res.ok) throw new Error("Failed to send message");
                setContactLoading('sent')
                return res.json();
            })
        } catch (error: any) {
            console.log("GRR", error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='home-contact'>
                <h3>Contact Me!</h3>
                <div>
                    <label htmlFor='email'>E-mail<span className='required'> *</span></label>
                    <input type='email' name='email' placeholder='name@website.com' required onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor='message'>Message<span className='required'> *</span></label>
                    <textarea name='message' placeholder="message" required onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {setMessage(e.target.value)}}></textarea>
                </div>
                <button type='submit' className='button-accent'>{contactLoading === 'loading' && 'Sending...'}{contactLoading === 'sent' && 'Sent! :D'}
                {!contactLoading && 'Send'}</button>
            </div>
        </form>

    )
}

export default Contact 
