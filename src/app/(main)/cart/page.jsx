'use client'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'
import { MdDeleteOutline } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';

const Cart = () => {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart, userData } = useContext(Context)
  const [formData, setFormData] = useState({
    name: userData.name || '',
    phone: userData.phone || '',
    subTotal: 0,
    discount: 0,
    totalPrice: 0,
    paymentMethod: 'cash',
    transactionId: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (!cart?.items) return;

    const subTotal = cart.items.reduce((sum, item) =>
      sum + (parseFloat(item.sale_price || 0) * (item.quantity || 0)), 0)

    const totalDiscount = cart.items.reduce((sum, item) =>
      sum + (parseFloat(item.discount_price || 0) * (item.quantity || 0)), 0)

    const totalPrice = subTotal - totalDiscount

    setFormData(prev => ({ ...prev, subTotal, discount: totalDiscount, totalPrice }))
  }, [cart?.items])

  const placeOrder = async (e) => {
    e.preventDefault()

    if (cart.items.length === 0) return toast.error("Your cart is empty");

    const payload = {
      customerName: formData.name,
      phone: formData.phone,
      subtotal: formData.subTotal,
      discount: formData.discount,
      total: formData.totalPrice,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
      status: 'pending',
      items: cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.sale_price
      }))
    }

    try {
      const response = await axios.post('/api/order/public', payload, { withCredentials: true })
      toast.success(response.data.message || 'Order placed successfully!');
      clearCart()
      setFormData({
        name: '', phone: '', subTotal: 0, discount: 0,
        totalPrice: 0, paymentMethod: 'cash', transactionId: ''
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to place order')
    }
  }

  if (!cart || cart?.items.length < 1) return (
    <div className='w-full p-20 text-center flex flex-col items-center gap-4'>
      <p className='text-2xl text-gray-400 '>Your cart is empty</p>
      <Link href="/products" className='bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full transition-all'>
        Continue Shopping
      </Link>
    </div>
  )

  return (
    <div className='w-full max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8 mt-10'>

      <div className='flex-1'>
        <h1 className='text-3xl font-semibold mb-8 text-gray-800'>Shopping Cart</h1>
        <div className='flex flex-col gap-6'>
          {cart.items.map((item) => (
            <div key={item?.product_id} className='w-full grid grid-cols-1 justify-items-center shadow sm:grid-cols-2  rounded-2xl border border-black/30 p-2'>
              <div className='col-span-1 w-full text-start'>
                <p className=' text-lg text-gray-800'>{item?.name}</p>
                <p className='text-sm text-gray-500'>৳{parseFloat(item?.sale_price).toFixed(2)} per unit</p>
              </div>
              <div className='col-span-1 grid grid-cols-3 justify-items-center gap-6'>
                <div className='grid-cols-1 flex items-center gap-4 bg-gray-100 px-4  rounded-full'>
                  <FaMinus
                    className='cursor-pointer text-gray-600 hover:text-black transition-colors'
                    onClick={() => decreaseQuantity(item?.product_id)}
                  />
                  <span className=' text-gray-800'>{item?.quantity}</span>
                  <FaPlus
                    className='cursor-pointer text-gray-600 hover:text-black transition-colors'
                    onClick={() => addToCart(item)}
                  />
                </div>
                <p className='grid-cols-1   text-gray-800'>
                  ৳{(parseFloat(item.sale_price) * item.quantity).toFixed(2)}
                </p>
                <MdDeleteOutline
                  className='grid-cols-1 text-2xl text-red-400 cursor-pointer hover:text-red-600 transition-colors'
                  onClick={() => removeFromCart(item?.product_id)}
                />
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className='text-sm text-red-400 self-start mt-4 hover:text-red-600 hover:underline transition-all'
          >
            Clear All Items
          </button>
        </div>
      </div>

      <div className='w-full lg:w-100 bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 h-fit sticky top-10'>
        <h2 className='text-2xl  mb-6 text-gray-800'>Order Summary</h2>
        <form onSubmit={placeOrder} className='flex flex-col gap-5'>
          <div className='space-y-4'>
            <input
              type="text" name='name' required placeholder="Your Full Name"
              onChange={handleChange} value={formData.name}
              className='w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-sky-500 transition-all'
            />
            <input
              type="text" name='phone' required placeholder="Phone Number"
              onChange={handleChange} value={formData.phone}
              className='w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-sky-500 transition-all'
            />

            <label className='text-xs  text-gray-400 uppercase ml-2'>Payment Method</label>
            <input type="text" name="paymentMethod" onChange={handleChange} value={formData.paymentMethod} readOnly className='w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-sky-500 transition-all' />

          </div>

          <div className='flex flex-col gap-3 border-t border-gray-100 pt-6 mt-2'>
            <div className='flex justify-between text-gray-500'>
              <span>Subtotal</span>
              <span>৳{formData.subTotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-green-600 font-semibold'>
              <span>Discount Applied</span>
              <span>-৳{formData.discount.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-xl font-black mt-2 text-gray-900'>
              <span>Net Total</span>
              <span>৳{formData.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            className='w-full bg-sky-600 text-white py-5 rounded-2xl  hover:bg-sky-700 active:scale-95   transition-all mt-6 uppercase tracking-wider'
            type='submit'
          >
            Confirm Order
          </button>
          <p className='text-[10px] text-center text-gray-400 italic'>*Our representative will call to confirm your order.</p>
        </form>
      </div>
    </div>
  )
}

export default Cart