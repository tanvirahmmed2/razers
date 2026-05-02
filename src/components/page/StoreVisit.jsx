'use client'
import Link from 'next/link'
import React from 'react'
import { MapPin, ArrowRight, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

const StoreVisit = () => {
  return (
    <section className='w-full py-10 px-4'>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className='max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-slate-900 shadow-xl shadow-slate-900/10'
      >
        {/* Background Pattern/Gradients */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none'></div>
        <div className='absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl'></div>
        
        <div className='relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left'>
            <div className='w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary'>
              <MapPin size={32} />
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-2xl md:text-4xl font-black text-white tracking-tight'>
                Visit Our <span className='text-primary'>Physical Store</span>
              </h2>
              <p className='text-slate-400 text-base max-w-sm font-medium'>
                Experience our premium quality products in person. Get expert advice and hands-on demonstrations.
              </p>
            </div>
          </div>

          <div className='flex flex-col items-center md:items-end gap-3'>
            <Link 
              href={'https://maps.app.goo.gl/aw6YJSn6bPPJzwx49'} 
              target="_blank"
              className='group flex items-center gap-2.5 px-6 py-3.5 bg-white text-slate-900 rounded-xl font-bold text-base hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95'
            >
              Find on Google Maps
              <ExternalLink size={18} className='group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
            </Link>
            <p className='text-slate-500 text-[10px] font-black uppercase tracking-widest'>Open: 9 AM - 10 PM Daily</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default StoreVisit
