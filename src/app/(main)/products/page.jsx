'use client'

import Item from "@/components/card/Item"
import { Context } from "@/components/helper/Context"
import axios from "axios"
import { useEffect, useState, useContext } from "react"

const Products = () => {
  const { categories } = useContext(Context)
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product/filter', {
          params: {
            category: category,
            page: page
          }
        });
        setProducts(response.data.payload);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.log(error)
        setProducts([])
      }
    };

    fetchProducts();
  }, [category, page])

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  }

  return (
    <div className="w-full p-4 min-h-screen">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col sm:flex-row items-start gap-4 p-2 sm:items-center justify-around shadow">
          <h1 className="w-full sm:w-auto outline-none text-center">Filter</h1>
          {
            categories && <select name="category" id="category" onChange={handleCategoryChange} value={category} className="w-full sm:w-auto outline-none px-4 cursor-pointer">
              <option value="" className="cursor-pointer ">All Product</option>
              {
                categories.map(cat => (
                  <option value={cat.category_id} key={cat.category_id} className="cursor-pointer ">{cat.name}</option>
                ))
              }
            </select>
          }
        </div>
        {
          products.length < 1 ? <p className="">No product found</p> :
            <>
              <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {
                  products.map(product => (
                    <Item product={product} key={product.product_id} />
                  ))
                }
              </div>

              <div className="flex items-center gap-2 mt-8">
               
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"
                >
                  Prev
                </button>

                {/* First Page (Optional, but helpful) */}
                {page > 2 && (
                  <>
                    <button onClick={() => setPage(1)} className="w-10 h-10 border rounded-md">1</button>
                    {page > 3 && <span className="px-1">...</span>}
                  </>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(num => num >= page - 1 && num <= page + 1) // Only show current and neighbors
                  .map(num => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-10 h-10 border rounded-md font-medium transition-all ${page === num ? 'bg-black text-white border-black' : 'hover:bg-gray-100'
                        }`}
                    >
                      {num}
                    </button>
                  ))}

                {page < totalPages - 1 && (
                  <>
                    {page < totalPages - 2 && <span className="px-1">...</span>}
                    <button onClick={() => setPage(totalPages)} className="w-10 h-10 border rounded-md">
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"
                >
                  Next
                </button>
              </div>
            </>
        }
      </div>
    </div>
  )
}

export default Products