"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpenIcon,
  VideoIcon,
  HeartIcon,
  ClockIcon,
  EyeIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  SparklesIcon,
  PlayIcon,
  UserIcon,
} from "lucide-react"
import { useSelector } from "react-redux"
import { getBlog } from "@/api/content"
import Loader from "@/components/Loader"

interface DashboardStats {
  totalBlogs: number
  totalVideos: number
  totalFavorites: number
  totalReadTime: number
  recentActivity: any[]
}

export default function ViewerDashboard() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    totalVideos: 0,
    totalFavorites: 0,
    totalReadTime: 0,
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)

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
        const totalReadTime = blogs.reduce((acc: number, blog: any) => {
          const minutes = Math.ceil(blog.content.split(/\s+/).length / 200)
          return acc + minutes
        }, 0)

        setStats({
          totalBlogs: blogs.length,
          totalVideos: 12, // Mock data - replace with actual API
          totalFavorites: blogs.filter((blog: any) => blog.is_liked).length,
          totalReadTime,
          recentActivity: blogs.slice(0, 5),
        })
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {user?.username || "User"}!
                  <SparklesIcon className="inline w-8 h-8 ml-2 text-yellow-300" />
                </h1>
                <p className="text-blue-100 text-lg">Ready to explore amazing content today?</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Articles Read</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalBlogs}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpenIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Videos Watched</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalVideos}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <p className="text-xs text-purple-600">Growing library</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <VideoIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Favorites</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalFavorites}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <p className="text-xs text-red-600">Your collection</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <HeartIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Reading Time</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalReadTime}m</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  <p className="text-xs text-emerald-600">Time invested</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <TrendingUpIcon className="w-6 h-6 text-blue-600 mr-3" />
                Explore Content
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => router.push("/viewer/blogs")}
                  className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <BookOpenIcon className="w-8 h-8" />
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Browse Articles</h4>
                    <p className="text-blue-100 text-sm">
                      Discover insightful articles and blog posts from our creators
                    </p>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </button>

                <button
                  onClick={() => router.push("/viewer/videos")}
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <PlayIcon className="w-8 h-8" />
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Watch Videos</h4>
                    <p className="text-purple-100 text-sm">Learn through engaging video content and tutorials</p>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <ClockIcon className="w-5 h-5 text-emerald-600 mr-3" />
              Recent Activity
            </h3>

            <div className="space-y-4">
              {stats.recentActivity.slice(0, 4).map((activity: any, index: number) => (
                <div
                  key={index}
                  className="group flex items-center space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <EyeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500">by {activity.author.username}</p>
                  </div>
                  <div className="text-xs text-slate-400">{new Date(activity.created_at).toLocaleDateString()}</div>
                </div>
              ))}

              {stats.recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EyeIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium mb-1">No recent activity</p>
                  <p className="text-slate-400 text-sm">Start exploring to see your activity here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
