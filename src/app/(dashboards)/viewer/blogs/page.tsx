"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  SearchIcon,
  MoreVerticalIcon,
  HeartIcon,
  XIcon,
  ClockIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  CalendarIcon,
  AlertCircleIcon,
  BookOpenIcon,
  FilterIcon,
  RefreshCwIcon,

} from "lucide-react"
import Image from "next/image"
import { getBlog, toggleBlogLike, editComments, addComment, deleteComment } from "@/api/content"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"
import { BlogModal } from "@/components/viewer/blog-modal"

interface Author {
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
  blog_id: number
  comment: string
  commented_at: string
  commented_by: number
  commenter: Commenter
}

interface Blog {
  is_liked: boolean
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
}

export default function BlogPage() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
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
    fetchBlogs()
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

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog)
    setShowBlogModal(true)
    setShowContentMenu(null)
  }

  // Add this new function to update the selected blog when data changes
  const updateSelectedBlog = () => {
    if (selectedBlog) {
      const updatedBlog = blogs.find((blog) => blog.id === selectedBlog.id)
      if (updatedBlog) {
        setSelectedBlog(updatedBlog)
      }
    }
  }

  const fetchBlogs = async () => {
    setFetchError("")
    setIsLoading(true)
    try {
      const response = await getBlog()
      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs.map((blog: Blog) => ({
          ...blog,
          excerpt: generateExcerpt(blog.content),
          thumbnail: "/placeholder.svg?height=200&width=300",
          readAt: new Date().toISOString().split("T")[0],
          readTime: calculateReadTime(blog.content),
          category: blog.author.role === "Creator" ? "Programming" : "General",
          isFavorite: false,
          publishedAt: blog.created_at,
        }))
        setBlogs(blogsWithUIFields)

        // Update selected blog if modal is open
        if (selectedBlog) {
          const updatedSelectedBlog = blogsWithUIFields.find((blog: Blog) => blog.id === selectedBlog.id)
          if (updatedSelectedBlog) {
            setSelectedBlog(updatedSelectedBlog)
          }
        }
      } else {
        setFetchError("Failed to fetch blogs - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setFetchError("Failed to fetch blogs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

    const fetchUpdatedBlogs = async () => {
    setFetchError("")
      try {
      const response = await getBlog()
      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs.map((blog: Blog) => ({
          ...blog,
          excerpt: generateExcerpt(blog.content),
          thumbnail: "/placeholder.svg?height=200&width=300",
          readAt: new Date().toISOString().split("T")[0],
          readTime: calculateReadTime(blog.content),
          category: blog.author.role === "Creator" ? "Programming" : "General",
          isFavorite: false,
          publishedAt: blog.created_at,
        }))
        setBlogs(blogsWithUIFields)

        // Update selected blog if modal is open
        if (selectedBlog) {
          const updatedSelectedBlog = blogsWithUIFields.find((blog: Blog) => blog.id === selectedBlog.id)
          if (updatedSelectedBlog) {
            setSelectedBlog(updatedSelectedBlog)
          }
        }
      } else {
        setFetchError("Failed to fetch blogs - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setFetchError("Failed to fetch blogs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const generateExcerpt = (content: string, maxLength = 150): string => {
    const textContent = content.replace(/<[^>]*>/g, "")
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
  }

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  const toggleFavorite = (blogId: number) => {
    setBlogs((prev) => prev.map((blog) => (blog.id === blogId ? { ...blog, isFavorite: !blog.isFavorite } : blog)))
  }

  const toggleLike = async (blogId: number) => {
    try {
      await toggleBlogLike(blogId)
      fetchUpdatedBlogs();
    } catch (error) {
      console.error("Error toggling blog like:", error)
    }
  }

  const handleContentAction = (action: string, blogId: number) => {
    switch (action) {
      case "favorite":
        toggleFavorite(blogId)
        break
      case "remove":
        setBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
        break
      default:
        break
    }
    setShowContentMenu(null)
  }



  const toggleComments = (blogId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(blogId)) {
        newSet.delete(blogId)
      } else {
        newSet.add(blogId)
      }
      return newSet
    })
  }

  const handleAddComment = async (blogId: number) => {
    const commentText = newComments[blogId]?.trim()
    if (!commentText) return

    try {
      await addComment(blogId, commentText)
      setNewComments((prev) => ({ ...prev, [blogId]: "" }))
      fetchBlogs()
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleEditComment = async (commentId: number) => {
    const trimmedText = editCommentText.trim()
    if (!trimmedText) return

    try {
      await editComments(commentId, trimmedText)
      setEditingComment(null)
      setEditCommentText("")
      fetchBlogs()
    } catch (error) {
      console.error("Error editing comment:", error)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId)
      fetchBlogs()
    } catch (error) {
      console.error("Error deleting comment:", error)
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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.category && blog.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterCategory === "all" || blog.category === filterCategory
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    if (selectedBlog) {
      updateSelectedBlog()
    }
  }, [showBlogModal,setBlogs])
  const categories = ["all", ...Array.from(new Set(blogs.map((blog) => blog.category).filter(Boolean)))]

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Blog Articles</h1>
              <p className="text-slate-600 text-lg">Discover amazing content from our creators</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 flex-1">{fetchError}</p>
              <button
                onClick={fetchBlogs}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Retry
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
                placeholder="Search articles by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchBlogs}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCwIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Loading..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="space-y-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="lg:flex">
                 {    blog.image &&
                  <div className="lg:w-80 lg:flex-shrink-0">
                    <div className="relative h-48 lg:h-full cursor-pointer" onClick={() => handleBlogClick(blog)}>
                  <Image
                        src={blog.image }
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                      }
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {blog.category}
                          </span> */}
                          {blog.isFavorite && <HeartIcon className="w-4 h-4 text-red-500 fill-current" />}
                        </div>
                        <h3
                          className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                          onClick={() => handleBlogClick(blog)}
                        >
                          {blog.title}
                        </h3>
                        <p className="text-slate-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                        <div className="flex items-center space-x-6 text-sm text-slate-500 mb-4">
                          <span className="font-medium">by {blog.author.username}</span>
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(blog.created_at)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{blog.readTime}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleLike(blog.id)
                              }}
                              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                                blog.is_liked ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              <ThumbsUpIcon className={`w-4 h-4 ${blog.is_liked ? "fill-current" : ""}`} />
                              <span className="text-sm font-medium">{blog.likes}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleComments(blog.id)
                              }}
                              className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 transition-colors"
                            >
                              <MessageCircleIcon className="w-4 h-4" />
                              <span className="text-sm">{blog.comments_count}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative ml-4" ref={contentMenuRef}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowContentMenu(showContentMenu === blog.id.toString() ? null : blog.id.toString())
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVerticalIcon className="w-5 h-5 text-slate-500" />
                        </button>
                        {showContentMenu === blog.id.toString() && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleContentAction("favorite", blog.id)
                              }}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                            >
                              <HeartIcon className="w-4 h-4" />
                              <span>{blog.isFavorite ? "Remove Favorite" : "Add Favorite"}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleContentAction("remove", blog.id)
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

                 
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpenIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No articles found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {searchTerm || filterCategory !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "No articles are available at the moment. Check back later for new content."}
              </p>
              {(searchTerm || filterCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterCategory("all")
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Blog Modal */}
        {showBlogModal && selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onClose={() => setShowBlogModal(false)}
            onToggleLike={toggleLike}
            onToggleFavorite={toggleFavorite}
            onRefreshBlogs={fetchUpdatedBlogs}
          />
        )}
      </div>
    </div>
  )
}
