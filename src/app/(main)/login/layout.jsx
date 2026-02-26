import { isUserLogin } from '@/lib/usermiddleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'Login',
    description:'Login Page'
}

const UserLoginLayout = async({children}) => {
    const auth= await isUserLogin()
    if(auth.success) return redirect('/profile')
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default UserLoginLayout
