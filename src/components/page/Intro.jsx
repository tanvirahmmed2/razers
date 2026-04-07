'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
const images=[
    'img1.jpg','img2.jpg','img3.jpg'
]

const Intro = () => {
    const [index,setIndex]=useState(0)
     useEffect(() => {
        if (images.length === 0) return
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className=' w-full flex flex-col gap-8'>

            <div className='w-full h-90 sm:h-110 overflow-hidden flex items-center justify-center relative'>
                <Image src={`/${images[index]}`} className='w-full h-90 sm:h-110 object-cover blur-[1px] opacity-90' alt='home image' width={1000} height={1000} />
                <div className="absolute inset-0 gap-4 flex flex-col items-center justify-center text-white bg-red-300/10 p-4">
                    <p className='font-semibold font-serif uppercase'>Welcome to</p>
                    <h1 className='text-5xl sm:text-7xl font-extrabold text-red-500 text-center'>Monihari</h1>
                    <div className='w-full max-w-2xl flex flex-wrap items-center justify-center gap-2'>
                       
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Intro
