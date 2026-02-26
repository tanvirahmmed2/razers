import Item from '@/components/card/Item'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const CategoryProducts = async ({ params }) => {
  const { id } =await params

  let products = []

  try {
    const response = await fetch(`${BASE_URL}/api/product/category/${id}`, {
      method: 'GET',
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    products = data.payload || []

  } catch (error) {
    console.log("CategoryProducts fetch error:", error.message)
  }

  if (products.length < 1) {
    return (
      <div className='w-full flex flex-col items-center justify-center gap-4 py-6'>
        <p>No product found</p>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col items-center p-4 gap-4 py-6'>
      <p className='text-center text-lg font-semibold'>Collect the best product </p>
      <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {products.map(product => (
          <Item product={product} key={product.product_id} />
        ))}
      </div>
    </div>
  )
}

export default CategoryProducts
