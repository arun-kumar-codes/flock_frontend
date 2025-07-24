"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getBlogByStatus, deleteBlog } from "@/api/content"
import {
  SearchIcon,
  AlertCircleIcon,
  FileTextIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  MoreVerticalIcon,
  EyeIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  XIcon,
  BookOpenIcon,
} from "lucide-react"

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

const IMAGE_BASE_URL = "http://116.202.210.102:5055/"

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

  const deleteModalRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const viewModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node) && showDeleteModal) {
        setShowDeleteModal(false)
      }
      if (viewModalRef.current && !viewModalRef.current.contains(event.target as Node) && showViewModal) {
        setShowViewModal(false)
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDeleteModal, showViewModal])

  const fetchBlogs = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await getBlogByStatus("published")
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

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog)
    setShowDeleteModal(true)
    setShowActionMenu(null)
    setDeleteError("")
  }

  const handleViewClick = (blog: Blog) => {
    setBlogToView(blog)
    setShowViewModal(true)
    setShowActionMenu(null)
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null
    return imagePath.startsWith("http") ? imagePath : `${IMAGE_BASE_URL}${imagePath}`
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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Blog Management</h2>
        <p className="text-slate-600">Manage published blog posts and content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Blogs</p>
              <p className="text-2xl font-bold text-slate-800">{totalBlogs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileTextIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Likes</p>
              <p className="text-2xl font-bold text-slate-800">{totalLikes}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ThumbsUpIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Comments</p>
              <p className="text-2xl font-bold text-slate-800">{totalComments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircleIcon className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchBlogs}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Blog Management */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-800">Published Blogs</h3>
            <button
              onClick={fetchBlogs}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Refresh Blogs"}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author === "all" ? "All Authors" : author}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading blogs...</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex space-x-4 flex-1">
                    {blog.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src={getImageUrl(blog.image) || "/placeholder.svg"}
                          alt={blog.title}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-slate-800 text-lg">{blog.title}</h4>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{generateExcerpt(blog.content, 150)}</p>
                      <div className="flex items-center space-x-6 text-sm text-slate-500 mb-2">
                        <span className="flex items-center space-x-1">
                          <UserIcon className="w-4 h-4" />
                          <span>by {blog.author.username}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(blog.created_at)}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <ThumbsUpIcon className="w-3 h-3" />
                          <span>{blog.likes} likes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircleIcon className="w-3 h-3" />
                          <span>{blog.comments_count} comments</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>ID: {blog.id}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative ml-4" >
                    <button
                      onClick={() =>
                        setShowActionMenu(showActionMenu === blog.id.toString() ? null : blog.id.toString())
                      }
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                    </button>
                    {showActionMenu === blog.id.toString() && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20" ref={actionMenuRef}>
                        <button
                          onClick={() => handleViewClick(blog)}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>View Content</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(blog)}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Delete Content</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No blogs found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || filterAuthor !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No blogs available at the moment"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Blog Modal */}
      {showDeleteModal && blogToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Confirm Blog Deletion</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setBlogToDelete(null)
                    setDeleteError("")
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">Delete Blog</h4>
                  <p className="text-slate-600 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div>
                  <p className="font-medium text-slate-800 mb-1">{blogToDelete.title}</p>
                  <p className="text-sm text-slate-600 mb-2">{generateExcerpt(blogToDelete.content, 100)}</p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>by {blogToDelete.author.username}</span>
                    <span>{formatDate(blogToDelete.created_at)}</span>
                    <span>{blogToDelete.likes} likes</span>
                    <span>{blogToDelete.comments_count} comments</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-6">
                Are you sure you want to delete <strong>"{blogToDelete.title}"</strong>? This will permanently remove
                the blog and all associated data including comments and likes.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircleIcon className="w-4 h-4 text-red-600" />
                    <p className="text-red-800 text-sm">{deleteError}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setBlogToDelete(null)
                    setDeleteError("")
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBlog(blogToDelete.id)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
      {/* View Content Modal */}
      {showViewModal && blogToView && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div
            ref={viewModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Blog Content</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setBlogToView(null)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Blog Header */}
              <div className="mb-6">
                {blogToView.image && (
                  <div className="mb-4">
                    <Image
                      src={getImageUrl(blogToView.image) || "/placeholder.svg"}
                      alt={blogToView.title}
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                <h1 className="text-3xl font-bold text-slate-800 mb-4">{blogToView.title}</h1>
                <div className="flex items-center space-x-6 text-sm text-slate-500 mb-4">
                  <span className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4" />
                    <span>by {blogToView.author.username}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(blogToView.created_at)}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-slate-600">
                  <span className="flex items-center space-x-1">
                    <ThumbsUpIcon className="w-4 h-4" />
                    <span>{blogToView.likes} likes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircleIcon className="w-4 h-4" />
                    <span>{blogToView.comments_count} comments</span>
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    ID: {blogToView.id}
                  </span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="prose prose-slate max-w-none">
                <div
                  className="text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blogToView.content }}
                />
              </div>

              {/* Author Info */}
              <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">About the Author</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {blogToView.author.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{blogToView.author.username}</p>
                    <p className="text-sm text-slate-600">{blogToView.author.email}</p>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mt-1">
                      {blogToView.author.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {blogToView.comments && blogToView.comments.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                    <MessageCircleIcon className="w-5 h-5" />
                    <span>Comments ({blogToView.comments_count})</span>
                  </h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {blogToView.comments
                      .sort((a, b) => new Date(b.commented_at).getTime() - new Date(a.commented_at).getTime())
                      .map((comment) => (
                        <div key={comment.id} className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-xs">
                                {comment.commenter.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-slate-800 text-sm">{comment.commenter.username}</span>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                  {comment.commenter.role}
                                </span>
                                <span className="text-xs text-slate-500">{formatDate(comment.commented_at)}</span>
                              </div>
                              <p className="text-slate-700 text-sm leading-relaxed">{comment.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* No Comments State */}
              {(!blogToView.comments || blogToView.comments.length === 0) && (
                <div className="mt-8 p-6 bg-slate-50 rounded-lg text-center">
                  <MessageCircleIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">No comments yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
