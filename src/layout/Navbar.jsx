import React from 'react'
import { Link } from 'react-router-dom'



const Navbar = () => {
  return (
    <section className='m-2'>
        <nav className='w-full h-14 bg-gradient-to-br from-sky-500 to-blue-600 text-white flex flex-row items-center justify-around rounded-lg '>
            <div >
                <a href="/" className='text-2xl font-semibold h-14 hover:scale-105'>Razers</a>
            </div>
            <input type="text" placeholder='search your favourite pair' className='p-1 px-3 hidden md:block  rounded-lg outline-none placeholder-blue-500 placeholder-opacity-25 text-black' />

            <div className='w-auto flex flex-row items-center justify-center gap-2 h-14'>
                <Link to='/' className='h-14 hidden md:flex items-center justify-center hover:border-b-2 border-red-500 px-2 md:px-6'>Home</Link>
                <Link to='/allshoes' className='h-14 flex items-center justify-center hover:border-b-2 border-red-500 px-2 md:px-6'>Shoes</Link>
                <Link to='/about' className='h-14 flex items-center justify-center hover:border-b-2 border-red-500 px-2 md:px-6'>About</Link>
                <Link to='/cart' className='h-14 flex items-center justify-center hover:border-b-2 border-red-500 px-2 md:px-6'>Cart</Link>
                <Link to='/login' className='h-14 flex items-center justify-center hover:border-b-2 border-red-500 px-2 md:px-6'>Login</Link>
            </div>

        </nav>
    </section>
  )
}

export default Navbar
