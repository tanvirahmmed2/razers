'use client'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Phone, User, ArrowRight, Loader2 } from "lucide-react";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart, userData } = useContext(Context)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
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
    
    setIsSubmitting(true)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cart || cart?.items.length < 1) return (
    <div className='w-full min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4'>
      <div className='w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300'>
        <ShoppingBag size={40} />
      </div>
      <div className='text-center'>
        <h2 className='text-xl font-black text-slate-800'>Your cart is empty</h2>
        <p className='text-slate-500 text-sm font-medium mt-1'>Looks like you haven't added anything yet.</p>
      </div>
      <Link href="/products" className='group flex items-center gap-2.5 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-sm active:scale-95'>
        Start Shopping
        <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
      </Link>
    </div>
  )

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-16'>
      <div className='flex flex-col lg:flex-row gap-8'>
        
        {/* Cart Items */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-3xl font-black text-slate-900 tracking-tight'>Shopping <span className='text-primary'>Cart</span></h1>
            <button 
              onClick={clearCart}
              className='flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest'
            >
              <Trash2 size={14} />
              Clear Cart
            </button>
          </div>

          <div className='flex flex-col gap-4'>
            <AnimatePresence mode='popLayout'>
              {cart.items.map((item) => (
                <motion.div 
                  key={item?.product_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className='group bg-white rounded-2xl border border-slate-100 p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition-all duration-300'
                >
                  <div className='w-20 h-20 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center'>
                    {item?.image ? (
                      <img src={item?.image} alt={item?.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform' />
                    ) : (
                      <ShoppingBag size={24} className='text-slate-200' />
                    )}
                  </div>

                  <div className='flex-1 text-center md:text-left'>
                    <h3 className='text-base font-bold text-slate-800 line-clamp-1'>{item?.name}</h3>
                    <p className='text-xs font-medium text-slate-400 mt-1'>৳{parseFloat(item?.sale_price).toFixed(2)} / unit</p>
                  </div>

                  <div className='flex flex-wrap items-center justify-center gap-4'>
                    <div className='flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100'>
                      <button
                        onClick={() => decreaseQuantity(item?.product_id)}
                        className='w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-90'
                      >
                        <Minus size={14} />
                      </button>
                      <span className='font-bold text-slate-800 min-w-[16px] text-center text-sm'>{item?.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className='w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-90'
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className='text-right min-w-[80px]'>
                      <p className='text-base font-black text-slate-900'>৳{(parseFloat(item.sale_price) * item.quantity).toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item?.product_id)}
                      className='p-2.5 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90'
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div className='w-full lg:w-[360px]'>
          <div className='bg-slate-900 rounded-3xl p-6 md:p-8 sticky top-20 shadow-xl shadow-slate-900/10'>
            <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-3'>
              Checkout
              <div className='h-1 w-10 bg-primary rounded-full'></div>
            </h2>

            <form onSubmit={placeOrder} className='flex flex-col gap-4'>
              <div className='space-y-3'>
                <div className='relative'>
                  <User className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500' size={16} />
                  <input
                    type="text" name='name' required placeholder="Full Name"
                    onChange={handleChange} value={formData.name}
                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all text-white font-medium placeholder:text-slate-600 text-sm'
                  />
                </div>
                <div className='relative'>
                  <Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500' size={16} />
                  <input
                    type="text" name='phone' required placeholder="Phone Number"
                    onChange={handleChange} value={formData.phone}
                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all text-white font-medium placeholder:text-slate-600 text-sm'
                  />
                </div>

                <div className='flex flex-col gap-1.5 pt-1'>
                  <label className='text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1'>Payment Method</label>
                  <div className='flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl text-slate-300'>
                    <CreditCard size={16} className='text-primary' />
                    <span className='font-bold uppercase tracking-wider text-[11px]'>{formData.paymentMethod} on Delivery</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-3 border-t border-white/10 pt-4 mt-1'>
                <div className='flex justify-between text-slate-500 font-medium text-sm'>
                  <span>Subtotal</span>
                  <span>৳{formData.subTotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-green-500 font-bold text-sm'>
                  <span>Discount</span>
                  <span>-৳{formData.discount.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-xl font-black mt-1 text-white'>
                  <span>Total</span>
                  <span className='text-primary'>৳{formData.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='group flex items-center justify-center gap-2.5 w-full py-3.5 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 shadow-md'
              >
                {isSubmitting ? (
                  <Loader2 size={20} className='animate-spin' />
                ) : (
                  <>
                    Confirm Order
                    <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                  </>
                )}
              </button>
              
              <p className='text-[9px] text-center text-slate-600 font-medium leading-relaxed italic'>
                * We will contact you shortly to verify your order details and delivery address.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
