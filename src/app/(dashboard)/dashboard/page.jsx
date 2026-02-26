'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { format } from 'date-fns'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Today')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const fetchStats = async () => {
        setLoading(true)
        try {
            const s = format(startDate, 'yyyy-MM-dd')
            const e = format(endDate, 'yyyy-MM-dd')
            const res = await axios.get(`/api/report/dashboard?type=${activeTab}&start=${s}&end=${e}`)
            if (res.data.success) setData(res.data)
        } catch (err) {
            console.error("Fetch Error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStats() }, [activeTab, startDate, endDate])

    if (loading && !data) return <div className='p-20 text-center font-bold text-gray-400 animate-pulse'>LOADING ANALYTICS...</div>

    const { overview, activeRange } = data || {}

    return (
        <div className='w-full min-h-screen p-6 bg-[#f8fafc] flex flex-col gap-8'>
            
            <div className='bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden'>
                <div className='flex border-b bg-slate-50/50 overflow-x-auto'>
                    {['Today', 'Yesterday', 'This Week', 'This Month', 'This Year', 'Custom'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-10 py-6 font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className='p-12'>
                    {activeTab === 'Custom' && (
                        <div className='mb-10 flex gap-6 items-center bg-blue-50 p-6 rounded-3xl border border-blue-100 w-fit'>
                            <div className='flex flex-col gap-2'>
                                <p className='text-[10px] font-black text-blue-600 uppercase tracking-tighter'>Date Range Selection</p>
                                <div className='flex items-center gap-4'>
                                    <DatePicker selected={startDate} onChange={d => setStartDate(d)} className='bg-transparent font-bold text-blue-900 outline-none border-b border-blue-200' />
                                    <span className='text-blue-300 font-bold'>TO</span>
                                    <DatePicker selected={endDate} onChange={d => setEndDate(d)} className='bg-transparent font-bold text-blue-900 outline-none border-b border-blue-200' />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
                        <PeriodStat label={`${activeTab} Sales`} value={activeRange?.sales} color="text-slate-900" />
                        <PeriodStat label={`${activeTab} Purchases`} value={activeRange?.purchases} color="text-slate-900" />
                        <PeriodStat label={`${activeTab} Returns`} value={activeRange?.returns} color="text-rose-500" />
                        <PeriodStat label={`${activeTab} Net Profit`} value={activeRange?.profit} color="text-emerald-600" isProfit />
                    </div>
                </div>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                <StatCard title="Total Customers" value={overview?.total_customers} color="bg-blue-600" />
                <StatCard title="Total Products" value={overview?.total_products} color="bg-indigo-600" />
                <StatCard title="Total Stock Qty" value={overview?.total_stock_qty} color="bg-violet-600" />
                <StatCard title="Stock Value" value={`৳${Number(overview?.total_stock_value).toLocaleString()}`} color="bg-fuchsia-600" />
                <StatCard title="Confirmed Orders" value={overview?.total_confirmed_orders} color="bg-emerald-600" />
                <StatCard title="Lifetime Sales" value={`৳${Number(overview?.total_sales_amount).toLocaleString()}`} color="bg-cyan-600" />
                <StatCard title="Lifetime Profit" value={`৳${Number(overview?.total_profit_amount).toLocaleString()}`} color="bg-slate-900" />
                <StatCard title="Purchase Cost" value={`৳${Number(overview?.total_purchase_amount).toLocaleString()}`} color="bg-orange-600" />
                <StatCard title="Returns" value={`৳${Number(overview?.total_returned_amount).toLocaleString()}`} color="bg-rose-600" />
            </div>

            {/* PERIOD ANALYSIS */}

        </div>
    )
}

const StatCard = ({ title, value, color }) => (
    <div className={`${color} p-8 rounded-[2rem] text-white shadow-xl shadow-inner flex flex-col gap-1 hover:scale-[1.02] transition-transform`}>
        <p className='text-[9px] font-black opacity-60 uppercase tracking-[0.2em]'>{title}</p>
        <p className='text-2xl font-black tracking-tighter'>{value ?? 0}</p>
    </div>
)

const PeriodStat = ({ label, value, color, isProfit }) => (
    <div className='flex flex-col gap-2'>
        <p className='text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]'>{label}</p>
        <p className={`text-4xl font-black ${color} tracking-tighter`}>
            ৳{Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        {isProfit && <div className='h-1 w-12 bg-emerald-500 rounded-full' />}
    </div>
)

export default Dashboard;