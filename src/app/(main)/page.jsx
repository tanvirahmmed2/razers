
import AllCategories from '@/components/page/AllCategories'
import Intro from '@/components/page/Intro'
import LatestProducts from '@/components/page/LatestProducts'
import Service from '@/components/page/Service'
import StoreVisit from '@/components/page/StoreVisit'
import Support from '@/components/page/Support'
import TopProducts from '@/components/page/TopProducts'
import Reviews from '@/components/pages/Reviews'
import React from 'react'

const MainPage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <Intro />
      <TopProducts/>
      <Service/>
      <LatestProducts/>
      <AllCategories/>
      <Reviews />
      <StoreVisit/>
      <Support />
    </div>
  )
}

export default MainPage
