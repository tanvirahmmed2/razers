'use client'
import Link from 'next/link'
import React from 'react'
import { LuMapPin } from "react-icons/lu";

const StoreVisit = () => {
  return (
    <div className='w-full p-4 bg-linear-to-br from-sky-600 to-blue-800 text-white flex flex-col md:flex-row items-center justify-around gap-8'>
      <div className='w-auto flex flex-col md:flex-row items-center justify-center gap-4'>
        <LuMapPin className='text-8xl'/>
        <div className='w-auto flex flex-col gap-1'>
            <p className='text-xl md:text-3xl font-semibold'>Premium Physical Store</p>
            <p>Visit Our Store & Get Your Desired  Product!</p>
        </div>
      </div>
      <Link href={'https://maps.app.goo.gl/aw6YJSn6bPPJzwx49'} className='bg-orange-400 p-2 px-6 rounded-full cursor-pointer hover:bg-orange-500'>Find on map</Link>
    </div>
  )
}

export default StoreVisit
