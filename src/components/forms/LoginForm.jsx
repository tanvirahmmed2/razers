'use client'
import axios from 'axios'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const loginHandle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/user/login', formData, { withCredentials: true })
      toast.success(response.data.message)
      window.location.replace('/dashboard')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onSubmit={loginHandle}
      className='w-full flex flex-col gap-5'
    >
      {/* Email Field */}
      <div className='flex flex-col gap-1.5'>
        <label htmlFor='email' className='text-sm font-semibold text-slate-700'>
          Email Address
        </label>
        <div className='relative group'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
            <Mail
              size={17}
              className='text-slate-400 group-focus-within:text-sky-500 transition-colors'
            />
          </div>
          <input
            type='email'
            id='email'
            name='email'
            required
            autoComplete='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='you@company.com'
            className='w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all shadow-sm'
          />
        </div>
      </div>

      {/* Password Field */}
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between'>
          <label htmlFor='password' className='text-sm font-semibold text-slate-700'>
            Password
          </label>
          <Link
            href='/recoverid'
            className='text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors hover:underline'
          >
            Forgot password?
          </Link>
        </div>
        <div className='relative group'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
            <Lock
              size={17}
              className='text-slate-400 group-focus-within:text-sky-500 transition-colors'
            />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            name='password'
            required
            autoComplete='current-password'
            value={formData.password}
            onChange={handleChange}
            placeholder='••••••••'
            className='w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all shadow-sm'
          />
          <button
            type='button'
            onClick={() => setShowPassword((v) => !v)}
            className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors'
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type='submit'
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className='mt-2 w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-sky-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]'
      >
        {loading ? (
          <>
            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            Signing in...
          </>
        ) : (
          <>
            Sign In to Dashboard
            <ArrowRight size={17} />
          </>
        )}
      </motion.button>

      {/* Divider */}
      <div className='relative flex items-center gap-3 my-1'>
        <div className='flex-1 h-px bg-slate-200' />
        <span className='text-xs text-slate-400 font-medium'>Staff access only</span>
        <div className='flex-1 h-px bg-slate-200' />
      </div>

      {/* Footer note */}
      <p className='text-center text-xs text-slate-400 leading-relaxed'>
        Having trouble? Contact your administrator or{' '}
        <Link href='/recoverid' className='text-sky-600 font-semibold hover:underline'>
          reset your password
        </Link>
        .
      </p>
    </motion.form>
  )
}

export default LoginForm
