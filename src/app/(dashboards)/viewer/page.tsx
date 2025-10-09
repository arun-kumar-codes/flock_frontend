"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, FlameIcon as FireIcon, HeartIcon } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import Loader from "@/components/Loader"
import TrendingContent from "@/components/viewer/TrendingContent"
import MostViewedTab from "@/components/viewer/MostViewed"
import MostLikedTab from "@/components/viewer/MostLiked"
import DashboardPage from "@/components/viewer/dashboard-page"
import { setActiveFilter } from "@/slice/dashbaordSlice"

export default function ViewerDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)
  const activeFilter = useSelector((state: any) => state.dashboard?.activeFilter)
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

  // Effect: handle redirect and loading. Safe checks with optional chaining.
  useEffect(() => {
    const role = user?.role?.toLowerCase() || null
    if (!role) {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      if (!token) {
        setIsLoading(false)
      }
      return
    }
    if (role === "creator") {
      router.push("/dashboard")
      return
    }
    if (role === "admin") {
      router.push("/admin")
      return
    }

    const token = localStorage.getItem("token")
    if (role === "viewer" || !token) {
      setIsLoading(false)
    }
  }, [user, router])

  // Content renderer
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

  const setActive = (value: string) => {
    dispatch(setActiveFilter(value))
  }

  // Keep this return at the end (hooks already executed above)
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen theme-bg-primary">
      <div className="mx-auto lg:px-2 py-1 lg:py-2">
        {/* <div className="mb-4 md:mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center md:ml-10">
  {filterButtons.map((filter) => {
    const Icon = filter.icon
    const isActive = activeFilter === filter.id
    return (
      <button
        key={filter.id}
        onClick={() => setActive(filter.id)}
        className={`flex items-center justify-center gap-x-2 md:gap-x-6 px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium cursor-pointer transition-all duration-200 ${
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
        </div> */}

        <div>{renderContent()}</div>
      </div>
    </div>
  )
}
