"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import Image from "next/image"
import { Home, Video, FileText, Building2, LogOutIcon, PenToolIcon, Building2Icon, FileChartColumnIncreasing, BadgeDollarSign } from "lucide-react"
import profileImg from "@/assets/profile.png"
import { logOut } from "@/slice/userSlice"
import { Suspense } from "react"
import Loader2 from "@/components/Loader2"

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
  {
    name: "Followers",
    href: "/dashboard/followers",
    icon: Building2Icon,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: FileChartColumnIncreasing,
  },
  {
    name: "Payout",
    href: "/dashboard/payout",
    icon: BadgeDollarSign
  }
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const logoutRef = useRef<HTMLDivElement>(null)

  //console.log(user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDetails(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setShowLogoutConfirm(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMouseEnter = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsExpanded(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsExpanded(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    dispatch(logOut())
    router.push("/login")
    setShowLogoutConfirm(false)
  }



  const currentPageName = navigationItems.find((item) => item.href === pathname)?.name || "Dashboard";

  if (user.loading || user.role.toLowerCase() !== "creator") return <Loader2 />

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-16"
          } flex flex-col border-r border-gray-200 overflow-hidden`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 group min-w-0 ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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



        {/* User Profile */}
        <div className="p-3 border-t border-gray-200 relative group " onClick={() => router.push("/dashboard/profiles")}>
          <div className="flex items-center min-w-0 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={user.profileImage || profileImg}
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

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200 relative" ref={logoutRef}>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group min-w-0"
          >
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
              <LogOutIcon className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
            </div>
            {isExpanded && <span className="ml-3 font-medium whitespace-nowrap">Logout</span>}
          </button>

          {/* Tooltip for collapsed state */}
          {!isExpanded && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 bottom-3">
              Logout
            </div>
          )}

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LogOutIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                      <p className="text-sm text-gray-600">Are you sure you want to sign out?</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden"  >
                        <Image
                          src={user.profileImage || profileImg}
                          alt="User Avatar"
                          width={40}
                          height={40}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.username || user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
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


                {/* Creator Badge */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  <PenToolIcon className="w-4 h-4" />
                  <span>Creator</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto md:p-6">{children}</main>
        </div>
      </Suspense>
    </div>
  )
}
