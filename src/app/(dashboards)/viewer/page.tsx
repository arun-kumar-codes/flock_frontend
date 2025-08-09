"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingUpIcon, EyeIcon, SparklesIcon, UserIcon, FlameIcon as FireIcon, HeartIcon } from "lucide-react"
import { useSelector } from "react-redux"
import { getBlog } from "@/api/content"
import Loader from "@/components/Loader"
import TrendingBlogsTab from "@/components/viewer/TrendingBlogs"
import TrendingVideosTab from "@/components/viewer/TrendingVideos"
import MostViewedTab from "@/components/viewer/MostViewed"
import MostLikedTab from "@/components/viewer/MostLiked"
interface BlogPost {
  id: string
  title: string
  content: string
  author: {
    username: string
  }
  created_at: string
  views?: number
  likes?: number
  is_trending?: boolean
}
interface VideoPost {
  id: string
  title: string
  author: {
    username: string
  }
  created_at: string
  views?: number
  likes?: number
  is_trending?: boolean
  thumbnail?: string
}
export default function ViewerDashboard() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [activeTab, setActiveTab] = useState("trending-blogs")
  const [trendingBlogs, setTrendingBlogs] = useState<BlogPost[]>([])
  const [mostViewedBlogs, setMostViewedBlogs] = useState<BlogPost[]>([])
  const [trendingVideos, setTrendingVideos] = useState<VideoPost[]>([])
  const [mostViewedVideos, setMostViewedVideos] = useState<VideoPost[]>([])
  const [mostLikedContent, setMostLikedContent] = useState<(BlogPost | VideoPost)[]>([])
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
    if (!user || !user.role) return
    const role = user.role.toLowerCase()
    if (role === "creator") {
      router.push("/creator/dashboard")
      return
    } else if (role === "admin") {
      router.push("/admin/dashboard")
      return
    }
    fetchDashboardData()
  }, [user, router])
  const fetchDashboardData = async () => {
    try {
      const response = await getBlog()
      if (response?.data?.blogs) {
        const blogs = response.data.blogs
        const trending = blogs.filter((blog: BlogPost) => blog.is_trending).slice(0, 6)
        const mostViewed = blogs.sort((a: BlogPost, b: BlogPost) => (b.views || 0) - (a.views || 0)).slice(0, 6)
        setTrendingBlogs(trending)
        setMostViewedBlogs(mostViewed)
      }
      // Mock video data - replace with actual API call
      const mockVideos: VideoPost[] = [
        {
          id: "1",
          title: "Introduction to React Hooks",
          author: { username: "techguru" },
          created_at: "2024-01-15",
          views: 1250,
          likes: 89,
          is_trending: true,
        },
        {
          id: "2",
          title: "Advanced TypeScript Patterns",
          author: { username: "codewizard" },
          created_at: "2024-01-14",
          views: 980,
          likes: 156,
          is_trending: true,
        },
        {
          id: "3",
          title: "Building Scalable APIs",
          author: { username: "backendpro" },
          created_at: "2024-01-13",
          views: 2100,
          likes: 234,
          is_trending: false,
        },
        {
          id: "4",
          title: "CSS Grid Mastery",
          author: { username: "designpro" },
          created_at: "2024-01-12",
          views: 1800,
          likes: 198,
          is_trending: true,
        },
        {
          id: "5",
          title: "Node.js Performance Tips",
          author: { username: "nodemaster" },
          created_at: "2024-01-11",
          views: 1450,
          likes: 167,
          is_trending: false,
        },
        {
          id: "6",
          title: "Database Optimization",
          author: { username: "dbexpert" },
          created_at: "2024-01-10",
          views: 1650,
          likes: 145,
          is_trending: true,
        },
      ]
      setTrendingVideos(mockVideos.filter((video) => video.is_trending))
      setMostViewedVideos(mockVideos.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6))
      // Combine blogs and videos for most liked
      const allContent = [...(response?.data?.blogs || []), ...mockVideos]
      const mostLiked = allContent.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6)
      setMostLikedContent(mostLiked)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
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
        </div>
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
