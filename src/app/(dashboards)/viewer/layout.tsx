"use client"

import type React from "react"

import { useState } from "react"
import { CustomSidebar } from "@/components/viewer/app-sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomSidebar onExpandChange={setIsSidebarExpanded} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarExpanded ? "ml-64" : "ml-16"}`}>
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
