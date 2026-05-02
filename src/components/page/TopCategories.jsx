'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const TopCategories = () => {
  const { categories } = useContext(Context)

  // Show 3 items for a more "asymmetric/editorial" feel
  const displayCategories = categories?.slice(0, 3) || []

  if (displayCategories.length === 0) return null

  return (
    <section className='w-full py-32 bg-white border-t border-slate-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex flex-col items-center mb-24 text-center'>
          <div className='w-px h-12 bg-primary mb-8'></div>
          <h2 className='text-4xl md:text-6xl font-serif italic text-slate-900 tracking-tight'>
            Curated <span className='not-italic font-light'>Collections</span>
          </h2>
          <p className='text-slate-400 mt-4 font-light tracking-wide max-w-md'>
            Discover the artistry behind our most sought-after categories, handpicked for your lifestyle.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-16'>
          {displayCategories.map((cat, index) => (
            <motion.div
              key={cat.category_id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className={index === 1 ? 'md:-mt-12' : ''} // Asymmetric offset for editorial feel
            >
              <Link 
                href={`/products?category=${cat.category_id}`}
                className='group block relative'
              >
                <div className='relative aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-sm'>
                  {cat.image ? (
                    <Image 
                      src={cat.image} 
                      alt={cat.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-[2.5s]'
                    />
                  ) : (
                    <div className='absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-200'>
                       <span className='font-serif italic text-4xl'>NVS</span>
                    </div>
                  )}
                  <div className='absolute inset-0 border border-black/5 group-hover:border-primary/20 transition-colors'></div>
                </div>
                
                <div className='mt-10 flex flex-col items-center gap-3'>
                  <h3 className='text-2xl font-serif text-slate-900 group-hover:text-primary transition-colors'>
                    {cat.name}
                  </h3>
                  <div className='text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 flex items-center gap-3 transition-all group-hover:text-primary'>
                    View Collection <div className='w-4 h-px bg-slate-200 group-hover:w-10 group-hover:bg-primary transition-all duration-500'></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className='mt-32 flex justify-center'>
            <Link 
                href='/products' 
                className='px-12 py-5 border border-slate-900 text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-700 active:scale-95'
            >
                Browse All Categories
            </Link>
        </div>
      </div>
    </section>
  )
}

export default TopCategories
