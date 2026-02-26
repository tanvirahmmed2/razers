'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const SalesReport = () => {
    const [reportData, setReportData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get('/api/report/sales')
                setReportData(res.data.payload)
            } catch (error) {
                console.error("Report error", error)
            } finally {
                setLoading(false)
            }
        }
        fetchReport()
    }, [])

    if (loading) return <div className='w-full min-h-screen flex items-center justify-center font-medium text-sky-400'>Generating Report...</div>

    return (
        <div className=' w-full p-1 sm:p-4 flex flex-col gap-10 bg-white min-h-screen'>
            <div className='text-center flex flex-col gap-2'>
                <h1 className='text-2xl font-black '>Sales Performance</h1>
                <p className='text-sky-400 text-sm uppercase tracking-widest font-medium '>Business Analytics</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='p-8 bg-white border border-sky-100 rounded shadow-sm flex flex-col gap-2'>
                    <span className='text-xs font-bold text-sky-400 uppercase tracking-widest'>Total Sales Amount</span>
                    <p className='text-5xl font-black text-orange-600'>
                        ৳{parseFloat(reportData?.stats?.total_revenue).toLocaleString()}
                    </p>
                    <div className='w-12 h-1 bg-orange-100 rounded-full mt-2'></div>
                </div>

                <div className='p-8 bg-white border border-sky-100 rounded shadow-sm flex flex-col gap-2'>
                    <span className='text-xs font-bold text-sky-400 uppercase tracking-widest'>Total Items Sold</span>
                    <p className='text-5xl font-black text-sky-800'>
                        {reportData?.stats?.total_items_sold} <span className='text-lg font-medium text-sky-300'>Units</span>
                    </p>
                    <div className='w-12 h-1 bg-sky-100 rounded-full mt-2'></div>
                </div>
            </div>

            <div className='w-full flex flex-col gap-6'>
                <div className='flex items-center gap-4'>
                    <h2 className='text-2xl font-bold text-sky-800'>Top 10 Selling Items</h2>
                    <div className='flex-1 h-px bg-sky-100'></div>
                </div>

                <div className='overflow-hidden bg-white rounded border border-sky-100 shadow-sm'>
                    <table className='w-full text-left'>
                        <thead>
                            <tr className='bg-sky-50/50 border-b border-sky-100'>
                                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-sky-500'>Product Name</th>
                                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-sky-500 text-center'>Quantity Sold</th>
                                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-sky-500 text-right'>Generated Revenue</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-sky-50 font-medium'>
                            {reportData?.topProducts?.map((item, idx) => (
                                <tr key={idx} className='hover:bg-sky-50/50 transition-colors'>
                                    <td className='px-8 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <span className='text-sky-300 font-black italic'>#{idx + 1}</span>
                                            <p className='text-sky-800'>{item.name}</p>
                                        </div>
                                    </td>
                                    <td className='px-8 py-4 text-center text-sky-600'>{item.sold_qty}</td>
                                    <td className='px-8 py-4 text-right text-sky-900 font-bold'>
                                        ৳{parseFloat(item.revenue).toLocaleString()}
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

export default SalesReport