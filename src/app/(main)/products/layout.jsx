import React from 'react'

export const metadata={
    title:'Products',
    description:'Products site'
}


const Menuayout = async({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default Menuayout
