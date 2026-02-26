import React from 'react'

export const metadata={
    title:'Help | Dashboard',
    description:'Help Page'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
