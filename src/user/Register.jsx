import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:5000/user/register', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const data = await res.json()
            console.log(data)

            if (data.success) {
                alert('Registration successful')
                setUser({ name: '', email: '', password: '' })
            } else {
                alert(data.message || 'Registration failed')
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        }

    }


    return (
        <section className='w-full h-auto my-20 flex items-center justify-center'>
            <div className='w-auto h-auto p-4 flex flex-col lg:flex-row items-center justify-center gap-6 bg-sky-100 rounded-lg'>
                <div className='w-auto flex flex-col items-center justify-center gap-2'>
                    <h1 className='text-2xl '>Welcome  to <span className='text-3xl font-bold'>Razers</span></h1>
                    <p>register and enjoy our premium services</p>
                    <Link to='/login' className='mt-6 text-green-500 italic'>already registered?</Link>
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4 lg:border-l-2 pl-4 border-white'>

                    <div className='w-auto flex flex-col items-start justify-center gap-2'>
                        <label htmlFor="name">name</label>
                        <input type="text" name='name' id='name' className='p-1 px-2 border-2 outline-none rounded-lg' value={user.name} onChange={handleChange} />
                    </div>
                    <div className='w-auto flex flex-col items-start justify-center gap-2'>
                        <label htmlFor="email">email</label>
                        <input type="email" name='email' id='email' className='p-1 px-2 border-2 outline-none rounded-lg' value={user.email} onChange={handleChange} />
                    </div>
                    <div className='w-auto flex flex-col items-start justify-center gap-2'>
                        <label htmlFor="password">password</label>
                        <input type="password" name='password' id='password' className='p-1 px-2 border-2 outline-none rounded-lg' value={user.password} onChange={handleChange} />
                    </div>
                    <button type='submit' className='p-1 px-2 bg-white text-sky-600 font-semibold rounded-lg'>Continue</button>

                </form>

            </div>
        </section>
    )
}

export default Register
