'use client'
import React, { useContext } from 'react'

import { AiOutlineProduct } from "react-icons/ai";
import { BiSolidOffer } from "react-icons/bi";
import { IoLogInSharp } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineAccountBox } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import Link from 'next/link';
import { Context } from '../helper/Context';
import { FaUser } from 'react-icons/fa6';

const BottomBar = () => {

  const {cart}=useContext(Context)

  return (
    <div  className='w-full flex sm:hidden flex-row items-center justify-between fixed bottom-0 right-0 h-14 px-4 bg-sky-600 text-white z-50 text-2xl'>
          <Link href={'/'} className='flex flex-col items-center justify-center'><IoHomeOutline /> <span className='text-[8px]'>Home</span></Link>
          <Link href={'/offers'} className='flex flex-col items-center justify-center'><BiSolidOffer />  <span className='text-[8px]'>Offers</span> </Link>
          <Link href={'/products'} className='flex flex-col items-center justify-center'><AiOutlineProduct />  <span className='text-[8px]'>Products</span></Link>
          <Link href={'/login'} className='flex flex-col items-center justify-center'><FaUser />  <span className='text-[8px]'>User</span></Link>
          <Link href={'/cart'} className={`flex flex-col items-center justify-center relative `}> {cart.items.length>0 && <span className='w-5 rounded-full h-5 absolute -top-4 bg-red-600 text-[14px] text-center flex items-center justify-center'>{cart.items.length}</span>}<CiShoppingCart /><span className='text-[8px]'>Cart</span></Link>
    </div>
  )
}

export default BottomBar
