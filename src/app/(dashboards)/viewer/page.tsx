"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import {
  LogOutIcon,
  SearchIcon,
  MoreVerticalIcon,
  HeartIcon,
  XIcon,
  SettingsIcon,
  UserIcon,
  TrendingUpIcon,
  BookOpenIcon,
  ClockIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  SendIcon,
  CalendarIcon,
  AlertCircleIcon,
} from "lucide-react"
import Image from "next/image"
import profileImg from "@/assets/profile.png"
import { getBlog } from "@/api/content"

interface ViewerData {
  email: string
  username: string
  id: string
  imageUrl?: string
  joinedAt: string
  role: string
}

interface Author {
  email: string
  id: number
  role: string
  username: string
}

interface Comment {
  id: number
  author: string
  content: string
  created_at: string
  avatar: string
}

interface Blog {
  id: number
  title: string
  content: string
  author: Author
  created_at: string
  created_by: number
  comments: Comment[]
  comments_count: number
  liked_by: number[]
  likes: number
  // UI-specific fields
  excerpt?: string
  thumbnail?: string
  readAt?: string
  readTime?: string
  category?: string
  isFavorite?: boolean
  isLiked?: boolean
  publishedAt?: string
}

interface ApiResponse {
  blogs: Blog[]
  pagination: {
    has_next: boolean
    has_prev: boolean
    page: number
    pages: number
    per_page: number
    total: number
  }
}

export default function ViewerDashboard() {
  const router = useRouter()
  const [viewerData, setViewerData] = useState<ViewerData>({
    email: "viewer@example.com",
    username: "John Viewer",
    id: "viewer-1",
    imageUrl: "",
    joinedAt: "2024-01-15",
    role: "Viewer",
  })

  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([])
  const [favorites, setFavorites] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [pagination, setPagination] = useState({
    has_next: false,
    has_prev: false,
    page: 1,
    pages: 1,
    per_page: 10,
    total: 0,
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const contentMenuRef = useRef<HTMLDivElement>(null)
  const settingsModalRef = useRef<HTMLDivElement>(null)
  const blogModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDetails(false)
      }
      if (contentMenuRef.current && !contentMenuRef.current.contains(event.target as Node)) {
        setShowContentMenu(null)
      }
      if (settingsModalRef.current && !settingsModalRef.current.contains(event.target as Node) && showSettingsModal) {
        setShowSettingsModal(false)
      }
      if (blogModalRef.current && !blogModalRef.current.contains(event.target as Node) && showBlogModal) {
        setShowBlogModal(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSettingsModal, showBlogModal])

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setIsLoading(true)
    setFetchError("")
    try {
      const response = await getBlog()
      console.log("Fetch blogs response:", response) // Debug log

      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs.map((blog: Blog) => ({
          ...blog,
          // Generate UI-specific fields
          excerpt: generateExcerpt(blog.content),
          thumbnail: "/placeholder.svg?height=200&width=300",
          readAt: new Date().toISOString().split("T")[0],
          readTime: calculateReadTime(blog.content),
          category: blog.author.role === "Creator" ? "Programming" : "General",
          isFavorite: false, // You can implement favorite logic based on user preferences
          isLiked: false, // You can check if current user ID is in liked_by array
          publishedAt: blog.created_at,
        }))

        setRecentBlogs(blogsWithUIFields)
        setPagination(response.data.pagination)
      } else {
        console.error("Unexpected response structure:", response)
        setFetchError("Failed to fetch blogs - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setFetchError("Failed to fetch blogs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to generate excerpt from content
  const generateExcerpt = (content: string, maxLength = 150): string => {
    // Remove HTML tags if any
    const textContent = content.replace(/<[^>]*>/g, "")
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
  }

  // Helper function to calculate read time
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    // Filter favorites from recent blogs
    setFavorites(recentBlogs.filter((blog) => blog.isFavorite))
  }, [recentBlogs])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const toggleFavorite = (blogId: number) => {
    setRecentBlogs((prev) =>
      prev.map((blog) => (blog.id === blogId ? { ...blog, isFavorite: !blog.isFavorite } : blog)),
    )
  }

  const toggleLike = (blogId: number) => {
    // TODO: Implement API call to like/unlike blog
    setRecentBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              isLiked: !blog.isLiked,
              likes: blog.isLiked ? blog.likes - 1 : blog.likes + 1,
            }
          : blog,
      ),
    )

    // Update selected blog if it's currently open
    if (selectedBlog && selectedBlog.id === blogId) {
      setSelectedBlog((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
            }
          : null,
      )
    }
  }

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog)
    setShowBlogModal(true)
    setShowContentMenu(null)
  }

  const handleContentAction = (action: string, blogId: number) => {
    switch (action) {
      case "favorite":
        toggleFavorite(blogId)
        break
      case "remove":
        setRecentBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
        break
      default:
        break
    }
    setShowContentMenu(null)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !selectedBlog) return

    setIsSubmittingComment(true)

    try {
      // TODO: Implement API call to add comment
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const comment: Comment = {
        id: Date.now(),
        author: viewerData.username,
        content: newComment,
        created_at: new Date().toISOString(),
        avatar: "/placeholder.svg?height=32&width=32",
      }

      // Update the blog in the main list
      setRecentBlogs((prev) =>
        prev.map((blog) =>
          blog.id === selectedBlog.id
            ? {
                ...blog,
                comments: [...blog.comments, comment],
                comments_count: blog.comments_count + 1,
              }
            : blog,
        ),
      )

      // Update the selected blog
      setSelectedBlog((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, comment],
              comments_count: prev.comments_count + 1,
            }
          : null,
      )

      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
      // Handle error - show toast or error message
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const filteredBlogs = recentBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.category && blog.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterCategory === "all" || blog.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const totalRead = recentBlogs.length
  const totalFavorites = favorites.length
  const totalReadTime = recentBlogs.reduce((acc, blog) => {
    if (blog.readTime) {
      const minutes = Number.parseInt(blog.readTime.split(" ")[0])
      return acc + minutes
    }
    return acc
  }, 0)

  const categories = ["all", ...Array.from(new Set(recentBlogs.map((blog) => blog.category).filter(Boolean)))]

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading && recentBlogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">My Reading Dashboard</h1>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 bg-white rounded-full p-1 pr-4 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
                onClick={() => setShowUserDetails(!showUserDetails)}
              >
                <Image src={profileImg || "/placeholder.svg"} alt="Profile" width={32} className="rounded-full" />
                <span className="text-sm font-medium text-slate-700">{viewerData.username}</span>
              </button>
              {showUserDetails && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-0 z-50 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={profileImg || "/placeholder.svg"}
                          alt="Profile"
                          width={56}
                          height={56}
                          className="rounded-full border-3 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="text-white">
                        <h3 className="font-semibold text-lg">{viewerData.username}</h3>
                        <p className="text-blue-100 text-sm opacity-90">{viewerData.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
                            <BookOpenIcon className="w-3 h-3 mr-1" />
                            {viewerData.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* User Stats */}
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-slate-800">{totalRead}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <BookOpenIcon className="w-3 h-3" />
                          <span>Read</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">{totalFavorites}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <HeartIcon className="w-3 h-3" />
                          <span>Favorites</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">{totalReadTime}m</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>Reading</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* User Menu */}
                  <div className="py-2">
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">My Profile</div>
                        <div className="text-xs text-slate-500">View and edit profile</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <HeartIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">My Favorites</div>
                        <div className="text-xs text-slate-500">View saved articles</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Reading History</div>
                        <div className="text-xs text-slate-500">View reading activity</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setShowSettingsModal(true)}
                      className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <SettingsIcon className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Settings</div>
                        <div className="text-xs text-slate-500">Account preferences</div>
                      </div>
                    </button>
                    <div className="my-2 h-px bg-slate-200 mx-6"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-red-50 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <LogOutIcon className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-red-600">Sign Out</div>
                        <div className="text-xs text-red-400">End your session</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {viewerData.username}! 📚</h2>
          <p className="text-slate-600">Continue your reading journey and discover new articles</p>
        </div>

        {/* Error Message */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{fetchError}</p>
              <button
                onClick={fetchBlogs}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Articles Available</p>
                <p className="text-2xl font-bold text-slate-800">{pagination.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Favorites</p>
                <p className="text-2xl font-bold text-slate-800">{totalFavorites}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Est. Read Time</p>
                <p className="text-2xl font-bold text-slate-800">{totalReadTime}m</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-800">Recent Articles</h3>
              <button
                onClick={fetchBlogs}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading articles...</p>
              </div>
            ) : filteredBlogs.length > 0 ? (
              <div className="space-y-6">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-slate-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 border border-slate-200 cursor-pointer"
                    onClick={() => handleBlogClick(blog)}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <Image
                          src={blog.thumbnail || "/placeholder.svg"}
                          alt={blog.title}
                          width={300}
                          height={200}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{blog.title}</h4>
                            <p className="text-slate-600 text-sm mb-3 line-clamp-3">{blog.excerpt}</p>
                          </div>
                          <div className="relative ml-4" ref={contentMenuRef}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowContentMenu(showContentMenu === blog.id.toString() ? null : blog.id.toString())
                              }}
                              className="p-1 hover:bg-slate-200 rounded transition-colors"
                            >
                              <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                            </button>
                            {showContentMenu === blog.id.toString() && (
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleContentAction("favorite", blog.id)
                                  }}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                                >
                                  <HeartIcon className="w-4 h-4" />
                                  <span>{blog.isFavorite ? "Remove Favorite" : "Add Favorite"}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleContentAction("remove", blog.id)
                                  }}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  <XIcon className="w-4 h-4" />
                                  <span>Remove from History</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                          <div className="flex items-center space-x-4">
                            <span>by {blog.author.username}</span>
                            <span className="flex items-center space-x-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatDate(blog.created_at)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <ClockIcon className="w-4 h-4" />
                              <span>{blog.readTime}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {blog.category}
                            </span>
                            {blog.isFavorite && <HeartIcon className="w-4 h-4 text-red-500 fill-current" />}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleLike(blog.id)
                              }}
                              className={`flex items-center space-x-1 hover:text-blue-600 transition-colors ${
                                blog.isLiked ? "text-blue-600" : ""
                              }`}
                            >
                              <ThumbsUpIcon className={`w-4 h-4 ${blog.isLiked ? "fill-current" : ""}`} />
                              <span>{blog.likes}</span>
                            </button>
                            <div className="flex items-center space-x-1">
                              <MessageCircleIcon className="w-4 h-4" />
                              <span>{blog.comments_count}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No articles found</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || filterCategory !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No articles available at the moment"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800">Your Favorites</h3>
              <p className="text-slate-600 text-sm mt-1">Articles you've marked as favorite</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.slice(0, 6).map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-slate-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 border border-slate-200 cursor-pointer"
                    onClick={() => handleBlogClick(blog)}
                  >
                    <Image
                      src={blog.thumbnail || "/placeholder.svg"}
                      alt={blog.title}
                      width={300}
                      height={120}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{blog.title}</h4>
                      <p className="text-slate-600 text-xs mb-2">by {blog.author.username}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{blog.readTime}</span>
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center space-x-1">
                            <ThumbsUpIcon className="w-3 h-3" />
                            <span>{blog.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircleIcon className="w-3 h-3" />
                            <span>{blog.comments_count}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Blog Modal */}
      {showBlogModal && selectedBlog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={blogModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedBlog.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>by {selectedBlog.author.username}</span>
                    <span className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(selectedBlog.created_at)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{selectedBlog.readTime}</span>
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedBlog.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowBlogModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <XIcon className="w-6 h-6 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Blog Content */}
              <div className="p-6 border-b border-slate-200">
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{selectedBlog.content}</div>
                </div>
              </div>

              {/* Engagement Section */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => toggleLike(selectedBlog.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedBlog.isLiked
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <ThumbsUpIcon className={`w-5 h-5 ${selectedBlog.isLiked ? "fill-current" : ""}`} />
                      <span>{selectedBlog.likes} Likes</span>
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedBlog.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedBlog.isFavorite
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <HeartIcon className={`w-5 h-5 ${selectedBlog.isFavorite ? "fill-current" : ""}`} />
                      <span>{selectedBlog.isFavorite ? "Favorited" : "Add to Favorites"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Comments ({selectedBlog.comments_count})</h3>

                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex space-x-3">
                    <Image
                      src={profileImg || "/placeholder.svg"}
                      alt="Your avatar"
                      width={40}
                      height={40}
                      className="rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!newComment.trim() || isSubmittingComment}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isSubmittingComment ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Posting...</span>
                            </>
                          ) : (
                            <>
                              <SendIcon className="w-4 h-4" />
                              <span>Post Comment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedBlog.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Image
                        src={comment.avatar || "/placeholder.svg"}
                        alt={comment.author}
                        width={32}
                        height={32}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-slate-800 text-sm">{comment.author}</span>
                            <span className="text-xs text-slate-500">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="text-slate-700 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedBlog.comments.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircleIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={settingsModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={viewerData.username}
                    onChange={(e) => setViewerData((prev) => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={viewerData.email}
                    onChange={(e) => setViewerData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Reading Reminders</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
