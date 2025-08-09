"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, MoreVerticalIcon, HeartIcon, XIcon, MessageCircleIcon, ThumbsUpIcon, PlayIcon, VideoIcon, AlertCircleIcon, CalendarIcon, EyeIcon, FilterIcon, RefreshCwIcon } from 'lucide-react'
import Image from "next/image"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"
import { VideoModal } from "@/components/viewer/video-modal"
import { getAllVideo, addCommentToVideo, toggleVideoLike, editVideoComment, deleteVideoComment, getFollowings, getAllVideoCretor } from "@/api/content"

interface Creator {
  email: string
  id: number
  role: string
  username: string
}

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

interface Video {
  id: number
  title: string
  description: string
  video: string
  thumbnail: string
  duration: number
  duration_formatted: string
  format: string
  views: number
  likes: number
  is_liked: boolean
  is_viewed: boolean
  created_at: string
  created_by: number
  creator: Creator
  comments: Comment[]
  comments_count: number
  liked_by: number[]
  viewed_by: number[]
  archived: boolean
  status: string
  // UI-only fields
  category?: string
  isFavorite?: boolean
  author?: Creator // For consistency with blog component
}

interface Following {
  email: string
  followers_count: string
  following_count: string
  id: string
  profile_picture: string | null
  role: string
  username: string
}

interface FollowingResponse {
  following: Following[]
  following_count: number
}

// Utility function to strip HTML tags and decode HTML entities
const stripHtmlAndDecode = (html: string): string => {
  if (!html) return ""
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html
  // Get text content (this automatically strips HTML tags)
  let text = tempDiv.textContent || tempDiv.innerText || ""
  // Additional cleanup for common HTML entities that might remain
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "...")
    .trim()
  return text
}

// Utility function to truncate text to a specific length
const truncateText = (text: string, maxLength = 120): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export default function VideoPage() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  
  // Video states
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  
  // Following states
  const [selectedFollowing, setSelectedFollowing] = useState<string>("all")
  const [followings, setFollowings] = useState<Following[]>([])
  const [followingCount, setFollowingCount] = useState<number>(0)
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false)
  const [followingError, setFollowingError] = useState("")
  
  // UI states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({})
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const contentMenuRef = useRef<HTMLDivElement>(null)

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
    
    // Fetch both following data and videos
    fetchFollowingData()
    fetchVideos()
  }, [user, router])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentMenuRef.current && !contentMenuRef.current.contains(event.target as Node)) {
        setShowContentMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch following data
  const fetchFollowingData = async () => {
    setIsLoadingFollowing(true)
    setFollowingError("")
    try {
      console.log("Fetching following data...")
      const response = await getFollowings()
      console.log("Following response:", response)
      
      if (response?.data) {
        const followingData: FollowingResponse = response.data
        if (followingData.following && Array.isArray(followingData.following)) {
          setFollowings(followingData.following)
          setFollowingCount(followingData.following_count || followingData.following.length)
          console.log("Following data set:", followingData.following)
        } else {
          console.error("Following data is not in expected format:", followingData)
          setFollowingError("Following data format is incorrect")
        }
      } else {
        console.error("No data in following response:", response)
        setFollowingError("No following data received")
      }
    } catch (error) {
      console.error("Error fetching following data:", error)
      setFollowingError("Failed to fetch following data")
    } finally {
      setIsLoadingFollowing(false)
    }
  }

  const fetchVideos = async () => {
    setFetchError("")
    setIsLoading(true)
    try {
      let response
      
      // If a specific following is selected, get their videos
      if (selectedFollowing !== "all") {
        const selectedUser = followings.find(f => f.username === selectedFollowing)
        if (selectedUser) {
          console.log("Fetching videos for creator:", selectedUser.id)
          response = await getAllVideoCretor(selectedUser.id)
        } else {
          console.log("Selected user not found, fetching all videos")
          response = await getAllVideo()
        }
      } else {
        // Get all videos
        console.log("Fetching all videos")
        response = await getAllVideo()
      }

      console.log("Video API Response:", response)
      
      if (response?.data?.videos) {
        const videosWithUIFields = response.data.videos
          .filter((video: any) => video.status === "published" && !video.archived)
          .map((video: any) => ({
            ...video,
            category: video.creator?.role === "Creator" ? "Educational" : "General",
            isFavorite: false,
            views: video.views || 0,
            author: video.creator,
            comments: video.comments || [],
            comments_count: video.comments_count || video.comments?.length || 0,
          }))
        setVideos(videosWithUIFields)
        console.log("Videos set:", videosWithUIFields.length)
        
        if (selectedVideo) {
          const updatedSelectedVideo = videosWithUIFields.find((video: any) => video.id === selectedVideo.id)
          if (updatedSelectedVideo) {
            setSelectedVideo(updatedSelectedVideo)
          }
        }
      } else {
        console.error("Unexpected API response structure:", response)
        setFetchError("Failed to fetch videos - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
      setFetchError("Failed to fetch videos. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update videos when selected following changes
  useEffect(() => {
    if (followings.length > 0 || selectedFollowing === "all") {
      console.log("Selected following changed:", selectedFollowing)
      fetchVideos()
    }
  }, [selectedFollowing])

  const toggleFavorite = (videoId: number) => {
    setVideos((prev) =>
      prev.map((video) => (video.id === videoId ? { ...video, isFavorite: !video.isFavorite } : video)),
    )
  }

  const toggleLike = async (videoId: number) => {
    try {
      const response = await toggleVideoLike(videoId)
      console.log("Like toggle response:", response)
      await fetchVideos()
    } catch (error) {
      console.error("Error toggling video like:", error)
      setFetchError("Failed to update like status. Please try again.")
      setTimeout(() => setFetchError(""), 3000)
    }
  }

  const handleContentAction = (action: string, videoId: number) => {
    switch (action) {
      case "favorite":
        toggleFavorite(videoId)
        break
      case "remove":
        setVideos((prev) => prev.filter((video) => video.id !== videoId))
        break
      default:
        break
    }
    setShowContentMenu(null)
  }

  const toggleComments = (videoId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  const handleAddComment = async (videoId: number) => {
    const commentText = newComments[videoId]?.trim()
    if (!commentText) return
    try {
      const response = await addCommentToVideo(videoId, commentText)
      console.log("Add comment response:", response)
      setNewComments((prev) => ({ ...prev, [videoId]: "" }))
      await fetchVideos()
    } catch (error) {
      console.error("Error adding comment:", error)
      setFetchError("Failed to add comment. Please try again.")
      setTimeout(() => setFetchError(""), 3000)
    }
  }

  const handleEditComment = async (commentId: number) => {
    const trimmedText = editCommentText.trim()
    if (!trimmedText) return
    try {
      const response = await editVideoComment(commentId, trimmedText)
      console.log("Edit comment response:", response)
      setEditingComment(null)
      setEditCommentText("")
      await fetchVideos()
    } catch (error) {
      console.error("Error editing comment:", error)
      setFetchError("Failed to edit comment. Please try again.")
      setTimeout(() => setFetchError(""), 3000)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await deleteVideoComment(commentId)
      console.log("Delete comment response:", response)
      await fetchVideos()
    } catch (error) {
      console.error("Error deleting comment:", error)
      setFetchError("Failed to delete comment. Please try again.")
      setTimeout(() => setFetchError(""), 3000)
    }
  }

  const startEditingComment = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditCommentText(comment.comment)
  }

  const cancelEditingComment = () => {
    setEditingComment(null)
    setEditCommentText("")
  }

  const filteredVideos = videos.filter((video) => {
    const plainDescription = stripHtmlAndDecode(video.description)
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.category && video.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      plainDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === "all" || video.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const categories = ["all", ...Array.from(new Set(videos.map((video) => video.category).filter(Boolean)))]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const handleVideoClick = async (video: Video) => {
    setSelectedVideo(video)
    setShowVideoModal(true)
    setShowContentMenu(null)
    try {
      // await markVideoAsViewed(video.id)
      // fetchVideos()
    } catch (error) {
      console.error("Error marking video as viewed:", error)
    }
  }

  if (isLoading && isLoadingFollowing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Video Content</h1>
              <p className="text-slate-600 text-lg">
                Watch educational videos and tutorials from our creators
              
              </p>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 flex-1">{fetchError}</p>
              <button
                onClick={fetchVideos}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {followingError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-yellow-800 flex-1">{followingError}</p>
              <button
                onClick={fetchFollowingData}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors"
              >
                Retry Following
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search videos by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              {/* Following Filter Dropdown */}
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={selectedFollowing}
                  onChange={(e) => {
                    console.log("Following selection changed:", e.target.value)
                    setSelectedFollowing(e.target.value)
                  }}
                  className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
                  disabled={isLoadingFollowing}
                >
                  <option value="all">All Creators </option>
                  {followings.map((following) => (
                    <option key={following.id} value={following.username}>
                      {following.username}
                    </option>
                  ))}
                </select>
                {isLoadingFollowing && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <RefreshCwIcon className="w-4 h-4 animate-spin text-slate-400" />
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  fetchVideos()
                  fetchFollowingData()
                }}
                disabled={isLoading || isLoadingFollowing}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCwIcon className={`w-4 h-4 ${(isLoading || isLoadingFollowing) ? "animate-spin" : ""}`} />
                <span>{(isLoading || isLoadingFollowing) ? "Loading..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => {
              // Process description for display in grid
              const plainDescription = stripHtmlAndDecode(video.description)
              const truncatedDescription = truncateText(plainDescription, 100)

              return (
                <div
                  key={video.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative">
                    <div
                      className="aspect-video relative overflow-hidden cursor-pointer"
                      onClick={() => handleVideoClick(video)}
                    >
                      <img
                        src={video.thumbnail || "/placeholder.svg?height=200&width=350"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                          <PlayIcon className="w-8 h-8 text-slate-800 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded-lg text-sm font-medium">
                        {video.duration_formatted}
                      </div>
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        {video.isFavorite && <HeartIcon className="w-4 h-4 text-red-500 fill-current" />}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4
                        className="font-bold text-slate-800 text-lg line-clamp-2 flex-1 group-hover:text-purple-600 transition-colors cursor-pointer"
                        onClick={() => handleVideoClick(video)}
                      >
                        {video.title}
                      </h4>
                      <div className="relative ml-3" ref={contentMenuRef}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowContentMenu(showContentMenu === video.id.toString() ? null : video.id.toString())
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                        </button>
                        {showContentMenu === video.id.toString() && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleContentAction("favorite", video.id)
                              }}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                            >
                              <HeartIcon className="w-4 h-4" />
                              <span>{video.isFavorite ? "Remove Favorite" : "Add Favorite"}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleContentAction("remove", video.id)
                              }}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <XIcon className="w-4 h-4" />
                              <span>Remove from History</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Updated description display with proper HTML stripping */}
                    <div className="mb-4">
                      {truncatedDescription ? (
                        <p className="text-slate-600 text-sm leading-relaxed">{truncatedDescription}</p>
                      ) : (
                        <p className="text-slate-400 text-sm italic">No description available</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <span className="font-medium">by {video.creator.username}</span>
                      <span className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(video.created_at)}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm">{formatViews(video.views)} views</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(video.id)
                          }}
                          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
                            video.is_liked ? "bg-purple-100 text-purple-600" : "hover:bg-slate-100 text-slate-600"
                          }`}
                        >
                          <ThumbsUpIcon className={`w-4 h-4 ${video.is_liked ? "fill-current" : ""}`} />
                          <span className="text-sm font-medium">{video.likes}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleComments(video.id)
                          }}
                          className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          <MessageCircleIcon className="w-4 h-4" />
                          <span className="text-sm">{video.comments_count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <VideoIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No videos found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {searchTerm || filterCategory !== "all" || selectedFollowing !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "No videos are available at the moment. Check back later for new content."}
              </p>
              {(searchTerm || filterCategory !== "all" || selectedFollowing !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterCategory("all")
                    setSelectedFollowing("all")
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Video Modal */}
        {showVideoModal && selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onClose={() => setShowVideoModal(false)}
            onToggleLike={toggleLike}
            onToggleFavorite={toggleFavorite}
            onRefreshVideos={fetchVideos}
          />
        )}
      </div>
    </div>
  )
}
