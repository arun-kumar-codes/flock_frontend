"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  HomeIcon,
  BookOpenIcon,
  VideoIcon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  TrendingUpIcon,
  HeartIcon,
  ClockIcon,
} from "lucide-react"
import Image from "next/image"
import { useSelector,useDispatch } from "react-redux"
import profileImg from "@/assets/profile.png"
import { logOut } from "@/slice/userSlice"


const menuItems = [
  {
    title: "Dashboard",
    url: "/viewer",
    icon: HomeIcon,
  },
  {
    title: "Blog",
    url: "/viewer/blogs",
    icon: BookOpenIcon,
  },
  {
    title: "Video",
    url: "/viewer/videos",
    icon: VideoIcon,
  }
]

const userMenuItems:any = [
  {
    title: "Profile",
    url: "/viewer/profile",
    icon: UserIcon,
  },
  // {
  //   title: "Favorites",
  //   url: "/viewer/favorites",
  //   icon: HeartIcon,
  // },
  // {
  //   title: "History",
  //   url: "/viewer/history",
  //   icon: ClockIcon,
  // },
  // {
  //   title: "Settings",
  //   url: "/viewer/settings",
  //   icon: SettingsIcon,
  // },
]



interface CustomSidebarProps {
  onExpandChange?: (isExpanded: boolean) => void
}

export function CustomSidebar({ onExpandChange }: CustomSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [isExpanded, setIsExpanded] = useState(false)

  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setIsExpanded(true)
    onExpandChange?.(true)
  }

  const handleMouseLeave = () => {
    setIsExpanded(false)
    onExpandChange?.(false)
  }

  const handleLogout = () => {
    dispatch(logOut())
    router.push("/login")
  }

  const sidebarWidth = isExpanded ? "w-64" : "w-16"
  const textVisibility = isExpanded ? "opacity-100" : "opacity-0"

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-slate-200 transition-all duration-300 ease-in-out z-40 ${sidebarWidth}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUpIcon className="w-5 h-5 text-white" />
          </div>
          <div className={`transition-opacity duration-300 ${textVisibility} ${isExpanded ? "" : "hidden"}`}>
            <div className="font-semibold text-slate-800">Flock</div>
            <div className="text-xs text-slate-500">Content Hub</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <button
                key={item.title}
                onClick={() => router.push(item.url)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
                title={!isExpanded ? item.title : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`transition-opacity duration-300 whitespace-nowrap ${textVisibility} ${
                    isExpanded ? "" : "hidden"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Separator */}
      <div className="mx-4 border-t border-slate-200"></div>

      {/* User Navigation */}
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {userMenuItems.map((item:any) => {
            const isActive = pathname === item.url
            return (
              <button
                key={item.title}
                onClick={() => router.push(item.url)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
                title={!isExpanded ? item.title : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`transition-opacity duration-300 whitespace-nowrap ${textVisibility} ${
                    isExpanded ? "" : "hidden"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 mb-3" onClick={() => router.push("/viewer/profile")}>
          <Image
            src={user.profileImage||profileImg || "/placeholder.svg"}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full flex-shrink-0"
          />
          <div className={`transition-opacity duration-300 ${textVisibility} ${isExpanded ? "" : "hidden"}`}>
            <div className="text-sm font-medium text-slate-800">{user?.username || "User"}</div>
            <div className="text-xs text-slate-500">{user?.role || "Viewer"}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          title={!isExpanded ? "Sign Out" : undefined}
        >
          <LogOutIcon className="w-5 h-5 flex-shrink-0" />
          <span
            className={`transition-opacity duration-300 whitespace-nowrap ${textVisibility} ${
              isExpanded ? "" : "hidden"
            }`}
          >
            Sign Out
          </span>
        </button>
      </div>
    </div>
  )
}
