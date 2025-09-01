"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { getVideoByStatus, deleteVideo, rejectVideo } from "@/api/content"
import {
  SearchIcon,
  AlertCircleIcon,
  VideoIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  EyeIcon,
  MoreVerticalIcon,
  TrashIcon,
  CalendarIcon,
  XIcon,
  PlayIcon,
  RefreshCwIcon,
  ClockIcon,
  CheckCircleIcon,
  EditIcon,
  XCircleIcon,
} from "lucide-react"
import Video from "@/components/Video"
import TipTapContentDisplay from "@/components/tiptap-content-display"

interface Commenter {
  email: string
  id: number
  role: string
  username: string
}

interface Comment {
  id: number
  video_id: number
  comment: string
  commented_at: string
  commented_by: number
  commenter: Commenter
}

interface Author {
  email: string
  id: number
  role: string
  username: string
}

interface VideoType {
  video_id: any
  videoId: any
  id: number
  title: string
  description: string
  creator: Author
  created_at: string
  created_by: number
  comments: Comment[]
  comments_count: number
  liked_by: number[]
  likes: number
  status?: string
  video: string
  thumbnail: string
  duration: number
  duration_formatted: string
  views: number
  viewed_by: number[]
  format: string
  archived: boolean
  is_liked: boolean
  is_viewed: boolean
}

const IMAGE_BASE_URL = "http://116.202.210.102:5055/"

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAuthor, setFilterAuthor] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<VideoType | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoToView, setVideoToView] = useState<VideoType | null>(null)
  const [activeTab, setActiveTab] = useState<"published" | "rejected">("published")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [videoToReject, setVideoToReject] = useState<VideoType | null>(null)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectError, setRejectError] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [reasonError, setReasonError] = useState("")

  // Video player states
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const deleteModalRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const videoModalRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const rejectModalRef = useRef<HTMLDivElement>(null) // Added reject modal ref

  useEffect(() => {
    fetchVideos()
  }, [activeTab]) // Added activeTab dependency to refetch when tab changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node) && showDeleteModal) {
        setShowDeleteModal(false)
      }
      if (videoModalRef.current && !videoModalRef.current.contains(event.target as Node) && showVideoModal) {
        setShowVideoModal(false)
      }
      if (rejectModalRef.current && !rejectModalRef.current.contains(event.target as Node) && showRejectModal) {
        setShowRejectModal(false)
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDeleteModal, showVideoModal, showRejectModal]) // Added showRejectModal dependency

  // Initialize video when component mounts
  useEffect(() => {
    if (videoRef.current && videoToView?.video) {
      videoRef.current.load()
    }
  }, [videoToView?.video])

  const fetchVideos = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await getVideoByStatus(activeTab)
      if (response?.data?.videos) {
        setVideos(response.data.videos)
      } else if (response?.videos) {
        setVideos(response.videos)
      } else {
        setError("Failed to fetch videos data - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
      setError("Failed to fetch videos. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVideo = async (videoId: number) => {
    setIsDeleting(true)
    setDeleteError("")
    try {
      const response = await deleteVideo(videoId)
      if (
        response?.status === 200 ||
        response?.status === 204 ||
        response?.success === true ||
        response?.message?.toLowerCase().includes("success") ||
        response?.data?.success === true
      ) {
        setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId))
        setShowDeleteModal(false)
        setVideoToDelete(null)
      } else {
        setDeleteError(
          `Failed to delete video. Server response: ${response?.status || response?.message || "Unknown error"}`,
        )
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setDeleteError("Video not found. It may have already been deleted.")
      } else if (error?.response?.status === 403) {
        setDeleteError("You don't have permission to delete this video.")
      } else if (error?.response?.status === 401) {
        setDeleteError("Authentication failed. Please log in again.")
      } else {
        setDeleteError(`Failed to delete video: ${error?.message || error?.response?.data?.message || "Network error"}`)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRejectVideo = async (videoId: number) => {
    // Validate reason has at least 10 words
    const wordCount = rejectReason
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    if (wordCount < 10) {
      setReasonError("Rejection reason must be at least 10 words long")
      return
    }

    setIsRejecting(true)
    setRejectError("")
    setReasonError("")
    try {
      const response = await rejectVideo(videoId, rejectReason)
      if (
        response?.status === 200 ||
        response?.status === 204 ||
        response?.success === true ||
        response?.message?.toLowerCase().includes("success") ||
        response?.data?.success === true
      ) {
        setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId))
        setShowRejectModal(false)
        setVideoToReject(null)
        setRejectReason("")
      } else {
        setRejectError(
          `Failed to reject video. Server response: ${response?.status || response?.message || "Unknown error"}`,
        )
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setRejectError("Video not found. It may have already been processed.")
      } else if (error?.response?.status === 403) {
        setRejectError("You don't have permission to reject this video.")
      } else if (error?.response?.status === 401) {
        setRejectError("Authentication failed. Please log in again.")
      } else {
        setRejectError(`Failed to reject video: ${error?.message || error?.response?.data?.message || "Network error"}`)
      }
    } finally {
      setIsRejecting(false)
    }
  }

  const handleRejectClick = (video: VideoType) => {
    setVideoToReject(video)
    setShowRejectModal(true)
    setShowActionMenu(null)
    setRejectReason("")
    setRejectError("")
    setReasonError("")
  }

  const handleDeleteClick = (video: VideoType) => {
    setVideoToDelete(video)
    setShowDeleteModal(true)
    setShowActionMenu(null)
    setDeleteError("")
  }

  const handleVideoDoubleClick = (video: VideoType) => {
    
    setVideoToView(video)
    setShowVideoModal(true)
    setShowActionMenu(null)
    // Reset video player states
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
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

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Video player functions
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
        })
      }
    }
  }

  const handleVideoPlay = () => {
    setIsPlaying(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      videoRef.current.volume = volume
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (videoRef.current && !isNaN(time)) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.creator.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterAuthor === "all" || video.creator.username === filterAuthor
    return matchesSearch && matchesFilter
  })

  const authors = ["all", ...Array.from(new Set(videos.map((video) => video.creator.username)))]

  const totalVideos = videos.length
  const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0)
  const totalComments = videos.reduce((sum, video) => sum + video.comments_count, 0)
  const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0)
  const totalDuration = videos.reduce((sum, video) => sum + (video.duration || 0), 0)

  // Format total duration
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600)
    const minutes = Math.floor((totalDuration % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl mb-4 md:mb-0 md:mr-6 shadow-lg">
              <VideoIcon className="w-5 h-5 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-purple-900 bg-clip-text text-transparent mb-4">
                Video Management
              </h1>
              <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0">
                Monitor and manage all video content across the platform
              </p>
            </div>
          </div>
        </div>


        {/* Quick Actions */}
        {/* <div className="flex justify-center mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-2xl hover:from-red-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Video
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium border border-gray-200">
              <BarChart3Icon className="w-5 h-5 mr-2" />
              Analytics Dashboard
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium border border-gray-200">
              <DownloadIcon className="w-5 h-5 mr-2" />
              Export Data
            </button>
          </div>
        </div> */}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="group relative overflow-hidden bg-white backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <VideoIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{totalVideos}</div>
                  <div className="text-xs md:text-sm font-medium text-red-600">Total Videos</div>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-white backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <EyeIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
                  <div className="text-xs md:text-sm font-medium text-indigo-600">Total Views</div>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-white backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ThumbsUpIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{totalLikes.toLocaleString()}</div>
                  <div className="text-xs md:text-sm font-medium text-purple-600">Total Likes</div>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-white backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircleIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{totalComments.toLocaleString()}</div>
                  <div className="text-xs md:text-sm font-medium text-green-600">Total Comments</div>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-white backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ClockIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{formatTotalDuration()}</div>
                  <div className="text-xs md:text-sm font-medium text-amber-600">Total Duration</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={fetchVideos}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 border-b border-gray-200/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeTab === "published" ? "Published Videos" : "Rejected Videos"}
                </h2>
                <p className="text-gray-600">
                  {activeTab === "published"
                    ? "Manage and monitor all published video content. Double-click any video to view details."
                    : "Review and manage rejected video content."}
                </p>
              </div>
              <button
                onClick={fetchVideos}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-2xl hover:from-red-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl font-medium"
              >
                <RefreshCwIcon className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Refreshing..." : "Refresh Videos"}
              </button>
            </div>

            <div className="flex flex-col md:flex-row space-x-2 mt-8 bg-gray-200 rounded-2xl p-1">
              <button
                onClick={() => setActiveTab("published")}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "published" ? "bg-white text-red-700 shadow-md" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Published Videos
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "rejected" ? "bg-white text-red-700 shadow-md" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Rejected Videos
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mt-8">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search videos by title, description, or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:p-8">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl mb-6 animate-pulse">
                  <VideoIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading videos...</h3>
                <p className="text-gray-600">Please wait while we fetch the video content</p>
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid gap-8">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-2xl hover:border-red-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleVideoDoubleClick(video)}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Thumbnail */}
                      {video.thumbnail && (
                        <div className="lg:w-64 lg:h-36 w-full h-48 flex-shrink-0 relative overflow-hidden rounded-xl shadow-md">
                          <Image
                            src={getImageUrl(video.thumbnail) || "/placeholder.svg"}
                            alt={video.title}
                            width={256}
                            height={144}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <PlayIcon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          {video.duration_formatted && (
                            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                              {video.duration_formatted}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                              {video.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 line-clamp-2">
                              {generateExcerpt(video.description, 180)}
                            </p>
                          </div>

                          {/* Action Menu */}
                          <div className="relative ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowActionMenu(showActionMenu === video.id.toString() ? null : video.id.toString())
                              }}
                              className="p-2 hover:bg-gray-100 rounded-xl transition-colors opacity-100"
                            >
                              <MoreVerticalIcon className="w-5 h-5 text-gray-500" />
                            </button>
                            {showActionMenu === video.id.toString() && (
                              <div
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-20"
                                ref={actionMenuRef}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleVideoDoubleClick(video)
                                  }}
                                  className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                >
                                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <EyeIcon className="w-4 h-4 text-amber-600" />
                                  </div>
                                  <span className="font-medium text-gray-900">View Content</span>
                                </button>
                                {activeTab === "published" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRejectClick(video)
                                    }}
                                    className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-red-50 transition-colors"
                                  >
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                      <XCircleIcon className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="font-medium text-red-600">Reject Video</span>
                                  </button>
                                )}

                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-xs">
                                {video.creator.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">by {video.creator.username}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(video.created_at)}</span>
                          </div>
                          <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            ID: {video.id}
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${activeTab === "published" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                          >
                            {activeTab === "published" ? (
                              <>
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                Published
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="w-3 h-3 mr-1" />
                                Rejected
                              </>
                            )}
                          </div>
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 rounded-xl">
                            <EyeIcon className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-medium text-indigo-700">{video.views || 0} views</span>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-xl">
                            <ThumbsUpIcon className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-purple-700">{video.likes} likes</span>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-xl">
                            <MessageCircleIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">{video.comments_count} comments</span>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-2 bg-amber-50 rounded-xl">
                            <ClockIcon className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-700">{video.duration_formatted}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                  <VideoIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeTab === "published" ? "No published videos found" : "No rejected videos found"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || filterAuthor !== "all"
                    ? "Try adjusting your search criteria or filters to find what you're looking for"
                    : activeTab === "published"
                      ? "No published videos are available at the moment."
                      : "No rejected videos are available at the moment."}
                </p>
                {(searchTerm || filterAuthor !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterAuthor("all")
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && videoToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div
              ref={deleteModalRef}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                      <AlertCircleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Delete Video</h3>
                      <p className="text-red-600 text-sm">This action cannot be undone</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setVideoToDelete(null)
                      setDeleteError("")
                    }}
                    className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-start space-x-4">
                    {videoToDelete.thumbnail && (
                      <div className="w-24 h-16 relative flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(videoToDelete.thumbnail) || "/placeholder.svg"}
                          alt={videoToDelete.title}
                          width={96}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <PlayIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">{videoToDelete.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{generateExcerpt(videoToDelete.description, 100)}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>by {videoToDelete.creator.username}</span>
                        <span>{formatDate(videoToDelete.created_at)}</span>
                        <span>{videoToDelete.views || 0} views</span>
                        <span>{videoToDelete.likes} likes</span>
                        <span>{videoToDelete.comments_count} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Are you sure you want to delete <strong>"{videoToDelete.title}"</strong>? This will permanently remove
                  the video and all associated data including comments and likes.
                </p>
                {deleteError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-4 h-4 text-red-600" />
                      <p className="text-red-800 text-sm">{deleteError}</p>
                    </div>
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setVideoToDelete(null)
                      setDeleteError("")
                    }}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(videoToDelete.id)}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-lg"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete Video
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && videoToView && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div
              ref={videoModalRef}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all duration-200"
            >
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{videoToView.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>by {videoToView.creator.username}</span>
                      <span className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(videoToView.created_at)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{videoToView.views || 0} views</span>
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Admin View</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowVideoModal(false)
                      setVideoToView(null)
                      setIsPlaying(false)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                  >
                    <XIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] ">
                {/* Video Player */}
                <div className="mb-8">
                  <div className="relative bg-black rounded-2xl overflow-hidden">
                    {/* Video Controls */}
                    <Video videoId={videoToView.video_id}></Video>
                  </div>
                </div>

                {/* Video Description */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Description</h4>
                  <div className="prose prose-lg prose-slate max-w-none bg-gray-50 p-6 rounded-2xl">
                    <TipTapContentDisplay content={videoToView.description} className="text-gray-700" />
                  </div>
                </div>

                {/* Video Details */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Video Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium text-gray-900">{videoToView.format || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">{videoToView.duration_formatted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">Published</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Archived:</span>
                        <span className="font-medium text-gray-900">{videoToView.archived ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Creator Information</h4>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold">
                          {videoToView.creator.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{videoToView.creator.username}</p>
                        <p className="text-gray-600">{videoToView.creator.email}</p>
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium mt-2">
                          {videoToView.creator.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {videoToView.comments && videoToView.comments.length > 0 ? (
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                      <MessageCircleIcon className="w-5 h-5" />
                      <span>Comments ({videoToView.comments_count})</span>
                    </h4>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {videoToView.comments
                        .sort((a, b) => new Date(b.commented_at).getTime() - new Date(a.commented_at).getTime())
                        .map((comment) => (
                          <div key={comment.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {comment.commenter.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="font-semibold text-gray-900">{comment.commenter.username}</span>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    {comment.commenter.role}
                                  </span>
                                  <span className="text-xs text-gray-500">{formatDate(comment.commented_at)}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <MessageCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">No comments yet</h4>
                    <p className="text-gray-600">This video has not received any comments.</p>
                  </div>
                )}
              </div>
            </div>

            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #ffffff;
                cursor: pointer;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }

              .slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #ffffff;
                cursor: pointer;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
            `}</style>
          </div>
        )}

        {showRejectModal && videoToReject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div
              ref={rejectModalRef}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                      <XCircleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Reject Video</h3>
                      <p className="text-red-600 text-sm">This will move the video to rejected status</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowRejectModal(false)
                      setVideoToReject(null)
                      setRejectError("")
                      setRejectReason("")
                      setReasonError("")
                    }}
                    className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-start space-x-4">
                    {videoToReject.thumbnail && (
                      <div className="w-24 h-16 relative flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(videoToReject.thumbnail) || "/placeholder.svg"}
                          alt={videoToReject.title}
                          width={96}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <PlayIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">{videoToReject.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{generateExcerpt(videoToReject.description, 100)}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>by {videoToReject.creator.username}</span>
                        <span>{formatDate(videoToReject.created_at)}</span>
                        <span>{videoToReject.views || 0} views</span>
                        <span>{videoToReject.likes} likes</span>
                        <span>{videoToReject.comments_count} comments</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Are you sure you want to reject <strong>"{videoToReject.title}"</strong>? This will change the video
                  status to rejected and it will no longer be visible to users.
                </p>

                <div className="mb-6">
                  <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value)
                      if (reasonError) setReasonError("")
                    }}
                    placeholder="Please provide a detailed reason for rejecting this video (minimum 10 words)..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                    rows={4}
                    disabled={isRejecting}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Word count:{" "}
                      {
                        rejectReason
                          .trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length
                      }{" "}
                      / 10 minimum
                    </p>
                  </div>
                </div>

                {reasonError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-4 h-4 text-red-600" />
                      <p className="text-red-800 text-sm">{reasonError}</p>
                    </div>
                  </div>
                )}

                {rejectError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-4 h-4 text-red-600" />
                      <p className="text-red-800 text-sm">{rejectError}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false)
                      setVideoToReject(null)
                      setRejectError("")
                      setRejectReason("")
                      setReasonError("")
                    }}
                    disabled={isRejecting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectVideo(videoToReject.id)}
                    disabled={isRejecting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-lg"
                  >
                    {isRejecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Rejecting...
                      </>
                    ) : (
                      "Reject Video"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
