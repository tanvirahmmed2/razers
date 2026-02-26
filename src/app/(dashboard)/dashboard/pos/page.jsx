'use client'

import Item from "@/components/card/Item"
import AddCutomerForm from "@/components/forms/AddCustomerForm"
import { Context } from "@/components/helper/Context"
import SalesCart from "@/components/page/SalesCart"
import axios from "axios"
import { useContext, useEffect, useState } from "react"



const PosPage = () => {

  const { isCustomerBox, categories } = useContext(Context)
  const [categoryId, setCategoryId] = useState('')
  const [products, setProducts] = useState([])

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value)
  }

  useEffect(()=>{
    if (!categoryId) {
    setProducts([]); 
    return;
  }
    const fetchProduct=async()=>{
      try {
        const res= await axios.get(`/api/product/category/${categoryId}`)
        setProducts(res.data.payload)
      } catch (error) {
        setProducts([])
        
      }
    }
    fetchProduct()
  },[categoryId])
  
  return (
    <div className="w-full p-1 sm:p-4 flex flex-col md:flex-row relative">
      <div className={`absolute ${isCustomerBox ? 'block' : 'hidden'} z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white min-w-100 border p-4 rounded-xl shadow-lg`}>
        <AddCutomerForm />
      </div>
      <SalesCart />
      <div className="flex-1 flex flex-col items-center gap-4">
        <select
          onChange={handleCategoryChange}
          className='w-full border p-2 border-black/30 outline-none'
        >
          <option value="" className="text-black">Categories</option>
          {categories.length > 0 && categories.map((cat) => (
            <option value={cat.category_id} key={cat.category_id} className="text-black">
              {cat?.name}
            </option>
          ))}
        </select>
        <div>
          {
            products.length < 1 ? <p className="">No product found</p> :

              <div className='w-full grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-screen overflow-y-scroll'>
                {
                 products && products.map(product => (
                    <Item product={product} key={product.product_id} />
                  ))
                }
              </div>}
        </div>
      </div>

    </div>
  )
}

export default PosPage