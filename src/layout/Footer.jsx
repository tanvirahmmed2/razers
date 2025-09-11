import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <section className='m-2'>
        <footer className='w-full flex flex-col md:flex-row gap-4  items-center justify-around p-4 bg-gray-100 rounded-lg'>
            <div className='w-auto flex flex-col items-start justify-center gap-2'>
                <Link to='/' className='hover:border-l-2 border-black px-4'>Sneaker</Link>
                <Link to='/' className='hover:border-l-2 border-black px-4'>Boots</Link>
                <Link to='/' className='hover:border-l-2 border-black px-4'>Casual</Link>
                <Link to='/' className='hover:border-l-2 border-black px-4'>Kids</Link>
                <Link to='/' className='hover:border-l-2 border-black px-4'>Hiking</Link>
            </div>
            <div className='w-auto flex flex-col items-center gap-2 justify-center'>
                <label htmlFor="subscribe">Subscibe newsletter</label>
                <input type="text" name='subscribe' id='subscribe' placeholder='enter your mail' className='px-2 p-1 rounded-lg outline-none' />
                <button className='bg-gradient-to-br from-sky-500 to-blue-600 text-white px-2 p-1 rounded-lg hover:to-blue-800 transition duration-500'>Subsribe</button>
            </div>
            <p className='w-auto'>All rights are reserved by <span className='text-lg font-semibold'>Razers</span></p>

        </footer>
    </section>
  )
}

export default Footer
