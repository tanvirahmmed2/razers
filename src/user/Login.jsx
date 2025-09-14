import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <section className='w-full h-auto my-20 flex items-center justify-center'>
        <div className='w-auto h-auto p-4 flex flex-col lg:flex-row items-center justify-center gap-6 bg-sky-100 rounded-lg'>
            <div className='w-auto flex flex-col items-center justify-center gap-2'>
                <h1 className='text-2xl '>Welcome back to <span className='text-3xl font-bold'>Razers</span></h1>
                <p>login and enjoy our premium services</p>
                <Link to='/register' className='mt-6 text-red-500 italic'>new user?</Link>
            </div>
            <form action="" className='flex flex-col items-center justify-center gap-4 lg:border-l-2 pl-4 border-white'>
               
                <div className='w-auto flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="email">email</label>
                    <input type="email" name='email' id='email' className='p-1 px-2 border-2 outline-none rounded-lg'/>
                </div>
                <div className='w-auto flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="password">password</label>
                    <input type="password" name='password' id='password' className='p-1 px-2 border-2 outline-none rounded-lg'/>
                </div>
                <button type='submit' className='p-1 px-2 bg-white text-sky-600 font-semibold rounded-lg'>Continue</button>

            </form>

        </div>
    </section>
  )
}

export default Login
