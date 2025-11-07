"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { CustomSidebar } from "@/components/viewer/app-sidebar"
import { HeaderNavbar } from "@/components/viewer/app-header"
import Loader from "@/components/Loader"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false) // desktop
  const [mobileOpen, setMobileOpen] = useState(false)              // mobile
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const user = useSelector((state: any) => state.user)

  // initial auth check
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (user.role === "viewer" || !token) {
      setIsLoading(false)
    }
  }, [])

  // close mobile menu on route change (and when navigating from inside the sidebar)
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false)
  }, [pathname])

  // lock body scroll while mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  if (isLoading) return <Loader />

  return (
    <div className="min-h-screen theme-bg-primary hide-scrollbar">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <CustomSidebar onExpandChange={setIsSidebarExpanded} />
      </div>

      {/* Mobile slide-in sidebar (always expanded) */}
<div
  className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300
              theme-bg-primary theme-text-primary
              ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
  aria-hidden={!mobileOpen}
>
  <CustomSidebar forceOpen />  {/* THIS is the key line */}
</div>

      {/* Mobile backdrop (click to close) */}
      {mobileOpen && (
        <button
          aria-label="Close sidebar backdrop"
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button (Menu ↔ X) */}
      <button
        type="button"
        className="lg:hidden fixed top-3 left-3 z-50 inline-flex h-10 w-10 items-center justify-center rounded-xl
                   theme-bg-card theme-text-primary shadow-md active:scale-95 transition"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Header */}
      <HeaderNavbar isSidebarExpanded={isSidebarExpanded} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out pt-10
                    ml-0
                    ${isSidebarExpanded ? "lg:ml-64" : "lg:ml-16"}`}
      >
        <main className="min-h-screen p-2">{children}</main>
      </div>
    </div>
  )
}
