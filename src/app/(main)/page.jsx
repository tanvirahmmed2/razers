
import Intro from '@/components/page/Intro'
import StoreVisit from '@/components/page/StoreVisit'
import Support from '@/components/page/Support'
import TopCategories from '@/components/page/TopCategories'
import React from 'react'

const MainPage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <Intro />
      <TopCategories/>
      <StoreVisit/>
      <Support />
    </div>
  )
}

export default MainPage
