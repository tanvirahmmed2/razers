import { isUserLogin } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
    title: 'Staff Login | Nizam Varieties Store',
    description: 'Sign in to access the Nizam Varieties Store management dashboard.',
}

const LoginLayout = async ({ children }) => {
    const auth = await isUserLogin()
    if (auth.success) return redirect('/dashboard')
    return <>{children}</>
}

export default LoginLayout
