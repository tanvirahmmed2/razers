'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import Image from 'next/image'
import { Context } from '../helper/Context'
import { ShoppingCart, ArrowRight } from 'lucide-react'

const Item = ({ product }) => {
  const { addToCart } = useContext(Context)

  const currentPrice =
    product?.discount_price > 0
      ? product.sale_price - product.discount_price
      : product.sale_price

  const isNew = product?.is_new ?? true

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative w-full"
    >
      {/* ── Image box ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/4' }}>

        {/* Badge */}
        {product?.discount_price > 0 ? (
          <div className="absolute top-3 left-4 z-20 bg-sky-500 text-white text-[11px] font-bold px-3 py-1 rounded-sm select-none">
            -{Math.round((product.discount_price / product.sale_price) * 100)}%
          </div>
        ) : isNew ? (
          <div className="absolute top-3 left-4 z-20 bg-sky-500 text-white text-[11px] font-bold px-3 py-1 rounded-sm select-none">
            New
          </div>
        ) : null}

        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product?.image || '/placeholder.jpg'}
            alt={product?.name || 'Product'}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div
          className="
            absolute bottom-0 left-0 right-0 h-24
            bg-white
            translate-y-full group-hover:translate-y-0
            transition-transform duration-500 ease-in-out
            z-10
            border-l border-r border-b border-gray-200
          "
        >
          <ul className="h-full flex flex-col items-end justify-center gap-2 px-3 font-sans">

            <li
              onClick={() => addToCart(product)}
              className="
                w-full flex items-center justify-end gap-2
                text-[13px] text-gray-500 hover:text-sky-500
                border-b border-gray-100 hover:border-sky-400
                pb-1.5 cursor-pointer transition-colors duration-200
              "
            >
              Add to Cart
              <ShoppingCart size={14} />
            </li>

            <li className="
              w-full flex items-center justify-end gap-2
              text-[13px] text-gray-500 hover:text-sky-500
              border-b border-gray-100 hover:border-sky-400
              pb-1.5 cursor-pointer transition-colors duration-200
            ">
              <Link href={`/products/${product.slug}`} className="flex items-center gap-2 w-full justify-end">
                View Details
                <ArrowRight size={14} />
              </Link>
            </li>

          </ul>
        </div>
      </div>

      <div className="w-full py-4 px-3 border border-t-0 border-gray-200 flex flex-col gap-1">
        <div className="flex items-center justify-between font-sans">
          <Link href={`/products/${product.slug}`}>
            <h2 className="text-sm font-bold text-gray-800 hover:text-sky-500 transition-colors line-clamp-1">
              {product?.name}
            </h2>
          </Link>
          <p className="text-[13px] text-gray-500 font-medium whitespace-nowrap ml-2">
            ৳{currentPrice}
          </p>
        </div>
        <p className="text-[12px] text-gray-400 line-clamp-1">
          {product?.category_name || product?.brand_name || ''}
        </p>
      </div>
    </motion.div>
  )
}

export default Item
