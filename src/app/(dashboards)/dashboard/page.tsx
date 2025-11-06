"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { getCreatorData } from "@/api/user"
import {
  FileTextIcon,
  VideoIcon,
  TrendingUpIcon,
  EyeIcon,
  ArrowRightIcon,
  SparklesIcon,
  BarChart3Icon,
  Loader2Icon,
} from "lucide-react"
import Loader2 from "@/components/Loader2"
import Lottie from "lottie-react";
import logoAnimation from "@/assets/logo animation.json";
import bannerBg from "@/assets/LSbg.jpg";


interface BlogStats {
  archived: number
  draft: number
  pending_approval: number
  published: number
  rejected: number
  total: number
  total_likes: number
  total_views: number
}

interface VideoStats {
  archived: number
  draft: number
  pending_approval: number
  published: number
  rejected: number
  total: number
  total_likes: number
  total_views: number
  total_watch_time: number
}

interface OverallStats {
  total_content: number
  total_likes: number
  total_views: number
}

interface CreatorData {
  statistics: {
    blogs: BlogStats
    videos: VideoStats
    overall: OverallStats
  }
  user: {
    email: string
    id: number
    profile_picture: string
    role: string
    username: string
  }
}


export default function CreatorDashboard() {
  const router = useRouter()
  const reduxUser = useSelector((state: any) => state.user)
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        setLoading(true)
        const response = await getCreatorData()
        const data = response.data;
        setCreatorData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
        console.error("Error fetching creator data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCreatorData()
  }, [])

  const user = creatorData?.user || reduxUser

  if (loading) {
    return (
      <Loader2></Loader2>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const stats = creatorData?.statistics

  const contentTypes = [
    {
      title: "Blog Management",
      description: "Create, edit, and manage your blog posts. Share your thoughts and expertise with your audience.",
      icon: FileTextIcon,
      href: "/dashboard/blogs",
      color: "from-indigo-600 to-purple-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      stats: `${stats?.blogs.total || 0} blogs`,
      publishedStats: `${stats?.blogs.published || 0} published`,
      draftStats: `${stats?.blogs.draft || 0} drafts`,
      features: ["Rich text editor", "Image uploads", "SEO optimization", "Draft management"],
    },
    {
      title: "Video Management",
      description: "Upload, organize, and manage your video content. Engage your audience with visual storytelling.",
      icon: VideoIcon,
      href: "/dashboard/videos",
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      stats: `${stats?.videos.total || 0} videos`,
      publishedStats: `${stats?.videos.published || 0} published`,
      draftStats: `${stats?.videos.draft || 0} drafts`,
      features: ["Video uploads", "Thumbnail management", "Comments system", "Analytics tracking"],
    },
  ]

  const quickActions = [
    {
      title: "Create New Blog",
      description: "Start writing your next blog post",
      icon: FileTextIcon,
      action: () => router.push("/dashboard/blogs"),
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "Upload Video",
      description: "Share your latest video content",
      icon: VideoIcon,
      action: () => router.push("/dashboard/videos"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  return (
    <div className="min-h-screen p-2 md:p-4">
      <div className="max-w-full mx-auto">
        {/* Hero Banner */}
        <div
  className="relative overflow-hidden rounded-4xl mb-8"
  style={{
    backgroundImage: `
      url(${bannerBg.src})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 md:px-15 py-9 md:py-10">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-2 mb-4">
                <SparklesIcon className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-300 font-medium">Creator Dashboard</span>
              </div>
              <h1 className="text-xl md:text-4xl font-bold text-white mb-4">
                Welcome back, {user?.username || "Creator"}! 👋
              </h1>
              <p className="text-base md:text-lg text-indigo-100 mb-8 leading-relaxed">
                Your creative hub awaits. <br />
                Manage your content, track your progress, <br /> and engage with your audience all in
                one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/dashboard/blogs")}
                  className="inline-flex items-center px-6 py-3 cursor-pointer bg-indigo-600 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors text-sm md:text-base"
                >
                  <FileTextIcon className="w-3 h-3 md:w-5 md:h-5 mr-2" />
                  Create Blog
                </button>
                <button
                  onClick={() => router.push("/dashboard/videos")}
                  className="inline-flex items-center px-6 py-3 cursor-pointer bg-purple-600 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors text-sm md:text-base"
                >
                  <VideoIcon className="w-3 h-3 md:w-5 md:h-5 mr-2" />
                  Create Video
                </button>
                <button
                  onClick={() => {
                    router.push("/dashboard/analytics")
                  }}
                  className="inline-flex items-center px-6 py-3 cursor-pointer bg-[#34A0B8] text-white rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm text-sm md:text-base"
                >
                  <BarChart3Icon className="w-3 h-3 md:w-5 md:h-5 mr-2" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>

         {/* Flock Animation - Visible on Large Screens (Desktop & Nest Hub) */}
<div className="absolute -right-30 top--1 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
  <div className="w-[580px] h-[580px] xl:w-[820px] xl:h-[820px]">
    <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl"></div>
    <Lottie
      animationData={logoAnimation}
      loop
      autoplay
      className="relative z-10 drop-shadow-xl"
    />
  </div>
</div>

          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 right-12 -mb-8 w-16 h-16 bg-yellow-300/20 rounded-full"></div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Blogs</p>
                <p className="text-2xl font-bold text-slate-800">{stats?.blogs.total || 0}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {stats?.blogs.published || 0} published • {stats?.blogs.draft || 0} drafts
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileTextIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Videos</p>
                <p className="text-2xl font-bold text-slate-800">{stats?.videos.total || 0}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {stats?.videos.published || 0} published • {stats?.videos.draft || 0} drafts
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <VideoIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-800">
                  {(stats?.overall.total_views || 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Blogs: {stats?.blogs.total_views || 0} • Videos: {stats?.videos.total_views || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Likes</p>
                <p className="text-2xl font-bold text-slate-800">{stats?.overall.total_likes || 0}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Blogs: {stats?.blogs.total_likes || 0} • Videos: {stats?.videos.total_likes || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Types */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Content Management</h2>
              <p className="text-slate-600 text-sm md:text-base">Choose the type of content you want to create or manage</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {contentTypes.map((type) => (
                <div
                  key={type.title}
                  className="group bg-white rounded-4xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer"
                  onClick={() => router.push(type.href)}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <div
                      className={`w-10 h-10 md:w-14 md:h-14 ${type.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <type.icon className={`w-5 h-5 md:w-7 md:h-7 ${type.iconColor}`} />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {type.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm md:text-base">{type.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{type.stats}</span>
                      <span className="text-xs text-slate-500">
                        {type.publishedStats} • {type.draftStats}
                      </span>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                        <span className="text-xs text-slate-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Stats Section */}
            <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Content Status Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blog Status */}
                <div>
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                    <FileTextIcon className="w-4 h-4 mr-2 text-indigo-600" />
                    Blog Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Published</span>
                      <span className="text-sm font-medium text-green-600">{stats?.blogs.published || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Drafts</span>
                      <span className="text-sm font-medium text-yellow-600">{stats?.blogs.draft || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Rejected</span>
                      <span className="text-sm font-medium text-red-600">{stats?.blogs.rejected || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Video Status */}
                <div>
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                    <VideoIcon className="w-4 h-4 mr-2 text-purple-600" />
                    Video Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Published</span>
                      <span className="text-sm font-medium text-green-600">{stats?.videos.published || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Drafts</span>
                      <span className="text-sm font-medium text-yellow-600">{stats?.videos.draft || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Rejected</span>
                      <span className="text-sm font-medium text-red-600">{stats?.videos.rejected || 0}</span>
                    </div>
                    {stats?.videos.total_watch_time && (
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-sm text-slate-600">Total Watch Time</span>
                        <span className="text-sm font-medium text-purple-600">
                          {Math.round((stats.videos.total_watch_time || 0) / 60)} min
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
