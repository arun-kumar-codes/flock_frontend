"use client"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import img from "@/assets/profile.png"
import {
  UsersIcon,
  FileTextIcon,
  VideoIcon,
  HomeIcon,
  LayersIcon,
  LogOutIcon,
  UserRoundCheck,
  Menu,
} from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { logOut } from "@/slice/userSlice"

const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Blogs", href: "/admin/blogs", icon: FileTextIcon },
  { name: "Videos", href: "/admin/videos", icon: VideoIcon },
  { name: "RPM", href: "/admin/rpm", icon: UserRoundCheck },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector((state: any) => state.user)

  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(!window.matchMedia("(min-width: 768px)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleMouseEnter = () => {
    if (!isMobile) setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    if (!isMobile) setIsExpanded(false)
  }

  const toggleMobileSidebar = () => {
    if (isMobile) setIsExpanded(prev => !prev)
  }

  const handleLogout = () => {
    dispatch(logOut())
    router.push("/login")
  }

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 bg-white shadow rounded-md p-2"
        >
          <Menu className="w-6 h-6 text-purple-600" />
        </button>
      )}

      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? "w-64" : "w-16"}
          ${isMobile && !isExpanded ? "w-0" : ""}
          flex flex-col border-r border-gray-200 overflow-hidden fixed md:static h-full z-40`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-gray-200 px-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-14 h-8 rounded-lg">
            </div>
            {isExpanded && (
              <span className="font-bold text-xl text-gray-800">Flock</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigationItems.map(item => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && setIsExpanded(false)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200
                  ${isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={img}
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isExpanded && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}
            </div>

            {/* Logout button: show ONLY when sidebar is expanded */}
              {isExpanded && (
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-md"
                  title="Logout"
                >
                  <LogOutIcon className="w-5 h-5" />
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  )
}
