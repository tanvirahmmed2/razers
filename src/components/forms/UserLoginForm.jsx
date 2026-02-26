'use client'
import axios from 'axios'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const UserLoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const loginHandle = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/user/login', formData, { withCredentials: true })
      toast.success(response.data.message)
      window.location.replace('/profile')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to login')

    }

  }

  return (
    <motion.form initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.4 }} onSubmit={loginHandle} className='w-full flex flex-col  gap-4'>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: .6 }} className='w-full flex flex-col'>
        <label htmlFor="email">Email</label>
        <input type="email" id='email' name='email' required value={formData.email} onChange={handleChange} className='w-full px-3 p-1 rounded-lg outline-none border border-black/10' />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: .6 }} className='w-full flex flex-col'>
        <label htmlFor="password">Password</label>
        <input type="password" id='password' name='password' required value={formData.password} onChange={handleChange} className='w-full px-3 p-1 rounded-lg outline-none border border-black/10' />
      </motion.div>
      <motion.div className='text-right' initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <Link href="/recoverid">Forgot password?</Link>
      </motion.div>
      <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} type='submit' className='bg-black/80 hover:bg-black text-white rounded-lg cursor-pointer '>Next</motion.button>
    </motion.form>
  )
}

export default UserLoginForm
