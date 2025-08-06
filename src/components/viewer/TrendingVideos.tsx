"use client"

import {
  VideoIcon,
  ArrowRightIcon,
  Loader2,
  Heart,
  Eye,
  MessageCircle,
  Calendar,
  User,
  Clock,
  PlayIcon,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getAllTrendingVideo, toggleVideoLike } from "@/api/content"
import { VideoModal } from "./video-modal"
import { useRouter } from "next/navigation"

interface VideoPost {
  id: number
  title: string
  description: string
  creator: {
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
}


export default function TrendingVideosTab() {
  const [videos, setVideos] = useState<VideoPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router= useRouter();

  const loadTrendingVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllTrendingVideo()
      const data = response.data.videos
      setVideos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trending videos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrendingVideos()
  }, [])

  const handleRefresh = async () => {
    loadTrendingVideos()
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
      // Update the video in the local state
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
      // Update selected video if it's the one being liked
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
    // Implement favorite functionality if needed
    console.log("Toggle favorite for video:", videoId)
  }

  const handleRefreshVideos = () => {
    loadTrendingVideos()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const truncateContent = (content: string, maxLength = 120) => {
    // Remove HTML tags for preview
    const textContent = content.replace(/<[^>]*>/g, "")
    if (textContent.length <= maxLength) return textContent
    return textContent.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <VideoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Trending Videos</h3>
              <p className="text-slate-600 text-sm">Discover the hottest video content</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-200">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading trending videos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <VideoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Trending Videos</h3>
              <p className="text-slate-600 text-sm">Discover the hottest video content</p>
            </div>
          </div>
        </div>
        <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <VideoIcon className="w-10 h-10 text-purple-500" />
          </div>
          <h4 className="text-xl font-semibold text-slate-800 mb-2">Oops! Something went wrong</h4>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <VideoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Trending Videos</h3>
              <p className="text-slate-600 text-sm">Discover the hottest video content</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
              {videos.length} videos
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-200 border border-purple-200"
            >
              Refresh
            </button>
            <button
              onClick={() => router.push("/viewer/videos")}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold text-sm flex items-center group px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => openVideoModal(video)}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
            

                {/* Video Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100">
                  {video.thumbnail ? (
                    <>
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <PlayIcon className="w-8 h-8 text-purple-600 ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoIcon className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                    {video.duration_formatted}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      {video.creator.profile_picture ? (
                        <img
                          src={video.creator.profile_picture || "/placeholder.svg"}
                          alt={video.creator.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{video.creator.username}</p>
                      <p className="text-xs text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(video.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Video Title */}
                  <h4 className="font-bold text-lg text-slate-800 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2 leading-tight">
                    {video.title}
                  </h4>

                  {/* Video Description Preview */}
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {truncateContent(video.description)}
                  </p>


                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{video.views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Heart className={`w-4 h-4 ${video.is_liked ? "text-red-500 fill-current" : ""}`} />
                        <span className="text-sm font-medium">{video.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{video.comments_count}</span>
                      </div>
                    </div>
              
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <VideoIcon className="w-10 h-10 text-purple-500" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mb-2">No trending videos yet</h4>
            <p className="text-slate-600 max-w-md mx-auto">Be the first to create amazing video content that trends!</p>
          </div>
        )}
      </div>

      {/* Use the VideoModal component */}
      {isModalOpen && selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={closeVideoModal}
          onToggleLike={handleToggleLike}
          onToggleFavorite={handleToggleFavorite}
          onRefreshVideos={handleRefreshVideos}
        />
      )}
    </>
  )
}
