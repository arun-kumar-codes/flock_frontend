"use client"

import { EyeIcon, VideoIcon, FileTextIcon, Loader2, Heart, MessageCircle, Calendar, User, PlayIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { getMostViewed, toggleBlogLike, toggleVideoLike } from "@/api/content"
import { BlogModal } from "./blog-modal"
import { VideoModal } from "./video-modal"
import { useRouter } from "next/navigation"

interface BlogPost {
  id: number
  title: string
  content: string
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
  image?: string
  is_liked: boolean
  is_viewed: boolean
  liked_by: number[]
  viewed_by: number[]
  status: string
  archived: boolean
  comments: any[]
  category?: string
  readTime?: string
  type: "blog"
}

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

type ContentItem = BlogPost | VideoPost

export default function MostViewedTab() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const loadMostViewedContent = async () => {
    try {
      setError(null)
      setLoading(true)

      // Use the single API call
      const response = await getMostViewed()

      // Process blogs
      const blogs: BlogPost[] = response.data.blogs.map((blog: any) => ({
        ...blog,
        author: blog.author,
        type: "blog" as const,
      }))

      // Process videos
      const videos: VideoPost[] = response.data.videos.map((video: any) => ({
        ...video,
        author: video.creator, // Map creator to author for consistency
        type: "video" as const,
      }))

      // Combine and sort by views (descending)
      const allContent = [...blogs, ...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 12) // Show top 12 most viewed

      setContent(allContent)

      // Update selected content if it exists
      if (selectedContent) {
        const updatedSelected = allContent.find(
          (item) => item.id === selectedContent.id && item.type === selectedContent.type,
        )
        setSelectedContent(updatedSelected || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch most viewed content")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMostViewedContent()
  }, [])

  const handleRefresh = async () => {
    loadMostViewedContent()
  }

  const openContentModal = (item: ContentItem) => {
    setSelectedContent(item)
    setIsModalOpen(true)
  }

  const closeContentModal = () => {
    setSelectedContent(null)
    setIsModalOpen(false)
  }

  const handleToggleLike = async (contentId: number, contentType: "blog" | "video") => {
    try {
      if (contentType === "blog") {
        await toggleBlogLike(contentId)
      } else {
        await toggleVideoLike(contentId)
      }

      // Update the content in the local state
      setContent((prevContent) =>
        prevContent.map((item) =>
          item.id === contentId && item.type === contentType
            ? {
                ...item,
                is_liked: !item.is_liked,
                likes: item.is_liked ? item.likes - 1 : item.likes + 1,
              }
            : item,
        ),
      )

      // Update selected content if it's the one being liked
      if (selectedContent && selectedContent.id === contentId && selectedContent.type === contentType) {
        setSelectedContent((prev) =>
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

  const handleToggleFavorite = async (contentId: number) => {
    console.log("Toggle favorite for content:", contentId)
  }

  const handleRefreshContent = () => {
    loadMostViewedContent()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const truncateContent = (content: string, maxLength = 120) => {
    const textContent = content.replace(/<[^>]*>/g, "")
    if (textContent.length <= maxLength) return textContent
    return textContent.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Most Viewed Content</h3>
              <p className="text-slate-600 text-sm">Discover the most popular content</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 rounded-2xl border border-blue-200">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading most viewed content...</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Most Viewed Content</h3>
              <p className="text-slate-600 text-sm">Discover the most popular content</p>
            </div>
          </div>
        </div>
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <EyeIcon className="w-10 h-10 text-blue-500" />
          </div>
          <h4 className="text-xl font-semibold text-slate-800 mb-2">Oops! Something went wrong</h4>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Most Viewed Content</h3>
              <p className="text-slate-600 text-sm">Discover the most popular content</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
              {content.length} items
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 border border-blue-200"
            >
              Refresh
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push("/viewer/blogs")}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200"
              >
                Blogs
              </button>
              <button
                onClick={() => router.push("/viewer/videos")}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200"
              >
                Videos
              </button>
            </div>
          </div>
        </div>

        {content.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {content.map((item, index) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => openContentModal(item)}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                {/* Content Image/Thumbnail */}
                {item.type === "video" ? (
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-100 to-sky-100">
                    {item.thumbnail ? (
                      <>
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <PlayIcon className="w-8 h-8 text-blue-600 ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoIcon className="w-16 h-16 text-blue-400" />
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                      {item.duration_formatted}
                    </div>
                  </div>
                ) : (
                  <div className="relative h-48 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-blue-100 via-cyan-100 to-sky-100 flex items-center justify-center">
                        <FileTextIcon className="w-16 h-16 text-blue-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      {item.author.profile_picture ? (
                        <img
                          src={item.author.profile_picture || "/placeholder.svg"}
                          alt={item.author.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.author.username}</p>
                      <p className="text-xs text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.type === "video" ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Content Title */}
                  <h4 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
                    {item.title}
                  </h4>

                  {/* Content Preview */}
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {item.type === "video" ? truncateContent(item.description) : truncateContent(item.content)}
                  </p>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-blue-500">
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Heart className={`w-4 h-4 ${item.is_liked ? "text-red-500 fill-current" : ""}`} />
                        <span className="text-sm font-medium">{item.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.comments_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 rounded-2xl border border-blue-200">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <EyeIcon className="w-10 h-10 text-blue-500" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mb-2">No content available</h4>
            <p className="text-slate-600 max-w-md mx-auto">Start exploring to see the most popular content!</p>
          </div>
        )}
      </div>

      {/* Conditional Modal Rendering */}
      {isModalOpen && selectedContent && selectedContent.type === "blog" && (
        <BlogModal
          blog={selectedContent}
          onClose={closeContentModal}
          onToggleLike={(id) => handleToggleLike(id, "blog")}
          onToggleFavorite={handleToggleFavorite}
          onRefreshBlogs={handleRefreshContent}
        />
      )}

      {isModalOpen && selectedContent && selectedContent.type === "video" && (
        <VideoModal
          video={selectedContent}
          onClose={closeContentModal}
          onToggleLike={(id) => handleToggleLike(id, "video")}
          onToggleFavorite={handleToggleFavorite}
          onRefreshVideos={handleRefreshContent}
        />
      )}
    </>
  )
}
