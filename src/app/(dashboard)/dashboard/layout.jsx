
import DashboardSidebar from "@/components/bar/DashboardSidebar"
import FooterTagline from "@/components/bar/FooterTagline"
import { isManager } from "@/lib/middleware"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Manage',
  description: 'Management site'
}


const PosLayout = async ({ children, }) => {
  const auth=await isManager()
  if(!auth.success) return redirect('/access')
  return (
    <div className="w-full pl-16 flex flex-col items-center justify-between min-h-screen py-4 gap-4 relative overflow-x-hidden">
      <DashboardSidebar />
      {children}
      <FooterTagline />
    </div>
  )
}

export default PosLayout
