
import UpdateProductForm from '@/components/forms/UpdateProductForm'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const UpdateProduct = async({params}) => {
  
  const { slug } = await params
  
    const res = await fetch(`${BASE_URL}/api/product/${slug}`, { method: "GET", cache: 'no-store' })
    const data = await res.json()
    const product = data.payload?.[0]
    if (!product) return <p>No data found</p>
  return (
    <div className='w-full p-4'>
       <UpdateProductForm  product={product} /> 
    </div>
  )
}

export default UpdateProduct
