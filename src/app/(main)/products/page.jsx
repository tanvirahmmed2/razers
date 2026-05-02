'use client'

import Item from "@/components/card/Item"
import { Context } from "@/components/helper/Context"
import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronLeft, ChevronRight, Loader2, LayoutGrid } from "lucide-react"

const ProductsPage = () => {
  const { categories } = useContext(Context)
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
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
      } finally {
        setLoading(false)
      }
    };

    fetchProducts();
  }, [category, page])

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Our Collection</h1>
              <p className="text-slate-400 text-xs font-medium">Browse through our premium items</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-56">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                name="category" 
                id="category" 
                onChange={handleCategoryChange} 
                value={category} 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-primary transition-all font-bold text-slate-600 appearance-none cursor-pointer text-sm"
              >
                <option value="">All Categories</option>
                {categories?.map(cat => (
                  <option value={cat.category_id} key={cat.category_id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Discovering Products...</p>
          </div>
        ) : products.length < 1 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200"
          >
            <p className="text-slate-400 text-lg font-bold">No products found for this category.</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-8">
            <motion.div 
              layout
              className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            >
              <AnimatePresence mode='popLayout'>
                {products.map((product) => (
                  <Item product={product} key={product.product_id} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className="p-1.5 text-slate-600 hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(num => {
                      if (page <= 3) return num <= 5;
                      if (page >= totalPages - 2) return num >= totalPages - 4;
                      return num >= page - 2 && num <= page + 2;
                    })
                    .map(num => (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                          page === num 
                            ? 'bg-primary text-white shadow-sm' 
                            : 'text-slate-400 hover:bg-sky-50 hover:text-primary'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                  className="p-1.5 text-slate-600 hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
