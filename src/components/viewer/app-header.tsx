// "use client"

// import { EyeIcon } from "lucide-react" // or use UserIcon if preferred

// export function AppHeader() {
//   return (
//     <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b">
//       <div className="flex items-center space-x-2">
//         <EyeIcon className="w-5 h-5 text-gray-700" />
//         <span className="text-sm font-medium text-gray-700">Viewer Mode</span>
//       </div>

//       {/* Optional: Right side content like user avatar or logout */}
//       <div className="text-sm text-gray-500">
//         {/* Placeholder or future content */}
//       </div>
//     </header>
//   )
// }



"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { ShieldIcon } from "lucide-react"


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
      

          {/* Admin Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
            <ShieldIcon className="w-4 h-4" />
            <span>Admin</span>
          </div>

        </div>
      </div>
    </header>
  )
}

