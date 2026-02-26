'use client'
import AddCutomerForm from '@/components/forms/AddCustomerForm'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const CustomerPage = () => {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/customer/search?q=${searchTerm}`, { withCredentials: true })
        setCustomers(response.data.payload)
      } catch (error) {
        setCustomers([])
      }
    }
    fetchCustomer()
  }, [searchTerm])

  return (
    <div className='w-full mx-auto p-1 sm:p-4 flex flex-col gap-10 items-center min-h-screen bg-white'>
      <AddCutomerForm/>
      <h1 className='text-2xl font-black text-gray-900 '> Customer Directory </h1>

       <input type="text" placeholder="Search by name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>

      <div className='w-full'>
        {customers.length === 0 ? (
          <div className='w-full py-24 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl'>
            <p className='text-gray-400 font-medium italic'>
              No customer intelligence found for this search.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
            {customers.map((customer, idx) => (
              <div key={customer.phone || idx} className='p-2 shadow' >
                <div className='flex justify-between items-start'>
                  <div className='flex flex-col'>
                    <span className='text-xs font-bold text-sky-600 uppercase tracking-tighter mb-1'>Customer Name</span>
                    <p className='text-xl font-bold text-gray-800 leading-tight'>{customer.name}</p>
                  </div>
                  <p className='text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded'>{customer.phone} </p>
                </div>

                <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-50'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] uppercase text-gray-400 font-bold tracking-wider'>Total Orders</span>
                    <p className='text-lg font-black text-gray-700'>{customer.total_orders}</p>
                  </div>
                  <div className='flex flex-col items-end'>
                    <span className='text-[10px] uppercase text-gray-400 font-bold tracking-wider'>Total Value</span>
                    <p className='text-lg font-black text-emerald-600'> ৳{parseFloat(customer.total_purchased_amount).toLocaleString()} </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerPage