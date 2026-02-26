'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Package, Truck, CheckCircle, Clock, CreditCard } from 'lucide-react' // Optional: npm install lucide-react
import Image from 'next/image'

const ProfilePageForUser = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get('/api/user/order', { withCredentials: true })
        setOrders(response.data.payload)
      } catch (error) {
        setOrders([])
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/user/login', { withCredentials: true })
      toast.success(response.data.message)
      window.location.replace('/login')
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  // Helper to style status badges
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase()
    if (s === 'delivered' || s === 'paid') return 'bg-green-100 text-green-700'
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (s === 'shipped') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-6'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>My Orders</h1>
          <p className='text-sm text-gray-500'>View and track your recent purchases</p>
        </div>
        <button 
          onClick={handleLogout} 
          className='px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all'
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center py-20'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black'></div>
        </div>
      ) : orders.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300'>
          <Package className='mx-auto text-gray-300 mb-3' size={48} />
          <p className='text-gray-500'>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order) => (
            <div key={order.order_id} className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
              {/* Order Header */}
              <div className='bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4'>
                <div className='flex gap-6'>
                  <div>
                    <p className='text-[10px] uppercase font-bold text-gray-400'>Order ID</p>
                    <p className='text-sm font-mono font-semibold'>#{order.order_id}</p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase font-bold text-gray-400'>Date</p>
                    <p className='text-sm font-semibold'>{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase font-bold text-gray-400'>Total</p>
                    <p className='text-sm font-bold text-black'>৳{order.total_amount}</p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(order.order_status)}`}>
                    {order.order_status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(order.payment?.status)}`}>
                    {order.payment?.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className='p-4'>
                <div className='space-y-4'>
                  {order.items.map((item, idx) => (
                    <div key={idx} className='flex items-center gap-4'>
                      <div className='w-16 h-16 bg-gray-100 rounded-lg  shrink-0 flex items-center justify-center overflow-hidden'>
                        {item.image ? (
                           <Image src={item.image} alt={item.name} width={15} height={15} className='object-cover w-full h-full' />
                        ) : (
                          <Package className='text-gray-400' size={20} />
                        )}
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-sm font-semibold text-gray-800'>{item.name}</h4>
                        <p className='text-xs text-gray-500'>
                          Qty: {item.quantity} {item.unit} × ৳{item.price}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm font-bold'>৳{item.quantity * item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer / Payment Info */}
              <div className='px-4 py-3 bg-white border-t border-gray-50 flex justify-between items-center'>
                 <p className='text-[11px] text-gray-400 flex items-center gap-1'>
                   <CreditCard size={12} /> Paid via {order.payment?.method || 'Cash'}
                 </p>
                 <button className='text-xs font-bold text-blue-600 hover:underline'>
                   Need help?
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfilePageForUser