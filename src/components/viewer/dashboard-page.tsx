"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  SearchIcon,
  ThumbsUpIcon,
  PlayIcon,
  RefreshCwIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
} from "lucide-react"
import Image from "next/image"
import Loader from "@/components/Loader"
import { VideoModal } from "@/components/viewer/video-modal"
import { BlogModal } from "@/components/viewer/blog-modal"
import { getDashboardContent, getFollowings, toggleBlogLike, toggleVideoLike } from "@/api/content"
import { useSelector } from "react-redux"
import { getAllCreators } from "@/api/user"

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
  video_id?: number
  blog_id?: number
  comment: string
  commented_at: string
  commented_by: number
  commenter: Commenter
}

interface Video {
  keywords: string[]
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
  category?: string
  isFavorite?: boolean
  author?: Creator
  type: "video"
}

interface Blog {
  keywords:string[]
  is_liked: boolean
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
  excerpt?: string
  thumbnail?: string
  readAt?: string
  readTime?: string
  category?: string
  isFavorite?: boolean
  publishedAt?: string
  type: "blog"
}

type ContentItem = Video | Blog

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

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
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

export default function DashboardPage() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)


  const [content, setContent] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  // Following states
  const [selectedFollowing, setSelectedFollowing] = useState<string>("all")
  const [followings, setFollowings] = useState<Following[]>([])
  const [followingCount, setFollowingCount] = useState<number>(0)
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true)
  const [followingError, setFollowingError] = useState("")

  const [contentTypeFilter, setContentTypeFilter] = useState<"all" | "videos" | "blogs">("all")

  // UI states
  const [searchTerm, setSearchTerm] = useState("")
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [likeAnimation, setLikeAnimation] = useState<{ [key: string]: boolean }>({})
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 9

  const fetchFollowingData = async () => {
    setFollowingError("")
    try {
      let response 
      if(user.isLogin===false){
        response = await getAllCreators()
        setFollowings(response.data.creators);
      }else{
        response = await getFollowings()
        setFollowings(response.data.following)
        setFollowingCount(response.data.following_count)
      }
    } catch (error) {
      console.error("Error fetching following data:", error)
      setFollowingError("Failed to fetch following data. Please try again.")
    } finally {
      setIsLoadingFollowing(false)
    }
  }

  const fetchContent = async () => {
    setFetchError("")
    try {
      let response

      if (selectedFollowing !== "all") {
        const selectedUser = followings.find((f) => f.username === selectedFollowing)
        if (selectedUser) {
          response = await getDashboardContent(selectedUser.id)
        } else {
          response = await getDashboardContent()
        }
      } else {
        response = await getDashboardContent()
      }

      const mixedContent: ContentItem[] = []

      // Process videos
      if (response?.data?.videos) {
        const videosWithUIFields = response.data.videos.map((video: any) => ({
          ...video,
          type: "video" as const,
          isFavorite: false,
          views: video.views || 0,
          author: video.creator,
          comments: video.comments || [],
          comments_count: video.comments_count || video.comments?.length || 0,
        }))
        mixedContent.push(...videosWithUIFields)  
          console.log(selectedVideo);  
          console.log("VIDEO WITH FIELDS : ")
          console.log(videosWithUIFields);
              if(selectedVideo){
              videosWithUIFields.forEach((video:any)=>{
                if(video.id==60){
                  console.log(video);
                }
            if(selectedVideo.id===video.id){
                    setSelectedVideo(video);          
            }
        })
      }
      }



      // Process blogs
      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs.map((blog: any) => ({
          ...blog,
          type: "blog" as const,
          excerpt: generateExcerpt(blog.content, blog.image),
          readTime: calculateReadTime(blog.content),
          isFavorite: false,
          publishedAt: blog.created_at,
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

      // Update selected items if they exist
      if (selectedVideo) {
        const updatedSelectedVideo = mixedContent.find(
          (item): item is Video => item.type === "video" && item.id === selectedVideo.id,
        )
        if (updatedSelectedVideo) {
          setSelectedVideo(updatedSelectedVideo)
        }
      }

      if (selectedBlog) {
        const updatedSelectedBlog = mixedContent.find(
          (item): item is Blog => item.type === "blog" && item.id === selectedBlog.id,
        )
        if (updatedSelectedBlog) {
          setSelectedBlog(updatedSelectedBlog)
        }
      }
    } catch (error) {
      console.error("Error fetching content:", error)
      setFetchError("Failed to fetch content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
    console.log("Fetching content on mount")
  }, [selectedFollowing, contentTypeFilter])

  useEffect(() => {
    fetchFollowingData()
    console.log("Fetching following data on mount")
  }, [])

  const toggleVideoFavorite = (videoId: number) => {
    setContent((prev) =>
      prev.map((item) =>
        item.type === "video" && item.id === videoId ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    )
  }

  const handleToggleVideoLike = async (videoId: number) => {
    try {
      await toggleVideoLike(videoId)
      // await fetchContent()
    } catch (error) {
      console.error("Error toggling video like:", error)
      setFetchError("Failed to update like status. Please try again.")
      setTimeout(() => setFetchError(""), 3000)
    }
  }

  const handleToggleBlogLike = async (blogId: number) => {
    try {
      await toggleBlogLike(blogId)
      // await fetchContent()
    } catch (error) {
      console.error("Error toggling blog like:", error)
      setFetchError("Failed to update like status. Please try again.")
      setTimeout(() => setFetchError(""), 3000)
    }
  }

  const filteredContent = content.filter((item) => {
    const searchText = searchTerm.toLowerCase()

    const matchesContentType =
      contentTypeFilter === "all" ||
      (contentTypeFilter === "videos" && item.type === "video") ||
      (contentTypeFilter === "blogs" && item.type === "blog")

    if (!matchesContentType) return false

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
        (item.excerpt && item.excerpt.toLowerCase().includes(searchText))
        ||
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
  }

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog)
    setShowBlogModal(true)
    setShowContentMenu(null)
  }

  const handleVideoLikeToggle = (e: any, videoId: number) => {
    e.stopPropagation()

    // Optimistic update
    setContent((prev) =>
      prev.map((item) =>
        item.type === "video" && item.id === videoId
          ? { ...item, is_liked: !item.is_liked, likes: item.is_liked ? item.likes - 1 : item.likes + 1 }
          : item,
      ),
    )

    // Trigger animation
    setLikeAnimation((prev) => ({ ...prev, [`video-${videoId}`]: true }))
    setTimeout(() => {
      setLikeAnimation((prev) => ({ ...prev, [`video-${videoId}`]: false }))
    }, 500)

    handleToggleVideoLike(videoId)
  }

  const handleBlogLikeToggle = (e: any, blogId: number) => {
    e.stopPropagation()

    // Optimistic update
    setContent((prev) =>
      prev.map((item) =>
        item.type === "blog" && item.id === blogId
          ? { ...item, is_liked: !item.is_liked, likes: item.is_liked ? item.likes - 1 : item.likes + 1 }
          : item,
      ),
    )

    // Trigger animation
    setLikeAnimation((prev) => ({ ...prev, [`blog-${blogId}`]: true }))
    setTimeout(() => {
      setLikeAnimation((prev) => ({ ...prev, [`blog-${blogId}`]: false }))
    }, 500)

    handleToggleBlogLike(blogId)
  }

   const handleRefresh=()=>{
      setIsLoading(true);
      setIsLoadingFollowing(true);
       fetchContent();
      fetchFollowingData();
  }


  
  if (isLoading || isLoadingFollowing) {
    return <Loader />
  }

  return (
    <div className="min-h-screen theme-bg-primary transition-colors duration-300">
      <div className="lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-4 md:mb-8 theme-border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-1.5 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 theme-text-muted" />
              <input
                type="text"
                placeholder="Search videos and articles by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 md:pl-12 pr-4 py-3 theme-input rounded-xl theme-text-primary placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs md:text-base"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value as "all" | "videos" | "blogs")}
                 className="pl-10 pr-8 py-2 md:py-3 theme-input rounded-xl theme-text-primary min-w-[180px] focus:ring-2 focus:ring-purple-500 focus:border-transparent md:text-base text-sm"
                >
                  <option value="all">All Content</option>
                  <option value="videos">Videos Only</option>
                  <option value="blogs">Blogs Only</option>
                </select>
              </div>

              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={selectedFollowing}
                  onChange={(e) => setSelectedFollowing(e.target.value)}
                  disabled={isLoadingFollowing}
                  className="pl-10 pr-8 py-2 md:py-3 theme-input rounded-xl theme-text-primary min-w-[180px] focus:ring-2 focus:ring-purple-500 focus:border-transparent md:text-base text-sm"
                >
                  <option value="all">{user.isLogin ? "All Following" : "All Creators"}</option>
                  {followings.length > 0 ? (
                    followings.map((following) => (
                      <option key={following.id} value={following.username}>
                        {following.username}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Followers
                    </option>
                  )}
                </select>
              </div>

              <button
                onClick={() => {
                 handleRefresh()
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 cursor-pointer  py-2 md:py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs md:text-sm font-medium shadow-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCwIcon className={`w-3 h-3 md:w-4 md:h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Loading..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </div>

        {currentContent.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Featured Content (Large Card) */}
            {currentContent[0] && (
              <div
                className="lg:col-span-2 lg:row-span-2 group cursor-pointer"
                onClick={() => {
                  if (currentContent[0].type === "video") {
                    handleVideoClick(currentContent[0])
                  } else {
                    handleBlogClick(currentContent[0])
                  }
                }}
              >
                <div className="theme-bg-card rounded-2xl shadow-sm hover:shadow-lg theme-border overflow-hidden h-full flex flex-col transition-all duration-300">
                  {/* Featured Content Image/Thumbnail */}
                  <div className="aspect-[16/10] relative overflow-hidden">
                    {currentContent[0].type === "video" ? (
                      <>
                        <img
                          src={
                            currentContent[0].thumbnail && currentContent[0].thumbnail !== ""
                              ? currentContent[0].thumbnail
                              : `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(currentContent[0].title)}&query=Professional video thumbnail`
                          }
                          alt={currentContent[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {/* Duration overlay for videos */}
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                          {currentContent[0].duration
                            ? formatDuration(Number.parseInt(currentContent[0].duration))
                            : "8:38"}
                        </div>
                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <PlayIcon className="w-7 h-7 text-gray-900 ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {currentContent[0].image ? (
                          <Image
                            src={currentContent[0].image || "/placeholder.svg"}
                            alt={currentContent[0].title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                            <BookOpenIcon className="w-12 h-12 text-purple-500" />
                          </div>
                        )}

                        {/* Blog icon overlay for hover effect */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <BookOpenIcon className="w-7 h-7 text-gray-900" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 text-sm theme-text-muted">
                        <span className="font-medium">
                          {currentContent[0].type === "video"
                            ? currentContent[0].creator.username
                            : currentContent[0].author.username}
                        </span>
                        <span>•</span>
                        <span>{formatDate(currentContent[0].created_at)}</span>
                        {/* Content type indicator */}
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          {currentContent[0].type === "video" ? (
                            <PlayIcon className="w-3 h-3" />
                          ) : (
                            <BookOpenIcon className="w-3 h-3" />
                          )}
                          <span className="capitalize">{currentContent[0].type}</span>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 theme-text-primary group-hover:text-purple-500 transition-colors line-clamp-3">
                      {currentContent[0].title}
                    </h2>

                    <p className="theme-text-secondary mb-6 line-clamp-4 flex-1 text-base leading-relaxed">
                      {currentContent[0].type === "video"
                        ? stripHtmlAndDecode(currentContent[0].description)
                        : currentContent[0].excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        {currentContent[0].type === "video" && (
                          <div className="flex items-center text-sm theme-text-muted">
                            <span>{formatViews(currentContent[0].views || 0)} views</span>
                          </div>
                        )}
                        {currentContent[0].type === "blog" && currentContent[0].readTime && (
                          <div className="flex items-center text-sm theme-text-muted">
                            <span>{currentContent[0].readTime}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (currentContent[0].type === "video") {
                            handleVideoLikeToggle(e, currentContent[0].id)
                          } else {
                            handleBlogLikeToggle(e, currentContent[0].id)
                          }
                        }}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                          currentContent[0].is_liked
                            ? "bg-blue-500/10 text-blue-500"
                            : "theme-button-secondary theme-text-secondary hover:theme-text-primary"
                        }`}
                      >
                        <ThumbsUpIcon
                          className={`w-4 h-4 ${currentContent[0].is_liked ? "fill-current" : ""} ${
                            likeAnimation[`${currentContent[0].type}-${currentContent[0].id}`] ? "animate-pop" : ""
                          }`}
                        />
                        <span>{currentContent[0].likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Content Cards */}
            {currentContent.slice(1).map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="lg:col-span-1 group cursor-pointer"
                onClick={() => {
                  if (item.type === "video") {
                    handleVideoClick(item)
                  } else {
                    handleBlogClick(item)
                  }
                }}
              >
                <div className="theme-bg-card rounded-2xl shadow-sm hover:shadow-lg theme-border overflow-hidden h-full flex flex-col transition-all duration-300">
                  {/* Content Image/Thumbnail */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {item.type === "video" ? (
                      <>
                        <img
                          src={
                            item.thumbnail && item.thumbnail !== ""
                              ? item.thumbnail
                              : `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(item.title)}&query=Professional video thumbnail`
                          }
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {/* Duration overlay for videos */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                          {item.duration ? formatDuration(Number.parseInt(item.duration)) : "8:38"}
                        </div>
                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <PlayIcon className="w-4 h-4 text-gray-900 ml-0.5" />
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
                            <BookOpenIcon className="w-8 h-8 text-purple-500" />
                          </div>
                        )}

                        {/* Blog icon overlay for hover effect */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <BookOpenIcon className="w-4 h-4 text-gray-900" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-xs theme-text-muted">
                        <span className="font-medium">
                          {item.type === "video" ? item.creator.username : item.author.username}
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
                    </div>

                    <h3 className="text-lg font-bold mb-3 theme-text-primary group-hover:text-purple-500 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="theme-text-secondary mb-4 line-clamp-3 flex-1 text-sm">
                      {item.type === "video" ? truncateText(stripHtmlAndDecode(item.description), 80) : item.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-1">
                        {item.type === "video" && (
                          <div className="flex items-center text-xs theme-text-muted">
                            <span>{formatViews(item.views || 0)} views</span>
                          </div>
                        )}
                        {item.type === "blog" && item.readTime && (
                          <div className="flex items-center text-xs theme-text-muted">
                            <span>{item.readTime}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item.type === "video") {
                            handleVideoLikeToggle(e, item.id)
                          } else {
                            handleBlogLikeToggle(e, item.id)
                          }
                        }}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs font-medium ${
                          item.is_liked
                            ? "bg-blue-500/10 text-blue-500"
                            : "theme-button-secondary theme-text-secondary hover:theme-text-primary"
                        }`}
                      >
                        <ThumbsUpIcon
                          className={`w-3 h-3 ${item.is_liked ? "fill-current" : ""} ${
                            likeAnimation[`${item.type}-${item.id}`] ? "animate-pop" : ""
                          }`}
                        />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="w-24 h-24 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 theme-border">
              <div className="flex items-center space-x-2">
                <PlayIcon className="w-8 h-8 theme-text-muted" />
                <BookOpenIcon className="w-8 h-8 theme-text-muted" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 theme-text-primary">No content found</h3>
            <p className="mb-8 max-w-md mx-auto theme-text-secondary">
              {searchTerm || contentTypeFilter !== "all"
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "No videos or articles are available at the moment. Check back later for new content."}
            </p>
            {(searchTerm || contentTypeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedFollowing("all")
                  setContentTypeFilter("all")
                }}
                className="px-6 py-3 theme-button-primary rounded-xl transition-colors"
              >
                Clear All Filters
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
              <ArrowRightIcon className="w-5 h-5 theme-text-secondary" />
            </button>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onClose={() => setShowVideoModal(false)}
            onToggleLike={handleToggleVideoLike}
            onRefreshVideos={fetchContent}
          />
        )}

        {showBlogModal && selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onClose={() => setShowBlogModal(false)}
            onToggleLike={handleToggleBlogLike}
            onRefreshBlogs={fetchContent}
          />
        )}
      </div>
    </div>
  )
}
