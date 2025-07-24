"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import AdminHeader from "@/components/admin/AdminHeader"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.push("/login")
      return
    }

    if (user.role?.toLowerCase() === "creator") {
      router.push("/dashboard")
      return
    } else if (user.role?.toLowerCase() === "viewer") {
      router.push("/viewer")
      return
    }
  }, [router, user.role])

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
