"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  Video,
  FileText,
  Building2,
  LogOutIcon,
  UserIcon,
  BellIcon,
  SearchIcon,
  SettingsIcon,
  PenToolIcon,
} from "lucide-react"
import profileImg from "@/assets/profile.png"
import { logOut } from "@/slice/userSlice"
import { Suspense } from "react"

const navigationItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Blogs",
    href: "/dashboard/blogs",
    icon: FileText,
  },
  {
    name: "Videos",
    href: "/dashboard/videos",
    icon: Video,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDetails(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    dispatch(logOut())
    router.push("/login")
  }

  const currentPageName = navigationItems.find((item) => item.href === pathname)?.name || "Dashboard"

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-16"
        } flex flex-col border-r border-gray-200 overflow-hidden`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo/Brand */}
        <div className="flex items-center h-16 border-b border-gray-200 px-3 min-w-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {isExpanded && <span className="font-bold text-xl text-gray-800 whitespace-nowrap">Flock</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-hidden">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 group min-w-0 ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"}`}
                    />
                  </div>
                  {isExpanded && <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>}
                </Link>
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                    {item.name}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Creator Status */}
        <div className="px-3 py-2 border-t border-gray-200">
          <div className="flex items-center min-w-0">
            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
            {isExpanded && <span className="ml-3 text-sm text-gray-600 whitespace-nowrap">Creator Mode</span>}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-gray-200 relative group">
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={profileImg || "/placeholder.svg"}
                alt="User Avatar"
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {isExpanded && (
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user?.username || user?.name || "Creator"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "creator@flock.com"}</p>
              </div>
            )}
          </div>
          {/* Tooltip for user info when collapsed */}
          {!isExpanded && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 bottom-3">
              <div className="font-medium">{user?.username || user?.name || "Creator"}</div>
              <div className="text-xs opacity-75">{user?.email || "creator@flock.com"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4 flex items-center justify-between">
              {/* Left Section - Current Page Name */}
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-800">{currentPageName}</h1>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                  />
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full">
                      <span className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                      <span className="relative w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      </span>
                    </span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-gray-800">Your blog post was approved</p>
                          <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-gray-800">New comment on your video</p>
                          <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-gray-800">Your content reached 100 views</p>
                          <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Creator Badge */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  <PenToolIcon className="w-4 h-4" />
                  <span>Creator</span>
                </div>

              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </Suspense>
    </div>
  )
}
