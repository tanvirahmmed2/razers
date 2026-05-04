
import Intro from '@/components/page/Intro'
import LatestProducts from '@/components/page/LatestProducts'
import Service from '@/components/page/Service'
import StoreVisit from '@/components/page/StoreVisit'
import Support from '@/components/page/Support'
import TopCategories from '@/components/page/TopCategories'
import React from 'react'

const MainPage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <Intro />
      <LatestProducts/>
      <Service/>
      <TopCategories/>
      <StoreVisit/>
      <Support />
    </div>
  )
}

export default MainPage
