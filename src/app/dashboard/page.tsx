'use client'

import React from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import { auth } from '../auth/firebase'
import { useRouter } from 'next/navigation'

type Props = {}

const Dashboard = (props: Props) => {
    const [signout, loading, error] = useSignOut(auth)
    const router = useRouter();
  return (
    <div>Dashboard
        <button onClick={() => {signout(); router.push('/')}}>Logout</button>
    </div>
    
  )
}

export default Dashboard
