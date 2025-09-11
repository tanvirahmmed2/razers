import React, { useContext } from 'react'
import { ShopContext } from '../components/ContextProvider'
import Shoes from './Shoes'

const Latest = () => {
    const {data} = useContext(ShopContext)
    const latestData= data.slice(-10)
  return (
    <div className='w-full flex flex-col items-center justify-center gap-6'>
        <h1 className='text-3xl font-semibold'>Latest Collections</h1>
        <div className='w-full flex flex-wrap gap-4 justify-center'>
            {
            latestData.map((shoe)=>{
                const {name, id, old_price, new_price, image}= shoe
                return(
                    <Shoes name={name} old_price={old_price} new_price={new_price} image={image} key={id} id={id}/>
                )
            })
        }
        </div>
        
      
    </div>
  )
}

export default Latest
