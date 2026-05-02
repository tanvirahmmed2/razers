'use client'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight } from 'lucide-react'

const Intro = () => {
    return (
        <section className='relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900'>
            {/* Background Image with Overlay */}
            <div className='absolute inset-0 z-0'>
                <Image 
                    src={`/bgg.jpg`} 
                    className='w-full h-full object-cover opacity-40 scale-105' 
                    alt='Hero Background' 
                    width={1920} 
                    height={1080} 
                    priority
                />
                <div className='absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900'></div>
            </div>

            {/* Content */}
            <div className='relative z-10 max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-6'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='flex flex-col items-center gap-3'
                >
                    <span className='px-3 py-1 rounded-full bg-primary/20 text-primary text-[11px] font-bold tracking-widest uppercase border border-primary/20'>
                        New Season Arrivals
                    </span>
                    <h1 className='text-5xl sm:text-7xl font-black text-white leading-none tracking-tighter uppercase'>
                        Nizam <span className='text-primary'>Varieties Store</span>
                    </h1>
                    <p className='max-w-lg text-base sm:text-lg text-slate-300 font-medium leading-relaxed'>
                        Discover an exclusive collection of premium products curated just for you. Quality meets variety at Nizam Varieties Store.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className='flex flex-wrap items-center justify-center gap-3'
                >
                    <Link 
                        href='/products' 
                        className='group flex items-center gap-2.5 px-6 py-3 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary-dark transition-all shadow-sm active:scale-95'
                    >
                        <ShoppingBag size={18} />
                        Shop Collection
                        <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                    </Link>
                    <Link 
                        href='/offers' 
                        className='px-6 py-3 bg-white/10 text-white rounded-xl font-bold text-base hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all active:scale-95'
                    >
                        View Offers
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className='absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20'></div>
        </section>
    )
}

export default Intro
