import React from 'react'

export const metadata={
    title:'Search Products',
    description:"Search your favourite products"
}
const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
