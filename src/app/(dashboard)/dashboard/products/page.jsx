'use client'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link';
import { toast } from 'react-toastify';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';

const ProductListPage = () => {
    const [products, setProducts] = useState([])
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const loadData = useCallback(async (page = 1, search = '') => {
        setLoading(true)
        try {
            let url = search
                ? `/api/product/search?q=${search}`
                : `/api/product?page=${page}`;

            const res = await axios.get(url, { withCredentials: true });

            if (res.data.success) {
                setProducts(res.data.payload || [])
                setPagination(res.data.pagination || { currentPage: 1, totalPages: 1 })
            }
        } catch (error) {
            console.error("Error fetching products", error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadData(1, searchTerm)
        }, 400)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, loadData])

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await axios.delete(`/api/product`, { data: { id }, withCredentials: true });
            if (res.data.success) {
                toast.success("Product deleted");
                setProducts(prev => prev.filter(p => p.product_id !== id));
            }
        } catch (error) {
            toast.error("Failed to delete product");
        }
    }

    return (
        <div className="w-full text-[8px] sm:text-base mx-auto p-1 sm:p-4 bg-white min-h-screen">

            <div className="mb-10 pl-6 flex justify-between items-center">
                <h1 className="sm:text-xl font-black uppercase">Product List</h1>
                <input
                    type="text"
                    placeholder="search..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className='w-auto border border-sky-400 px-4 p-1 rounded-sm outline-none '
                />

                <div className="text-right">
                    <span className="text-[10px] font-black uppercase bg-black text-white px-3 py-1">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                </div>
            </div>

            <div className="w-full grid grid-cols-8 border-b-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest mb-1">
                <div className="col-span-4">Product Name</div>
                <div className="col-span-1 text-center">Price</div>
                <div className="col-span-1 text-center">Stock</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>

            {loading ? (
                <div className="space-y-2 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded-none"></div>
                    ))}
                </div>
            ) : (
                <div className="w-full flex flex-col">
                    {products.map((item) => (
                        <div key={item.product_id} className="w-full grid grid-cols-8 border-b border-gray-100 px-4 py-3 items-center hover:bg-gray-300 transition-colors group   rounded-xl even:bg-gray-200">
                            <div className="col-span-4 flex flex-col">
                                <Link className='font-bold text-gray-800 hover:text-sky-600' href={`/products/${item.slug}`}>
                                    {item.name}
                                </Link>
                                <span className='text-[9px] text-gray-400 font-mono'>ID: {item.product_id}</span>
                            </div>

                            <p className="col-span-1 text-center font-black text-gray-700">
                                ৳ {parseFloat(item.sale_price).toFixed(2)}
                            </p>

                            <div className="col-span-1 text-center">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded ${item.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.stock} IN STOCK
                                </span>
                            </div>

                            <div className="col-span-2 flex justify-end ">
                                <Link href={`/dashboard/products/${item.slug}`} className='p-2 hover:bg-sky-100 text-sky-600 rounded-full transition-all'>
                                    <MdEdit size={18} />
                                </Link>
                                <button onClick={() => handleDelete(item.product_id)} className='p-2 hover:bg-red-100 text-red-500 rounded-full transition-all'>
                                    <MdDeleteOutline size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && products.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-200">
                    <p className="font-black uppercase text-gray-300 text-2xl tracking-tighter">No items found</p>
                </div>
            )}

            {!searchTerm && pagination.totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => loadData(pagination.currentPage - 1)}
                        className="px-4 py-2 border-2 border-black text-[10px] font-black uppercase hover:bg-black hover:text-white disabled:opacity-20 transition-all"
                    >
                        Prev
                    </button>

                    <div className="flex items-center gap-1">
                        {/* Always Show First Page if we are far from it */}
                        {pagination.currentPage > 2 && (
                            <>
                                <button
                                    onClick={() => loadData(1)}
                                    className="w-10 h-10 border-2 border-black text-xs font-black hover:bg-gray-100"
                                >
                                    1
                                </button>
                                {pagination.currentPage > 3 && <span className="px-1 font-bold">...</span>}
                            </>
                        )}

                        {/* Sliding Window: Show Current, One Before, and One After */}
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(num => num >= pagination.currentPage - 1 && num <= pagination.currentPage + 1)
                            .map((num) => (
                                <button
                                    key={num}
                                    onClick={() => loadData(num)}
                                    className={`w-10 h-10 border-2 border-black text-xs font-black transition-all ${pagination.currentPage === num ? 'bg-black text-white' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}

                        {/* Always Show Last Page if we are far from it */}
                        {pagination.currentPage < pagination.totalPages - 1 && (
                            <>
                                {pagination.currentPage < pagination.totalPages - 2 && <span className="px-1 font-bold">...</span>}
                                <button
                                    onClick={() => loadData(pagination.totalPages)}
                                    className="w-10 h-10 border-2 border-black text-xs font-black hover:bg-gray-100"
                                >
                                    {pagination.totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Next Button */}
                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => loadData(pagination.currentPage + 1)}
                        className="px-4 py-2 border-2 border-black text-[10px] font-black uppercase hover:bg-black hover:text-white disabled:opacity-20 transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProductListPage