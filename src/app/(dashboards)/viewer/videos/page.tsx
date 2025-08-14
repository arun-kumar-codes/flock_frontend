"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, HeartIcon, PlayIcon, AlertCircleIcon, RefreshCwIcon, TrendingUpIcon, UserIcon, FilterIcon } from "lucide-react"
// Removed Redux dependency to fix store error
import Loader from "@/components/Loader"
import { VideoModal } from "@/components/viewer/video-modal"
import {
  getAllVideo,
  addCommentToVideo,
  toggleVideoLike,
  editVideoComment,
  deleteVideoComment,
  getFollowings,
  getAllVideoCretor,
} from "@/api/content"
import { useSelector } from "react-redux"

// ... existing interfaces ...

interface Creator {
  email: string
  id: number
  role: string
  username: string
  avatar?: string
  name?: string
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
  duration: string
  views: number
  likes: number
  is_liked: boolean
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

// Function to format video duration properly
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export default function VideoPage() {
  const router = useRouter()
    

 const user=useSelector((state:any)=>state.user);

 const isDark=user.theme==="dark";


  // Video states
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  // Following states
  const [selectedFollowing, setSelectedFollowing] = useState<string>("all")
  const [followings, setFollowings] = useState<Following[]>([])
  const [followingCount, setFollowingCount] = useState<number>(0)
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true)
  const [followingError, setFollowingError] = useState("")

  // UI states
  const [searchTerm, setSearchTerm] = useState("")
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)


  const fetchFollowingData = async () => {
  
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
  
    try {
      let response

      // If a specific following is selected, get their videos
      if (selectedFollowing !== "all") {
        const selectedUser = followings.find((f) => f.username === selectedFollowing)
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

  // Initialize data fetching on component mount
  useEffect(() => {
    if(user.isLogIn){
      fetchFollowingData();
    }
    fetchVideos()
  }, [])

  // Update videos when selected following changes
  useEffect(() => {
    if (followings.length > 0 || selectedFollowing === "all") {
      console.log("Selected following changed:", selectedFollowing)
      fetchVideos()
    }
  }, [selectedFollowing])



  // ... existing functions ...

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



  const filteredVideos = videos.filter((video) => {
    const plainDescription = stripHtmlAndDecode(video.description)
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plainDescription.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  const handleLikeToggle = (e: any, videoId: number) => {
    e.stopPropagation()
    toggleLike(videoId)
  }

  const handleFavoriteToggle = (e: any, videoId: number) => {
    e.stopPropagation()
    toggleFavorite(videoId)
  }

  if (isLoading && isLoadingFollowing) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-blue-50"}`}
      >
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen theme-bg-primary transition-colors duration-300">
      <div className=" px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filter */}
           <div className=" mb-8 shadow-sm theme-border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
              <input
                type="text"
                placeholder="Search articles by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 theme-input rounded-xl theme-text-primary placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 theme-text-muted" />
                <select
                  value={selectedFollowing}
                  onChange={(e) => setSelectedFollowing(e.target.value)}
                  className="pl-10 pr-8 py-3 theme-input rounded-xl theme-text-primary min-w-[180px] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoadingFollowing}
                >
                  <option value="all">All Creators</option>
                  {followings.map((following) => (
                    <option key={following.id} value={following.username}>
                      {following.username}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  fetchVideos();
                  fetchFollowingData()
                }}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 theme-button-primary rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCwIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Loading..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </div>
        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => {
              const plainDescription = stripHtmlAndDecode(video.description)
              const truncatedDescription = truncateText(plainDescription, 80)

              return (
                <div key={video.id} className="group cursor-pointer h-full" onClick={() => handleVideoClick(video)}>
                  <div className="theme-bg-card rounded-xl shadow-sm hover:shadow-md theme-border overflow-hidden transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden rounded-t-xl flex-shrink-0">
                      <img
                        src={
                          video.thumbnail && video.thumbnail !== ""
                            ? video.thumbnail
                            : `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(video.title)}&query=Professional outdoor adventure thumbnail design, turquoise/teal colored object placed on red sandstone cliff edge, dramatic desert landscape background with blue sky and clouds, minimalist composition, natural daylight photography, adventure travel aesthetic, clean modern design, high contrast colors`
                        }
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (!target.src.includes("placeholder.svg")) {
                            target.src = `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(video.title)}&query=Professional outdoor adventure thumbnail design, turquoise/teal colored object placed on red sandstone cliff edge, dramatic desert landscape background with blue sky and clouds, minimalist composition, natural daylight photography, adventure travel aesthetic, clean modern design, high contrast colors`
                          }
                        }}
                      />

                      {/* Duration overlay */}
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {video.duration ? formatDuration(Number.parseInt(video.duration)) : "8:38"}
                      </div>

                      {/* Play button overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
                          <PlayIcon className="w-5 h-5 text-gray-900 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex gap-3 flex-1">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden theme-bg-secondary">
                            {video.creator?.avatar && video.creator.avatar !== "" ? (
                              <img
                                src={video.creator.avatar || "/placeholder.svg"}
                                alt={video.creator.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                  target.nextElementSibling?.classList.remove("hidden")
                                }}
                              />
                            ) : null}
                            <UserIcon className={`w-5 h-5 theme-text-muted ${video.creator?.avatar ? "hidden" : ""}`} />
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h3
                            title={video.title}
                            className="font-semibold text-sm leading-5 line-clamp-2 group-hover:text-purple-500 transition-colors theme-text-primary mb-2 h-10 flex items-start"
                          >
                            {video.title}
                          </h3>

                          <p className="text-sm theme-text-secondary mb-2 truncate">
                            {video.creator?.username || "Unknown Creator"}
                          </p>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center text-xs theme-text-muted">
                              <span>{formatViews(video.views || 0)} views</span>
                              <span className="mx-1">•</span>
                              <span>{formatDate(video.created_at)}</span>
                            </div>

                            <button
                              onClick={(e) => handleLikeToggle(e, video.id)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all text-xs ${
                                video.is_liked ? "text-red-500" : "theme-text-muted hover:text-red-500"
                              }`}
                            >
                              <HeartIcon className={`w-3 h-3 ${video.is_liked ? "fill-current" : ""}`} />
                              <span>{video.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 theme-border">
                <PlayIcon className="w-10 h-10 theme-text-muted" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 theme-text-primary">No videos found</h3>
              <p className="mb-8 max-w-md mx-auto theme-text-secondary">
                {searchTerm
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "No videos are available at the moment. Check back later for new content."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedFollowing("all")
                  }}
                  className="px-6 py-3 theme-button-primary rounded-xl transition-colors"
                >
                  Clear Search
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
