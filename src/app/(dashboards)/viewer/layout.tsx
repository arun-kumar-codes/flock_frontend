"use client"

import type React from "react"
import { useState,useEffect } from "react"
import { CustomSidebar } from "@/components/viewer/app-sidebar"
import { HeaderNavbar } from "@/components/viewer/app-header"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLoading,setIsLoading]=useState(true);
  const user = useSelector((state: any) => state.user);

  useEffect(()=>{
      const token=localStorage.getItem("token");
      if(user.role==="viewer"||!token){
      setIsLoading(false);
     }
  },[]);

  if(isLoading) return <Loader></Loader>;



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
