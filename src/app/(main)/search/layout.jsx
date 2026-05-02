import React from 'react'

export const metadata={
    title:'Search Products',
    description:'Search Products page'
}


const Menuayout = async({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default Menuayout
