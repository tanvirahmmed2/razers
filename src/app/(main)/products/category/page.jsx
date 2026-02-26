'use client'
import { Context } from '@/components/helper/Context'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'

const CategoryPage = () => {
    const { categories } = useContext(Context)
    return (
        <div className='w-full text-center flex flex-col items-center gap-6 py-8 px-4'>
            <h1 className='text-xl  text-center'>Find best product for your daily life among these categories</h1>
            <div className='w-full max-w-2xl flex flex-wrap items-center justify-center gap-4'>
                {
                    categories.length > 0 && categories.map((cat) => (
                        <Link href={`/products/category/${cat?.category_id}`} className='w-auto px-4 p-1 border rounded-full shadow' key={cat.category_id}>{cat?.name}</Link>

                    ))
                }
            </div>
        </div>
    )
}

export default CategoryPage
