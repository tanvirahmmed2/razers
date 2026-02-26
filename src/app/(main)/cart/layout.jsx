import React from 'react'
export const metadata={
    title:'Cart',
    description:'Cart Page'
}

const CartLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default CartLayout
