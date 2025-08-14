"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingUpIcon, EyeIcon, SparklesIcon, UserIcon, FlameIcon as FireIcon, HeartIcon } from "lucide-react"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"
import TrendingBlogsTab from "@/components/viewer/TrendingBlogs"
import TrendingVideosTab from "@/components/viewer/TrendingVideos"
import MostViewedTab from "@/components/viewer/MostViewed"
import MostLikedTab from "@/components/viewer/MostLiked"


export default function ViewerDashboard() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [activeTab, setActiveTab] = useState("trending-blogs")
  const [isLoading, setIsLoading] = useState(true)
  const tabs = [
    {
      id: "trending-blogs",
      label: "Trending Blogs",
      icon: FireIcon,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      id: "trending-videos",
      label: "Trending Videos",
      icon: TrendingUpIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "most-viewed",
      label: "Most Viewed",
      icon: EyeIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "most-liked",
      label: "Most Liked",
      icon: HeartIcon,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
  ]
  useEffect(() => {
    // if (!user || !user.role) return
    const role = user.role.toLowerCase()
    if (role === "creator") {
      router.push("/dashboard")
      return;
    } else if (role === "admin") {
      router.push("/admin") 
      return;
    }

    if(role==="viewer")
    setIsLoading(false);
    console.log(isLoading);
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader />
      </div>
    )
  }
  const renderTabContent = () => {
    switch (activeTab) {
      case "trending-blogs":
        return <TrendingBlogsTab  />
      case "trending-videos":
        return <TrendingVideosTab />
      case "most-viewed":
        return <MostViewedTab  />
      case "most-liked":
        return <MostLikedTab />
      default:
        return <TrendingBlogsTab  />
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        {/* <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, {user?.username || "User"}!
                    <SparklesIcon className="inline w-6 h-6 md:w-8 md:h-8 ml-2 text-yellow-300" />
                  </h1>
                  <p className="text-blue-100 text-base md:text-lg">Discover trending content and popular posts</p>
                </div>
              </div>
             
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>
        </div> */}
        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
          <div className="flex flex-wrap border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 px-4 py-4 md:px-6 md:py-5 flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-300 relative group ${
                    isActive
                      ? `${tab.bgColor} ${tab.color} border-b-2 ${tab.borderColor.replace("border-", "border-b-")}`
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? "scale-110" : "group-hover:scale-105"} transition-transform duration-200`}
                  />
                  <span className="font-medium text-xs md:text-sm truncate">{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent"></div>
                  )}
                </button>
              )
            })}
          </div>
          {/* Tab Content */}
          <div className="p-6 md:p-8">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  )
}
