"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { UserIcon, LogOutIcon, TrendingUpIcon } from "lucide-react"
import HomeIconSvg from "@/assets/Home-icon.svg"
import BlogIconSvg from "@/assets/Blog.svg"
import VideoIconSvg from "@/assets/Video.svg"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import profileImg from "@/assets/profile.png"
import { logOut } from "@/slice/userSlice"
import Logo from "@/assets/logo.svg"
import Exit from '@/assets/Exit.svg'
import Login from '@/assets/Login.svg'

const menuItems = [
  {
    title: "Home",
    url: "/viewer",
    icon: HomeIconSvg,
  },
  {
    title: "Blog",
    url: "/viewer/blogs",
    icon: BlogIconSvg,
  },
  {
    title: "Video",
    url: "/viewer/videos",
    icon: VideoIconSvg,
  },
]

const userMenuItems: any = [
  {
    title: "Profile",
    url: "/viewer/profile",
    icon: UserIcon,
  },
]

interface CustomSidebarProps {
  onExpandChange?: (isExpanded: boolean) => void
}

export function CustomSidebar({ onExpandChange }: CustomSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [isExpanded, setIsExpanded] = useState(false)
  // const [isMobile, setIsMobile] = useState(false)

  const dispatch = useDispatch()

  // useEffect(()=> {
  //   const handleResize = ()=>{
  //     setIsMobile(window.innerWidth < 768)
  //   }
  //   handleResize()
  //   window.addEventListener("resize", handleResize)
  //   return ()=> window.removeEventListener("resize", handleResize)
  // }, [])

  const handleMouseEnter = () => {
    if(window.matchMedia("(min-width: 768px)").matches){
      setIsExpanded(true)
      onExpandChange?.(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsExpanded(false)
      onExpandChange?.(false)
    }
  }

  const handleLogout = () => {
    dispatch(logOut())
    router.push("/login")
  }

  const sidebarWidth = isExpanded ? "w-64" : "w-20"
  const textVisibility = isExpanded ? "opacity-100" : "opacity-0"

  return (
    <div
      className={`fixed left-0 top-0 mb-2 h-full transition-all duration-300 ease-in-out z-40 ${sidebarWidth}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full bg-[#E6EEFF] mx-2 my-2 rounded-4xl">
        {/* Header */}
        <div className="p-3 mt-2 h-20 ">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Image src={Logo} alt="logo" className="w-10 h-10 text-white" />
            </div>
            <div className={`transition-opacity duration-300 ${textVisibility} ${isExpanded ? "" : "hidden"}`}>
              <div className="font-bold text-xl text-[#2C50A2] whitespace-nowrap">FLOCK</div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-4 flex-grow">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.url
              return (
                <button
                  key={item.title}
                  onClick={() => router.push(item.url)}
                  className={`w-full flex items-center hover:bg-gray-300 space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                    isActive
                    ? "bg-blue-200 text-[#0F0A0F]"
                    : "text-[#424242] hover:theme-bg-hover hover:text-gray-600"
                  }`}
                  title={!isExpanded ? item.title : undefined}
                >
                  {/* {item.title === "FlockTogether" ? (
                    <Image src={item.icon} alt="icon" width={20} height={20} className={`flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                  ) : (
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                  )} */}
                  <Image src={item.icon} alt="icon" width={20} height={20} className={`flex-shrink-0 ${isActive ? "text-black" : ""}`} />
                  <span
                    className={`transition-opacity duration-300 whitespace-nowrap font-medium ${textVisibility} ${
                      isExpanded ? "" : "hidden"
                    } ${isActive ? "text-black" : "hover:theme-bg-hover hover:text-gray-600"}`}
                  >
                    {item.title}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="mx-4 my-2 border-t theme-border opacity-30"></div>

      {/* User Navigation */}
      <div className="py-2">
        <nav className="space-y-1 px-2">
          {userMenuItems.map((item: any) => {
            const isActive = pathname === item.url
            return (
              <button
                key={item.title}
                onClick={() => router.push(item.url)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-200 text-[#0F0A0F]"
                    : "text-[#424242] hover:theme-bg-hover hover:text-blue-600"
                  }`}
                title={!isExpanded ? item.title : undefined}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-black" : ""}`} />
                <span
                  className={`transition-opacity duration-300 whitespace-nowrap font-medium ${textVisibility} ${
                    isExpanded ? "" : "hidden"
                  } ${isActive ? "text-[#0F0A0F]" : ""}`}
                >
                  {item.title}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* User Profile & Logout OR Sign In */}
      {user.isLogin ? (
        // Logged-in state → Profile & Logout
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* <div
            className="flex items-center space-x-3 mb-3 cursor-pointer hover:theme-bg-hover rounded-lg p-2 transition-colors duration-200"
            onClick={() => router.push("/viewer/profile")}
          >
            <div className="w-8 h-8 flex-shrink-0">
              <Image
                src={user.profileImage || profileImg || "/placeholder.svg"}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <div className={`transition-opacity duration-300 ${textVisibility} ${isExpanded ? "" : "hidden"}`}>
              <div className="text-sm font-medium theme-text-primary">{user?.username || "User"}</div>
              <div className="text-xs theme-text-secondary">{user?.role || "Viewer"}</div>
            </div>
          </div> */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-black dark:text-black hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-black transition-all duration-200"
            title={!isExpanded ? "Sign Out" : undefined}
          >
            <Image src={Exit} alt="exit" className="w-6 h-6 text-white" />
            <span
              className={`transition-opacity duration-300 whitespace-nowrap text-black dark:text-black font-medium ${textVisibility} ${
                isExpanded ? "" : "hidden"
              }`}
            >
              Sign Out
            </span>
          </button>
        </div>
      ) : (
        // Logged-out state → Sign In
        <div
  className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
    isExpanded ? "p-4" : "px-2 py-3"
  }`}
>

          <button
            onClick={() => router.push("/login")}
            className="w-full flex items-center space-x-3 cursor-pointer  px-4 py-2.5 rounded-lg text-black hover:bg-gray-300 transition-all duration-200"
            title={!isExpanded ? "Sign In" : undefined}
          >
            <Image src={Login} alt="Login" className="w-8 h-8 flex-shrink-0 " />
            <span
              className={`transition-opacity duration-300 whitespace-nowrap font-medium ${textVisibility} ${
                isExpanded ? "" : "hidden"
              }`}
            >
              Sign In
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
