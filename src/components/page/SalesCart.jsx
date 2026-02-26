'use client'
import React, { useContext } from 'react'
import Orderform from '../forms/Orderform'
import { Context } from '../helper/Context'

const SalesCart = () => {
  const { cart, clearCart } = useContext(Context)

  

  return (
    <div className='flex-1  p-4 flex flex-col items-center gap-6'>
      <h1 className='text-xl font-semibold'>Order details</h1>
      
      <Orderform cartItems={cart?.items} />

      <button onClick={clearCart} className='font-semibold bg-orange-500 text-white px-4 p-1 rounded-full uppercase cursor-pointer'>Clear Cart</button>
    </div>
  )
}

export default SalesCart