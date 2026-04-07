'use client'
import React, { useEffect, useState } from 'react'

const SearchPage = () => {
    
      const [products, setProducts] = useState([])
      const [searchTerm, setSearchTerm] = useState('')

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
    <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='px-2 w-40 md:w-100 p-1 outline-none bg-white text-black'
          placeholder='search'
        />
      
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

export default SearchPage
