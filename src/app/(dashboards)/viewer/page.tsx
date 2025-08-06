// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import {
//   VideoIcon,
//   TrendingUpIcon,
//   EyeIcon,
//   ArrowRightIcon,
//   SparklesIcon,
//   UserIcon,
//   FlameIcon as FireIcon,
//   ClockIcon,
// } from "lucide-react"
// import { useSelector } from "react-redux"
// import { getBlog } from "@/api/content"
// import Loader from "@/components/Loader"

// interface BlogPost {
//   id: string
//   title: string
//   content: string
//   author: {
//     username: string
//   }
//   created_at: string
//   views?: number
//   is_trending?: boolean
// }

// interface VideoPost {
//   id: string
//   title: string
//   author: {
//     username: string
//   }
//   created_at: string
//   views?: number
//   is_trending?: boolean
//   thumbnail?: string
// }

// export default function ViewerDashboard() {
//   const router = useRouter()
//   const user = useSelector((state: any) => state.user)
//   const [trendingBlogs, setTrendingBlogs] = useState<BlogPost[]>([])
//   const [mostViewedBlogs, setMostViewedBlogs] = useState<BlogPost[]>([])
//   const [trendingVideos, setTrendingVideos] = useState<VideoPost[]>([])
//   const [mostViewedVideos, setMostViewedVideos] = useState<VideoPost[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     if (!user || !user.role) return

//     const role = user.role.toLowerCase()
//     if (role === "creator") {
//       router.push("/creator/dashboard")
//       return
//     } else if (role === "admin") {
//       router.push("/admin/dashboard")
//       return
//     }

//     fetchDashboardData()
//   }, [user, router])

//   const fetchDashboardData = async () => {
//     try {
//       const response = await getBlog()
//       if (response?.data?.blogs) {
//         const blogs = response.data.blogs

//         // Mock trending and most viewed logic - replace with actual API data
//         const trending = blogs.filter((blog: BlogPost) => blog.is_trending).slice(0, 3)
//         const mostViewed = blogs.sort((a: BlogPost, b: BlogPost) => (b.views || 0) - (a.views || 0)).slice(0, 3)

//         setTrendingBlogs(trending)
//         setMostViewedBlogs(mostViewed)
//       }

//       // Mock video data - replace with actual API call
//       const mockVideos: VideoPost[] = [
//         {
//           id: "1",
//           title: "Introduction to React Hooks",
//           author: { username: "techguru" },
//           created_at: "2024-01-15",
//           views: 1250,
//           is_trending: true,
//         },
//         {
//           id: "2",
//           title: "Advanced TypeScript Patterns",
//           author: { username: "codewizard" },
//           created_at: "2024-01-14",
//           views: 980,
//           is_trending: true,
//         },
//         {
//           id: "3",
//           title: "Building Scalable APIs",
//           author: { username: "backendpro" },
//           created_at: "2024-01-13",
//           views: 2100,
//           is_trending: false,
//         },
//       ]

//       setTrendingVideos(mockVideos.filter((video) => video.is_trending))
//       setMostViewedVideos(mockVideos.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3))
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//         <Loader />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Hero Section */}
//         <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
//           <div className="absolute inset-0 bg-black/10"></div>
//           <div className="relative z-10">
//             <div className="flex items-center space-x-4 mb-4">
//               <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
//                 <UserIcon className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold mb-2">
//                   Welcome back, {user?.username || "User"}!
//                   <SparklesIcon className="inline w-8 h-8 ml-2 text-yellow-300" />
//                 </h1>
//                 <p className="text-blue-100 text-lg">Discover trending content and popular posts</p>
//               </div>
//             </div>
//           </div>
//           <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
//           <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>
//         </div>

//         {/* Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Trending Blogs */}
//           <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-slate-800 flex items-center">
//                 <FireIcon className="w-6 h-6 text-red-500 mr-3" />
//                 Trending Blogs
//               </h3>
//               <button
//                 onClick={() => router.push("/viewer/blogs")}
//                 className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group"
//               >
//                 View All
//                 <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               {trendingBlogs.length > 0 ? (
//                 trendingBlogs.map((blog, index) => (
//                   <div
//                     key={blog.id}
//                     onClick={() => router.push("/viewer/blogs")}
//                     className="group flex items-start space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer"
//                   >
//                     <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
//                       <FireIcon className="w-5 h-5 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
//                         {blog.title}
//                       </p>
//                       <p className="text-xs text-slate-500">by {blog.author.username}</p>
//                       <p className="text-xs text-slate-400 mt-1">{new Date(blog.created_at).toLocaleDateString()}</p>
//                     </div>
//                     <div className="text-xs text-red-500 font-medium">#{index + 1}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <FireIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//                   <p className="text-slate-500 font-medium">No trending blogs yet</p>
//                   <p className="text-slate-400 text-sm">Check back later for trending content</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Most Viewed Blogs */}
//           <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-slate-800 flex items-center">
//                 <EyeIcon className="w-6 h-6 text-blue-500 mr-3" />
//                 Most Viewed Blogs
//               </h3>
//               <button
//                 onClick={() => router.push("/viewer/blogs")}
//                 className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group"
//               >
//                 View All
//                 <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               {mostViewedBlogs.length > 0 ? (
//                 mostViewedBlogs.map((blog, index) => (
//                   <div
//                     key={blog.id}
//                     onClick={() => router.push("/viewer/blogs")}
//                     className="group flex items-start space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer"
//                   >
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
//                       <EyeIcon className="w-5 h-5 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
//                         {blog.title}
//                       </p>
//                       <p className="text-xs text-slate-500">by {blog.author.username}</p>
//                       <div className="flex items-center mt-1 space-x-2">
//                         <p className="text-xs text-slate-400">{new Date(blog.created_at).toLocaleDateString()}</p>
//                         <span className="text-xs text-slate-300">•</span>
//                         <p className="text-xs text-blue-500 font-medium">{blog.views || 0} views</p>
//                       </div>
//                     </div>
//                     <div className="text-xs text-blue-500 font-medium">#{index + 1}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <EyeIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//                   <p className="text-slate-500 font-medium">No blogs available</p>
//                   <p className="text-slate-400 text-sm">Start reading to see popular content</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Trending Videos */}
//           <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-slate-800 flex items-center">
//                 <TrendingUpIcon className="w-6 h-6 text-purple-500 mr-3" />
//                 Trending Videos
//               </h3>
//               <button
//                 onClick={() => router.push("/viewer/videos")}
//                 className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center group"
//               >
//                 View All
//                 <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               {trendingVideos.length > 0 ? (
//                 trendingVideos.map((video, index) => (
//                   <div
//                     key={video.id}
//                     onClick={() => router.push("/viewer/videos")}
//                     className="group flex items-start space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer"
//                   >
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
//                       <VideoIcon className="w-5 h-5 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
//                         {video.title}
//                       </p>
//                       <p className="text-xs text-slate-500">by {video.author.username}</p>
//                       <p className="text-xs text-slate-400 mt-1">{new Date(video.created_at).toLocaleDateString()}</p>
//                     </div>
//                     <div className="text-xs text-purple-500 font-medium">#{index + 1}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <VideoIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//                   <p className="text-slate-500 font-medium">No trending videos yet</p>
//                   <p className="text-slate-400 text-sm">Check back later for trending content</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Most Viewed Videos */}
//           <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-slate-800 flex items-center">
//                 <ClockIcon className="w-6 h-6 text-emerald-500 mr-3" />
//                 Most Viewed Videos
//               </h3>
//               <button
//                 onClick={() => router.push("/viewer/videos")}
//                 className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center group"
//               >
//                 View All
//                 <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               {mostViewedVideos.length > 0 ? (
//                 mostViewedVideos.map((video, index) => (
//                   <div
//                     key={video.id}
//                     onClick={() => router.push("/viewer/videos")}
//                     className="group flex items-start space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer"
//                   >
//                     <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
//                       <VideoIcon className="w-5 h-5 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
//                         {video.title}
//                       </p>
//                       <p className="text-xs text-slate-500">by {video.author.username}</p>
//                       <div className="flex items-center mt-1 space-x-2">
//                         <p className="text-xs text-slate-400">{new Date(video.created_at).toLocaleDateString()}</p>
//                         <span className="text-xs text-slate-300">•</span>
//                         <p className="text-xs text-emerald-500 font-medium">{video.views || 0} views</p>
//                       </div>
//                     </div>
//                     <div className="text-xs text-emerald-500 font-medium">#{index + 1}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <VideoIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//                   <p className="text-slate-500 font-medium">No videos available</p>
//                   <p className="text-slate-400 text-sm">Start watching to see popular content</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


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
              <div className="flex flex-col items-start md:items-end text-sm md:text-base">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-2">
                  <span className="text-white/90">Today's Highlights</span>
                </div>
                <div className="text-blue-100">{trendingBlogs.length + trendingVideos.length} trending items</div>
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
