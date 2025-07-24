"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getBlogByStatus, getVideoByStatus, approveBlog, rejectBlog, approveVideo, rejectVideo } from "@/api/content"
import {
  ClockIcon,
  FileTextIcon,
  VideoIcon,
  SearchIcon,
  MoreVerticalIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
  UserIcon,
  CalendarIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  PlayIcon,
} from "lucide-react"

interface Author {
  email: string
  id: number
  role: string
  username: string
}

interface Blog {
  id: number
  title: string
  content: string
  author: Author
  created_at: string
  comments_count: number
  likes: number
  image?: string
}

interface Video {
  id: number
  title: string
  description: string
  creator: Author
  created_at: string
  comments_count: number
  likes: number
  views: number
  thumbnail: string
  duration_formatted: string
}

const IMAGE_BASE_URL = "http://116.202.210.102:5055/"

export default function PendingPage() {
  const [activeTab, setActiveTab] = useState<"blogs" | "videos">("blogs")
  const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([])
  const [pendingVideos, setPendingVideos] = useState<Video[]>([])
  const [loadingBlogs, setLoadingBlogs] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [blogSearchTerm, setBlogSearchTerm] = useState("")
  const [videoSearchTerm, setVideoSearchTerm] = useState("")
  const [showBlogActionMenu, setShowBlogActionMenu] = useState<string | null>(null)
  const [showVideoActionMenu, setShowVideoActionMenu] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const blogActionMenuRef = useRef<HTMLDivElement>(null)
  const videoActionMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPendingBlogs()
    fetchPendingVideos()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (blogActionMenuRef.current && !blogActionMenuRef.current.contains(event.target as Node)) {
        setShowBlogActionMenu(null)
      }
      if (videoActionMenuRef.current && !videoActionMenuRef.current.contains(event.target as Node)) {
        setShowVideoActionMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchPendingBlogs = async () => {
    setLoadingBlogs(true)
    try {
      const response = await getBlogByStatus("pending_approval")
      if (response?.data?.blogs) {
        setPendingBlogs(response.data.blogs)
      } else if (response?.blogs) {
        setPendingBlogs(response.blogs)
      }
    } catch (error) {
      console.error("Error fetching pending blogs:", error)
    } finally {
      setLoadingBlogs(false)
    }
  }

  const fetchPendingVideos = async () => {
    setLoadingVideos(true)
    try {
      const response = await getVideoByStatus("pending_approval")
      if (response?.data?.videos) {
        setPendingVideos(response.data.videos)
      } else if (response?.videos) {
        setPendingVideos(response.videos)
      }
    } catch (error) {
      console.error("Error fetching pending videos:", error)
    } finally {
      setLoadingVideos(false)
    }
  }

  const handleApproveBlog = async (blogId: number) => {
    setIsApproving(true)
    try {
      const response = await approveBlog(blogId)
      if (response?.status === 200 || response?.status === 201 || response?.success === true) {
        setPendingBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
        setShowBlogActionMenu(null)
      }
    } catch (error) {
      console.error("Error approving blog:", error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectBlog = async (blogId: number) => {
    setIsRejecting(true)
    try {
      const response = await rejectBlog(blogId)
      if (response?.status === 200 || response?.status === 201 || response?.success === true) {
        setPendingBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
        setShowBlogActionMenu(null)
      }
    } catch (error) {
      console.error("Error rejecting blog:", error)
    } finally {
      setIsRejecting(false)
    }
  }

  const handleApproveVideo = async (videoId: number) => {
    setIsApproving(true)
    try {
      const response = await approveVideo(videoId)
      if (response?.status === 200 || response?.status === 201 || response?.success === true) {
        setPendingVideos((prev) => prev.filter((video) => video.id !== videoId))
        setShowVideoActionMenu(null)
      }
    } catch (error) {
      console.error("Error approving video:", error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectVideo = async (videoId: number) => {
    setIsRejecting(true)
    try {
      const response = await rejectVideo(videoId)
      if (response?.status === 200 || response?.status === 201 || response?.success === true) {
        setPendingVideos((prev) => prev.filter((video) => video.id !== videoId))
        setShowVideoActionMenu(null)
      }
    } catch (error) {
      console.error("Error rejecting video:", error)
    } finally {
      setIsRejecting(false)
    }
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null
    return imagePath.startsWith("http") ? imagePath : `${IMAGE_BASE_URL}${imagePath}`
  }

  const generateExcerpt = (content: string, maxLength = 100): string => {
    const textContent = content.replace(/<[^>]*>/g, "")
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredPendingBlogs = pendingBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(blogSearchTerm.toLowerCase())
    return matchesSearch
  })

  const filteredPendingVideos = pendingVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
      video.creator.username.toLowerCase().includes(videoSearchTerm.toLowerCase())
    return matchesSearch
  })

  const totalPendingBlogs = pendingBlogs.length
  const totalPendingVideos = pendingVideos.length
  const totalPending = totalPendingBlogs + totalPendingVideos

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Pending Approvals</h2>
        <p className="text-slate-600">Review and approve pending content submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Pending</p>
              <p className="text-2xl font-bold text-slate-800">{totalPending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Blogs</p>
              <p className="text-2xl font-bold text-slate-800">{totalPendingBlogs}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileTextIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Videos</p>
              <p className="text-2xl font-bold text-slate-800">{totalPendingVideos}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "blogs"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileTextIcon className="w-4 h-4" />
                <span>Pending Blogs</span>
                <span className="bg-yellow-100 text-yellow-600 py-1 px-2 rounded-full text-xs">
                  {totalPendingBlogs}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "videos"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <VideoIcon className="w-4 h-4" />
                <span>Pending Videos</span>
                <span className="bg-yellow-100 text-yellow-600 py-1 px-2 rounded-full text-xs">
                  {totalPendingVideos}
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === "blogs" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-800">Pending Blog Approval</h3>
              <button
                onClick={fetchPendingBlogs}
                disabled={loadingBlogs}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {loadingBlogs ? "Refreshing..." : "Refresh Pending"}
              </button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pending blogs..."
                  value={blogSearchTerm}
                  onChange={(e) => setBlogSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {loadingBlogs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading pending blogs...</p>
              </div>
            ) : filteredPendingBlogs.length > 0 ? (
              <div className="space-y-4">
                {filteredPendingBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-start justify-between p-4 border border-yellow-200 rounded-lg hover:border-yellow-300 hover:shadow-sm transition-all duration-200 bg-yellow-50/30"
                  >
                    <div className="flex space-x-4 flex-1">
                      {blog.image && (
                        <div className="flex-shrink-0">
                          <Image
                            src={getImageUrl(blog.image) || "/placeholder.svg"}
                            alt={blog.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-800 text-lg">{blog.title}</h4>
                          <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
                            Pending Approval
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{generateExcerpt(blog.content, 150)}</p>
                        <div className="flex items-center space-x-6 text-sm text-slate-500 mb-2">
                          <span className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>by {blog.author.username}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(blog.created_at)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <ThumbsUpIcon className="w-3 h-3" />
                            <span>{blog.likes} likes</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircleIcon className="w-3 h-3" />
                            <span>{blog.comments_count} comments</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>ID: {blog.id}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative ml-4" ref={blogActionMenuRef}>
                      <button
                        onClick={() =>
                          setShowBlogActionMenu(showBlogActionMenu === blog.id.toString() ? null : blog.id.toString())
                        }
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                      </button>
                      {showBlogActionMenu === blog.id.toString() && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                            <EyeIcon className="w-4 h-4" />
                            <span>View Content</span>
                          </button>
                          <button
                            onClick={() => handleApproveBlog(blog.id)}
                            disabled={isApproving}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 disabled:opacity-50"
                          >
                            <CheckIcon className="w-4 h-4" />
                            <span>{isApproving ? "Approving..." : "Approve"}</span>
                          </button>
                          <button
                            onClick={() => handleRejectBlog(blog.id)}
                            disabled={isRejecting}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <XIcon className="w-4 h-4" />
                            <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No pending blogs</h3>
                <p className="text-slate-600 mb-4">
                  {blogSearchTerm ? "No pending blogs match your search" : "All blogs have been reviewed"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "videos" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-800">Pending Video Approval</h3>
              <button
                onClick={fetchPendingVideos}
                disabled={loadingVideos}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {loadingVideos ? "Refreshing..." : "Refresh Pending"}
              </button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pending videos..."
                  value={videoSearchTerm}
                  onChange={(e) => setVideoSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {loadingVideos ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading pending videos...</p>
              </div>
            ) : filteredPendingVideos.length > 0 ? (
              <div className="space-y-4">
                {filteredPendingVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-start justify-between p-4 border border-yellow-200 rounded-lg hover:border-yellow-300 hover:shadow-sm transition-all duration-200 bg-yellow-50/30"
                  >
                    <div className="flex space-x-4 flex-1">
                      {video.thumbnail && (
                        <div className="flex-shrink-0 relative">
                          <Image
                            src={getImageUrl(video.thumbnail) || "/placeholder.svg"}
                            alt={video.title}
                            width={120}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                            <PlayIcon className="w-8 h-8 text-white" />
                          </div>
                          {video.duration_formatted && (
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                              {video.duration_formatted}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-800 text-lg">{video.title}</h4>
                          <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
                            Pending Approval
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {generateExcerpt(video.description, 150)}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-slate-500 mb-2">
                          <span className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>by {video.creator.username}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(video.created_at)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <EyeIcon className="w-3 h-3" />
                            <span>{video.views || 0} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ThumbsUpIcon className="w-3 h-3" />
                            <span>{video.likes} likes</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircleIcon className="w-3 h-3" />
                            <span>{video.comments_count} comments</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>ID: {video.id}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative ml-4" ref={videoActionMenuRef}>
                      <button
                        onClick={() =>
                          setShowVideoActionMenu(
                            showVideoActionMenu === video.id.toString() ? null : video.id.toString(),
                          )
                        }
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                      </button>
                      {showVideoActionMenu === video.id.toString() && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                            <EyeIcon className="w-4 h-4" />
                            <span>View Video</span>
                          </button>
                          <button
                            onClick={() => handleApproveVideo(video.id)}
                            disabled={isApproving}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 disabled:opacity-50"
                          >
                            <CheckIcon className="w-4 h-4" />
                            <span>{isApproving ? "Approving..." : "Approve"}</span>
                          </button>
                          <button
                            onClick={() => handleRejectVideo(video.id)}
                            disabled={isRejecting}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <XIcon className="w-4 h-4" />
                            <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No pending videos</h3>
                <p className="text-slate-600 mb-4">
                  {videoSearchTerm ? "No pending videos match your search" : "All videos have been reviewed"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
