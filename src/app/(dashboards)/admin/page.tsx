"use client"

import { useState, useEffect } from "react"
import { getAllUser } from "@/api/user"
import { getBlogByStatus } from "@/api/content"
import { getVideoByStatus } from "@/api/content"
import { UsersIcon, FileTextIcon, VideoIcon, EyeIcon, ClockIcon } from "lucide-react"
import Link from "next/link"
import Loader2 from "@/components/Loader2"


interface User {
  id: number
  username: string
  email: string
  role: "Creator" | "Viewer"
}

interface Blog {
  id: number
  title: string
  content: string
  author: any
  created_at: string
  comments_count: number
  likes: number
}

interface Video {
  id: number
  title: string
  description: string
  creator: any
  created_at: string
  comments_count: number
  likes: number
  views: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([])
  const [pendingVideos, setPendingVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    if(!localStorage.getItem("access_token")) {
        window.location.href = "/login";
        return;
    }
    fetchData()
    setLoading(false)
  }, [])

  const fetchData = async () => {
    try {
      // Fetch users
      const usersResponse = await getAllUser()
      if (usersResponse?.data?.users) {
        setUsers(usersResponse.data.users)
      } else if (usersResponse?.users) {
        setUsers(usersResponse.users)
      }

      // Fetch published blogs
      const blogsResponse = await getBlogByStatus("published")
      if (blogsResponse?.data?.blogs) {
        setBlogs(blogsResponse.data.blogs)
      } else if (blogsResponse?.blogs) {
        setBlogs(blogsResponse.blogs)
      }

      // Fetch published videos
      const videosResponse = await getVideoByStatus("published")
      if (videosResponse?.data?.videos) {
        setVideos(videosResponse.data.videos)
      } else if (videosResponse?.videos) {
        setVideos(videosResponse.videos)
      }

      // Fetch pending blogs
      const pendingBlogsResponse = await getBlogByStatus("pending_approval")
      if (pendingBlogsResponse?.data?.blogs) {
        setPendingBlogs(pendingBlogsResponse.data.blogs)
      } else if (pendingBlogsResponse?.blogs) {
        setPendingBlogs(pendingBlogsResponse.blogs)
      }

      // Fetch pending videos
      const pendingVideosResponse = await getVideoByStatus("pending_approval")
      if (pendingVideosResponse?.data?.videos) {
        setPendingVideos(pendingVideosResponse.data.videos)
      } else if (pendingVideosResponse?.videos) {
        setPendingVideos(pendingVideosResponse.videos)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  const totalUsers = users.length
  const creatorUsers = users.filter((user) => user.role === "Creator").length
  const viewerUsers = users.filter((user) => user.role === "Viewer").length
  const totalBlogs = blogs.length
  const totalVideos = videos.length
  const totalBlogLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  const totalVideoLikes = videos.reduce((sum, video) => sum + video.likes, 0)
  const totalBlogComments = blogs.reduce((sum, blog) => sum + blog.comments_count, 0)
  const totalVideoComments = videos.reduce((sum, video) => sum + video.comments_count, 0)
  const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0)
  const totalPendingBlogs = pendingBlogs.length
  const totalPendingVideos = pendingVideos.length

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: UsersIcon,
      color: "blue",
      href: "/admin/users",
      subtitle: `${creatorUsers} Creators, ${viewerUsers} Viewers`,
    },
    {
      title: "Blog Posts",
      value: totalBlogs,
      icon: FileTextIcon,
      color: "purple",
      href: "/admin/blogs",
      subtitle: `${totalBlogLikes} likes, ${totalBlogComments} comments`,
    },
    {
      title: "Videos",
      value: totalVideos,
      icon: VideoIcon,
      color: "red",
      href: "/admin/videos",
      subtitle: `${totalViews} views, ${totalVideoLikes} likes`,
    },
    {
      title: "Pending Approval",
      value: totalPendingBlogs + totalPendingVideos,
      icon: ClockIcon,
      color: "yellow",
      href: "/admin/pending",
      subtitle: `${totalPendingBlogs} blogs, ${totalPendingVideos} videos`,
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      red: "bg-red-100 text-red-600",
      yellow: "bg-yellow-100 text-yellow-600",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if(loading){
    return <Loader2></Loader2>
  }

  return (
    
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard 🛡️</h2>
        <p className="text-slate-600">Welcome back! Here's what's happening on your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">{stat.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Manage Users</p>
                <p className="text-sm text-slate-500">View and manage user accounts</p>
              </div>
            </Link>

            <Link
              href="/admin/pending"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Review Pending Content</p>
                <p className="text-sm text-slate-500">Approve or reject pending submissions</p>
              </div>
            </Link>

          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Platform Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Content</span>
              <span className="font-semibold text-slate-800">{totalBlogs + totalVideos}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Engagement</span>
              <span className="font-semibold text-slate-800">
                {totalBlogLikes + totalVideoLikes + totalBlogComments + totalVideoComments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Pending Reviews</span>
              <span className="font-semibold text-slate-800">{totalPendingBlogs + totalPendingVideos}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Active Users</span>
              <span className="font-semibold text-slate-800">{totalUsers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
