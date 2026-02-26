'use client'
import AddBrandForm from '@/components/forms/AddBrandForm'
import AddCategoryForm from '@/components/forms/AddCategoryForm'
import AddProductForm from '@/components/forms/AddProductForm'
import { Context } from '@/components/helper/Context'
import React, { useContext } from 'react'

const NewProductPage = () => {
  const {isCategoryBox, isBrandBox}= useContext(Context)
  return (
    <div className='w-full p-1 sm:p-4 relative'>
      <div className={`absolute ${isCategoryBox?'block': 'hidden'} z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white min-w-100 border p-4 rounded-xl shadow-lg`}>
        <AddCategoryForm />

      </div>
      <div className={`absolute ${isBrandBox?'block': 'hidden'} z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white min-w-100 border p-4 rounded-xl shadow-lg`}>
        <AddBrandForm />

      </div>
      <AddProductForm />
    </div>
  )
}

export default NewProductPage
