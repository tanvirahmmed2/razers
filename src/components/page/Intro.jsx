'use client'
import Image from 'next/image'
import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, RefreshCw } from 'lucide-react'
import { Context } from '../helper/Context'

const images = [
    'https://res.cloudinary.com/dv30hn53t/image/upload/v1777758910/pexels-yankrukov-5793641_cpjxja.jpg',
    'https://res.cloudinary.com/dv30hn53t/image/upload/v1777758910/pexels-chipi1189-34976479_oyvaze.jpg',
    'https://res.cloudinary.com/dv30hn53t/image/upload/v1777758910/pexels-knownasovan-62689_bqfkmu.jpg',
    'https://res.cloudinary.com/dv30hn53t/image/upload/v1777758911/pexels-fatih-sucu-43042350-7512609_kxf7kb.jpg',
    'https://res.cloudinary.com/dv30hn53t/image/upload/v1777758912/pexels-zhenxing-cai-724200611-31359734_i8pcyk.jpg'
]

const Intro = () => {
    const { siteData } = useContext(Context)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className='relative w-full min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden py-20 px-6'>

            {/* Massive Background Branding */}
            <div className='absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none'>
                <h1 className='text-[45vw] font-black uppercase text-slate-900 leading-none tracking-tighter'>
                    NVS
                </h1>
            </div>

            <div className='relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center'>

                {/* Information Side */}
                <div className='flex flex-col gap-10 text-center lg:text-left'>
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className='inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-12 shadow-sm'>
                            <RefreshCw size={12} className='animate-spin' />
                            Updated Collection 2026
                        </div>
                        <h2 className='text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter mb-10'>
                            STYLE <br />
                            <span className='text-primary decoration-primary/10 underline underline-offset-[12px]'>EVOLVED.</span>
                        </h2>
                        <p className='text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 opacity-80'>
                            Experience the flawless fusion of premium aesthetics and daily utility. {siteData?.website_name || 'NIJAM'} defines the next generation of variety.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6'
                    >
                        <Link href='/products' className='group relative px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm flex items-center gap-4 hover:bg-primary transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95'>
                            Shop Collection
                            <ArrowRight size={20} className='group-hover:translate-x-2 transition-transform duration-500' />
                        </Link>
                        <Link href='/offers' className='px-12 py-6 bg-white text-slate-900 border border-slate-100 rounded-[2rem] font-black text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm'>
                            View Exclusive Offers
                        </Link>
                    </motion.div>
                </div>

                {/* Interactive Swipe Side */}
                <div className='relative h-[450px] md:h-[600px] flex items-center justify-center lg:justify-end'>
                    <div className='relative w-full max-w-[380px] h-full flex items-center justify-center'>
                        <AnimatePresence>
                            {images.map((img, i) => (
                                i === currentIndex && (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, rotate: 12, x: 150, scale: 0.85 }}
                                        animate={{ opacity: 1, rotate: -currentIndex * 1.5, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: -25, x: -250, scale: 0.9 }}
                                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                        className='absolute w-full h-full rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-8 border-white z-20 cursor-grab active:cursor-grabbing'
                                    >
                                        <Image src={img} fill className='object-cover' alt='Fashion Showcase' priority />
                                        <div className='absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent'></div>
                                        <div className='absolute bottom-12 left-12 text-white'>
                                            <div className='text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2'>Premium Selection</div>
                                            <div className='text-3xl font-black tabular-nums'>0{i + 1}</div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>

                        {/* Background "Ghost" Cards */}
                        <div className='absolute w-full h-full rounded-[3.5rem] bg-white border border-slate-100 shadow-xl rotate-[6deg] translate-x-6 -z-10'></div>
                        <div className='absolute w-full h-full rounded-[3.5rem] bg-slate-100 border border-slate-100 shadow-lg rotate-[-4deg] -translate-x-6 -z-20'></div>
                    </div>
                </div>

            </div>

            {/* Bottom Progress Tracker */}
            <div className='absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30'>
                <span className='text-[10px] font-black text-slate-300 tabular-nums'>01</span>
                <div className='w-48 md:w-64 h-1 bg-slate-200 rounded-full overflow-hidden'>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className='h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]'
                    ></motion.div>
                </div>
                <span className='text-[10px] font-black text-slate-300 tabular-nums'>0{images.length}</span>
            </div>
        </section>
    )
}

export default Intro
