'use client'
import React, { useContext, useState } from 'react'
import { ImCancelCircle } from "react-icons/im";
import { Context } from '../helper/Context';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategoryForm = () => {
    const [category, setCategory] = useState('')
    const { setIsCategoryBox, fetchCategory, isCategoryBox } = useContext(Context)
    
    
    const addNewCategory = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/category', {name:category}, { withCredentials: true })
           toast(response.data.message)
            fetchCategory()
            setIsCategoryBox(false)
        } catch (error) {
            toast(error?.response?.data?.message || "failed to add Category")

        }
    }
    return (
        <form onSubmit={addNewCategory} className='w-full flex  flex-col items-center justify-center gap-3 relative'>
            <h1>Add New Category</h1>
            <button type='button' onClick={() => setIsCategoryBox(false)} className=' absolute top-2 right-2 text-2xl cursor-pointer'><ImCancelCircle /></button>
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="category">Category</label>
                <input type="text" id='category' name='category' required value={category} onChange={(e) => setCategory(e.target.value)} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
            </div>
            <button className='w-auto px-8 p-1 bg-sky-600 hover:bg-sky-500 rounded-full text-white cursor-pointer' type='submit'>Submit</button>
        </form>
    )
}

export default AddCategoryForm
