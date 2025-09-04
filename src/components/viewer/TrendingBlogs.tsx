"use client"

import { FlameIcon as FireIcon, ArrowRightIcon, Loader2, Heart, Eye, MessageCircle, Calendar, User } from "lucide-react"
import { useState, useEffect } from "react"
import { getTrendingBlog, toggleBlogLike } from "@/api/content"
import { BlogModal } from "./blog-modal"
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
}



export default function TrendingBlogsTab() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  const loadTrendingBlogs = async () => {
    try {
      setError(null)
      const response = await getTrendingBlog()
      const data = response.data.blogs
      setBlogs(data)
      if(selectedBlog){
        setSelectedBlog(data.find((blog:any) => blog.id === selectedBlog.id) || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trending blogs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrendingBlogs()
  }, [])

  const handleRefresh = async () => {
    loadTrendingBlogs()
  }

  const openBlogModal = (blog: BlogPost) => {
    setSelectedBlog(blog)
    setIsModalOpen(true)
  }

  const closeBlogModal = () => {
    setSelectedBlog(null)
    setIsModalOpen(false)
  }

  const handleToggleLike = async (blogId: number) => {
    try {
      await toggleBlogLike(blogId)
      // Update the blog in the local state
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId
            ? {
                ...blog,
                is_liked: !blog.is_liked,
                likes: blog.is_liked ? blog.likes - 1 : blog.likes + 1,
              }
            : blog,
        ),
      )
      // Update selected blog if it's the one being liked
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
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleToggleFavorite = async (blogId: number) => {
    // Implement favorite functionality if needed
    //console.log("Toggle favorite for blog:", blogId)
  }

  const handleRefreshBlogs = () => {
    loadTrendingBlogs()
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <FireIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Trending Blogs</h3>
              <p className="text-slate-600 text-sm">Discover the hottest content</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl border border-orange-200">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading trending blogs...</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <FireIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Trending Blogs</h3>
              <p className="text-slate-600 text-sm">Discover the hottest content</p>
            </div>
          </div>
        </div>
        <div className="text-center py-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FireIcon className="w-10 h-10 text-red-500" />
          </div>
          <h4 className="text-xl font-semibold text-slate-800 mb-2">Oops! Something went wrong</h4>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <FireIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Trending Blogs</h3>
              <p className="text-slate-600 text-sm">Discover the hottest content</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
              {blogs.length} posts
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="text-orange-600 hover:text-orange-700 font-semibold text-sm px-4 py-2 rounded-xl cursor-pointer  bg-orange-50 hover:bg-orange-100 transition-all duration-200 border border-orange-200"
            >
              Refresh
            </button>
            <button
              onClick={() => router.push("/viewer/blogs")}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-sm flex items-center group px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <div
                key={blog.id}
                onClick={() => openBlogModal(blog)}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-orange-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
           

                {/* Blog Image */}
                {blog.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 flex items-center justify-center">
                    <FireIcon className="w-16 h-16 text-orange-400" />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      {blog.author.profile_picture ? (
                        <img
                          src={blog.author.profile_picture || "/placeholder.svg"}
                          alt={blog.author.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{blog.author.username}</p>
                      <p className="text-xs text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(blog.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Blog Title */}
                  <h4 className="font-bold text-lg text-slate-800 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2 leading-tight">
                    {blog.title}
                  </h4>

                  {/* Blog Content Preview */}
                  <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">{truncateContent(blog.content)}</p>

               

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{blog.views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Heart className={`w-4 h-4 ${blog.is_liked ? "text-red-500 fill-current" : ""}`} />
                        <span className="text-sm font-medium">{blog.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{blog.comments_count}</span>
                      </div>
                    </div>
              
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl border border-orange-200">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FireIcon className="w-10 h-10 text-orange-500" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mb-2">No trending blogs yet</h4>
            <p className="text-slate-600 max-w-md mx-auto">Be the first to create amazing content that trends!</p>
          </div>
        )}
      </div>

      {/* Use the existing BlogModal component */}
      {isModalOpen && selectedBlog && (
        <BlogModal
          blog={selectedBlog}
          onClose={closeBlogModal}
          onToggleLike={handleToggleLike}
          onRefreshBlogs={handleRefreshBlogs}
        />
      )}
    </>
  )
}
