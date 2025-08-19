"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import AdminHeader from "@/components/admin/AdminHeader"
import AdminSidebar from "@/components/admin/AdminSidebar"
import Loader2 from "@/components/Loader2"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
   if (user.loading || user.role.toLowerCase() !== "admin") return <Loader2/>

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader />
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
