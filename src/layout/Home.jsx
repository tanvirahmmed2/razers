import React from 'react'
import { Link } from 'react-router-dom'
import About from '../pages/About'
import Latest from '../pages/Latest'
import Intro from '../pages/Intro'

const Home = () => {
    return (
        <div className='w-full flex flex-col items-center justify-center gap-6'>
            <Intro/>
            <Latest />
            <Link to='/allshoes' className='p-1 px-3 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-lg'>Explore more</Link>
            <About />
        </div>
    )
}

export default Home
