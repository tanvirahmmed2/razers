'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StockReport = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('low') 

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const res = await axios.get('/api/report/stock')
                setData(res.data.payload)
            } catch (error) {
                console.error("Stock fetch error", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStockData()
    }, [])

    if (loading) return <div className='w-full min-h-screen flex items-center justify-center font-medium text-sky-400 uppercase tracking-widest text-xs'>Analyzing Inventory...</div>

    const currentList = viewMode === 'low' ? data?.lowStock : data?.highStock

    return (
        <div className=' mx-auto w-full p-1 sm:p-4 flex flex-col gap-10 bg-white min-h-screen'>
            
            <div className='text-center flex flex-col gap-2'>
                <h1 className='text-4xl font-black text-sky-900 tracking-tight'>Inventory Analysis</h1>
                <p className='text-sky-400 text-sm uppercase tracking-widest font-medium '>Stock Management</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='p-8 bg-white border border-sky-100 rounded shadow-sm flex flex-col gap-2'>
                    <span className='text-xs font-bold text-sky-400 uppercase tracking-widest'>Current Remaining Stock</span>
                    <p className='text-5xl font-black text-sky-600'>
                        {data?.stats?.total_remaining_stock ? Number(data.stats.total_remaining_stock).toLocaleString() : 0} <span className='text-lg font-medium text-sky-300'>Units</span>
                    </p>
                    <div className='w-12 h-1 bg-sky-100 rounded-full mt-2'></div>
                </div>

                <div className='p-8 bg-white border border-sky-100 rounded shadow-sm flex flex-col gap-2'>
                    <span className='text-xs font-bold text-sky-400 uppercase tracking-widest'>Lifetime Sold Stock</span>
                    <p className='text-5xl font-black text-sky-800'>
                        {data?.stats?.total_sold_stock ? Number(data.stats.total_sold_stock).toLocaleString() : 0} <span className='text-lg font-medium text-sky-300'>Units</span>
                    </p>
                    <div className='w-12 h-1 bg-sky-100 rounded-full mt-2'></div>
                </div>
            </div>

            <div className='w-full flex flex-col gap-6'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                        <h2 className='text-2xl font-bold text-sky-800 capitalize'>{viewMode} Stock Levels</h2>
                        <div className='hidden md:block w-24 h-px bg-sky-100'></div>
                    </div>

                    <div className='flex bg-sky-100 p-1 rounded-xl w-fit'>
                        <button 
                            onClick={() => setViewMode('low')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'low' ? 'bg-white text-red-600 shadow-sm' : 'text-sky-400 hover:text-sky-600'}`}
                        >
                            Lowest
                        </button>
                        <button 
                            onClick={() => setViewMode('high')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'high' ? 'bg-white text-orange-600 shadow-sm' : 'text-sky-400 hover:text-sky-600'}`}
                        >
                            Highest
                        </button>
                    </div>
                </div>

                <div className='overflow-hidden bg-white rounded border border-sky-100 shadow-sm'>
                    <table className='w-full text-left'>
                        <thead>
                            <tr className='bg-sky-50/50 border-b border-sky-100'>
                                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-sky-500'>Product</th>
                                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-sky-500'>Sale Price</th>
                                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-sky-500 text-right'>In Stock</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-sky-50 font-medium'>
                            {currentList?.map((item, idx) => (
                                <tr key={idx} className='hover:bg-sky-50/50 transition-colors group'>
                                    <td className='px-8 py-4'>
                                        <p className='text-sky-800'>{item.name}</p>
                                    </td>
                                    <td className='px-8 py-4 text-sky-500'>৳{item.sale_price}</td>
                                    <td className='px-8 py-4 text-right'>
                                        <span className={`px-4 py-1 rounded-full text-sm font-black ${viewMode === 'low' && item.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-700'}`}>
                                            {item.stock}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default StockReport