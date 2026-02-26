'use client'
import AddBrandForm from '@/components/forms/AddBrandForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, } from 'react'

const BrandPage = () => {
  const {brands, fetchBrand}= useContext(Context)

  const removeBrand=async(id)=>{
    try {
      const response= await axios.delete('/api/brand', {data:{id},withCredentials:true})
      alert(response.data.message)
      fetchBrand()
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to remove brand')
      
    }
  }
  return (
    <div className='w-full p-1 sm:p-4 flex flex-col gap-6 items-center'>
      {
        brands.length === 0 ? <div className='w-full min-h-30 flex items-center justify-center text-center'>
          <p className='text-red-500'>Brand data not Found !</p>
        </div> : <div className='w-full flex flex-col items-center justify-center gap-4'>
          <h1 className='text-center text-2xl font-semibold'>Brands</h1>
          {
            brands.map((brand) => (
              <div key={brand.brand_id} className='w-full grid grid-cols-3 p-2 border border-black/50 rounded-xl even:bg-gray-200'>
                <p>{brand.name}</p>
                <p>{brand.description}</p>
                <button className='cursor-pointer' onClick={()=> removeBrand(brand.brand_id)}>Delete</button>
              </div>
            ))
          }
        </div>
      }
      <AddBrandForm />
    </div>
  )
}

export default BrandPage
