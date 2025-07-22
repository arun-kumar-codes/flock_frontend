"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { LogOutIcon, SearchIcon, MoreVerticalIcon, TrashIcon, EyeIcon, UsersIcon, XIcon, AlertCircleIcon, SendIcon, ShieldIcon, TrendingUpIcon, FileTextIcon, CalendarIcon, MessageCircleIcon, ThumbsUpIcon, BookOpenIcon, UserIcon, CheckIcon, ClockIcon } from 'lucide-react'
import Image from "next/image"
import profileImg from "@/assets/profile.png"
import { inviteUser, getAllUser, deleteUser } from "@/api/user"
import { getBlog, deleteBlog, getBlogByStatus, approveBlog, rejectBlog } from "@/api/content"
import Loader from "@/components/Loader"
import { logOut } from "@/slice/userSlice"
import { useDispatch } from "react-redux"

interface AdminData {
  email: string
  username: string
  id: string
  imageUrl?: string
}

interface User {
  id: number
  username: string
  email: string
  role: "Creator" | "Viewer"
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
  status?: string
  image?: string
}

interface ApiResponse {
  users: User[]
}

interface BlogApiResponse {
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

const IMAGE_BASE_URL = "http://116.202.210.102:5055/"

export default function AdminDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()

  // State for tabs
  const [activeTab, setActiveTab] = useState<"users" | "content" | "pending" | "approved">("users")

  // User management state
  const [adminData, setAdminData] = useState<AdminData>({
    email: "admin@example.com",
    username: "Admin",
    id: "admin-1",
    imageUrl: "",
  })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  // Content management state
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [contentFetchError, setContentFetchError] = useState("")
  const [contentSearchTerm, setContentSearchTerm] = useState("")
  const [contentFilterAuthor, setContentFilterAuthor] = useState("all")
  const [showContentActionMenu, setShowContentActionMenu] = useState<string | null>(null)
  const [showDeleteContentModal, setShowDeleteContentModal] = useState(false)
  const [contentToDelete, setContentToDelete] = useState<Blog | null>(null)
  const [isDeletingContent, setIsDeletingContent] = useState(false)
  const [deleteContentError, setDeleteContentError] = useState("")

  // Pending content state
  const [pendingContent, setPendingContent] = useState<Blog[]>([])
  const [isLoadingPending, setIsLoadingPending] = useState(false)
  const [pendingFetchError, setPendingFetchError] = useState("")
  const [pendingSearchTerm, setPendingSearchTerm] = useState("")
  const [showPendingActionMenu, setShowPendingActionMenu] = useState<string | null>(null)

  // Approved content state
  const [approvedContent, setApprovedContent] = useState<Blog[]>([])
  const [isLoadingApproved, setIsLoadingApproved] = useState(false)
  const [approvedFetchError, setApprovedFetchError] = useState("")
  const [approvedSearchTerm, setApprovedSearchTerm] = useState("")
  const [showApprovedActionMenu, setShowApprovedActionMenu] = useState<string | null>(null)

  // Content viewer state
  const [showContentViewer, setShowContentViewer] = useState(false)
  const [viewingContent, setViewingContent] = useState<Blog | null>(null)

  // Approval state
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [approvalError, setApprovalError] = useState("")

  const [pagination, setPagination] = useState({
    has_next: false,
    has_prev: false,
    page: 1,
    pages: 1,
    per_page: 10,
    total: 0,
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const deleteModalRef = useRef<HTMLDivElement>(null)
  const contentActionMenuRef = useRef<HTMLDivElement>(null)
  const deleteContentModalRef = useRef<HTMLDivElement>(null)
  const pendingActionMenuRef = useRef<HTMLDivElement>(null)
  const approvedActionMenuRef = useRef<HTMLDivElement>(null)
  const contentViewerRef = useRef<HTMLDivElement>(null)

  const user = useSelector((state: any) => state.user)

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.push("/login")
    }
    if (user.role.toLowerCase() === "creator") {
      router.push("/dashboard")
      return
    } else if (user.role.toLowerCase() === "viewer") {
      router.push("/viewer")
      return
    }

    setIsLoading(false)
    fetchUsers()
    fetchContent()
    fetchPendingContent()
    fetchApprovedContent()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDetails(false)
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
      if (contentActionMenuRef.current && !contentActionMenuRef.current.contains(event.target as Node)) {
        setShowContentActionMenu(null)
      }
      if (pendingActionMenuRef.current && !pendingActionMenuRef.current.contains(event.target as Node)) {
        setShowPendingActionMenu(null)
      }
      if (approvedActionMenuRef.current && !approvedActionMenuRef.current.contains(event.target as Node)) {
        setShowApprovedActionMenu(null)
      }
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && showInviteModal) {
        setShowInviteModal(false)
      }
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node) && showDeleteModal) {
        setShowDeleteModal(false)
      }
      if (
        deleteContentModalRef.current &&
        !deleteContentModalRef.current.contains(event.target as Node) &&
        showDeleteContentModal
      ) {
        setShowDeleteContentModal(false)
      }
      if (contentViewerRef.current && !contentViewerRef.current.contains(event.target as Node) && showContentViewer) {
        setShowContentViewer(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showInviteModal, showDeleteModal, showDeleteContentModal, showContentViewer])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    dispatch(logOut())
    router.push("/login")
  }

  // User management functions
  const fetchUsers = async () => {
    setFetchError("")
    try {
      const response = await getAllUser()
      console.log("Fetch users response:", response)
      if (response?.data?.users) {
        setUsers(response.data.users)
      } else if (response?.users) {
        setUsers(response.users)
      } else {
        console.error("Unexpected response structure:", response)
        setFetchError("Failed to fetch users data - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setFetchError("Failed to fetch users. Please try again.")
    }
  }

  // Content management functions
  const fetchContent = async () => {
    setIsLoadingContent(true)
    setContentFetchError("")
    try {
      const response = await getBlogByStatus("published")
      console.log("Fetch content response:", response)
      if (response?.data?.blogs) {
        setBlogs(response.data.blogs)
        if (response.data.pagination) {
          setPagination(response.data.pagination)
        }
      } else if (response?.blogs) {
        setBlogs(response.blogs)
      } else {
        console.error("Unexpected response structure:", response)
        setContentFetchError("Failed to fetch content data - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching content:", error)
      setContentFetchError("Failed to fetch content. Please try again.")
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Fetch pending content
  const fetchPendingContent = async () => {
    setIsLoadingPending(true)
    setPendingFetchError("")
    try {
      const response = await getBlogByStatus("pending_approval")
      console.log("Fetch pending content response:", response)
      if (response?.data?.blogs) {
        setPendingContent(response.data.blogs)
      } else if (response?.blogs) {
        setPendingContent(response.blogs)
      } else {
        console.error("Unexpected response structure:", response)
        setPendingFetchError("Failed to fetch pending content data")
      }
    } catch (error) {
      console.error("Error fetching pending content:", error)
      setPendingFetchError("Failed to fetch pending content. Please try again.")
    } finally {
      setIsLoadingPending(false)
    }
  }

  // Fetch approved content
  const fetchApprovedContent = async () => {
    setIsLoadingApproved(true)
    setApprovedFetchError("")
    try {
      const response = await getBlogByStatus("published")
      console.log("Fetch approved content response:", response)
      if (response?.data?.blogs) {
        setApprovedContent(response.data.blogs)
      } else if (response?.blogs) {
        setApprovedContent(response.blogs)
      } else {
        console.error("Unexpected response structure:", response)
        setApprovedFetchError("Failed to fetch approved content data")
      }
    } catch (error) {
      console.error("Error fetching approved content:", error)
      setApprovedFetchError("Failed to fetch approved content. Please try again.")
    } finally {
      setIsLoadingApproved(false)
    }
  }

  // Approve content function
  const handleApproveContent = async (contentId: number) => {
    setIsApproving(true)
    setApprovalError("")
    try {
      const response = await approveBlog(contentId)
      console.log("Approve content response:", response)

      if (response?.status === 200 || response?.status === 201 || response?.success === true) {
        // Remove from pending and add to approved
        const approvedItem = pendingContent.find((item) => item.id === contentId)
        if (approvedItem) {
          setPendingContent((prev) => prev.filter((item) => item.id !== contentId))
          setApprovedContent((prev) => [...prev, { ...approvedItem, status: "published" }])
        }
        setShowPendingActionMenu(null)

        // Close content viewer if it's showing the approved content
        if (viewingContent && viewingContent.id === contentId) {
          setShowContentViewer(false)
          setViewingContent(null)
        }
      } else {
        setApprovalError("Failed to approve content")
      }
    } catch (error: any) {
      console.error("Error approving content:", error)
      setApprovalError(`Failed to approve content: ${error?.message || "Please try again."}`)
    } finally {
      setIsApproving(false)
    }
  }

  // Reject content function
  const handleRejectContent = async (contentId: number) => {
    setIsRejecting(true)
    setApprovalError("")
    try {
      const response = await rejectBlog(contentId)
      console.log("Reject content response:", response)

      if (response?.status === 200 || response?.status === 201 || response?.success === true) {
        // Remove from pending
        setPendingContent((prev) => prev.filter((item) => item.id !== contentId))
        setShowPendingActionMenu(null)

        // Close content viewer if it's showing the rejected content
        if (viewingContent && viewingContent.id === contentId) {
          setShowContentViewer(false)
          setViewingContent(null)
        }
      } else {
        setApprovalError("Failed to reject content")
      }
    } catch (error: any) {
      console.error("Error rejecting content:", error)
      setApprovalError(`Failed to reject content: ${error?.message || "Please try again."}`)
    } finally {
      setIsRejecting(false)
    }
  }

  // View content function
  const handleViewContent = (content: Blog) => {
    setViewingContent(content)
    setShowContentViewer(true)
    setShowPendingActionMenu(null)
    setShowApprovedActionMenu(null)
    setShowContentActionMenu(null)
  }

  const handleDeleteContentClick = (blog: Blog) => {
    console.log("Delete content clicked for:", blog)
    setContentToDelete(blog)
    setShowDeleteContentModal(true)
    setShowContentActionMenu(null)
    setDeleteContentError("")
  }

  const handleDeleteContentConfirm = async () => {
    if (!contentToDelete) {
      console.error("No content selected for deletion")
      return
    }
    console.log("Attempting to delete content:", contentToDelete)
    setIsDeletingContent(true)
    setDeleteContentError("")
    try {
      const response = await deleteBlog(contentToDelete.id)
      console.log("Delete content response:", response)
      if (
        response?.status === 200 ||
        response?.status === 204 ||
        response?.success === true ||
        response?.message?.toLowerCase().includes("success") ||
        response?.data?.success === true
      ) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== contentToDelete.id))
        setPendingContent((prev) => prev.filter((blog) => blog.id !== contentToDelete.id))
        setApprovedContent((prev) => prev.filter((blog) => blog.id !== contentToDelete.id))
        setShowDeleteContentModal(false)
        setContentToDelete(null)
        console.log("Content deleted successfully")
        setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }))
      } else {
        console.error("Delete content failed with response:", response)
        setDeleteContentError(
          `Failed to delete content. Server response: ${response?.status || response?.message || "Unknown error"}`,
        )
      }
    } catch (error: any) {
      console.error("Error deleting content:", error)
      if (error?.response?.status === 404) {
        setDeleteContentError("Content not found. It may have already been deleted.")
      } else if (error?.response?.status === 403) {
        setDeleteContentError("You don't have permission to delete this content.")
      } else if (error?.response?.status === 401) {
        setDeleteContentError("Authentication failed. Please log in again.")
      } else {
        setDeleteContentError(
          `Failed to delete content: ${error?.message || error?.response?.data?.message || "Network error"}`,
        )
      }
    } finally {
      setIsDeletingContent(false)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    if (!inviteEmail.trim()) {
      setEmailError("Email is required")
      return
    }
    if (!validateEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }
    setIsInviting(true)
    try {
      const response = await inviteUser({ email: inviteEmail })
      console.log("Invite response:", response)
      if (response.status === 200 || response.status === 201) {
        setInviteEmail("")
        setInviteMessage("")
        setShowInviteModal(false)
        fetchUsers()
      } else {
        console.log("Invite failed:", response)
        setEmailError("Failed to send invitation. Please try again.")
      }
    } catch (error) {
      console.error("Error sending invite:", error)
      setEmailError("Failed to send invitation. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }

  const handleDeleteClick = (user: User) => {
    console.log("Delete clicked for user:", user)
    setUserToDelete(user)
    setShowDeleteModal(true)
    setShowActionMenu(null)
    setDeleteError("")
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) {
      console.error("No user selected for deletion")
      return
    }
    console.log("Attempting to delete user:", userToDelete)
    setIsDeleting(true)
    setDeleteError("")
    try {
      const response = await deleteUser(userToDelete.id)
      console.log("Delete response:", response)
      if (response?.status === 200 || response?.status === 204 || response?.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id))
        setShowDeleteModal(false)
        setUserToDelete(null)
        console.log("User deleted successfully")
      } else {
        console.error("Delete failed with response:", response)
        setDeleteError(`Failed to delete user. Server response: ${response?.status || "Unknown error"}`)
      }
    } catch (error: any) {
      console.error("Error deleting user:", error)
      setDeleteError(`Failed to delete user: ${error?.message || "Network error"}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Creator":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Viewer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null
    return imagePath.startsWith("http") ? imagePath : `${IMAGE_BASE_URL}${imagePath}`
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesFilter
  })

  const filteredContent = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(contentSearchTerm.toLowerCase())
    const matchesFilter = contentFilterAuthor === "all" || blog.author.username === contentFilterAuthor
    return matchesSearch && matchesFilter
  })

  const filteredPendingContent = pendingContent.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(pendingSearchTerm.toLowerCase())
    return matchesSearch
  })

  const filteredApprovedContent = approvedContent.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(approvedSearchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(approvedSearchTerm.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(approvedSearchTerm.toLowerCase())
    return matchesSearch
  })

  const totalUsers = users.length
  const creatorUsers = users.filter((user) => user.role === "Creator").length
  const viewerUsers = users.filter((user) => user.role === "Viewer").length
  const totalContent = blogs.length
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  const totalComments = blogs.reduce((sum, blog) => sum + blog.comments_count, 0)
  const totalPending = pendingContent.length
  const totalApproved = approvedContent.length

  const authors = ["all", ...Array.from(new Set(blogs.map((blog) => blog.author.username)))]

  if (isLoading) {
    return (
      <>
        <Loader />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <ShieldIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 bg-white rounded-full p-1 pr-4 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
                onClick={() => setShowUserDetails(!showUserDetails)}
              >
                <Image src={profileImg || "/placeholder.svg"} alt="Profile" width={32} className="rounded-full" />
                <span className="text-sm font-medium text-slate-700">{adminData.username}</span>
              </button>
              {showUserDetails && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-0 z-50 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
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
                        <h3 className="font-semibold text-lg">{adminData.username}</h3>
                        <p className="text-purple-100 text-sm opacity-90">{adminData.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
                            <ShieldIcon className="w-3 h-3 mr-1" />
                            Administrator
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Admin Stats */}
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-slate-800">{totalUsers}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <UsersIcon className="w-3 h-3" />
                          <span>Users</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">{totalContent}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <FileTextIcon className="w-3 h-3" />
                          <span>Content</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">{totalPending}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Admin Menu */}
                  <div className="py-2">
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <ShieldIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Admin Settings</div>
                        <div className="text-xs text-slate-500">Configure platform settings</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <UsersIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">User Management</div>
                        <div className="text-xs text-slate-500">Manage user accounts</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Analytics</div>
                        <div className="text-xs text-slate-500">View platform analytics</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <SendIcon className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Send Invitations</div>
                        <div className="text-xs text-slate-500">Invite new users to platform</div>
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
                        <div className="text-xs text-red-400">End your admin session</div>
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
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard 🛡️</h2>
          <p className="text-slate-600">Manage users, content, and oversee platform activity</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "users"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-4 h-4" />
                  <span>User Management</span>
                  <span className="bg-slate-100 text-slate-600 py-1 px-2 rounded-full text-xs">{totalUsers}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "content"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileTextIcon className="w-4 h-4" />
                  <span>All Content</span>
                  <span className="bg-slate-100 text-slate-600 py-1 px-2 rounded-full text-xs">{totalContent}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "pending"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>Pending Approval</span>
                  <span className="bg-yellow-100 text-yellow-600 py-1 px-2 rounded-full text-xs">{totalPending}</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Error Messages */}
        {fetchError && activeTab === "users" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{fetchError}</p>
              <button
                onClick={fetchUsers}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {contentFetchError && activeTab === "content" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{contentFetchError}</p>
              <button
                onClick={fetchContent}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {pendingFetchError && activeTab === "pending" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{pendingFetchError}</p>
              <button
                onClick={fetchPendingContent}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {approvedFetchError && activeTab === "approved" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{approvedFetchError}</p>
              <button
                onClick={fetchApprovedContent}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {approvalError && (activeTab === "pending" || activeTab === "approved") && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{approvalError}</p>
              <button
                onClick={() => setApprovalError("")}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Creators</p>
                  <p className="text-2xl font-bold text-slate-800">{creatorUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileTextIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Viewers</p>
                  <p className="text-2xl font-bold text-slate-800">{viewerUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "content" || activeTab === "pending" || activeTab === "approved") && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Content</p>
                  <p className="text-2xl font-bold text-slate-800">{totalContent}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileTextIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-800">{totalPending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Approved</p>
                  <p className="text-2xl font-bold text-slate-800">{totalApproved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-green-600" />
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
          </div>
        )}

        {/* User Management Section */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-800">User Management</h3>
                <button
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setShowInviteModal(true)}
                >
                  <SendIcon className="w-4 h-4 mr-2" />
                  Send Invitation
                </button>
              </div>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="Creator">Creator</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="p-6">
              {filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          src={profileImg || "/placeholder.svg"}
                          alt={user.username}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="font-semibold text-slate-800">{user.username}</h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mb-1">{user.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span className="flex items-center space-x-1">
                              <span>ID: {user.id}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionMenu(showActionMenu === user.id.toString() ? null : user.id.toString())
                          }
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                        </button>
                        {showActionMenu === user.id.toString() && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                            <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                              <EyeIcon className="w-4 h-4" />
                              <span>View Profile</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                              <TrashIcon className="w-4 h-4" />
                              <span>Remove User</span>
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
                    <UsersIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No users found</h3>
                  <p className="text-slate-600 mb-4">
                    {searchTerm || filterRole !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Start by inviting users to join the platform"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Content Management Section */}
        {activeTab === "content" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-800">All Content</h3>
                <button
                  onClick={fetchContent}
                  disabled={isLoadingContent}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isLoadingContent ? "Refreshing..." : "Refresh Content"}
                </button>
              </div>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={contentSearchTerm}
                    onChange={(e) => setContentSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={contentFilterAuthor}
                  onChange={(e) => setContentFilterAuthor(e.target.value)}
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
              {isLoadingContent ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading content...</p>
                </div>
              ) : filteredContent.length > 0 ? (
                <div className="space-y-4">
                  {filteredContent.map((blog) => (
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
                            {blog.status && (
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(blog.status)}`}
                              >
                                {blog.status.replace("_", " ")}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                            {generateExcerpt(blog.content, 150)}
                          </p>
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
                      <div className="relative ml-4">
                        <button
                          onClick={() =>
                            setShowContentActionMenu(
                              showContentActionMenu === blog.id.toString() ? null : blog.id.toString(),
                            )
                          }
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                        </button>
                        {showContentActionMenu === blog.id.toString() && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                            <button
                              onClick={() => handleViewContent(blog)}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>View Content</span>
                            </button>
                            <button
                              onClick={() => handleDeleteContentClick(blog)}
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
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No content found</h3>
                  <p className="text-slate-600 mb-4">
                    {contentSearchTerm || contentFilterAuthor !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No content available at the moment"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approved Content Section */}
        {activeTab === "approved" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-800">Approved Content</h3>
                <button
                  onClick={fetchApprovedContent}
                  disabled={isLoadingApproved}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoadingApproved ? "Refreshing..." : "Refresh Approved"}
                </button>
              </div>
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search approved content..."
                    value={approvedSearchTerm}
                    onChange={(e) => setApprovedSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="p-6">
              {isLoadingApproved ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading approved content...</p>
                </div>
              ) : filteredApprovedContent.length > 0 ? (
                <div className="space-y-4">
                  {filteredApprovedContent.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-start justify-between p-4 border border-green-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all duration-200 bg-green-50/30"
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
                            <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
                              Approved
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                            {generateExcerpt(blog.content, 150)}
                          </p>
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
                      <div className="relative ml-4" ref={approvedActionMenuRef}>
                        <button
                          onClick={() =>
                            setShowApprovedActionMenu(
                              showApprovedActionMenu === blog.id.toString() ? null : blog.id.toString(),
                            )
                          }
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                        </button>
                        {showApprovedActionMenu === blog.id.toString() && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                            <button
                              onClick={() => handleViewContent(blog)}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>View Content</span>
                            </button>
                            <button
                              onClick={() => handleDeleteContentClick(blog)}
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
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No approved content</h3>
                  <p className="text-slate-600 mb-4">
                    {approvedSearchTerm
                      ? "No approved content matches your search"
                      : "No content has been approved yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pending Content Section */}
        {activeTab === "pending" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-800">Pending Approval</h3>
                <button
                  onClick={fetchPendingContent}
                  disabled={isLoadingPending}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {isLoadingPending ? "Refreshing..." : "Refresh Pending"}
                </button>
              </div>
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pending content..."
                    value={pendingSearchTerm}
                    onChange={(e) => setPendingSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="p-6">
              {isLoadingPending ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading pending content...</p>
                </div>
              ) : filteredPendingContent.length > 0 ? (
                <div className="space-y-4">
                  {filteredPendingContent.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-start justify-between p-4 border border-yellow-200 rounded-lg hover:border-yellow-300 hover:shadow-sm transition-all duration-200 bg-yellow-50/30"
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
                            <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
                              Pending Approval
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                            {generateExcerpt(blog.content, 150)}
                          </p>
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
                      <div className="relative ml-4" ref={pendingActionMenuRef}>
                        <button
                          onClick={() =>
                            setShowPendingActionMenu(
                              showPendingActionMenu === blog.id.toString() ? null : blog.id.toString(),
                            )
                          }
                          className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                        >
                          <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                        </button>
                        {showPendingActionMenu === blog.id.toString() && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                            <button
                              onClick={() => handleViewContent(blog)}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>View Content</span>
                            </button>
                            <button
                              onClick={() => handleApproveContent(blog.id)}
                              disabled={isApproving}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 disabled:opacity-50"
                            >
                              <CheckIcon className="w-4 h-4" />
                              <span>{isApproving ? "Approving..." : "Approve"}</span>
                            </button>
                            <button
                              onClick={() => handleRejectContent(blog.id)}
                              disabled={isRejecting}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <XIcon className="w-4 h-4" />
                              <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClockIcon className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No pending content</h3>
                  <p className="text-slate-600 mb-4">
                    {pendingSearchTerm ? "No pending content matches your search" : "All content has been reviewed"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Content Viewer Modal */}
      {showContentViewer && viewingContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={contentViewerRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-slate-800">{viewingContent.title}</h3>
                  {viewingContent.status && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(viewingContent.status)}`}
                    >
                      {viewingContent.status.replace("_", " ")}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowContentViewer(false)
                    setViewingContent(null)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-3 text-sm text-slate-600">
                <span className="flex items-center space-x-1">
                  <UserIcon className="w-4 h-4" />
                  <span>by {viewingContent.author.username}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(viewingContent.created_at)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ThumbsUpIcon className="w-4 h-4" />
                  <span>{viewingContent.likes} likes</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageCircleIcon className="w-4 h-4" />
                  <span>{viewingContent.comments_count} comments</span>
                </span>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {viewingContent.image && (
                <div className="mb-6">
                  <Image
                    src={getImageUrl(viewingContent.image) || "/placeholder.svg"}
                    alt={viewingContent.title}
                    width={800}
                    height={400}
                    className="rounded-lg object-cover w-full"
                  />
                </div>
              )}
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: viewingContent.content }}
              />
            </div>
            {activeTab === "pending" && (
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => handleRejectContent(viewingContent.id)}
                    disabled={isRejecting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <XIcon className="w-4 h-4" />
                    <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
                  </button>
                  <button
                    onClick={() => handleApproveContent(viewingContent.id)}
                    disabled={isApproving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>{isApproving ? "Approving..." : "Approve"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Send Invitation</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleInviteSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setEmailError("")
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    emailError ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="user@example.com"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isInviting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-4 h-4 mr-2" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Confirm User Deletion</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setUserToDelete(null)
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
                  <h4 className="text-lg font-semibold text-slate-800">Delete User</h4>
                  <p className="text-slate-600 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Image
                    src={profileImg || "/placeholder.svg"}
                    alt={userToDelete.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-slate-800">{userToDelete.username}</p>
                    <p className="text-sm text-slate-600">{userToDelete.email}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getRoleColor(userToDelete.role)}`}
                    >
                      {userToDelete.role}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                Are you sure you want to delete <strong>{userToDelete.username}</strong>? This will permanently remove
                their account and all associated data.
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
                    setUserToDelete(null)
                    setDeleteError("")
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
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
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Content Confirmation Modal */}
      {showDeleteContentModal && contentToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div
            ref={deleteContentModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Confirm Content Deletion</h3>
                <button
                  onClick={() => {
                    setShowDeleteContentModal(false)
                    setContentToDelete(null)
                    setDeleteContentError("")
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
                  <h4 className="text-lg font-semibold text-slate-800">Delete Content</h4>
                  <p className="text-slate-600 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div>
                  <p className="font-medium text-slate-800 mb-1">{contentToDelete.title}</p>
                  <p className="text-sm text-slate-600 mb-2">{generateExcerpt(contentToDelete.content, 100)}</p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>by {contentToDelete.author.username}</span>
                    <span>{formatDate(contentToDelete.created_at)}</span>
                    <span>{contentToDelete.likes} likes</span>
                    <span>{contentToDelete.comments_count} comments</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                Are you sure you want to delete <strong>"{contentToDelete.title}"</strong>? This will permanently remove
                the content and all associated data including comments and likes.
              </p>
              {deleteContentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircleIcon className="w-4 h-4 text-red-600" />
                    <p className="text-red-800 text-sm">{deleteContentError}</p>
                  </div>
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteContentModal(false)
                    setContentToDelete(null)
                    setDeleteContentError("")
                  }}
                  disabled={isDeletingContent}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteContentConfirm}
                  disabled={isDeletingContent}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isDeletingContent ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
