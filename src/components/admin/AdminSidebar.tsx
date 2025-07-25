"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { UsersIcon, FileTextIcon, VideoIcon, ClockIcon, BarChart3Icon, HomeIcon, LayersIcon } from "lucide-react"
import { useSelector } from "react-redux"

const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Blogs", href: "/admin/blogs", icon: FileTextIcon },
  { name: "Videos", href: "/admin/videos", icon: VideoIcon },
  { name: "Pending", href: "/admin/pending", icon: ClockIcon },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3Icon },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const user = useSelector((state: any) => state.user)

  return (
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
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex-shrink-0">
            <LayersIcon className="w-5 h-5 text-white" />
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
                  isActive ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-purple-700" : "text-gray-500 group-hover:text-gray-700"}`}
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

      {/* Admin Status */}
      <div className="px-3 py-2 border-t border-gray-200">
        <div className="flex items-center min-w-0">
          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
          {isExpanded && <span className="ml-3 text-sm text-gray-600 whitespace-nowrap">Admin Panel Active</span>}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-gray-200 relative group">
        <div className="flex items-center min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src="/placeholder.svg?height=32&width=32"
              alt="Admin Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {isExpanded && (
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">Administrator</p>
              <p className="text-xs text-gray-500 truncate">admin@flock.com</p>
            </div>
          )}
        </div>
        {/* Tooltip for user info when collapsed */}
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 bottom-3">
            <div className="font-medium">Administrator</div>
            <div className="text-xs opacity-75">admin@flock.com</div>
          </div>
        )}
      </div>
    </div>
  )
}
