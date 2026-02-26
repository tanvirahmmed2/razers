'use client'
import AddPurchaseForm from '@/components/forms/AddPurchaseForm'
import AddSupplierForm from '@/components/forms/AddSupplierForm'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'
import { LuDelete } from 'react-icons/lu'

const PurchasePage = () => {
  const { isSupplierBox, setIsSupplierBox } = useContext(Context)




  return (
    <div className="w-full p-1 sm:p-4 flex flex-col md:flex-row relative ">
      <div className={`absolute w-auto ${isSupplierBox ? 'block backdrop-blur-2xl' : 'hidden backdrop-blur-none'} z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white min-w-100 border p-4 rounded-xl shadow-lg`}>
        <LuDelete className='w-full  cursor-pointer text-2xl' onClick={()=>setIsSupplierBox(false)}/>
        <AddSupplierForm />
      </div>
      <AddPurchaseForm />

    </div>
  )
}

export default PurchasePage
