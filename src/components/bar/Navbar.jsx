'use client'
import axios from 'axios';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context';
import { useRouter } from 'next/navigation'; // Import the router

const Navbar = () => {
  const { categories } = useContext(Context)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter(); // Initialize the router

  // Handle Category Redirect
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (categoryId) {
      router.push(`/products/category/${categoryId}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.length < 2) {
        setProducts([]);
        return;
      }
      try {
        const response = await axios.get(`/api/product/search?q=${searchTerm}`, { withCredentials: true })
        setProducts(response.data.payload)
      } catch (error) {
        console.log(error)
        setProducts([])
      }
    }
    fetchData()
  }, [searchTerm])

  return (
    <div className='w-full relative'>
      <nav className='w-full flex flex-row items-center justify-between fixed top-0 right-0 h-14 px-4 bg-linear-to-br from-sky-600 to-blue-800 text-white z-50'>
        <Link href={'/'} className='text-lg sm:text-2xl font-semibold'>Nizam Varieties Store</Link>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='px-2 w-40 md:w-100 p-1 outline-none bg-white text-black'
          placeholder='search'
        />

        <div className='w-auto hidden sm:flex flex-row items-center justify-center gap-2'>
          <select
            onChange={handleCategoryChange}
            className='bg-transparent border border-white/40 rounded px-1 outline-none text-white cursor-pointer'
          >
            <option value="" className="text-black">Categories</option>
            {categories.length > 0 && categories.map((cat) => (
              <option value={cat.category_id} key={cat.category_id} className="text-black">
                {cat?.name}
              </option>
            ))}
          </select>

          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/offers'}>Offers</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/products'}>Products</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/cart'}>Cart</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/login'}>Login</Link>
        </div>
      </nav>

      {products.length > 0 && searchTerm.length > 1 && (
        <div className='fixed w-full z-50 top-14 flex items-center justify-center '>
          <div className='w-full sm:w-1/2 mx-auto flex flex-col items-center bg-white shadow-xl border border-gray-200 max-h-100 overflow-y-auto'>
            {products.map((product) => (
              <Link
                onClick={() => setSearchTerm('')}
                href={`/products/${product.slug}`}
                key={product.slug}
                className="w-full px-4 py-3 border-b border-gray-100 text-black hover:bg-sky-50 block transition-colors"
              >
                {product.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar