import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'
import Cart from './pages/Cart'
import About from './pages/About'
import Home from './layout/Home'

const App = () => {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </div>


      <Footer />
    </>
  )
}

export default App
