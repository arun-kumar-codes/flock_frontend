"use client"

import {
  VideoIcon,
  ArrowRightIcon,
  Loader2,
  ThumbsUpIcon,
  User,
  PlayIcon,
  BookOpenIcon,
  SearchIcon,
  ArrowLeftIcon,
  LucideArrowRight as PaginationArrowRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getAllTrendingContent, toggleVideoLike, toggleBlogLike } from "@/api/content"
import { BlogModal } from "./blog-modal"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Creator {
  id: number
  username: string
  email: string
  profile_picture: string
  role: string
}

interface Comment {
  id: number
  video_id?: number
  blog_id?: number
  comment: string
  commented_at: string
  commented_by: number
  commenter: {
    email: string
    id: number
    role: string
    username: string
  }
}

interface Video {
  keywords: string[]
  id: number
  title: string
  description: string
  creator: Creator
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
  comments: Comment[]
  total_watch_time: number
  total_watch_time_formatted: string
  user_watch_time: number
  user_watch_time_formatted: string
  type: "video"
}

interface Blog {
  keywords: string[]
  id: number
  title: string
  content: string
  author: Creator
  created_at: string
  created_by: number
  comments: Comment[]
  comments_count: number
  liked_by: number[]
  likes: number
  image?: string
  archived: boolean
  status: string
  is_liked: boolean
  excerpt?: string
  readTime?: string
  type: "blog"
}

type ContentItem = Video | Blog

const stripHtmlAndDecode = (html: string): string => {
  if (!html) return ""
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html
  let text = tempDiv.textContent || tempDiv.innerText || ""
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

const truncateText = (text: string, maxLength = 120): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

const generateExcerpt = (content: string, image?: string): string => {
  const maxLength = image ? 150 : 600
  const textContent = content.replace(/<[^>]*>/g, "")
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
}

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
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

export default function TrendingContentTab() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [likeAnimation, setLikeAnimation] = useState<{[key: string]: boolean}>({})
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8

  const loadTrendingContent = async () => {
    try {
      setError(null)
      setLoading(true);
      const response = await getAllTrendingContent()

      const mixedContent: ContentItem[] = []

      // Process videos
      if (response?.data?.videos) {
        const videosWithUIFields = response.data.videos
          .filter((video: any) => video.status === "published" && !video.archived)
          .map((video: any) => ({
            ...video,
            type: "video" as const,
            views: video.views || 0,
            comments: video.comments || [],
            comments_count: video.comments_count || video.comments?.length || 0,
          }))
        mixedContent.push(...videosWithUIFields)
      }

      // Process blogs
      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs
          .filter((blog: any) => blog.status === "published" && !blog.archived)
          .map((blog: any) => ({
            ...blog,
            type: "blog" as const,
            excerpt: generateExcerpt(blog.content, blog.image),
            readTime: calculateReadTime(blog.content),
            comments: blog.comments || [],
            comments_count: blog.comments_count || blog.comments?.length || 0,
          }))
        mixedContent.push(...blogsWithUIFields)
      }

      // Sort mixed content by creation date (newest first)
      mixedContent.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setContent(mixedContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trending content")
    } finally {
      setLoading(false)
    }
  }
  

  const handleRefresh = () => {
    loadTrendingContent()
  }

  const handleVideoClick = (video: Video) => {
    router.push(`/viewer/video/${video.id}`)
  }

  const openBlogModal = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsBlogModalOpen(true)
  }

  const closeBlogModal = () => {
    setSelectedBlog(null)
    setIsBlogModalOpen(false)
  }

  const handleToggleVideoLike = async (videoId: number) => {
    try {
      setContent((prevContent) =>
        prevContent.map((item) =>
          item.type === "video" && item.id === videoId
            ? {
              ...item,
              is_liked: !item.is_liked,
              likes: item.is_liked ? item.likes - 1 : item.likes + 1,
            }
            : item,
        ),
      )

      setLikeAnimation(prev => ({ ...prev, [`video-${videoId}`]: true }))
      setTimeout(() => {
        setLikeAnimation(prev => ({ ...prev, [`video-${videoId}`]: false }))
      }, 500)

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
      await toggleVideoLike(videoId)
    } catch (error) {
      console.error("Error toggling video like:", error)
      setContent((prevContent) =>
        prevContent.map((item) =>
          item.type === "video" && item.id === videoId
            ? {
                ...item,
                is_liked: !item.is_liked,
                likes: item.is_liked ? item.likes - 1 : item.likes + 1,
              }
            : item,
        ),
      )
    }
  }

  const handleToggleBlogLike = async (blogId: number) => {
    try {
      
      setContent((prevContent) =>
        prevContent.map((item) =>
          item.type === "blog" && item.id === blogId
            ? {
              ...item,
              is_liked: !item.is_liked,
              likes: item.is_liked ? item.likes - 1 : item.likes + 1,
            }
            : item,
        ),
      )
      setLikeAnimation(prev => ({...prev, [`blog-${blogId}`]: true}))
      setTimeout(() => {
        setLikeAnimation(prev => ({...prev, [`blog-${blogId}`]: false}))
      }, 500)
      if (selectedBlog && selectedBlog.id === blogId) {
        setSelectedBlog((prev) =>
          prev
            ? {
              ...prev,
              is_liked: !prev.is_liked,
              likes: prev.is_liked ? prev.likes - 1 : prev.likes + 1,
            }
            : null,
        )
      }
      await toggleBlogLike(blogId)
    } catch (error) {
      console.error("Error toggling blog like:", error)
      setContent((prevContent) =>
        prevContent.map((item) =>
          item.type === "blog" && item.id === blogId
            ? {
                ...item,
                is_liked: !item.is_liked,
                likes: item.is_liked ? item.likes - 1 : item.likes + 1,
              }
            : item,
        ),
      )
    }
  }

  const handleRefreshContent =async () => {
    try {
      const response = await getAllTrendingContent()

      const mixedContent: ContentItem[] = []

      // Process videos
      if (response?.data?.videos) {
        const videosWithUIFields = response.data.videos
          .filter((video: any) => video.status === "published" && !video.archived)
          .map((video: any) => ({
            ...video,
            type: "video" as const,
            views: video.views || 0,
            comments: video.comments || [],
            comments_count: video.comments_count || video.comments?.length || 0,
          }))

           if(selectedVideo){

              videosWithUIFields.forEach((video:any)=>{
            if(selectedVideo.id===video.id){
                    setSelectedVideo(video);
                
            }
        })
      }
        mixedContent.push(...videosWithUIFields)
      }
      // Process blogs
      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs
          .filter((blog: any) => blog.status === "published" && !blog.archived)
          .map((blog: any) => ({
            ...blog,
            type: "blog" as const,
            excerpt: generateExcerpt(blog.content, blog.image),
            readTime: calculateReadTime(blog.content),
            comments: blog.comments || [],
            comments_count: blog.comments_count || blog.comments?.length || 0,
          }))

          if(selectedBlog){
        blogsWithUIFields.forEach((blog:any)=>{
            if(selectedBlog.id===blog.id){
                    setSelectedBlog(blog);
                    console.log("BLog",blog)               
            }
        })
          }    
        mixedContent.push(...blogsWithUIFields)
      }

      // Sort mixed content by creation date (newest first)
      mixedContent.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setContent(mixedContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trending content")
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = content.filter((item) => {
    const searchText = searchTerm.toLowerCase()

    if (item.type === "video") {
      const plainDescription = stripHtmlAndDecode(item.description)
      return (
        item.title.toLowerCase().includes(searchText) ||
        item.creator.username.toLowerCase().includes(searchText) ||
        plainDescription.toLowerCase().includes(searchText)||
        (Array.isArray(item.keywords) &&
      item.keywords.some((kw:any) => kw.toLowerCase().includes(searchText)))
      )
    } else {
      return (
        item.title.toLowerCase().includes(searchText) ||
        item.author.username.toLowerCase().includes(searchText) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(searchText))||
        (Array.isArray(item.keywords) &&
      item.keywords.some((kw:any) => kw.toLowerCase().includes(searchText)))
      )
    }
  })

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage)
  const currentContent = filteredContent.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    loadTrendingContent()
  }, [])

  if (loading) {
    return (
      <div className="theme-bg-primary min-h-screen p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <VideoIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold theme-text-primary">Trending Content</h3>
                <p className="theme-text-secondary text-xs md:text-sm">Discover the hottest videos and articles</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-16 theme-bg-secondary rounded-2xl theme-border border">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="theme-text-secondary font-medium">Loading trending content...</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <VideoIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold theme-text-primary">Trending Content</h3>
                <p className="theme-text-secondary text-xs md:text-sm">Discover the hottest videos and articles</p>
              </div>
            </div>
          </div>
          <div className="text-center py-16 theme-bg-secondary rounded-2xl theme-border border">
            <div className="w-20 h-20 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="flex items-center space-x-2">
                <VideoIcon className="w-8 h-8 text-purple-500" />
                <BookOpenIcon className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <h4 className="text-xl font-semibold theme-text-primary mb-2">Oops! Something went wrong</h4>
            <p className="theme-text-secondary mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="theme-bg-primary min-h-screen md:p-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center space-x-3">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <VideoIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold theme-text-primary">Trending Content</h3>
                <p className="theme-text-secondary text-xs md:text-sm">Discover the hottest videos and articles</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs md:text-sm font-bold px-3 py-1 mt-2 mb-2 md:mt-0 md:mb-0 rounded-full shadow-md">
              {content.length} items
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="theme-text-primary hover:theme-text-secondary font-semibold cursor-pointer text-xs md:text-sm px-4 py-2 rounded-xl theme-bg-secondary hover:theme-bg-card transition-all duration-200 theme-border border"
            >
              Refresh
            </button>
            <button
              onClick={() => router.push("/viewer/videos")}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold text-xs md:text-sm flex items-center group px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All
              <ArrowRightIcon className="w-3 h-3 md:w-4 md:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        <div className="mb-4 md:mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-1.5 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 theme-text-muted" />
            <input
              type="text"
              placeholder="Search videos and articles by title, author, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-6 md:pl-12 pr-4 py-3 theme-input rounded-xl theme-text-primary placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs md:text-base"
            />
          </div>
        </div>

        {currentContent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentContent.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="group cursor-pointer h-full"
                onClick={() => {
                  if (item.type === "video") {
                    handleVideoClick(item)
                  } else {
                    openBlogModal(item)
                  }
                }}
              >
                <div className="theme-bg-card rounded-xl shadow-sm hover:shadow-md theme-border overflow-hidden transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden rounded-t-xl flex-shrink-0">
                    {item.type === "video" ? (
                      <>
                        <img
                          src={
                            item.thumbnail && item.thumbnail !== ""
                              ? item.thumbnail
                              : `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(item.title)}&query=Professional video thumbnail design, purple/indigo colored object, modern minimalist composition, high contrast colors`
                          }
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            if (!target.src.includes("placeholder.svg")) {
                              target.src = `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(item.title)}&query=Professional video thumbnail design, purple/indigo colored object, modern minimalist composition, high contrast colors`
                            }
                          }}
                        />

                        {/* Duration overlay */}
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                          {item.duration_formatted || "8:38"}
                        </div>

                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <PlayIcon className="w-5 h-5 text-gray-900 ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {item.image ? (
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                            <BookOpenIcon className="w-12 h-12 text-purple-500" />
                          </div>
                        )}

                        {/* Read time overlay for blogs */}
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                          {item.readTime || "5 min read"}
                        </div>

                        {/* Book icon overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <BookOpenIcon className="w-5 h-5 text-gray-900" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex gap-3 flex-1">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden theme-bg-secondary">
                          {(item.type === "video" ? item.creator?.profile_picture : item.author?.profile_picture) &&
                            (item.type === "video" ? item.creator.profile_picture : item.author.profile_picture) !==
                            "" ? (
                            <img
                              src={
                                (item.type === "video" ? item.creator.profile_picture : item.author.profile_picture) ||
                                "/placeholder.svg"
                              }
                              alt={item.type === "video" ? item.creator.username : item.author.username}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                          ) : null}
                          <User
                            className={`w-5 h-5 theme-text-muted ${(item.type === "video" ? item.creator?.profile_picture : item.author?.profile_picture) ? "hidden" : ""}`}
                          />
                        </div>
                      </div>

                      {/* Content Info */}
                      {/* <div className="flex-1 min-w-0 flex flex-col">
                        <h3
                          title={item.title}
                          className="font-semibold text-sm leading-5 line-clamp-2 group-hover:text-purple-500 transition-colors theme-text-primary mb-2 h-10 flex items-start"
                        >
                          {item.title}
                        </h3>

                        <div className="flex items-center space-x-2 text-xs theme-text-muted mb-2">
                          <span className="font-medium">
                            {item.type === "video"
                              ? item.creator?.username
                              : item.author?.username || "Unknown Creator"}
                          </span>
                          <span>•</span>
                          <span>{formatDate(item.created_at)}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            {item.type === "video" ? (
                              <PlayIcon className="w-2.5 h-2.5" />
                            ) : (
                              <BookOpenIcon className="w-2.5 h-2.5" />
                            )}
                            <span className="capitalize">{item.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center text-xs theme-text-muted">
                            {item.type === "video" ? (
                              <>
                                <span>{formatViews(item.views || 0)} views</span>
                              </>
                            ) : (
                              <span>{item.readTime}</span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (item.type === "video") {
                                handleToggleVideoLike(item.id)
                              } else {
                                handleToggleBlogLike(item.id)
                              }
                            }}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all text-xs ${item.is_liked ? "text-red-500" : "theme-text-muted hover:text-red-500"
                              }`}
                          >
                            <ThumbsUpIcon className={`w-3 h-3 ${item.is_liked ? "fill-current" : ""} ${likeAnimation[`${item.type}-${item.id}`] ? "animate-pop-red" : "" }`} />
                            <span>{item.likes}</span>
                          </button>
                        </div>
                      </div> */}

                       <div className="flex-1 min-w-0 flex flex-col">
                                                <h3
                                                title={item.title}
                                                className="font-semibold text-sm leading-5 line-clamp-2 group-hover:text-red-500 transition-colors theme-text-primary mb-2 h-10 overflow-hidden"
                                              >
                                                {item.title}
                                              </h3>
                      
                                                <p className="text-sm theme-text-secondary mt-2 truncate">
                                                  {item.type === "video"
                                                    ? item.creator?.username || "Unknown Creator"
                                                    : item.author?.username || "Unknown Creator"}
                                                </p>
                      
                                                <div className="flex items-center justify-between mt-auto">
                                                  <div className="flex items-center text-xs theme-text-muted">
                                                    {item.type === "video" ? (
                                                      <>
                                                        <span>{formatViews(item.views || 0)} views</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{formatDate(item.created_at)}</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <span>{item.readTime}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{formatDate(item.created_at)}</span>
                                                      </>
                                                    )}
                                                  </div>
                      
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      if (item.type === "video") {
                                                        handleToggleVideoLike(item.id)
                                                      } else {
                                                        handleToggleBlogLike(item.id)
                                                      }
                                                    }}
                                                    className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all text-xs ${
                                                      item.is_liked ? "text-blue-500" : "theme-text-muted hover:text-blue-500"
                                                    }`}
                                                  >
                                                    <ThumbsUpIcon className={`w-3 h-3 ${item.is_liked ? "fill-current" : ""} ${likeAnimation[`${item.type}-${item.id}`] ? "animate-pop" : "" }`} />
                                                    <span>{item.likes}</span>
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
              <div className="flex items-center space-x-2">
                <VideoIcon className="w-8 h-8 text-purple-500" />
                <BookOpenIcon className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <h4 className="text-xl font-semibold theme-text-primary mb-2">No trending content yet</h4>
            <p className="theme-text-secondary max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms to find what you're looking for."
                : "Be the first to create amazing content that trends!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-12">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-3 rounded-full theme-button-secondary hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="w-5 h-5 theme-text-secondary" />
            </button>

            <div className="px-4 py-2 rounded-lg theme-bg-card theme-border">
              <span className="text-sm font-medium theme-text-primary">
                {currentPage + 1} of {totalPages}
              </span>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="p-3 rounded-full theme-button-secondary hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaginationArrowRight className="w-5 h-5 theme-text-secondary" />
            </button>
          </div>
        )}
      </div>


      {isBlogModalOpen && selectedBlog && (
        <BlogModal
          blog={selectedBlog}
          onClose={closeBlogModal}
          onToggleLike={handleToggleBlogLike}
          onRefreshBlogs={handleRefreshContent}
        />
      )}
    </div>
  )
}
