import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'
import Cart from './pages/Cart'
import About from './pages/About'
import Home from './layout/Home'

const App = () => {
  return (
    <div className='w-full overflow-x-hidden relative'>
      <Navbar />
      <div className='w-full min-h-screen flex items-center justify-center'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </div>


      <Footer />
    </div>
  )
}

export default App
