'use client'
import AddCategoryForm from '@/components/forms/AddCategoryForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext } from 'react'

const CategoryPage = () => {
  const {categories, fetchCategory}= useContext(Context)

  const removeCategory=async(id)=>{
    try {
      const response= await axios.delete('/api/category', {data:{id},withCredentials:true})
      alert(response.data.message)
      fetchCategory()

    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to remove category')
      
    }
  }


  return (
    <div className='w-full flex flex-col items-center p-1 sm:p-4'>
      {
        categories.length === 0 ? <div className='w-full min-h-30 flex items-center justify-center text-center'>
          <p className='text-red-500'>Category data not Found !</p>
        </div> :<div className='w-full flex flex-col items-center justify-center gap-4'>
          <h1 className='text-center text-2xl font-semibold'>Category</h1>
          {
            categories.map((cat) => (
              <div key={cat.category_id} className='w-full grid grid-cols-2 p-2 border  border-black/50 rounded-xl even:bg-gray-200'>
                <p>{cat.name}</p>
                <button className='cursor-pointer' onClick={()=> removeCategory(cat.category_id)}>Delete</button>
              </div>
            ))
          }
        </div>
      }
      <AddCategoryForm />
    </div>
  )
}

export default CategoryPage
