"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getVideoByStatus, deleteVideo } from "@/api/content"
import {
  SearchIcon,
  AlertCircleIcon,
  VideoIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  EyeIcon,
  MoreVerticalIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  XIcon,
  PlayIcon,
} from "lucide-react"

interface Author {
  email: string
  id: number
  role: string
  username: string
}

interface Video {
  id: number
  title: string
  description: string
  creator: Author
  created_at: string
  created_by: number
  comments: any[]
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

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAuthor, setFilterAuthor] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const deleteModalRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node) && showDeleteModal) {
        setShowDeleteModal(false)
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDeleteModal])

  const fetchVideos = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await getVideoByStatus("published")
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

  const handleDeleteClick = (video: Video) => {
    setVideoToDelete(video)
    setShowDeleteModal(true)
    setShowActionMenu(null)
    setDeleteError("")
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Video Management</h2>
        <p className="text-slate-600">Manage published videos and content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Videos</p>
              <p className="text-2xl font-bold text-slate-800">{totalVideos}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Views</p>
              <p className="text-2xl font-bold text-slate-800">{totalViews}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Likes</p>
              <p className="text-2xl font-bold text-slate-800">{totalLikes}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ThumbsUpIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Comments</p>
              <p className="text-2xl font-bold text-slate-800">{totalComments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircleIcon className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchVideos}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Video Management */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-800">Published Videos</h3>
            <button
              onClick={fetchVideos}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Refresh Videos"}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author === "all" ? "All Authors" : author}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading videos...</p>
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:border-red-300 hover:shadow-sm transition-all duration-200"
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
                  <div className="relative ml-4" ref={actionMenuRef}>
                    <button
                      onClick={() =>
                        setShowActionMenu(showActionMenu === video.id.toString() ? null : video.id.toString())
                      }
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                    </button>
                    {showActionMenu === video.id.toString() && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                        <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                          <EyeIcon className="w-4 h-4" />
                          <span>View Video</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(video)}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Delete Video</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <VideoIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No videos found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || filterAuthor !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No videos available at the moment"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Video Modal */}
      {showDeleteModal && videoToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Confirm Video Deletion</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setVideoToDelete(null)
                    setDeleteError("")
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">Delete Video</h4>
                  <p className="text-slate-600 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div>
                  <p className="font-medium text-slate-800 mb-1">{videoToDelete.title}</p>
                  <p className="text-sm text-slate-600 mb-2">{generateExcerpt(videoToDelete.description, 100)}</p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>by {videoToDelete.creator.username}</span>
                    <span>{formatDate(videoToDelete.created_at)}</span>
                    <span>{videoToDelete.views || 0} views</span>
                    <span>{videoToDelete.likes} likes</span>
                    <span>{videoToDelete.comments_count} comments</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-6">
                Are you sure you want to delete <strong>"{videoToDelete.title}"</strong>? This will permanently remove
                the video and all associated data including comments and likes.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircleIcon className="w-4 h-4 text-red-600" />
                    <p className="text-red-800 text-sm">{deleteError}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setVideoToDelete(null)
                    setDeleteError("")
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteVideo(videoToDelete.id)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
    </div>
  )
}
