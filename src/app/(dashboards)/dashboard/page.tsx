"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { createBlog, getBlog } from "@/api/content"
import { useDispatch } from "react-redux"
import { logOut } from "@/slice/userSlice"
import { UseSelector } from "react-redux"
import {
  PlusIcon,
  LogOutIcon,
  SearchIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  FileTextIcon,
  TrendingUpIcon,
  UserIcon,
  XIcon,
  SaveIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react"
import Image from "next/image"
import profileImg from "@/assets/profile.png"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"

interface UserData {
  email: string
  username: string
  id: string
  imageUrl?: string
  content?: Blog[]
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
  comments: any[]
  comments_count: number
  liked_by: number[]
  likes: number
  // UI-specific fields
  description?: string
  createdAt?: string
  status?: "published" | "draft" | "archived"
  views?: number
  category?: string
}

interface CreateBlogData {
  title: string
  content: string
  status?: string
  category?: string
}

export default function Dashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [userData, setUserData] = useState<UserData>({
    email: "",
    username: "",
    id: "",
    imageUrl: "",
    content: [],
  })
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [createSuccess, setCreateSuccess] = useState("")
  const [fetchError, setFetchError] = useState("")
  // Create blog form state
  const [blogForm, setBlogForm] = useState<CreateBlogData>({
    title: "",
    content: "",
    status: "draft",
    category: "General",
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const createModalRef = useRef<HTMLDivElement>(null)

  const user = useSelector((state: any) => state.user)

  useEffect(()=>{

      if(user.role.toLowerCase()==="admin"){
        router.replace("/admin")
      }else if(user.role.toLowerCase()==="viewer"){
        router.replace("/viewer")
      }

  }),[];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDetails(false)
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
      if (createModalRef.current && !createModalRef.current.contains(event.target as Node) && showCreateModal) {
        setShowCreateModal(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCreateModal])

  // Fetch user's blogs
  const fetchUserBlogs = async () => {
    try {
      const response = await getBlog()
      console.log("Fetch blogs response:", response)

      if (response?.data?.blogs) {
        // Filter blogs created by current user and add UI-specific fields
        const userBlogs = response.data.blogs
          .filter((blog: Blog) => blog.created_by === user?.id || blog.author?.id === user?.id)
          .map((blog: Blog) => ({
            ...blog,
            description: generateExcerpt(blog.content),
            createdAt: blog.created_at,
            status: "published" as const, // You can add status logic based on your API
            views: Math.floor(Math.random() * 1000), // Mock views - replace with real data
            category: blog.author?.role === "Creator" ? "Programming" : "General",
          }))

        setUserData((prev) => ({
          ...prev,
          content: userBlogs,
        }))
      }
    } catch (error) {
      console.error("Error fetching user blogs:", error)
      setFetchError("Failed to fetch your blogs")
    }
  }

  // Helper function to generate excerpt
  const generateExcerpt = (content: string, maxLength = 100): string => {
    const textContent = content.replace(/<[^>]*>/g, "")
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
  }

  useEffect(() => {
    if (user) {
      if (!user.is_profile_completed) {
        router.push("/dashboard/profile")
      } else {
        // Set user data from Redux store
        setUserData((prev) => ({
          ...prev,
          email: user.email || "",
          username: user.username || "",
          id: user.id || "",
        }))
        fetchUserBlogs()
      }
      setIsLoading(false)
    }
  }, [user, router])

  if (isLoading) {
    return <Loader />
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    dispatch(logOut())
    router.push("/login")
  }

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError("")
    setCreateSuccess("")

    // Validation
    if (!blogForm.title.trim()) {
      setCreateError("Title is required")
      return
    }
    if (!blogForm.content.trim()) {
      setCreateError("Content is required")
      return
    }
    if (blogForm.content.trim().length < 10) {
      setCreateError("Content must be at least 10 characters long")
      return
    }

    setIsCreating(true)

    try {
      const response = await createBlog({
        title: blogForm.title.trim(),
        content: blogForm.content.trim(),
      })

      console.log("Create blog response:", response)

      if (response?.status === 200 || response?.status === 201 || response?.data) {
        setCreateSuccess("Blog created successfully!")

        // Reset form
        setBlogForm({
          title: "",
          content: "",
          status: "draft",
          category: "General",
        })

        // Refresh blogs list
        await fetchUserBlogs()

        // Close modal after a short delay
        setTimeout(() => {
          setShowCreateModal(false)
          setCreateSuccess("")
        }, 2000)
      } else {
        setCreateError("Failed to create blog. Please try again.")
      }
    } catch (error: any) {
      console.error("Error creating blog:", error)
      setCreateError(error?.response?.data?.message || "Failed to create blog. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleFormChange = (field: keyof CreateBlogData, value: string) => {
    setBlogForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear errors when user starts typing
    if (createError) {
      setCreateError("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "draft":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const filteredContent =
    userData.content?.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesFilter = filterStatus === "all" || item.status === filterStatus
      return matchesSearch && matchesFilter
    }) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileTextIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">ContentHub</h1>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 bg-white rounded-full p-1 pr-4 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
                onClick={() => setShowUserDetails(!showUserDetails)}
              >
                <Image src={profileImg || "/placeholder.svg"} alt="Profile" width={32} className="rounded-full" />
                <span className="text-sm font-medium text-slate-700">{userData.username}</span>
              </button>
              {showUserDetails && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-0 z-50 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
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
                        <h3 className="font-semibold text-lg">{userData.username}</h3>
                        <p className="text-indigo-100 text-sm opacity-90">{userData.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-xs text-indigo-100">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Profile Stats */}
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-slate-800">{userData.content?.length || 0}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <FileTextIcon className="w-3 h-3" />
                          <span>Blogs</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">
                          {userData.content?.reduce((sum, item) => sum + (item.views || 0), 0) || 0}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <EyeIcon className="w-3 h-3" />
                          <span>Views</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">
                          {userData.content?.filter((item) => item.status === "published").length || 0}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <TrendingUpIcon className="w-3 h-3" />
                          <span>Published</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Profile Menu */}
                  <div className="py-2">
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">View Profile</div>
                        <div className="text-xs text-slate-500">Manage your account settings</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <EditIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Edit Profile</div>
                        <div className="text-xs text-slate-500">Update your information</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Analytics</div>
                        <div className="text-xs text-slate-500">View your content performance</div>
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
                        <div className="text-xs text-red-400">End your current session</div>
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
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {userData.username}! 👋</h2>
          <p className="text-slate-600">Manage your blogs and track your progress</p>
        </div>

        {/* Error Message */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{fetchError}</p>
              <button
                onClick={fetchUserBlogs}
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
                <p className="text-sm font-medium text-slate-600">Total Blogs</p>
                <p className="text-2xl font-bold text-slate-800">{userData.content?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold text-slate-800">
                  {userData.content?.filter((item) => item.status === "published").length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-800">
                  {userData.content?.reduce((sum, item) => sum + (item.views || 0), 0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-800">Your Blogs</h3>
              <button
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create New Blog
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            {filteredContent.length > 0 ? (
              <div className="space-y-4">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-slate-800">{item.title}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status || "published")}`}
                        >
                          {item.status || "published"}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </span>
                        {item.views && (
                          <span className="flex items-center space-x-1">
                            <EyeIcon className="w-3 h-3" />
                            <span>{item.views} views</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <span>👍 {item.likes} likes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>💬 {item.comments_count} comments</span>
                        </span>
                      </div>
                    </div>
                    <div className="relative" ref={actionMenuRef}>
                      <button
                        onClick={() =>
                          setShowActionMenu(showActionMenu === item.id.toString() ? null : item.id.toString())
                        }
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                      </button>
                      {showActionMenu === item.id.toString() && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                            <EyeIcon className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                            <EditIcon className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                            <TrashIcon className="w-4 h-4" />
                            <span>Delete</span>
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
                  <FileTextIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No blogs found</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating your first blog post"}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <button
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Your First Blog
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Blog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={createModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-200"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Create New Blog</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setBlogForm({ title: "", content: "", status: "draft", category: "General" })
                    setCreateError("")
                    setCreateSuccess("")
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleCreateBlog} className="p-6">
                {/* Success Message */}
                {createSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <p className="text-green-800 text-sm">{createSuccess}</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {createError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-4 h-4 text-red-600" />
                      <p className="text-red-800 text-sm">{createError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={blogForm.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your blog title..."
                      maxLength={200}
                    />
                    <p className="text-xs text-slate-500 mt-1">{blogForm.title.length}/200 characters</p>
                  </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                      Blog Content *
                    </label>
                    <textarea
                      id="content"
                      value={blogForm.content}
                      onChange={(e) => handleFormChange("content", e.target.value)}
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Write your blog content here..."
                      rows={12}
                      minLength={10}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {blogForm.content.length} characters (minimum 10 required)
                    </p>
                  </div>

                  {/* Category and Status Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        value={blogForm.category}
                        onChange={(e) => handleFormChange("category", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="General">General</option>
                        <option value="Programming">Programming</option>
                        <option value="Design">Design</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Lifestyle">Lifestyle</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        id="status"
                        value={blogForm.status}
                        onChange={(e) => handleFormChange("status", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setBlogForm({ title: "", content: "", status: "draft", category: "General" })
                      setCreateError("")
                      setCreateSuccess("")
                    }}
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !blogForm.title.trim() || !blogForm.content.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Create Blog
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
