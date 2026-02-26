'use client'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'

const AddSupplierForm = () => {
    const {fetchSupplier}= useContext(Context)
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        address: '',
        email: ''
    })
    const handleChnage = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/supplier', formData, { withCredentials: true })
            toast.success(response.data.message)
            fetchSupplier()
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to add supplier')

        }
    }


    return (
        <form onSubmit={handleSubmit} className='w-full  flex flex-col items-center justify-center gap-2'>
            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                <div className=' w-full flex flex-col gap-1 '>
                    <label htmlFor="name">Name*</label>
                    <input type="text" id='name' name='name' required onChange={handleChnage} value={formData.name} className='px-3 p-1 border border-black/50 outline-none' />
                </div>
                <div className=' w-full flex flex-col gap-1 '>
                    <label htmlFor="phone">Phone*</label>
                    <input type="text" id='phone' name='phone' required onChange={handleChnage} value={formData.phone}  className='px-3 p-1 border border-black/50 outline-none'/>
                </div>
            </div>
            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                <div className=' w-full flex flex-col gap-1 '>
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' name='email'  onChange={handleChnage} value={formData.email} className='px-3 p-1 border border-black/50 outline-none' />
                </div>
                <div className=' w-full flex flex-col gap-1 '>
                    <label htmlFor="address">address</label>
                    <input type="text" id='address' name='address'   onChange={handleChnage} value={formData.address} className='px-3 p-1 border border-black/50 outline-none' />
                </div>
            </div>
           <button className='w-auto px-8 p-1 bg-sky-600 hover:bg-sky-500 rounded-full text-white cursor-pointer' type='submit'>Submit</button>
        </form>
    )
}

export default AddSupplierForm
