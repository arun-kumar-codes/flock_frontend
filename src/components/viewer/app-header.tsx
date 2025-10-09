"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sun, Moon, User, LogIn, UserPlus, Sparkles, Bell } from "lucide-react"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import { toggleThemeMode } from "@/slice/userSlice"
import { clearFilter } from "@/slice/dashbaordSlice"
import { toast } from "react-hot-toast"
import { toggleUserRole } from "@/api/content"

interface HeaderNavbarProps {
  isSidebarExpanded: boolean
}

export function HeaderNavbar({ isSidebarExpanded }: HeaderNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [isDark, setIsDark] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const detectTheme = () => {
      const savedTheme = localStorage.getItem("theme")
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark)

      setIsDark(shouldBeDark)
      document.documentElement.setAttribute("data-theme", shouldBeDark ? "dark" : "light")
    }

    detectTheme()
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    const themeValue = newTheme ? "dark" : "light"
    localStorage.setItem("theme", themeValue)
    document.documentElement.setAttribute("data-theme", themeValue)
    dispatch(toggleThemeMode())
  }

  // Handle dashboard reset
  const handleDashboardChange = () => {
    dispatch(clearFilter())
  }

  // Switch role (viewer <-> creator)
  const handleSwitchRole = async () => {
  try {
    const res = await toggleUserRole();
    toast.success(res.data.message);
    window.location.reload();
  } catch (err: any) {
    const msg = err.response?.data?.error || "Unable to switch role";
    toast.error(msg);
  }
};

  // Get page title based on pathname
  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const lastSegment = pathSegments[pathSegments.length - 1]

    switch (lastSegment) {
      case "viewer":
        return `Hello ${user?.username || "User"}!`
      case "blogs":
        return "Blog Posts"
      case "videos":
        return "Videos"
      case "profile":
        return "Profile"
      case "settings":
        return "Settings"
      case "favorites":
        return "Favorites"
      case "history":
        return "History"
      default:
        return "Dashboard"
    }
  }

  // Get page description
  const getPageDescription = () => {
    const title = getPageTitle()
    switch (title) {
      case "Dashboard":
        return "Welcome to your content hub"
      case "Blog Posts":
        return "Discover and read amazing articles"
      case "Videos":
        return "Watch and explore video content"
      case "Profile":
        return "Manage your account settings"
      case "Settings":
        return "Customize your experience"
      case "Favorites":
        return "Your saved content"
      case "History":
        return "Recently viewed content"
      default:
        return ""
    }
  }

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-12 transition-all duration-300 bg-white  ${
        isSidebarExpanded ? "left-64" : "left-16"
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 mt-2 md:px-8">
        <div className="flex items-center space-x-4">
          <div className={`flex flex-col justify-center ${getPageTitle().includes("Hello") && "cursor-pointer"}`}>
            <div className="flex items-center space-x-2 " onClick={handleDashboardChange}>
              <h1 
                className="text-lg sm:text-xl font-medium text-[#C14C42] leading-none"
                style={{ 
                  fontFamily: '"Cera Pro", sans-serif',
                  fontWeight: 500,
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                {getPageTitle()}
              </h1>
            </div>
            <p className="text-xs md:text-sm theme-text-secondary mt-1 font-medium opacity-80">
              {getPageDescription()}
            </p>
          </div>
        </div>

        <div className="flex items-center ml-2 space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-50 transition-all duration-300 group cursor-pointer"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Notifications */}
          

          {user.isLogin ? (
            <div className="flex items-center space-x-3">
              {/* Switch Role Button - Circular */}
              <button
                onClick={handleSwitchRole}
                className="p-2 rounded-full hover:bg-gray-50 transition-all duration-300 group cursor-pointer"
                title="Switch Role"
              >
                <Sparkles className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
              </button>

              {/* Profile Picture */}
              <button
                onClick={() => router.push("/viewer/profile")}
                className="relative"
                title="View Profile"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden transition-all duration-300 cursor-pointer">
                  <Image
                    src={user.profileImage || "/placeholder-profile.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover "
                  />
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/login")}
                className="flex items-center space-x-2 px-5 py-3 cursor-pointer rounded-xl theme-bg-secondary theme-bg-hover theme-border transition-all duration-300 group"
                title="Sign In"
              >
                <LogIn className="w-4 h-4 theme-text-primary group-hover:translate-x-1 transition-transform duration-300" />
                <span className="text-sm font-semibold theme-text-primary hidden sm:block">Sign In</span>
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl cursor-pointer theme-button-primary transition-all duration-300 group"
                title="Sign Up"
              >
                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-semibold hidden sm:block">Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
