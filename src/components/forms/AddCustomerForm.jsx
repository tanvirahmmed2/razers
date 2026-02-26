'use client'
import React, { useContext, useState } from 'react'
import { ImCancelCircle } from 'react-icons/im'
import { Context } from '../helper/Context'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddCutomerForm = () => {
    const [formData, setFormData]= useState({
        name:'',
        phone:'',
        email:"",
        address:''
    })
    const {setIsCustomerBox, fetchCustomer}= useContext(Context)

    const handleChange=(e)=>{
        const {name, value}=e.target
        setFormData((prev)=>({...prev, [name]:value}))
    }
    
    const addNewCustomer=async(e)=>{
        e.preventDefault()
        
        try {
            const response = await axios.post('/api/customer', formData, { withCredentials: true })
            toast(response.data.message)
            fetchCustomer()
            setIsCustomerBox(false)
        } catch (error) {
            toast(error?.response?.data?.message || "failed to add Brand")

        }
    }
  return (
    <form onSubmit={addNewCustomer} className='w-full flex  flex-col items-center justify-center gap-3 relative'>
        <h1>Add New Customer</h1>
        <button type='button' onClick={()=>setIsCustomerBox(false)} className=' absolute top-2 right-2 text-2xl cursor-pointer'><ImCancelCircle/></button>
        <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4'>
            <div className='w-full flex flex-col gap-1'>
            <label htmlFor="name">Name *</label>
            <input type="text" id='name' name='name' required value={formData.name} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="phone">Phone *</label>
            <input type="text" id='phone' name='phone' required value={formData.phone} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
        </div>
        </div>
        <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4'>
            <div className='w-full flex flex-col gap-1'>
            <label htmlFor="email">Email</label>
            <input type="email" id='email' name='email'  value={formData.email} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="address">Address</label>
            <input type="text" id='address' name='address'  value={formData.address} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
        </div>
        </div>
        
        <button className='w-auto px-8 p-1 bg-sky-600 hover:bg-sky-500 rounded-full text-white cursor-pointer' type='submit'>Submit</button>
    </form>
  )
}

export default AddCutomerForm
