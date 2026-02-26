
import Logout from '@/components/buttons/Logout'
import { isLogin } from '@/lib/middleware'
import Link from 'next/link'
import React from 'react'

const Profile = async () => {
  const auth = await isLogin()
  const data = auth.payload


  return (
    <div className='w-full min-h-screen flex items-center justify-center p-1 sm:p-4'>
      <div className='w-full  border border-orange-400 min-h-[60vh]  rounded-lg flex flex-col items-center p-4 justify-between'>

        <div className='flex flex-col items-center justify-center gap-2'>

          <h1 className='text-2xl text-center'>Profile</h1>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-semibold'>{data?.name}</h1>
            <p className='opacity-60'>{data?.role}</p>

          </div>
          <div className='w-auto grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-2 border border-orange-300 rounded-lg flex flex-col gap-2'>
              <p className='w-full text-center border-b-2 opacity-30'>Phone</p>
              <p>{data?.phone || '....'}</p>
            </div>
            <div className='p-2 border border-orange-300 rounded-lg flex flex-col gap-2'>
              <p className='w-full text-center border-b-2 opacity-30'>Email</p>
              <p>{data?.email || '....'}</p>
            </div>
            <Logout/>


          </div>
        </div>
      </div>

    </div>
  )
}

export default Profile
