'use client'
import React from 'react'
import { CiDeliveryTruck } from 'react-icons/ci'
import { GrReturn } from 'react-icons/gr'
import { LiaStoreAltSolid } from 'react-icons/lia'
import { MdVerified } from 'react-icons/md'

const data=[
    {
        id:1,
        icon: <CiDeliveryTruck/>,
        title:'Home Delivery',
        description:'Free on 2000+'
    },
    {
        id:2,
        icon: <LiaStoreAltSolid/>,
        title:'100% Original',
        description:'Authentic guarantee'
    },
    {
        id:3,
        icon: <MdVerified/>,
        title:'Cash On Delivery',
        description:'Outside Dhaka'
    },
    {
        id:4,
        icon: <GrReturn/>,
        title:'7 Days Return',
        description:'Easy policy'
    },
]
const Service = () => {
  return (
    <div className='w-full p-4 py-10 bg-slate-400 grid grid-cols-2 md:grid-cols-4 md:px-10 gap-4 md:gap-8'>
        {
            data.map((d)=>(
                <div key={d.id} className='w-full bg-white p-2 md:p-4 flex flex-col items-center justify-center rounded-2xl text-center'>
                    <p className='text-3xl'>{d.icon}</p>
                    <h1 className='text-base md:text-xl font-semibold'>{d.title}</h1>
                    <p>{d.description}</p>
                </div>
            ))
        }
      
    </div>
  )
}

export default Service
