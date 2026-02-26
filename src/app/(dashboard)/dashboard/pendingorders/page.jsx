'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { generateReceipt } from '@/lib/database/print'
import { printOrder } from '@/lib/database/orderPrint'

const PendingOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/order/status?q=pending`)
      if (res.data.success) {
        setOrders(res.data.payload)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const confirmOrder = async (orderId) => {
    try {
      const res = await axios.put('/api/order', { orderId, action: 'confirm' })
      if (res.data.success) {
        toast.success("Order Confirmed & Stock Updated")
        fetchOrders() 
        // Note: res.data.payload should contain the full order object for the receipt
        generateReceipt(res.data.payload)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Confirmation failed")
    }
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await axios.put('/api/order', { orderId, action: 'delete' })
      if (res.data.success) {
        toast.error("Order Deleted")
        fetchOrders() 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed")
    }
  }

  if (loading) return <p className='text-center text-gray-500 mt-10'>Loading pending orders...</p>
  if (orders.length === 0) return <p className='text-center text-gray-500 mt-10'>No pending orders found</p>

  console.log(orders)

  return (
    <div className='w-full min-h-screen flex flex-col items-center p-1 sm:p-4 gap-6 '>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-4'>Pending Orders</h1>

      <div className='w-full flex flex-col gap-2 items-center justify-center'>
        {orders.length > 0 && orders.map((order, idx) => (
          <div key={idx}
            className='w-full grid grid-cols-12 p-2 border rounded-xl even:bg-gray-200'
          >
            <div className='flex flex-col gap-1 w-full col-span-3'>
              <p className='font-medium text-gray-700'>Name: <span className='font-semibold text-gray-900'>{order.name}</span></p>
              <p className='font-medium text-gray-700'>Phone: <span className='font-semibold text-gray-900'>{order.phone}</span></p>
              <p className='text-xs text-blue-600 font-bold uppercase'>{order.status}</p>
            </div>
            <div className=' w-full flex flex-col gap-1 col-span-5'>
              <p className='font-medium text-gray-700 mb-1'>Products ({order.product_list?.length || 0} items):</p>
              <ul className='w-full list-disc list-inside text-gray-800'>
                {order.product_list?.map((product, pIdx) => (
                  <li key={pIdx} className='w-full grid grid-cols-6'>
                    <p className='col-span-4'>{product.name}</p>
                    <p className='col-span-1'>Qty: {product.quantity}</p>
                    <div className='col-span-1 flex flex-col'>
                      <p >৳{Number(product.price) * Number(product.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex flex-col gap-1 col-span-3 text-xs'>
              <p className='font-medium text-gray-700'>Total: <span className='font-semibold text-gray-900'>৳{order.total_amount}</span></p>
              <p className='font-medium text-gray-700'>Discount: <span className='font-semibold text-gray-900'>৳{order.total_discount_amount || order.discount}</span></p>
              <p className='font-medium text-gray-700'>Paid: <span className='font-semibold text-green-700'>৳{order.paid_amount || order.amount_received || 0}</span></p>
              <p className='font-medium text-gray-700'>Change: <span className='font-semibold text-red-600'>৳{order.change_amount || 0}</span></p>
              <p className='font-medium text-gray-700'>Date: <span className='font-semibold text-gray-900'>{(order.created_at || order.date)?.slice(0, 10)}</span></p>
            </div>

            <div className='w-full col-span-1 flex flex-col gap-1'>
              {order.status === 'pending' && (
                <button onClick={() => confirmOrder(order.order_id)} className='w-full bg-green-600 text-white cursor-pointer py-1 text-sm rounded'>Confirm</button>
              )}
              <button onClick={() => cancelOrder(order.order_id)} className='w-full bg-red-500 text-white cursor-pointer py-1 text-sm rounded'>Delete</button>
              
              <button onClick={() => printOrder(order)} className='w-full bg-sky-600 text-white cursor-pointer py-1 text-sm rounded'>Print</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingOrdersPage