'use client'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {


  return (
    <div className='w-full relative'>
      <nav className='w-full flex flex-row items-center justify-between fixed top-0 right-0 h-14 px-4 bg-red-500 text-white z-50'>
        <Link href={'/'} className='text-lg sm:text-2xl font-semibold uppercase font-mono'>Monihari</Link>

        <div className='w-auto flex flex-row items-center justify-center gap-4'>
          <Link href={'/search'}><SearchIcon/></Link>
        <div className='w-auto hidden sm:flex flex-row items-center justify-center gap-2'>
          

          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/offers'}>Offers</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/products'}>Products</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/cart'}>Cart</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/login'}>Login</Link>
        </div>
        </div>
        
      </nav>

    </div>
  )
}

export default Navbar