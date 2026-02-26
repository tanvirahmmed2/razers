'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const NewStaffForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    })

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const submitNewRole = async (e) => {
        e.preventDefault()
        try {
            const response= await axios.post('/api/staff', formData, {withCredentials:true})
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add new staff")
            
        }

    }
    return (
        <form onSubmit={submitNewRole} className='w-full flex flex-col items-center gap-4'>
            <h1>Add New Staff</h1>
            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-3'>
                <div className='w-full flex flex-col gap-1 '>
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' id='name' required value={formData.name} onChange={changeHandler} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                </div>
                <div className='w-full flex flex-col gap-1 '>
                    <label htmlFor="role">Role</label>
                    <select name="role" id="role" required value={formData.role} onChange={changeHandler} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '>
                        <option value="">select</option>
                        <option value="manager">Manager</option>
                        <option value="sales">Sales</option>
                    </select>
                </div>
            </div>


            <div className='w-full flex flex-col gap-1 '>
                <label htmlFor="email">Email</label>
                <input type="email" name='email' id='email' required value={formData.email} onChange={changeHandler} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
            </div>

            <div className='w-full flex flex-col gap-1 '>
                <label htmlFor="password">Password</label>
                <input type="password" name='password' id='password' required value={formData.password} onChange={changeHandler} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
            </div>

            <button className='w-auto px-8 p-1 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-500 ' type='submit'>Submit</button>
        </form>
    )
}

export default NewStaffForm
