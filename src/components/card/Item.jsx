'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import Image from 'next/image'
import { Context } from '../helper/Context'

const Item = ({ product }) => {

  const { addToCart } = useContext(Context)

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className='w-auto text-black text-center text-sm bg-white flex flex-col items-center justify-between group gap-1'>
      <Image src={`${product?.image}`} alt='image' width={1000} height={1000} className='w-full h-50 object-cover' />
      <Link href={`/products/${product?.slug}`}>{product?.name}</Link>
      {
        product?.discount_price > 0 ? <div>
          <p className='text-red-400 line-through'>BDT {product.sale_price}</p>
          <p>BDT {product?.sale_price - product?.discount_price}</p>
        </div> : <p>BDT {product.sale_price}</p>
      }
      <button onClick={() => addToCart(product)} className='w-full p-1 bg-orange-500 text-white cursor-pointer hover:bg-orange-700'>Add to cart</button>
    </motion.div>
  )
}

export default Item
