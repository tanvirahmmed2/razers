'use client'
import React, { useContext, useState } from 'react'
import { RiCloseLine } from 'react-icons/ri'
import { Context } from '../helper/Context'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const AddBrandForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })
    const { setIsBrandBox, fetchBrand } = useContext(Context)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    
    const addNewBrand = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/brand', formData, { withCredentials: true })
            toast.success(response.data.message)
            fetchBrand()
            setIsBrandBox(false)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add brand")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={addNewBrand} className='flex flex-col w-full bg-white'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-slate-100'>
                <h2 className='text-lg font-bold text-slate-800 tracking-tight'>Add New Brand</h2>
                <button 
                    type='button' 
                    onClick={() => setIsBrandBox(false)} 
                    className='p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors'
                >
                    <RiCloseLine size={24} />
                </button>
            </div>

            {/* Body */}
            <div className='p-6 flex flex-col gap-5'>
                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="name" className='text-sm font-semibold text-slate-700'>Brand Name <span className='text-rose-500'>*</span></label>
                    <input 
                        type="text" 
                        id='name' 
                        name='name' 
                        required 
                        placeholder="e.g., Nike"
                        value={formData.name} 
                        onChange={handleChange} 
                        className='w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400' 
                    />
                </div>
                
                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="description" className='text-sm font-semibold text-slate-700'>Description</label>
                    <textarea 
                        id='description' 
                        name='description' 
                        rows="3"
                        placeholder="Optional details about this brand..."
                        value={formData.description} 
                        onChange={handleChange} 
                        className='w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none' 
                    />
                </div>
            </div>

            {/* Footer */}
            <div className='p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3'>
                <button 
                    type='button' 
                    onClick={() => setIsBrandBox(false)}
                    className='px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-200/50 rounded-xl transition-colors'
                >
                    Cancel
                </button>
                <button 
                    disabled={isSubmitting}
                    type='submit' 
                    className='px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors shadow-sm shadow-sky-200 disabled:opacity-50 flex items-center gap-2'
                >
                    {isSubmitting ? 'Saving...' : 'Save Brand'}
                </button>
            </div>
        </form>
    )
}

export default AddBrandForm
