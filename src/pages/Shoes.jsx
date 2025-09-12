import React from 'react'
import { Link } from 'react-router-dom'
import {motion} from 'framer-motion'

const Shoes = (props) => {
  const { name, id, new_price, old_price, image } = props
  return (
    <motion.div initial={{opacity: 0, scale:0.9}} whileInView={{opacity: 1, scale:1}} transition={{duration: 0.6}} className='md:w-[250px] md:h-[300px] w-[150px] h-[200px] rounded-lg relative bg-gray-500 group shadow-sm overflow-hidden shadow-blue-400'>
      <img src={image} alt="" className='w-[250px] h-[300px] object-cover group-hover:scale-110 group-hover:rotate-2 transition duration-500' />
      <div className=' w-full h-auto hidden transition duration-500 flex-col items-center justify-center bg-white absolute bottom-0 p-2 group-hover:flex'>
        
        <p className='font-semibold text-lg flex flex-row gap-2 items-center justify-center line-through text-red-500'><span className='text-xs'>$</span>{old_price}</p>
        <p className='font-semibold text-lg flex flex-row gap-2 items-center justify-center'><span className='text-xs'>$</span>{new_price}</p>
        <Link to={`/shoe/${id}`} className='font-semibold'>{name}</Link>
      </div>

    </motion.div>
  )
}

export default Shoes
