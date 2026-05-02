import LoginForm from '@/components/forms/LoginForm'
import Image from 'next/image'
import React from 'react'
import { ShieldCheck } from 'lucide-react'

const LoginPage = () => {
  return (
    <div className='w-full min-h-screen flex items-stretch bg-slate-950'>

      {/* ── Left Panel — Branding ──────────────────────────────────────── */}
      <div className='hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden'>
        {/* Animated background blobs */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950' />
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/5 rounded-full' />

        {/* Content */}
        <div className='relative z-10 flex flex-col items-center text-center'>
          <div className='w-20 h-20 mb-6 relative'>
            <Image src='/icon.png' alt='NVS Logo' fill className='object-contain drop-shadow-2xl' />
          </div>
          <h1 className='text-4xl font-black text-white tracking-tight leading-tight'>
            Nizam Varieties<br />
            <span className='bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent'>
              Store
            </span>
          </h1>
          <p className='text-slate-400 mt-4 text-base font-medium max-w-xs leading-relaxed'>
            Management dashboard. Sign in with your credentials to continue.
          </p>

          {/* Feature badges */}
          <div className='mt-10 flex flex-col gap-3 w-full max-w-xs'>
            {['Inventory Management', 'Sales & POS System', 'Purchase Tracking', 'Reports & Analytics'].map((f) => (
              <div key={f} className='flex items-center gap-3 text-left bg-white/5 border border-white/10 rounded-xl px-4 py-3'>
                <div className='w-2 h-2 rounded-full bg-sky-400 flex-shrink-0' />
                <span className='text-slate-300 text-sm font-medium'>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ───────────────────────────────────── */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50'>
        <div className='w-full max-w-md'>

          {/* Mobile logo */}
          <div className='flex lg:hidden items-center gap-3 mb-10'>
            <div className='w-10 h-10 relative'>
              <Image src='/icon.png' alt='NVS Logo' fill className='object-contain' />
            </div>
            <span className='font-black text-slate-900 text-lg uppercase tracking-tight'>Nizam Varieties Store</span>
          </div>

          {/* Header */}
          <div className='mb-8'>
            <div className='inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4'>
              <ShieldCheck size={13} />
              Store Access
            </div>
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>Welcome back</h2>
            <p className='text-slate-500 mt-2 text-sm font-medium'>
              Sign in to access your dashboard and manage store operations.
            </p>
          </div>

          <LoginForm />

        </div>
      </div>
    </div>
  )
}

export default LoginPage
