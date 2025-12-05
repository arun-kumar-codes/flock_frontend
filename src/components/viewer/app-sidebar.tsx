"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { UserIcon, LogOutIcon, TrendingUpIcon, Users } from "lucide-react"
import HomeIconSvg from "@/assets/Home-icon.svg"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import profileImg from "@/assets/profile.png"
import { logOut } from "@/slice/userSlice"
import Logo from "@/assets/Flock-LOGO.png"
import Exit from '@/assets/Exit.svg'
import ExitIcon from "@/assets/logout-icon.png"
import Login from '@/assets/Login.svg'
import BlogIcon from "@/assets/blog-icon.png"
import VideoIcon from "@/assets/video-icon.png"
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const menuItems = [
  {
    title: "Home",
    url: "/viewer",
    icon: HomeIconSvg,
  },
  {
    title: "Blog",
    url: "/viewer/blogs",
    icon: BlogIcon,
  },
  {
    title: "Video",
    url: "/viewer/videos",
    icon: VideoIcon,
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
  forceOpen?: boolean
}

export function CustomSidebar({ onExpandChange, forceOpen = false }: CustomSidebarProps) {
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
    if (forceOpen) return
    if(window.matchMedia("(min-width: 768px)").matches){
      setIsExpanded(true)
      onExpandChange?.(true)
    }
  }

  const handleMouseLeave = () => {
    if (forceOpen) return 
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsExpanded(false)
      onExpandChange?.(false)
    }
  }

  const handleLogout = () => {
    dispatch(logOut())
    router.push("/login")
  }

  const open = forceOpen || isExpanded

  const sidebarWidth = open ? "w-64" : "w-20"
  const textVisibility = open ? "opacity-100" : "opacity-0 hidden"

  return (
    <div
  className={`fixed left-0 top-0 mb-2 h-full transition-all duration-300 ease-in-out z-40 ${sidebarWidth} ${inter.className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full bg-[#E5F6FA] mx-2 my-2 rounded-4xl">
        {/* Sidebar Header / Logo */}
<div className="flex items-center justify-center py-4 mt-3">
  <div className="flex items-center space-x-3">
    <div className={`flex items-center justify-center rounded-xl transition-all duration-300 
    ${open ? "w-50 h-10" : "w-20 h-10"}`}>
      <Image
        src={Logo}
        alt="Flock Logo"
       width={open ? 80 : 48}
        height={open ? 80 : 48}
        className="object-contain drop-shadow-md"
        priority
      />
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
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                    isActive
                      ? "bg-[#684098] text-white"
                      : "text-black hover:text-black hover:bg-[#684098]"
                  }`}
                  title={!open ? item.title : undefined}
                >
                  {/* {item.title === "FlockTogether" ? (
                    <Image src={item.icon} alt="icon" width={20} height={20} className={`flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                  ) : (
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                  )} */}
                  <Image
                src={item.icon}
                alt="icon"
                width={22}
                height={22}
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive ? "brightness-0 invert" : "brightness-0"
                }`}
              />

              <span
                className={`transition-opacity duration-300 whitespace-nowrap font-medium ${inter.className} ${textVisibility} ${
                  isActive ? "text-white" : "text-black"
                }`}
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
                title={!open ? item.title : undefined} 
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-black" : ""}`} />
                <span
                  className={`transition-opacity duration-300 whitespace-nowrap font-medium ${textVisibility} ${
                    isActive ? "text-[#0F0A0F]" : ""
                  }`}
                >
                  {item.title}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* About Us Link */}
      <div
  className={`absolute bottom-20 left-0 right-0 transition-all duration-300 ${
    open ? "p-4" : "px-2 py-2"
  }`}
>
  <button
    onClick={() => router.push("/about-us")}
    className="
      w-full flex items-center space-x-3 
      px-4 py-2.5 rounded-lg 
      cursor-pointer text-black
      hover:bg-gray-300 
      transition-all duration-200
    "
    title={!open ? "About Us" : undefined}
  >
    <Users className="w-6 h-6 flex-shrink-0 text-black" />

    <span
      className={`transition-opacity duration-300 whitespace-nowrap font-medium ${textVisibility}`}
    >
      About Us
    </span>
  </button>
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
            title={!open ? "Sign Out" : undefined}
          >
            <Image src={ExitIcon} alt="exit" className="w-6 h-6 text-white" />
            <span
             className={`transition-opacity duration-300 whitespace-nowrap text-black dark:text-black font-medium ${textVisibility}`}
            >
              Sign Out
            </span>
          </button>
        </div>
      ) : (
        // Logged-out state → Sign In
        <div
  className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
    open ? "p-4" : "px-2 py-3"
  }`}
>
          <button
            onClick={() => router.push("/login")}
            className="w-full flex items-center space-x-3 cursor-pointer  px-4 py-2.5 rounded-lg text-black hover:bg-gray-300 transition-all duration-200"
            title={!open ? "Sign In" : undefined}
          >
            <Image src={ExitIcon} alt="Login" className="w-6 h-6 text-[#F3582C] flex-shrink-0 " />
            <span
              className={`transition-opacity duration-300 whitespace-nowrap font-medium ${textVisibility}`}
            >
              Sign In
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
