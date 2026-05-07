import { BASE_URL } from '@/lib/database/secret'
import React from 'react'
import Link from 'next/link'
import { 
    Wallet, 
    Calendar, 
    User, 
    Phone, 
    ArrowRight, 
    DollarSign, 
    Receipt, 
    Hash,
    Tag
} from 'lucide-react'

const TransactionsPage = async () => {
    const res = await fetch(`${BASE_URL}/api/payment`, {
        method: 'GET',
        cache: 'no-store'
    })

    const data = await res.json()
    
    if (!data.success) {
        return (
            <div className='w-full min-h-[60vh] flex flex-col items-center justify-center gap-4'>
                <div className='w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200'>
                    <Receipt size={32} />
                </div>
                <div className='text-center'>
                    <p className='text-slate-500 font-bold'>No transactions found</p>
                    <p className='text-slate-400 text-xs mt-1'>Completed sales will appear here.</p>
                </div>
            </div>
        )
    }

    const transactions = data.payload

    return (
        <div className='flex flex-col gap-8 max-w-6xl mx-auto w-full'>
            {/* Header Area */}
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div>
                    <h1 className='text-2xl md:text-3xl font-black text-slate-900 tracking-tight'>Sales <span className='text-primary'>Transactions</span></h1>
                    <p className='text-slate-400 text-xs font-medium'>Record of all completed payments and receipts</p>
                </div>
                <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200'>
                    <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary'>
                        <Hash size={16} />
                    </div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none'>Total History</p>
                        <p className='text-sm font-bold text-slate-800'>{transactions.length} Records</p>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className='grid grid-cols-1 gap-4'>
                {transactions.map((t, idx) => (
                    <div 
                        key={t.payment_id || idx} 
                        className='group bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 relative overflow-hidden'
                    >
                        {/* Decorative background element */}
                        <div className='absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500' />
                        
                        <div className='flex flex-col lg:flex-row gap-6 lg:items-center justify-between relative z-10'>
                            {/* Customer Info Section */}
                            <div className='flex items-start gap-4'>
                                <div className='w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20'>
                                    <User size={20} />
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='text-lg font-bold text-slate-800 leading-none'>{t.name}</h3>
                                        <span className='px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-tight'>Paid</span>
                                    </div>
                                    <div className='flex items-center gap-3 mt-1.5'>
                                        <div className='flex items-center gap-1 text-slate-400 text-xs font-medium'>
                                            <Phone size={12} />
                                            <span>{t.phone}</span>
                                        </div>
                                        <div className='w-1 h-1 bg-slate-200 rounded-full' />
                                        <div className='flex items-center gap-1 text-slate-400 text-xs font-medium'>
                                            <Calendar size={12} />
                                            <span>{t.date.slice(0, 10)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider for mobile */}
                            <div className='h-px w-full bg-slate-50 lg:hidden' />

                            {/* Financial Details Section */}
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8'>
                                <TransactionMetric label="Sub Total" value={t.subtotal} icon={<DollarSign size={14} />} />
                                <TransactionMetric label="Discount" value={t.discount} color="text-rose-500" icon={<Tag size={14} />} />
                                <TransactionMetric label="Paid Amount" value={t.payment_amount} color="text-primary" icon={<Wallet size={14} />} />
                                
                                <div className='flex flex-col justify-center items-end'>
                                    <div className='flex flex-col gap-1'>
                                        <label className='text-[9px] font-black text-slate-400 uppercase tracking-widest text-right'>Transaction ID</label>
                                        <p className='text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100'>
                                            {t.transaction_id || `#TX-${t.payment_id}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className='hidden xl:block'>
                                <Link 
                                    href={`/dashboard/sales/pos/${t.order_id}`}
                                    className='w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all cursor-pointer'
                                >
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const TransactionMetric = ({ label, value, color = "text-slate-800", icon }) => (
    <div className='flex flex-col gap-1'>
        <label className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>{label}</label>
        <div className='flex items-center gap-1'>
            <span className='text-slate-300'>{icon}</span>
            <span className={`text-base font-black ${color} tracking-tight`}>৳{Number(value || 0).toLocaleString()}</span>
        </div>
    </div>
)

export default TransactionsPage
