"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, FlameIcon as FireIcon, HeartIcon } from "lucide-react"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"
import TrendingContent from "@/components/viewer/TrendingContent"
import MostViewedTab from "@/components/viewer/MostViewed"
import MostLikedTab from "@/components/viewer/MostLiked"
import DashboardPage from "@/components/viewer/dashboard-page"

export default function ViewerDashboard() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const filterButtons = [
    {
      id: "trending",
      label: "Trending",
      icon: FireIcon,
      color: "text-red-500",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
    },
    {
      id: "most-viewed",
      label: "Most Viewed",
      icon: EyeIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      id: "most-liked",
      label: "Most Liked",
      icon: HeartIcon,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
    },
  ]

  useEffect(() => {
    // if (!user || !user.role) return
    const role = user.role.toLowerCase()
    if (role === "creator") {
      router.push("/dashboard")
      return
    } else if (role === "admin") {
      router.push("/admin")
      return
    }
    const token=localStorage.getItem("token");


    if (role === "viewer"||!token) setIsLoading(false)
    //console.log(isLoading)
  }, [user, router])

  if (isLoading) {
    return (
        <Loader />
     
    )
  }

  const renderContent = () => {
    switch (activeFilter) {
      case "trending":
        return <TrendingContent />
      case "most-viewed":
        return <MostViewedTab />
      case "most-liked":
        return <MostLikedTab />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen theme-bg-primary">
      <div className="mx-auto lg:px-8 py-4 lg:py-8">
        <div className="mb-4 md:mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
            {/* All Videos button (default) */}
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium cursor-pointer transition-all duration-200 text-white ${
                activeFilter === null ? "theme-button-primary shadow-md" : "theme-button-secondary theme-border"
              }`}
            >
              All
            </button>

            {/* Filter buttons */}
            {filterButtons.map((filter) => {
              const Icon = filter.icon
              const isActive = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium cursor-pointer transition-all duration-200 ${
                    isActive
                      ? `${filter.bgColor} ${filter.color} shadow-md border border-current`
                      : `theme-button-secondary theme-border`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              )
            })}
          </div>
        </div>

          <div >{renderContent()}</div>
        
      </div>
    </div>
  )
}
