'use client'

import Item from "@/components/card/Item"
import axios from "axios"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

const Products = () => {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/product/offer', {
          params: {
            page: page
          }
        });
        if (response.data.success) {
          setProducts(response.data.payload);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.log(error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    };

    fetchOffers();
  }, [page])

  return (
    <section className="w-full py-12 px-4 bg-slate-50/50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className='text-3xl sm:text-4xl font-black text-slate-900 tracking-tight'>
            Exclusive <span className="text-primary">Offers</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full"></div>
          <p className="text-slate-400 text-sm font-medium">Handpicked deals just for you</p>
        </div>

        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-slate-400 text-sm font-medium">Refreshing our collection...</p>
          </div>
        ) : products.length < 1 ? (
          <div className="w-full py-12 text-center glass rounded-2xl">
            <p className="text-slate-400 text-base font-medium">No products found at the moment.</p>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            >
              <AnimatePresence mode='popLayout'>
                {products.map((product, index) => (
                  <Item product={product} key={product.product_id} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <div className="flex items-center gap-1 mt-8 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className="p-1.5 text-slate-600 hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                aria-label="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
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
                aria-label="Next Page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Products
