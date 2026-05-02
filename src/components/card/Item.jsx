'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import Image from 'next/image'
import { Context } from '../helper/Context'
import { ShoppingCart, Eye } from 'lucide-react'

const Item = ({ product }) => {
  const { addToCart } = useContext(Context)
  const currentPrice = product?.discount_price > 0 
    ? product.sale_price - product.discount_price 
    : product.sale_price;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }} 
      className='group relative bg-white rounded-2xl p-2 border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col gap-3'
    >
      {/* Image Container */}
      <div className='relative w-full aspect-square overflow-hidden rounded-xl bg-slate-50'>
        {product?.discount_price > 0 && (
          <div className='absolute top-2 left-2 z-10 px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full'>
            -{Math.round((product.discount_price / product.sale_price) * 100)}%
          </div>
        )}
        
        <Link href={`/products/${product.slug}`} className='block w-full h-full overflow-hidden'>
          <Image 
            src={`${product?.image}`} 
            alt={product?.name} 
            width={400} 
            height={400} 
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' 
          />
        </Link>

        {/* Hover Actions */}
        <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2'>
          <Link 
            href={`/products/${product.slug}`}
            className='w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 hover:bg-primary hover:text-white transition-all shadow-sm'
          >
            <Eye size={16} />
          </Link>
          <button 
            onClick={() => addToCart(product)}
            className='w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 hover:bg-primary hover:text-white transition-all shadow-sm'
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-col gap-0.5 px-0.5'>
        <Link href={`/products/${product.slug}`}>
          <h3 className='text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors'>
            {product?.name}
          </h3>
        </Link>
        
        <div className='flex items-center justify-between mt-1'>
          <div className='flex flex-col'>
            {product?.discount_price > 0 && (
              <span className='text-[9px] text-slate-400 line-through leading-none'>
                ৳{product.sale_price}
              </span>
            )}
            <span className='text-base font-black text-slate-900 leading-tight'>
              ৳{currentPrice}
            </span>
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            className='p-2 rounded-lg bg-sky-50 text-primary hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm'
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Item
