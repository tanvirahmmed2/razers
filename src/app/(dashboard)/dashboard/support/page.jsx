'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const SupportPage = () => {
    const [supports, setSupports] = useState([])

    useEffect(() => {
        const fetchSupport = async () => {
            try {
                const response = await axios.get('/api/support', { withCredentials: true })
                setSupports(response.data.payload)
            } catch (error) {
                console.log(error)
                setSupports([])
            }
        }
        fetchSupport()
    }, [])

    const removeSupport = async (id) => {
        try {
            const response = await axios.delete('/api/support', { data: { id }, withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to remove support")

        }
    }
    
    return (
        <div className='w-full flex flex-col items-center justify-center gap-6 p-4 '>
            {
                supports.length > 0 ? <div className='w-full flex flex-col items-center justify-center gap-5'>
                    <h1>Support Messages</h1>
                    {
                        supports.length>0 && supports.map((e) => (
                            <div key={e.support_id} className='w-full grid grid-cols-3 gap-2 p-2 border'>
                                <div className='w-full flex flex-col gap-2'>
                                    <p>{e.name}</p>
                                    <p>{e.email}</p>
                                </div>
                                <div className='w-full flex flex-col gap-2'>
                                    <p>{e.subject}</p>
                                    <p>{e.message}</p>
                                </div>
                                <button className='cursor-pointer' onClick={()=>removeSupport(e.support_id)}>Remove</button>
                            </div>
                        ))
                    }

                </div> : <p>No message found</p>
            }


        </div>
    )
}

export default SupportPage
