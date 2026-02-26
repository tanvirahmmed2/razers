import UserLoginForm from '@/components/forms/UserLoginForm'
import React from 'react'

const LoginPageUSer = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center p-4'>
            <div className='w-auto flex flex-col items-center justify-center md:flex-row gap-4 p-3 border rounded-2xl shadow border-black/30'>
                <div className='w-full flex flex-col items-center justify-center'>
                    <p>Welcome to</p>
                    <h1 className='text-xl font-semibold text-center'>Nizam Varieties Store</h1>
                    <p>login and buy products</p>
                </div>
                <UserLoginForm />
            </div>
        </div>
  )
}

export default LoginPageUSer
