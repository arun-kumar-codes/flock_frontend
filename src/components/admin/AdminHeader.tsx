"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import Image from "next/image"
import { LogOutIcon, ShieldIcon, BellIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react"
import profileImg from "@/assets/profile.png"
import { logOut } from "@/slice/userSlice"

const navigationItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
  { name: "Blogs", href: "/admin/blogs" },
  { name: "Videos", href: "/admin/videos" },
  { name: "Pending", href: "/admin/pending" },
//   { name: "Analytics", href: "/admin/analytics" },
]

interface AdminData {
  email: string
  username: string
  id: string
  imageUrl?: string
}

export default function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  const [adminData] = useState<AdminData>({
    email: "admin@flock.com",
    username: "Administrator",
    id: "admin-1",
    imageUrl: "",
  })

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

  const currentPageName = navigationItems.find((item) => item.href === pathname)?.name || "Admin Panel"

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section - Page Title */}
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
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-colors"
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
                    <p className="text-sm font-medium text-gray-800">New user registered</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Content pending approval</p>
                    <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">System backup completed</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
            <ShieldIcon className="w-4 h-4" />
            <span>Admin</span>
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            {/* <button
              className="flex items-center space-x-3 bg-white rounded-lg p-1 pr-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
              onClick={() => setShowUserDetails(!showUserDetails)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={profileImg || "/placeholder.svg"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-lg object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{adminData.username}</span>
            </button> */}

           
          </div>
        </div>
      </div>
    </header>
  )
}
