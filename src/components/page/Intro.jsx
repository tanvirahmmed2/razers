'use client'
import Image from 'next/image'
import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, RefreshCw } from 'lucide-react'
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
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className='w-full min-h-[80vh] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-10 py-10 p-4 items-center'>

            <div className='w-full overflow-hidden col-span-1 md:col-span-2 lg:col-span-4 order-1 md:order-2 relative aspect-video md:aspect-auto md:h-[600px] rounded-3xl'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className='absolute inset-0 w-full h-full'
                    >
                        <Image
                            src={images[currentIndex]}
                            fill
                            className='object-cover rounded-3xl shadow-lg'
                            alt='Fashion Showcase'
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>

            <div className='w-full flex flex-col items-center lg:items-start justify-center gap-8 col-span-1 lg:col-span-2 order-2 md:order-1 px-4'>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className='text-center lg:text-left'
                >
                    <div className='inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-primary mb-6 shadow-sm'>
                        <RefreshCw size={12} className='animate-spin' />
                        Updated Collection 2026
                    </div>
                    <h2 className='text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6'>
                        STYLE <br />
                        <span className='text-primary underline underline-offset-8 decoration-primary/20'>EVOLVED.</span>
                    </h2>
                    <p className='text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-md mx-auto lg:mx-0'>
                        Experience the flawless fusion of premium aesthetics and daily utility. {siteData?.website_name || 'NIJAM'} defines the next generation.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full'
                >
                    <Link href='/products' className='w-full sm:w-auto group px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-95'>
                        Shop Now
                        <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                    </Link>
                    <Link href='/offers' className='w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 text-center'>
                        View Offers
                    </Link>
                </motion.div>
            </div>

        </div>
    )
}

export default Intro