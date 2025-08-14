"use client"

import type React from "react"
import { useState } from "react"
import { CustomSidebar } from "@/components/viewer/app-sidebar"
import { HeaderNavbar } from "@/components/viewer/app-header"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const user = useSelector((state: any) => state.user)

  if(user.role==="") return <Loader></Loader>;

  if (user.isLogIn&&(user.loading || user.role.toLowerCase() !== "viewer")) return <Loader />

  return (
    <div className="min-h-screen theme-bg-primary">
      <CustomSidebar onExpandChange={setIsSidebarExpanded} />
      <HeaderNavbar isSidebarExpanded={isSidebarExpanded} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out pt-16 ${isSidebarExpanded ? "ml-64" : "ml-16"}`}>
        <main className="min-h-screen p-6">{children}</main>
      </div>
    </div>
  )
}
