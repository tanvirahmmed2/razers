import React, { useContext } from 'react'
import { ShopContext } from '../components/ContextProvider'

const Cart = () => {
  const { cartData } = useContext(ShopContext)





  const handleCoupon = (e) => {
    e.preventDefault()
  }
  return (
    <section className='w-full h-auto flex flex-col items-center justify-center gap-6 p-2'>
      <h1 className='text-3xl font-semibold'>Welcome to cart</h1>
      <div className='w-full flex flex-row items-center justify-around border-2'>
        <p>Product</p>
        <p>Name</p>
        <p>Quantity</p>
        <p>Price</p>
        <p>Remove</p>

      </div>

      {cartData.map((data) => {
        const { image, name, id, new_price, } = data
        return (
          <div className='w-full flex flex-row items-center justify-around border-2' key={id}>
            <img src={image} alt="" className='w-10' />
            <p>{name}</p>
            <p>Quantity</p>
            <p>{new_price}</p>
            <p>Remove</p>
          </div>

        )
      })}



      <div className='w-full flex flex-col md:flex-row items-center justify-between'>
        <div className='w-full flex flex-col p-4'>
          <p>Total item:</p>
          <p>Total amount:</p>
        </div>
        <form action="" className='w-full bg-blue-600 text-white rounded-lg flex flex-col gap-2 p-4' onSubmit={handleCoupon}>
          <label htmlFor="coupon">Get Discount</label>
          <input type="text" name='coupon' id='coupon' placeholder='type coupon' required className='p-1 px-3 hidden md:block  rounded-lg outline-none placeholder-blue-500 placeholder-opacity-25 text-black' />
          <button className='bg-white text-blue-600 rounded-lg' type='submit'>Apply coupon</button>

        </form>

      </div>
      <p className=' bg-gradient-to-br from-amber-500 to-red-600 text-white p-1 rounded-lg px-6'>Pay</p>

    </section>
  )
}

export default Cart
