import Link from 'next/link'
import React from 'react'
import FooterTagline from './FooterTagline'

const Footer = () => {
  return (
    <div className='w-full flex flex-col bg-linear-to-br from-sky-800 to-blue-900 text-white  items-center justify-center gap-6 p-4 border-t'>
      <div className='w-full grid grid-cols-1 md:grid-cols-3 justify-items-center gap-4'>
        <div className='w-auto min-w-50 flex flex-col gap-1'>
          <p className='font-semibold'>Links</p>
          <div className='flex flex-col text-sm w-auto'>
            <Link href={'/offers'}>Offers</Link>
            <Link href={'/products'}>Products</Link>
            <Link href={'/products/category'}>Categories</Link>
          </div>
        </div>
        <div className='w-auto min-w-50 flex flex-col gap-1'>
          <p className='font-semibold'>Policy</p>
          <div className='flex flex-col text-sm w-auto'>
            <Link href={'/'}>Privacy & Policy</Link>
            <Link href={'/'}>Payments</Link>
            <Link href={'/'}>Refund Policy</Link>
          </div>
        </div>
        <div className='w-auto min-w-50 flex flex-col gap-1'>
          <p className='font-semibold'>User Manual</p>
          <div className='flex flex-col text-sm w-auto'>
            <Link href={'/dashboard'}>Access</Link>
            <Link href={'/'}>Data</Link>
            <Link href={'/'}>Account</Link>
          </div>
        </div>
      </div>
    <FooterTagline/>
    </div>
  )
}

export default Footer
