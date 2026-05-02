'use client'
import React, { useContext, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Context } from '../helper/Context'
import axios from 'axios'

const UpdateProductForm = ({ product }) => {
    const { categories, brands, variantTypes, variantValues } = useContext(Context)
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        productId: product?.product_id,
        name: product?.name || '',
        category_id: product?.category_id || '',
        sub_category_id: product?.sub_category_id || '',
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

    const [variants, setVariants] = useState(product?.variants || [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    // Filter categories
    const mainCategories = categories?.filter(cat => !cat.parent_id) || [];
    const subCategories = categories?.filter(cat => cat.parent_id && cat.parent_id === parseInt(formData.category_id)) || [];

    const addVariant = () => {
        setVariants([...variants, { sku: '', price: '', stock: '', values: [], image: null }])
    }

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index))
    }

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants]
        if (field === 'image') {
            updated[index][field] = value.target.files[0]
        } else if (field === 'values') {
            // value is the valueId
            if (!updated[index].values) updated[index].values = []
            
            // Extract IDs if values is array of objects (from API)
            let currentIds = updated[index].values.map(v => typeof v === 'object' ? v.value_id : v)
            
            if (currentIds.includes(value)) {
                currentIds = currentIds.filter(id => id !== value)
            } else {
                currentIds = [...currentIds, value]
            }
            updated[index].values = currentIds
        } else {
            updated[index][field] = value
        }
        setVariants(updated)
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

            // Variants Logic
            const variantsToSubmit = variants.map(v => ({
                variant_id: v.variant_id || null,
                sku: v.sku,
                price: parseFloat(v.price),
                stock: parseInt(v.stock),
                image: typeof v.image === 'string' ? v.image : null, // Keep existing image URL if not a new file
                values: v.values.map(val => typeof val === 'object' ? val.value_id : val)
            }))
            data.append('variants', JSON.stringify(variantsToSubmit))

            // Variant Images
            variants.forEach((v, i) => {
                if (v.image && typeof v.image !== 'string') {
                    data.append(`variantImage_${i}`, v.image)
                }
            })

            const response = await axios.put('/api/product', data, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            })

            toast.success(response.data.message)
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Failed to update product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm'>
            <h1 className='text-center text-2xl font-bold text-slate-800 mb-6'>Update Product</h1>
            <form onSubmit={SubmitUpdateProduct} className='flex flex-col gap-6'>

                {/* Image Upload Input */}
                <div className='w-full flex flex-col gap-1.5'>
                    <label className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Product Image (Leave blank to keep current)</label>
                    <div className='w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-slate-50 transition-all'>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className='w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark transition-all cursor-pointer'
                        />
                    </div>
                    {product?.image && <p className='text-[10px] text-slate-400 mt-1 ml-1 font-mono truncate'>Current: {product.image}</p>}
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="name" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Name *</label>
                    <input type="text" name='name' id='name' required value={formData.name} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm' />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="category_id" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Category *</label>
                        <select name='category_id' id='category_id' required value={formData.category_id} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm'>
                            <option value="">Select Category</option>
                            {mainCategories.map((category) => (
                                <option value={category.category_id} key={category.category_id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="sub_category_id" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Sub Category</label>
                        <select name='sub_category_id' id='sub_category_id' value={formData.sub_category_id} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm' disabled={!formData.category_id}>
                            <option value="">Select Sub Category</option>
                            {subCategories.map((category) => (
                                <option value={category.category_id} key={category.category_id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="brand_id" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Brand</label>
                        <select name='brand_id' id='brand_id' value={formData.brand_id} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm'>
                            <option value="">Select Brand</option>
                            {brands.map((brand) => (
                                <option value={brand.brand_id} key={brand.brand_id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="unit" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Unit *</label>
                        <input type="text" name='unit' id='unit' required value={formData.unit} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm' />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="barcode" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Barcode *</label>
                        <input type="text" name='barcode' id='barcode' required value={formData.barcode} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="stock" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Stock *</label>
                        <input type="number" step="0.01" name='stock' id='stock' required value={formData.stock} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm' />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="purchase_price" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Purchase Price *</label>
                        <input type="number" step="0.01" name='purchase_price' id='purchase_price' required value={formData.purchase_price} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold text-slate-700' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="sale_price" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Sale Price *</label>
                        <input type="number" step="0.01" name='sale_price' id='sale_price' required value={formData.sale_price} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold text-slate-700' />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="sale_price" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Sale Price *</label>
                        <input type="number" step="0.01" name='sale_price' id='sale_price' required value={formData.sale_price} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold text-slate-700' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="discount_price" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Discount Price</label>
                        <input type="number" step="0.01" name='discount_price' id='discount_price' value={formData.discount_price} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm text-rose-600 font-bold' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="wholesale_price" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Wholesale Price *</label>
                        <input type="number" step="0.01" name='wholesale_price' id='wholesale_price' required value={formData.wholesale_price} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold text-slate-700' />
                    </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="description" className='text-xs font-bold text-slate-500 uppercase tracking-wider ml-1'>Description *</label>
                    <textarea name="description" id="description" required value={formData.description} onChange={handleChange} className='w-full border border-slate-200 bg-slate-50/30 px-4 py-3 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm h-32 resize-none'></textarea>
                </div>

                {/* Variants Section */}
                <div className='pt-6 border-t border-slate-100'>
                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>Product Variants</h3>
                            <p className='text-[10px] text-slate-400'>Add or update variations of this product</p>
                        </div>
                        <button type='button' onClick={addVariant} className='px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2'>
                            + Add Variant
                        </button>
                    </div>

                    <div className='flex flex-col gap-4'>
                        {variants.map((v, i) => (
                            <div key={i} className='p-4 border border-slate-200 rounded-2xl bg-slate-50/20 flex flex-col gap-4'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full'>Variant #{i + 1}</span>
                                    <button type='button' onClick={() => removeVariant(i)} className='text-rose-500 hover:text-rose-600 text-xs font-bold'>Remove</button>
                                </div>
                                
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <div className='flex flex-col gap-1'>
                                        <label className='text-[10px] font-bold text-slate-500 uppercase ml-1'>SKU / Barcode</label>
                                        <input type="text" value={v.sku} onChange={(e) => handleVariantChange(i, 'sku', e.target.value)} className='w-full border border-slate-200 bg-white px-3 py-2 rounded-lg outline-none focus:border-primary text-xs' placeholder='v-sku-001' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label className='text-[10px] font-bold text-slate-500 uppercase ml-1'>Price (৳)</label>
                                        <input type="number" value={v.price} onChange={(e) => handleVariantChange(i, 'price', e.target.value)} className='w-full border border-slate-200 bg-white px-3 py-2 rounded-lg outline-none focus:border-primary text-xs' placeholder='0.00' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label className='text-[10px] font-bold text-slate-500 uppercase ml-1'>Stock</label>
                                        <input type="number" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} className='w-full border border-slate-200 bg-white px-3 py-2 rounded-lg outline-none focus:border-primary text-xs' placeholder='0' />
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[10px] font-bold text-slate-500 uppercase ml-1'>Select Attributes</label>
                                    <div className='flex flex-wrap gap-2'>
                                        {variantValues.map((val) => {
                                            const currentIds = v.values?.map(valObj => typeof valObj === 'object' ? valObj.value_id : valObj) || []
                                            const isActive = currentIds.includes(val.variant_value_id)
                                            return (
                                                <button
                                                    key={val.variant_value_id}
                                                    type='button'
                                                    onClick={() => handleVariantChange(i, 'values', val.variant_value_id)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                                                        isActive
                                                        ? 'bg-primary border-primary text-white'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-primary'
                                                    }`}
                                                >
                                                    {val.type_name}: {val.value}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label className='text-[10px] font-bold text-slate-500 uppercase ml-1'>Variant Image</label>
                                    <input type="file" onChange={(e) => handleVariantChange(i, 'image', e)} className='text-[10px] text-slate-400' />
                                    {v.image && typeof v.image === 'string' && <p className='text-[8px] text-slate-400'>Current: {v.image}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='pt-6 border-t border-slate-100 flex justify-center'>
                    <button
                        disabled={loading}
                        className='w-full md:w-auto px-12 py-3.5 rounded-xl bg-primary text-white font-bold cursor-pointer hover:bg-primary-dark disabled:bg-slate-300 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2'
                        type='submit'
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdateProductForm
