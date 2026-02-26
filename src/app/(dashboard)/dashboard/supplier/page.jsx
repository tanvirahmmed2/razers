import AddSupplierForm from '@/components/forms/AddSupplierForm'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const SupplierPage = async () => {
  const res = await fetch(`${BASE_URL}/api/supplier`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) {
    return (
      <div className='w-full text-center py-20'>
        <p className='text-gray-500 text-lg'>{data.message || 'No result found'}</p>
      </div>
    )
  }

  const suppliers = data.payload

  return (
    <div className='w-full p-1 sm:p-4 flex flex-col gap-6'>
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className='text-2xl font-black text-gray-800 uppercase tracking-tight'>Supplier Directory</h1>
        <p className='text-xs text-gray-500 font-medium'>Overview of procurement and vendor stats</p>
      </div>
      <div className='w-full flex flex-col items-center justify-center gap-3'>
        <h1 className='text-center text-2xl font-semibold'>Add new Supplier</h1>
        <AddSupplierForm/>
      </div>

      {suppliers.length === 0 ? (
        <div className='w-full min-h-60 flex items-center justify-center text-center bg-gray-50 rounded-3xl border-2 border-dashed'>
          <p className='text-gray-400 font-medium'>No supplier records found in the database.</p>
        </div>
      ) : (
        <div className='w-full flex flex-col items-center justify-center gap-1'>
          {suppliers.map((supplier) => {
            const totalSpent = Number(supplier.total_amount_spent || 0);
            const totalPurchases = Number(supplier.total_purchases || 0);

            return (
              <div 
                key={supplier.supplier_id} 
                className="flex w-full even:bg-gray-200 rounded-2xl shadow p-4 flex-row items-center justify-between group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {supplier.name}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold tracking-wider">{supplier.phone}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                    Vendor
                  </span>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Total Purchases</span>
                    <span className="text-sm font-black text-gray-700">{totalPurchases}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Total Investment</span>
                    <span className="text-sm font-black text-green-600">
                      ৳{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {supplier.last_purchase_date && (
                    <div className="pt-2">
                      <p className="text-[10px] text-gray-400 font-medium italic">
                        Last Invoice: {new Date(supplier.last_purchase_date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SupplierPage