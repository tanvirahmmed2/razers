'use client'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'
import axios from 'axios'
import BarScanner from '../helper/BarcodeScanner'

const AddProductForm = () => {
    const { setIsCategoryBox, setIsBrandBox, categories, brands } = useContext(Context)

    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        categoryId: '',
        brandId: '',
        unit: '',
        stock: '',
        purchasePrice: '',
        salePrice: '',
        discountPrice: '',
        wholeSalePrice: '',
        retailPrice: '',
        dealerPrice: '',
        description: '',
        image: null,
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (files) {
            setFormData({ ...formData, image: files[0] })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleAddBarcode = (code) => {
        setFormData(prev => ({ ...prev, barcode: code }))
        toast.info(`Barcode Scanned: ${code}`, { autoClose: 1000 })
    }

    const SubmitNewProduct = async (e) => {
        e.preventDefault()
        try {
            const newData = new FormData()
            Object.keys(formData).forEach(key => {
                // Only append if value exists to avoid sending "null" strings for optional fields
                if (formData[key] !== null && formData[key] !== '') {
                    newData.append(key, formData[key])
                }
            })

            const response = await axios.post('/api/product', newData, { withCredentials: true })
            toast.success(response.data.message)

            setFormData({
                name: '', barcode: '', categoryId: '', brandId: '', unit: '',
                stock: '', purchasePrice: '', salePrice: '', discountPrice: '',
                wholeSalePrice: '', retailPrice: '', dealerPrice: '',
                description: '', image: null,
            })
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Failed to add product")
        }
    }

    return (
        <div className='w-full flex flex-col items-center gap-6'>
            <h1 className='text-center text-2xl font-semibold'>Add New Product</h1>

            <BarScanner onScan={handleAddBarcode} />

            <form onSubmit={SubmitNewProduct} className='w-full flex flex-col items-center gap-4'>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="name">Name *</label>
                        <input type="text" name='name' id='name' required value={formData.name} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="barcode">Barcode (Auto-generated if empty)</label>
                        <input
                            type="text"
                            name='barcode'
                            id='barcode'
                            // Removed readOnly so you can type manually if scanner fails
                            placeholder="Scan, type, or leave empty"
                            value={formData.barcode}
                            onChange={handleChange}
                            className='w-full border border-sky-400 bg-gray-50 font-mono px-4 p-1 rounded-sm outline-none'
                        />
                        {formData.barcode ? 
                            <span className='text-[10px] text-green-600 font-bold'>✓ Code Provided</span> : 
                            <span className='text-[10px] text-orange-500 font-bold'>⚠ System will generate ID</span>
                        }
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-row items-center justify-between gap-2'>
                        <div className='w-full flex flex-col gap-1'>
                            <label htmlFor="category">Category *</label>
                            <select name='categoryId' id='categoryId' required value={formData.categoryId} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '>
                                <option value="">select</option>
                                {categories.map((cat) => (
                                    <option value={cat.category_id} key={cat.category_id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type='button' className='mt-6 text-center p-2 bg-sky-600 text-white rounded-full' onClick={() => setIsCategoryBox(true)}>Add</button>
                    </div>

                    <div className='w-full flex flex-row items-center justify-between gap-2'>
                        <div className='w-full flex flex-col gap-1'>
                            <label htmlFor="brand">Brand</label>
                            <select name='brandId' id='brandId' value={formData.brandId} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '>
                                <option value="">select</option>
                                {brands.map((brand) => (
                                    <option value={brand.brand_id} key={brand.brand_id}>{brand.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type='button' className='mt-6 text-center p-2 bg-sky-600 text-white rounded-full' onClick={() => setIsBrandBox(true)}>Add</button>
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="unit">Unit *</label>
                        <input type="text" name='unit' id='unit' required value={formData.unit} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="stock">Stock *</label>
                        <input type="number" min={0}
                            step="0.01" name='stock' id='stock' required value={formData.stock} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="purchasePrice">Purchase Price *</label>
                        <input type="number" min={0}
                            step="0.01" name='purchasePrice' id='purchasePrice' required value={formData.purchasePrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="salePrice">Sale Price *</label>
                        <input type="number" min={0}
                            step="0.01" name='salePrice' id='salePrice' required value={formData.salePrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="discountPrice">Discount Price</label>
                        <input type="number" min={0}
                            step="0.01" name='discountPrice' id='discountPrice' value={formData.discountPrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="retailPrice">Retail Price</label>
                        <input type="number" min={0}
                            step="0.01" name='retailPrice' id='retailPrice' value={formData.retailPrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="wholeSalePrice">Whole Sale Price *</label>
                        <input type="number" min={0}
                            step="0.01" name='wholeSalePrice' id='wholeSalePrice' required value={formData.wholeSalePrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="dealerPrice">Dealer Price</label>
                        <input type="number" min={0}
                            step="0.01" name='dealerPrice' id='dealerPrice' value={formData.dealerPrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="description">Description *</label>
                        <textarea name="description" id="description" required value={formData.description} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none h-20'></textarea>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="image">Image *</label>
                        <input type="file" name='image' id='image' accept='image/*' required onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>

                <button className='w-auto px-12 py-2 mt-4 rounded-full bg-sky-600 text-white font-bold cursor-pointer hover:bg-sky-500 transition-all' type='submit'>Submit Product</button>
            </form>
        </div>
    )
}

export default AddProductForm