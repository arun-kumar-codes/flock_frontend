"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sun, Moon, User, LogIn, UserPlus, Sparkles } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { toggleThemeMode } from "@/slice/userSlice"

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

  // Get page title based on pathname
  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const lastSegment = pathSegments[pathSegments.length - 1]

    switch (lastSegment) {
      case "viewer":
        return "FlockTogether"
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
        return "Explore amazing content"
    }
  }

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-20 theme-bg-card theme-border transition-all duration-300 backdrop-blur-xl ${
        isSidebarExpanded ? "left-64" : "left-16"
      }`}
    >
      <div className="flex items-center justify-between h-full px-8">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold theme-text-primary leading-tight">{getPageTitle()}</h1>
              {/* <Sparkles className="w-5 h-5 theme-text-accent animate-pulse" /> */}
            </div>
            <p className="text-sm theme-text-secondary mt-1 font-medium opacity-80">{getPageDescription()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl theme-bg-secondary theme-bg-hover theme-border transition-all duration-300 group"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 theme-text-primary group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="w-5 h-5 theme-text-primary group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>

          {user.isLogin ? (
            // User is logged in - show profile button
            <button
              onClick={() => router.push("/viewer/profile")}
              className="flex items-center space-x-3 px-6 py-3 rounded-xl theme-bg-secondary theme-bg-hover theme-border transition-all duration-300 group"
              title="View Profile"
            >
              <User className="w-5 h-5 theme-text-primary group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-semibold theme-text-primary hidden sm:block">
                {user?.username || "Profile"}
              </span>
            </button>
          ) : (
            // User is not logged in - show login/signup buttons
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/login")}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl theme-bg-secondary theme-bg-hover theme-border transition-all duration-300 group"
                title="Sign In"
              >
                <LogIn className="w-4 h-4 theme-text-primary group-hover:translate-x-1 transition-transform duration-300" />
                <span className="text-sm font-semibold theme-text-primary hidden sm:block">Sign In</span>
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl theme-button-primary transition-all duration-300 group shadow-lg"
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
