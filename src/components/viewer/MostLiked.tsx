"use client"

import { Heart, Loader2, User, PlayIcon, ThumbsUpIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getMostViewed, toggleVideoLike } from "@/api/content"
import { VideoModal } from "./video-modal"
import { useRouter } from "next/navigation"

interface VideoPost {
  id: number
  title: string
  description: string
  author: {
    id: number
    username: string
    email: string
    profile_picture: string
    role: string
  }
  created_at: string
  views: number
  likes: number
  comments_count: number
  thumbnail?: string
  video: string
  video_id: string
  duration: number
  duration_formatted: string
  is_liked: boolean
  is_viewed: boolean
  liked_by: number[]
  viewed_by: number[]
  status: string
  archived: boolean
  comments: any[]
  total_watch_time: number
  total_watch_time_formatted: string
  user_watch_time: number
  user_watch_time_formatted: string
  type: "video"
}

export default function MostLikedTab() {
  const user = useSelector((state: any) => state.user)
  const [videos, setVideos] = useState<VideoPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const loadMostLikedVideos = async () => {
    try {
      setError(null)
      setLoading(true)

      const response = await getMostViewed()

      const videos: VideoPost[] = response.data.videos
        .map((video: any) => ({
          ...video,
          author: video.creator,
          type: "video" as const,
        }))
        .sort((a: VideoPost, b: VideoPost) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 12)

      setVideos(videos)

      if (selectedVideo) {
        const updatedSelected = videos.find((video) => video.id === selectedVideo.id)
        setSelectedVideo(updatedSelected || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch most liked videos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMostLikedVideos()
  }, [])

  const handleRefresh = async () => {
    loadMostLikedVideos()
  }

  const openVideoModal = (video: VideoPost) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
    setIsModalOpen(false)
  }

  const handleToggleLike = async (videoId: number) => {
    try {
      await toggleVideoLike(videoId)

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId
            ? {
                ...video,
                is_liked: !video.is_liked,
                likes: video.is_liked ? video.likes - 1 : video.likes + 1,
              }
            : video,
        ),
      )

      if (selectedVideo && selectedVideo.id === videoId) {
        setSelectedVideo((prev) =>
          prev
            ? {
                ...prev,
                is_liked: !prev.is_liked,
                likes: prev.is_liked ? prev.likes - 1 : prev.likes + 1,
              }
            : null,
        )
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleToggleFavorite = async (videoId: number) => {
    //console.log("Toggle favorite for video:", videoId)
  }

  const handleRefreshVideos = () => {
    loadMostLikedVideos()
  }

  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString()
  }


  if (loading) {
    return (
      <div className="theme-bg-primary min-h-screen p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold theme-text-primary">Most Liked Videos</h3>
                <p className="theme-text-secondary text-sm">Discover the most loved videos</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-16 theme-bg-secondary rounded-2xl theme-border border">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin mx-auto mb-4" />
              <p className="theme-text-secondary font-medium">Loading most liked videos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="theme-bg-primary min-h-screen p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold theme-text-primary">Most Liked Videos</h3>
                <p className="theme-text-secondary text-sm">Discover the most loved videos</p>
              </div>
            </div>
          </div>
          <div className="text-center py-16 theme-bg-secondary rounded-2xl theme-border border">
            <div className="w-20 h-20 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h4 className="text-xl font-semibold theme-text-primary mb-2">Oops! Something went wrong</h4>
            <p className="theme-text-secondary mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={handleRefresh}
              className="theme-button-secondary font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="theme-bg-primary min-h-screen p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold theme-text-primary">Most Liked Videos</h3>
              <p className="theme-text-secondary text-sm">Discover the most loved videos</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
              {videos.length} videos
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="theme-button-secondary font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200"
            >
              Refresh
            </button>
            <button
              onClick={() => router.push("/viewer/videos")}
              className="theme-button-secondary font-semibold text-sm px-3 py-2 rounded-lg transition-all duration-200"
            >
              All Videos
            </button>
          </div>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div key={video.id} className="group cursor-pointer h-full" onClick={() => openVideoModal(video)}>
                <div className="theme-bg-card rounded-xl shadow-sm hover:shadow-md theme-border overflow-hidden transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden rounded-t-xl flex-shrink-0">
                    <img
                      src={
                        video.thumbnail && video.thumbnail !== ""
                          ? video.thumbnail
                          : `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(video.title)}&query=Professional video thumbnail design, red/pink colored object, modern minimalist composition, high contrast colors`
                      }
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (!target.src.includes("placeholder.svg")) {
                          target.src = `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(video.title)}&query=Professional video thumbnail design, red/pink colored object, modern minimalist composition, high contrast colors`
                        }
                      }}
                    />

                    {/* Duration overlay */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                      {video.duration_formatted || "8:38"}
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
                          {video.author?.profile_picture && video.author.profile_picture !== "" ? (
                            <img
                              src={video.author.profile_picture || "/placeholder.svg"}
                              alt={video.author.username}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                          ) : null}
                          <User
                            className={`w-5 h-5 theme-text-muted ${video.author?.profile_picture ? "hidden" : ""}`}
                          />
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h3
                          title={video.title}
                          className="font-semibold text-sm leading-5 line-clamp-2 group-hover:text-red-500 transition-colors theme-text-primary mb-2 h-10 flex items-start"
                        >
                          {video.title}
                        </h3>

                        <p className="text-sm theme-text-secondary mb-2 truncate">
                          {video.author?.username || "Unknown Creator"}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center text-xs theme-text-muted">
                            <span>{video.views || 0} views</span>
                            <span className="mx-1">•</span>
                            <span>{formatDate(video.created_at)}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleLike(video.id)
                            }}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all text-xs ${
                              video.is_liked ? "text-red-500" : "theme-text-muted hover:text-red-500"
                            }`}
                          >
                            {/* <Heart className={`w-3 h-3 ${video.is_liked ? "fill-current" : ""}`} /> */}
                               <ThumbsUpIcon className={`w-3 h-3 ${video.is_liked ? "fill-current" : ""}`} />
                            <span>{video.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 theme-bg-secondary rounded-2xl theme-border border">
            <div className="w-20 h-20 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h4 className="text-xl font-semibold theme-text-primary mb-2">No videos available</h4>
            <p className="theme-text-secondary max-w-md mx-auto">Start liking videos to see the most loved content!</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={closeVideoModal}
          onToggleLike={handleToggleLike}
          onToggleFavorite={handleToggleFavorite}
          onRefreshVideos={handleRefreshVideos}
        />
      )}
    </div>
  )
}
