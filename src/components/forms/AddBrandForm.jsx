'use client'
import React, { useContext, useState } from 'react'
import { ImCancelCircle } from 'react-icons/im'
import { Context } from '../helper/Context'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddBrandForm = () => {
    const [formData, setFormData]= useState({
        name:'',
        description:''
    })
    const {setIsBrandBox, fetchBrand}= useContext(Context)

    const handleChange=(e)=>{
        const {name, value}=e.target
        setFormData((prev)=>({...prev, [name]:value}))
    }
    
    const addNewBrand=async(e)=>{
        e.preventDefault()
        
        try {
            const response = await axios.post('/api/brand', formData, { withCredentials: true })
            toast(response.data.message)
            fetchBrand()
            setIsBrandBox(false)
        } catch (error) {
            toast(error?.response?.data?.message || "failed to add Brand")

        }
    }
  return (
    <form onSubmit={addNewBrand} className='w-full flex  flex-col items-center justify-center gap-3 relative'>
        <h1>Add New Brand</h1>
        <button type='button' onClick={()=>setIsBrandBox(false)} className=' absolute top-2 right-2 text-2xl cursor-pointer'><ImCancelCircle/></button>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="name">Name *</label>
            <input type="text" id='name' name='name' required value={formData.name} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="description">Description</label>
            <textarea type="text" id='description' name='description' value={formData.description} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
        </div>
        <button className='w-auto px-8 p-1 bg-sky-600 hover:bg-sky-500 rounded-full text-white cursor-pointer' type='submit'>Submit</button>
    </form>
  )
}

export default AddBrandForm
