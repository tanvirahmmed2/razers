'use client'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'
import axios from 'axios'

const UpdateProductForm = ({ product }) => {
    const { categories, brands } = useContext(Context)
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        productId: product?.product_id,
        name: product?.name || '',
        category_id: product?.category_id || '',
        brand_id: product?.brand_id || '',
        barcode: product?.barcode || '',
        unit: product?.unit || '',
        stock: product?.stock || '',
        purchase_price: product?.purchase_price || '',
        sale_price: product?.sale_price || '',
        discount_price: product?.discount_price || '',
        wholesale_price: product?.wholesale_price || '',
        retail_price: product?.retail_price || '',
        dealer_price: product?.dealer_price || '',
        description: product?.description || '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const SubmitUpdateProduct = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = new FormData()
            data.append("id", formData.productId)
            data.append("name", formData.name)
            data.append("category_id", formData.category_id)
            data.append("brand_id", formData.brand_id)
            data.append("barcode", formData.barcode)
            data.append("unit", formData.unit)
            data.append("stock", formData.stock)
            data.append("purchase_price", formData.purchase_price)
            data.append("sale_price", formData.sale_price)
            data.append("discount_price", formData.discount_price)
            data.append("wholesale_price", formData.wholesale_price)
            data.append("retail_price", formData.retail_price)
            data.append("dealer_price", formData.dealer_price)
            data.append("description", formData.description)

            if (imageFile) {
                data.append("image", imageFile)
            }

            const response = await axios.put('/api/product', data, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            })

            toast.success(response.data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center gap-6 p-4'>
            <h1 className='text-center text-2xl font-semibold'>Update Product</h1>
            <form onSubmit={SubmitUpdateProduct} className='w-full flex flex-col items-center gap-4'>

                {/* Image Upload Input */}
                <div className='w-full flex flex-col gap-1'>
                    <label className='font-medium'>Product Image (Leave blank to keep current)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none bg-white'
                    />
                    {product?.image && <p className='text-xs text-gray-500'>Current: {product.image.split('/').pop()}</p>}
                </div>

                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="name">Name *</label>
                    <input type="text" name='name' id='name' required value={formData.name} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none' />
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="category_id">Category *</label>
                        <select name='category_id' id='category_id' required value={formData.category_id} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none'>
                            <option value="">select</option>
                            {categories.map((category) => (
                                <option value={category.category_id} key={category.category_id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="brand_id">Brand</label>
                        <select name='brand_id' id='brand_id' value={formData.brand_id} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none'>
                            <option value="">select</option>
                            {brands.map((brand) => (
                                <option value={brand.brand_id} key={brand.brand_id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="barcode">Barcode *</label>
                        <input type="text" name='barcode' id='barcode' required value={formData.barcode} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="unit">Unit *</label>
                        <input type="text" name='unit' id='unit' required value={formData.unit} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none' />
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="stock">Stock *</label>
                        <input type="number" step="0.01" name='stock' id='stock' required value={formData.stock} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="purchase_price">Purchase Price *</label>
                        <input type="number" step="0.01" name='purchase_price' id='purchase_price' required value={formData.purchase_price} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none' />
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="sale_price">Sale Price *</label>
                        <input type="number" step="0.01" name='sale_price' id='sale_price' required value={formData.sale_price} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="discount_price">Discount Price</label>
                        <input type="number" step="0.01" name='discount_price' id='discount_price' value={formData.discount_price} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="wholesale_price">Wholesale Price *</label>
                        <input type="number" step="0.01" name='wholesale_price' id='wholesale_price' required value={formData.wholesale_price} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none' />
                    </div>
                </div>

                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="description">Description *</label>
                    <textarea name="description" id="description" required value={formData.description} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none min-h-[80px]'></textarea>
                </div>

                <button
                    disabled={loading}
                    className='w-full md:w-auto px-12 py-2 rounded-full bg-sky-600 text-white font-bold cursor-pointer hover:bg-sky-500 disabled:bg-gray-400'
                    type='submit'
                >
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    )
}

export default UpdateProductForm