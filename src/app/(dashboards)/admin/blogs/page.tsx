"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getBlogByStatus, deleteBlog, rejectBlog } from "@/api/content"
import {
  SearchIcon,
  AlertCircleIcon,
  FileTextIcon,
  MessageCircleIcon,
  MoreVerticalIcon,
  EyeIcon,
  TrashIcon,
  CalendarIcon,
  XIcon,
  BookOpenIcon,
  FilterIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  StarIcon,
  HeartIcon,
  XCircleIcon,
} from "lucide-react"
import TipTapContentDisplay from "@/components/tiptap-content-display"

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

interface Author {
  email: string
  id: number
  role: string
  username: string
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
  status?: string
  image?: string
  archived: boolean
  is_liked: boolean
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAuthor, setFilterAuthor] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [showViewModal, setShowViewModal] = useState(false)
  const [blogToView, setBlogToView] = useState<Blog | null>(null)
  const [activeTab, setActiveTab] = useState<"published" | "rejected">("published")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [blogToReject, setBlogToReject] = useState<Blog | null>(null)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectError, setRejectError] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [rejectReasonError, setRejectReasonError] = useState("")

  const deleteModalRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const viewModalRef = useRef<HTMLDivElement>(null)
  const rejectModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchBlogs()
  }, [activeTab]) // Added activeTab dependency to refetch when tab changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node) && showDeleteModal) {
        setShowDeleteModal(false)
      }
      if (viewModalRef.current && !viewModalRef.current.contains(event.target as Node) && showViewModal) {
        setShowViewModal(false)
      }
      if (rejectModalRef.current && !rejectModalRef.current.contains(event.target as Node) && showRejectModal) {
        setShowRejectModal(false)
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDeleteModal, showViewModal, showRejectModal]) // Added showRejectModal dependency

  const fetchBlogs = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await getBlogByStatus(activeTab)
      if (response?.data?.blogs) {
        setBlogs(response.data.blogs)
      } else if (response?.blogs) {
        setBlogs(response.blogs)
      } else {
        setError("Failed to fetch blogs data - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setError("Failed to fetch blogs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBlog = async (blogId: number) => {
    setIsDeleting(true)
    setDeleteError("")
    try {
      const response = await deleteBlog(blogId)
      if (
        response?.status === 200 ||
        response?.status === 204 ||
        response?.success === true ||
        response?.message?.toLowerCase().includes("success") ||
        response?.data?.success === true
      ) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId))
        setShowDeleteModal(false)
        setBlogToDelete(null)
      } else {
        setDeleteError(
          `Failed to delete blog. Server response: ${response?.status || response?.message || "Unknown error"}`,
        )
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setDeleteError("Blog not found. It may have already been deleted.")
      } else if (error?.response?.status === 403) {
        setDeleteError("You don't have permission to delete this blog.")
      } else if (error?.response?.status === 401) {
        setDeleteError("Authentication failed. Please log in again.")
      } else {
        setDeleteError(`Failed to delete blog: ${error?.message || error?.response?.data?.message || "Network error"}`)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRejectBlog = async (blogId: number) => {
    // Validate rejection reason
    const wordCount = rejectReason
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    if (wordCount < 10) {
      setRejectReasonError(`Rejection reason must be at least 10 words. Current: ${wordCount} words.`)
      return
    }

    setIsRejecting(true)
    setRejectError("")
    try {
      const response = await rejectBlog(blogId, rejectReason)
      if (
        response?.status === 200 ||
        response?.status === 204 ||
        response?.success === true ||
        response?.message?.toLowerCase().includes("success") ||
        response?.data?.success === true
      ) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId))
        setShowRejectModal(false)
        setBlogToReject(null)
        setRejectReason("")
        setRejectReasonError("")
      } else {
        setRejectError(
          `Failed to reject blog. Server response: ${response?.status || response?.message || "Unknown error"}`,
        )
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setRejectError("Blog not found. It may have already been processed.")
      } else if (error?.response?.status === 403) {
        setRejectError("You don't have permission to reject this blog.")
      } else if (error?.response?.status === 401) {
        setRejectError("Authentication failed. Please log in again.")
      } else {
        setRejectError(`Failed to reject blog: ${error?.message || error?.response?.data?.message || "Network error"}`)
      }
    } finally {
      setIsRejecting(false)
    }
  }

  const handleViewClick = (blog: Blog) => {
    setBlogToView(blog)
    setShowViewModal(true)
    setShowActionMenu(null)
  }

  const handleRejectClick = (blog: Blog) => {
    setBlogToReject(blog)
    setShowRejectModal(true)
    setShowActionMenu(null)
    setRejectReason("")
    setRejectReasonError("")
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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterAuthor === "all" || blog.author.username === filterAuthor
    return matchesSearch && matchesFilter
  })

  const authors = ["all", ...Array.from(new Set(blogs.map((blog) => blog.author.username)))]
  const totalBlogs = blogs.length
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  const totalComments = blogs.reduce((sum, blog) => sum + blog.comments_count, 0)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-2 md:mb-12 space-x-3 md:space-x-6">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <BookOpenIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-5xl font-bold  bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent mb-4  ">
            Blog Management
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-12">
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileTextIcon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{totalBlogs}</div>
                  <div className="text-xs md:text-sm font-medium text-blue-600">Total Blogs</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUpIcon className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-sm md:text-base">Published content</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <HeartIcon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{totalLikes}</div>
                  <div className="text-xs md:text-sm font-medium text-purple-600">Total Likes</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                <span className="text-sm md:text-base">Community engagement</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircleIcon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{totalComments}</div>
                  <div className="text-xs md:text-sm font-medium text-green-600">Total Comments</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MessageCircleIcon className="w-4 h-4 mr-1 text-blue-500" />
                <span>Active discussions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={fetchBlogs}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 border-b border-gray-200/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeTab === "published" ? "Published Content" : "Rejected Content"}
                </h2>
                <p className="text-gray-600">
                  {activeTab === "published"
                    ? "Manage your blog posts and monitor engagement"
                    : "Review and manage rejected blog posts"}
                </p>
              </div>
              <button
                onClick={fetchBlogs}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 cursor-pointer  bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl font-medium text-sm md:text-base"
              >
                <RefreshCwIcon className={`w-3 h-4 md:w-5 md:h-5 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="flex flex-col md:flex-row space-x-2 mt-8 bg-gray-500/10 rounded-2xl p-1">
              <button
                onClick={() => setActiveTab("published")}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base cursor-pointer ${
                  activeTab === "published" ? "bg-white text-purple-700 shadow-md" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Published Blogs
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base cursor-pointer ${
                  activeTab === "rejected" ? "bg-white text-red-700 shadow-md" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Rejected Blogs
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mt-8">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs, authors, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="relative">
                <FilterIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  className="pl-12 pr-8 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 min-w-[200px]"
                >
                  {authors.map((author) => (
                    <option key={author} value={author}>
                      {author === "all" ? "All Authors" : author}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:p-8">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-6 animate-pulse">
                  <BookOpenIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading blogs...</h3>
                <p className="text-gray-600">Please wait while we fetch your content</p>
              </div>
            ) : filteredBlogs.length > 0 ? (
              <div className="gap-4 md:gap-8">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 m-2 md:m-4 shadow-lg border border-gray-200/50 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewClick(blog)
                    }}
                  >
                    <div className="flex flex-col lg:flex-row md:gap-6">
                      {/* Image */}
                      {blog.image && (
                        <div className="relative w-full h-40 sm:h-32 sm:w-48 rounded-lg sm:rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                          <Image
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            fill
                            className="w-full h-full object-cover rounded-xl shadow-md"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 ">
                        <div className="w-full flex items-center justify-between mb-4 ">
                          <div className="">
                            <h3 className="text-lg py-2 line-clamp-2  md:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                              {blog.title}
                            </h3>
                          </div>

                          {/* Action Menu */}
                          <div className="relative mr-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowActionMenu(showActionMenu === blog.id.toString() ? null : blog.id.toString())
                              }}
                              className="p-2 hover:bg-gray-100 rounded-xl transition-colors opacity-100"
                            >
                              <MoreVerticalIcon className="w-5 h-5 text-gray-500" />
                            </button>
                            {showActionMenu === blog.id.toString() && (
                              <div
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-20"
                                ref={actionMenuRef}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewClick(blog)
                                  }}
                                  className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                >
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <EyeIcon className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="font-medium text-gray-900">View Content</span>
                                </button>
                                {activeTab === "published" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRejectClick(blog)
                                    }}
                                    className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-red-50 transition-colors"
                                  >
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                      <XCircleIcon className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="font-medium text-red-600">Reject Blog</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                         <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2 text-sm md:text-base">
                            {generateExcerpt(blog.content, 100)}
                          </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-xs">
                                {blog.author.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">by {blog.author.username}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(blog.created_at)}</span>
                          </div>
                          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            ID: {blog.id}
                          </div>
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 rounded-xl">
                            <HeartIcon className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-700">{blog.likes}</span>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-xl">
                            <MessageCircleIcon className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">{blog.comments_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                  <BookOpenIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeTab === "published" ? "No published blogs found" : "No rejected blogs found"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || filterAuthor !== "all"
                    ? "Try adjusting your search criteria or filters to find what you're looking for"
                    : activeTab === "published"
                      ? "No published blogs are available at the moment. Check back later for new content."
                      : "No rejected blogs are available at the moment."}
                </p>
                {(searchTerm || filterAuthor !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterAuthor("all")
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && blogToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div
              ref={deleteModalRef}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                      <AlertCircleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Delete Blog Post</h3>
                      <p className="text-red-600 text-sm">This action cannot be undone</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setBlogToDelete(null)
                      setDeleteError("")
                    }}
                    className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">{blogToDelete.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{generateExcerpt(blogToDelete.content, 120)}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>by {blogToDelete.author.username}</span>
                    <span>{formatDate(blogToDelete.created_at)}</span>
                    <span>{blogToDelete.likes} likes</span>
                    <span>{blogToDelete.comments_count} comments</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Are you sure you want to delete <strong>"{blogToDelete.title}"</strong>? This will permanently remove
                  the blog post and all associated data including comments and likes.
                </p>

                {deleteError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-4 h-4 text-red-600" />
                      <p className="text-red-800 text-sm">{deleteError}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setBlogToDelete(null)
                      setDeleteError("")
                    }}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blogToDelete.id)}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-lg"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete Blog
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && blogToView && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center sm:p-4 z-[60]">
            <div
              ref={viewModalRef}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col transform transition-all duration-200"
            >
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Blog Content</h3>
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      setBlogToView(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <XIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Blog Header */}
                <div className="mb-8">
                  {blogToView.image && (
                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                      <Image
                        src={blogToView.image || "/placeholder.svg"}
                        alt={blogToView.title}
                        width={800}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-4xl font-bold text-gray-900 mt-4 md:mt-0 mb-6 leading-tight">{blogToView.title}</h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {blogToView.author.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">by {blogToView.author.username}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(blogToView.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-xl">
                      <HeartIcon className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-red-700">{blogToView.likes} likes</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl">
                      <MessageCircleIcon className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-blue-700">{blogToView.comments_count} comments</span>
                    </div>
                    <div className="px-4 py-2 bg-gray-100 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">ID: {blogToView.id}</span>
                    </div>
                  </div>
                </div>

                {/* Blog Content */}

                <div className="mb-8">
                  <TipTapContentDisplay content={blogToView.content} className="text-gray-700" />
                </div>

                {/* Author Info */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8">
                  <h4 className="font-bold text-gray-900 mb-4">About the Author</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold">{blogToView.author.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{blogToView.author.username}</p>
                      <p className="text-gray-600">{blogToView.author.email}</p>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mt-2">
                        {blogToView.author.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {blogToView.comments && blogToView.comments.length > 0 ? (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <MessageCircleIcon className="w-5 h-5" />
                      <span>Comments ({blogToView.comments_count})</span>
                    </h4>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {blogToView.comments
                        .sort((a, b) => new Date(b.commented_at).getTime() - new Date(a.commented_at).getTime())
                        .map((comment) => (
                          <div key={comment.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {comment.commenter.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="font-semibold text-gray-900">{comment.commenter.username}</span>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    {comment.commenter.role}
                                  </span>
                                  <span className="text-xs text-gray-500">{formatDate(comment.commented_at)}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <MessageCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">No comments yet</h4>
                    <p className="text-gray-600">Be the first to start a conversation about this blog post.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showRejectModal && blogToReject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div
              ref={rejectModalRef}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                      <XCircleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Reject Blog Post</h3>
                      <p className="text-red-600 text-sm">This will move the blog to rejected status</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowRejectModal(false)
                      setBlogToReject(null)
                      setRejectError("")
                      setRejectReason("")
                      setRejectReasonError("")
                    }}
                    className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">{blogToReject.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{generateExcerpt(blogToReject.content, 120)}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>by {blogToReject.author.username}</span>
                    <span>{formatDate(blogToReject.created_at)}</span>
                    <span>{blogToReject.likes} likes</span>
                    <span>{blogToReject.comments_count} comments</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Are you sure you want to reject <strong>"{blogToReject.title}"</strong>? This will change the blog
                  status to rejected and it will no longer be visible to users.
                </p>

                <div className="mb-6">
                  <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value)
                      setRejectReasonError("")
                    }}
                    placeholder="Please provide a detailed reason for rejecting this blog post (minimum 10 words)..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={4}
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      Word count:{" "}
                      {
                        rejectReason
                          .trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length
                      }{" "}
                      / 10 minimum
                    </div>
                    {rejectReasonError && <div className="text-sm text-red-600">{rejectReasonError}</div>}
                  </div>
                </div>

                {rejectError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-4 h-4 text-red-600" />
                      <p className="text-red-800 text-sm">{rejectError}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false)
                      setBlogToReject(null)
                      setRejectError("")
                      setRejectReason("")
                      setRejectReasonError("")
                    }}
                    disabled={isRejecting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectBlog(blogToReject.id)}
                    disabled={
                      isRejecting ||
                      rejectReason
                        .trim()
                        .split(/\s+/)
                        .filter((word) => word.length > 0).length < 10
                    }
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-lg"
                  >
                    {isRejecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-4 h-4 mr-2" />
                        Reject Blog
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
