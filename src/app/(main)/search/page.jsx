'use client'
import Item from '@/components/card/Item'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const SearchProduct = () => {
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
    <div className='w-full flex flex-col items-center gap-4 p-4'>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='px-2 w-full md:w-1/2 rounded-2xl p-1 outline-none border bg-white text-black border-blue-500'
        placeholder='search'
      />
      {
        searchTerm.length===0? <p>Please search product</p>: <div>
          {
            products.length===0? <p>No product found</p>:<div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {
                products.map((item)=>(
                  <Item key={item.product_id} product={item}/>
                ))
              }
            </div>
          }
        </div>
      }
    </div>
  )
}

export default SearchProduct
