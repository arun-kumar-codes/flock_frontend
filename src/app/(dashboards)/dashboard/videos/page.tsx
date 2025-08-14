"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import {
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  EditIcon,
  EyeIcon,
  CalendarIcon,
  VideoIcon,
  TrendingUpIcon,
  XIcon,
  SaveIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  SendIcon,
  ArchiveIcon,
  LoaderIcon,
  ClockIcon,
  RefreshCwIcon,
  PlayIcon,
  UploadIcon,
} from "lucide-react"
import Image from "next/image"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"
import {
  getMyVideos,
  createVideo,
  updateVideo,
  sendVideoForApproval,
  archiveVideo,
  unarchiveVideo,
} from "@/api/content"
import TipTapEditor from "@/components/tiptap-editor"
import TipTapContentDisplay from "@/components/tiptap-content-display"
import Video from "@/components/Video"

interface UserData {
  email: string
  username: string
  id: string
  imageUrl?: string
  videos?: VideoType[]
}

interface Author {
  email: string
  id: number
  role: string
  username: string
}

interface Comment {
  id: number
  video_id: number
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

interface VideoType {
  video_id: any
  creator: any
  id: number
  title: string
  description: string
  author: Author
  created_at: string
  created_by: number
  comments: Comment[]
  comments_count: number
  liked_by: number[]
  likes: number
  video_url?: string
  thumbnail?: string
  status?: string | null
  archived?: boolean | null
  createdAt?: string
  views?: number
  category?: string
  duration?: string
  video?: string
  duration_formatted?: string
  format?: string
}

interface CreateVideoData {
  title: string
  description: string
  status?: string
  category?: string
  video?: File | null
}

interface EditVideoData {
  id: number
  title: string
  description: string
  status?: string
  category?: string
  videoId?: string
  existingVideoUrl?: string
}

export default function VideoDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [userData, setUserData] = useState<UserData>({
    email: "",
    username: "",
    id: "",
    imageUrl: "",
    videos: [],
  })
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [createSuccess, setCreateSuccess] = useState("")
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [fetchError, setFetchError] = useState("")
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewVideo, setViewVideo] = useState<VideoType | null>(null)

  // Loading states for different actions
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({})

  // File upload states
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoError, setVideoError] = useState("")
  const [isVideoDragOver, setIsVideoDragOver] = useState(false)

  // Video loading states
  const [videoLoadError, setVideoLoadError] = useState<{ [key: string]: boolean }>({})

  // Create video form state
  const [videoForm, setVideoForm] = useState<CreateVideoData>({
    title: "",
    description: "",
    status: "draft",
    category: "General",
    video: null,
  })

  // Edit video form state
  const [editVideoForm, setEditVideoForm] = useState<EditVideoData>({
    id: 0,
    title: "",
    description: "",
    status: "draft",
    category: "General",
    videoId: "",
    existingVideoUrl: "",
  })

  // Store original edit form data for comparison
  const [originalEditData, setOriginalEditData] = useState<EditVideoData>({
    id: 0,
    title: "",
    description: "",
    status: "draft",
    category: "General",
    videoId: "",
    existingVideoUrl: "",
  })

  // Comment states
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [commentError, setCommentError] = useState("")
  const [commentSuccess, setCommentSuccess] = useState("")

  const dropdownRef = useRef<HTMLDivElement>(null)
  const createModalRef = useRef<HTMLDivElement>(null)
  const editModalRef = useRef<HTMLDivElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const viewModalRef = useRef<HTMLDivElement>(null)

  const user = useSelector((state: any) => state.user)

  // Helper function to strip HTML tags and convert to plain text
  const stripHtmlTags = (html: string): string => {
    if (!html) return ""
    // Create a temporary div element to parse HTML
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    // Get text content and clean up extra whitespace
    const textContent = tempDiv.textContent || tempDiv.innerText || ""
    // Replace multiple whitespace characters with single space and trim
    return textContent.replace(/\s+/g, " ").trim()
  }

  // Helper function to truncate text to specified length
  const truncateText = (text: string, maxLength = 150): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  // Helper function to get plain text description for display in cards
  const getPlainTextDescription = (description: string, maxLength = 150): string => {
    const plainText = stripHtmlTags(description)
    return truncateText(plainText, maxLength)
  }

  useEffect(() => {
    if (user.role.toLowerCase() === "admin") {
      router.replace("/admin")
    } else if (user.role.toLowerCase() === "viewer") {
      router.replace("/viewer")
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDetails(false)
      }
      if (!event.target || !(event.target as Element).closest(".action-menu-container")) {
        setShowActionMenu(null)
      }
      if (createModalRef.current && !createModalRef.current.contains(event.target as Node) && showCreateModal) {
        setShowCreateModal(false)
      }
      if (editModalRef.current && !editModalRef.current.contains(event.target as Node) && showEditModal) {
        setShowEditModal(false)
      }
      if (viewModalRef.current && !viewModalRef.current.contains(event.target as Node) && showViewModal) {
        setShowViewModal(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCreateModal, showEditModal, showViewModal])

  // Helper function to set loading state for specific actions
  const setActionLoading = (videoId: number, action: string, loading: boolean) => {
    setLoadingActions((prev) => ({
      ...prev,
      [`${videoId}-${action}`]: loading,
    }))
  }

  // Helper function to check if action is loading
  const isActionLoading = (videoId: number, action: string) => {
    return loadingActions[`${videoId}-${action}`] || false
  }

  // Helper function to safely check if video is archived
  const isArchived = (video: VideoType): boolean => {
    return video.archived === true
  }

  // Simplified video URL function - just return the URL as-is since full URLs are coming from API
  const getVideoUrl = (videoPath: string | null | undefined): string | null => {
    console.log("getVideoUrl called with:", videoPath)
    if (!videoPath) {
      console.log("No video path provided")
      return null
    }
    // Since full URLs are coming from the API, just return them directly
    console.log("Returning video URL:", videoPath)
    return videoPath
  }

  const getThumbnailUrl = (thumbnailPath: string | null | undefined): string | null => {
    if (!thumbnailPath) return null
    // Since full URLs are coming from the API, just return them directly
    return thumbnailPath
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Video validation function
  const validateVideo = (file: File): string | null => {
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov"]
    const maxSize = 500 * 1024 * 1024 // 500MB

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid video file (MP4, WebM, OGG, AVI, or MOV)"
    }

    if (file.size > maxSize) {
      return "Video size must be less than 250MB"
    }

    return null
  }

  // Handle video selection for create form
  const handleVideoSelect = (file: File) => {
    const error = validateVideo(file)
    if (error) {
      setVideoError(error)
      return
    }

    setVideoError("")
    setVideoForm((prev) => ({ ...prev, video: file }))
    const url = URL.createObjectURL(file)
    setVideoPreview(url)
  }

  // File input handlers
  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleVideoSelect(file)
    }
  }

  // Drag and drop handlers for create form
  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsVideoDragOver(true)
  }

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsVideoDragOver(false)
  }

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsVideoDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleVideoSelect(file)
    }
  }

  // Fetch user's videos
  const fetchUserVideos = async () => {
    try {
      setFetchError("")
      const response = await getMyVideos()
      console.log("Fetch videos response:", response)
      if (response?.data?.videos) {
        const userVideos = response.data.videos
          .filter((video: VideoType) => video.created_by === user?.id || video.author?.id === user?.id)
          .map((video: VideoType) => ({
            ...video,
            createdAt: video.created_at,
            status: video.status || "draft",
            views: video.views || 0,
            category: video.author?.role === "Creator" ? "Programming" : "General",
          }))
        setUserData((prev) => ({
          ...prev,
          videos: userVideos,
        }))
      }
        setIsLoading(false)
    } catch (error) {
      console.error("Error fetching user videos:", error)
      setFetchError("Failed to fetch your videos")
    }
  }

  useEffect(() => {
    if (user) {
      if (!user.is_profile_completed) {
        router.push("/dashboard/profile")
      } else {
        setUserData((prev) => ({
          ...prev,
          email: user.email || "",
          username: user.username || "",
          id: user.id || "",
        }))
        fetchUserVideos()
      }
    
    }
  }, [user, router])

  if (isLoading) {
    return <Loader />
  }

  // Send video for approval
  const handleSendForApproval = async (videoId: number) => {
    try {
      setActionLoading(videoId, "approval", true)
      setUpdateError("")
      const response = await sendVideoForApproval(videoId)
      if (response?.status === 200) {
        setUserData((prev) => ({
          ...prev,
          videos:
            prev.videos?.map((video) => (video.id === videoId ? { ...video, status: "pending_approval" } : video)) ||
            [],
        }))
        setUpdateSuccess("Video sent for approval successfully!")
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to send video for approval")
      }
    } catch (error: any) {
      console.error("Error sending video for approval:", error)
      setUpdateError(error?.response?.data?.message || "Failed to send video for approval")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(videoId, "approval", false)
      setShowActionMenu(null)
    }
  }

  // Archive video
  const handleArchiveVideo = async (videoId: number) => {
    try {
      setActionLoading(videoId, "archive", true)
      setUpdateError("")
      const response = await archiveVideo(videoId)
      if (response?.status === 200) {
        setUserData((prev) => ({
          ...prev,
          videos: prev.videos?.map((video) => (video.id === videoId ? { ...video, archived: true } : video)) || [],
        }))
        setUpdateSuccess("Video archived successfully!")
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to archive video")
      }
    } catch (error: any) {
      console.error("Error archiving video:", error)
      setUpdateError(error?.response?.data?.message || "Failed to archive video")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(videoId, "archive", false)
      setShowActionMenu(null)
    }
  }

  // Unarchive video
  const handleUnarchiveVideo = async (videoId: number) => {
    try {
      setActionLoading(videoId, "unarchive", true)
      setUpdateError("")
      const response = await unarchiveVideo(videoId)
      if (response?.status === 200) {
        setUserData((prev) => ({
          ...prev,
          videos: prev.videos?.map((video) => (video.id === videoId ? { ...video, archived: false } : video)) || [],
        }))
        setUpdateSuccess("Video unarchived successfully!")
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to unarchive video")
      }
    } catch (error: any) {
      console.error("Error unarchiving video:", error)
      setUpdateError(error?.response?.data?.message || "Failed to unarchive video")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(videoId, "unarchive", false)
      setShowActionMenu(null)
    }
  }

  // Update video status (draft to published)
  const updateVideoStatus = async (videoId: number, newStatus: string) => {
    try {
      setActionLoading(videoId, "status", true)
      setUpdateError("")
      const formData = new FormData()
      formData.append("status", newStatus)
      const response = await updateVideo(videoId, formData)
      if (response?.status === 200 || response?.data) {
        setUserData((prev) => ({
          ...prev,
          videos: prev.videos?.map((video) => (video.id === videoId ? { ...video, status: newStatus } : video)) || [],
        }))
        setUpdateSuccess(`Video ${newStatus === "published" ? "published" : "updated"} successfully!`)
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to update video status")
      }
    } catch (error: any) {
      console.error("Error updating video status:", error)
      setUpdateError(error?.response?.data?.message || "Failed to update video status")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(videoId, "status", false)
      setShowActionMenu(null)
    }
  }

  // Enhanced edit video handler
  const handleEditVideo = (video: VideoType) => {
    console.log("Edit video clicked:", video.id)
    console.log("Video data:", video)
    setShowActionMenu(null)
    setUpdateError("")
    setUpdateSuccess("")

    const editData = {
      id: video.id,
      title: video.title,
      description: video.description,
      status: video.status || "draft",
      category: video.category || "General",
      videoId: video.video_id || video.id.toString(),
      existingVideoUrl: video.video_url || video.video || "",
    }

    console.log("Edit data:", editData)
    setEditVideoForm(editData)
    setOriginalEditData(editData)
    setShowEditModal(true)
  }

  // Handle view video
  const handleViewVideo = async (video: VideoType) => {
    console.log("View video clicked:", video)
    setShowActionMenu(null)
    setViewVideo(video)
    setComments(video.comments || [])
    setNewComment("")
    setCommentError("")
    setCommentSuccess("")
    setEditingCommentId(null)
    setEditCommentText("")
    setVideoLoadError({}) // Reset video load errors
    setShowViewModal(true)
  }

  // Enhanced update video handler - only send changed values
  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateError("")
    setUpdateSuccess("")

    // Enhanced validation
    if (!editVideoForm.title.trim()) {
      setUpdateError("Title is required")
      return
    }
    if (editVideoForm.title.trim().length < 3) {
      setUpdateError("Title must be at least 3 characters long")
      return
    }
    if (!editVideoForm.description.trim()) {
      setUpdateError("Description is required")
      return
    }
    if (editVideoForm.description.trim().length < 10) {
      setUpdateError("Description must be at least 10 characters long")
      return
    }

    setIsUpdating(true)
    try {
      // Create FormData only with changed values
      const formData = new FormData()
      let hasChanges = false

      // Check for changes and only add changed fields
      if (editVideoForm.title.trim() !== originalEditData.title) {
        formData.append("title", editVideoForm.title.trim())
        hasChanges = true
      }

      if (editVideoForm.description.trim() !== originalEditData.description) {
        formData.append("description", editVideoForm.description.trim())
        hasChanges = true
      }

      if (editVideoForm.status !== originalEditData.status) {
        formData.append("status", editVideoForm.status || "draft")
        hasChanges = true
      }

      if (editVideoForm.category !== originalEditData.category) {
        formData.append("category", editVideoForm.category || "General")
        hasChanges = true
      }

      if (!hasChanges) {
        setUpdateError("No changes detected")
        setIsUpdating(false)
        return
      }

      const response = await updateVideo(editVideoForm.id, formData)
      if (response?.status === 200 || response?.data) {
        const updatedVideo = {
          ...editVideoForm,
          title: editVideoForm.title.trim(),
          description: editVideoForm.description.trim(),
        }

        setUserData((prev) => ({
          ...prev,
          videos:
            prev.videos?.map((video) =>
              video.id === editVideoForm.id
                ? {
                    ...video,
                    ...updatedVideo,
                  }
                : video,
            ) || [],
        }))

        setUpdateSuccess("Video updated successfully!")
        setTimeout(() => {
          setShowEditModal(false)
          setUpdateSuccess("")
          setEditVideoForm({
            id: 0,
            title: "",
            description: "",
            status: "draft",
            category: "General",
            videoId: "",
            existingVideoUrl: "",
          })
          setOriginalEditData({
            id: 0,
            title: "",
            description: "",
            status: "draft",
            category: "General",
            videoId: "",
            existingVideoUrl: "",
          })
        }, 2000)
      } else {
        throw new Error("Failed to update video")
      }
    } catch (error: any) {
      console.error("Error updating video:", error)
      setUpdateError(error?.response?.data?.message || error?.message || "Failed to update video. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError("")
    setCreateSuccess("")

    // Validation
    if (!videoForm.title.trim()) {
      setCreateError("Title is required")
      return
    }
    if (!videoForm.description.trim()) {
      setCreateError("Description is required")
      return
    }
    if (videoForm.description.trim().length < 10) {
      setCreateError("Description must be at least 10 characters long")
      return
    }
    if (!videoForm.video) {
      setCreateError("Video file is required")
      return
    }

    setIsCreating(true)
    try {
      const formData = new FormData()
      formData.append("title", videoForm.title.trim())
      formData.append("description", videoForm.description.trim())
      formData.append("video", videoForm.video)

      const response = await createVideo(formData)
      console.log("Create video response:", response)

      if (response?.status === 200 || response?.status === 201 || response?.data) {
        setCreateSuccess("Video created successfully!")
        setVideoForm({
          title: "",
          description: "",
          video: null,
        })
        setVideoPreview(null)
        setVideoError("")
        if (videoInputRef.current) {
          videoInputRef.current.value = ""
        }
        await fetchUserVideos()
        setTimeout(() => {
          setShowCreateModal(false)
          setCreateSuccess("")
        }, 2000)
      } else {
        setCreateError("Failed to create video. Please try again.")
      }
    } catch (error: any) {
      console.error("Error creating video:", error)
      setCreateError(error?.response?.data?.message || "Failed to create video. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleFormChange = (field: keyof CreateVideoData, value: string) => {
    setVideoForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (createError) {
      setCreateError("")
    }
  }

  const handleEditFormChange = (field: keyof EditVideoData, value: string) => {
    setEditVideoForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (updateError) {
      setUpdateError("")
    }
  }

  const getStatusColor = (status: string, archived?: boolean) => {
    if (archived) {
      return "bg-gray-100 text-gray-800 border-gray-200"
    }
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "draft":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "pending_approval":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getStatusIcon = (status: string, archived?: boolean) => {
    if (archived) {
      return <ArchiveIcon className="w-3 h-3" />
    }
    switch (status) {
      case "published":
        return <TrendingUpIcon className="w-3 h-3" />
      case "draft":
        return <EditIcon className="w-3 h-3" />
      case "pending_approval":
        return <ClockIcon className="w-3 h-3" />
      case "rejected":
        return <XIcon className="w-3 h-3" />
      case "approved":
        return <CheckCircleIcon className="w-3 h-3" />
      default:
        return <VideoIcon className="w-3 h-3" />
    }
  }

  const getStatusText = (status: string, archived?: boolean) => {
    if (archived) {
      return "archived"
    }
    if (status == "pending_approval") {
      return "pending approval"
    }
    return status || "draft"
  }

  // Get active (non-archived) videos
  const activeVideos = userData.videos?.filter((item) => !isArchived(item)) || []

  // Get archived videos
  const archivedVideos = userData.videos?.filter((item) => isArchived(item)) || []

  // Filter content based on active tab and search/filter criteria
  const getFilteredContent = () => {
    const sourceVideos = activeTab === "active" ? activeVideos : archivedVideos
    return sourceVideos.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && getPlainTextDescription(item.description).toLowerCase().includes(searchTerm.toLowerCase()))

      if (activeTab === "archived") {
        return matchesSearch // For archived tab, just match search
      }

      // For active tab, also apply status filter
      const matchesFilter = filterStatus === "all" || item.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }

  const filteredContent = getFilteredContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Video Management</h2>
          <p className="text-slate-600">Manage your videos and track your performance</p>
        </div>

        {/* Success/Error Messages */}
        {(fetchError || updateError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{fetchError || updateError}</p>
              {fetchError && (
                <button
                  onClick={fetchUserVideos}
                  className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <p className="text-green-800">{updateSuccess}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Active</p>
                <p className="text-2xl font-bold text-slate-800">{activeVideos.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <VideoIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold text-slate-800">
                  {activeVideos.filter((item) => item.status === "published").length}
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
                <p className="text-sm font-medium text-slate-600">Pending Approval</p>
                <p className="text-2xl font-bold text-slate-800">
                  {activeVideos.filter((item) => item.status === "pending_approval").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Archived</p>
                <p className="text-2xl font-bold text-slate-800">{archivedVideos.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <ArchiveIcon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-xl font-semibold text-slate-800">Your Videos</h3>
              <button
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Upload New Video
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-4">
              <button
                onClick={() => {
                  setActiveTab("active")
                  setFilterStatus("all")
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <VideoIcon className="w-4 h-4" />
                  <span>Active Videos</span>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                    {activeVideos.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("archived")
                  setFilterStatus("all")
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "archived" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ArchiveIcon className="w-4 h-4" />
                  <span>Archived</span>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                    {archivedVideos.length}
                  </span>
                </div>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab} videos...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {activeTab === "active" && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="rejected">Rejected</option>
                  <option value="approved">Approved</option>
                </select>
              )}
            </div>
          </div>

          <div className="p-6">
            {filteredContent.length > 0 ? (
              <div className="space-y-4">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Video Thumbnail */}
                      {item.thumbnail && (
                        <div className="flex-shrink-0 relative">
                          <Image
                            src={getThumbnailUrl(item.thumbnail) || "/placeholder.svg?height=60&width=80"}
                            alt={item.title}
                            width={80}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                              <PlayIcon className="w-3 h-3 text-white ml-0.5" />
                            </div>
                          </div>
                          {item.duration && (
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                              {item.duration_formatted}
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewVideo(item)
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-800">{item.title}</h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(
                              item.status || "draft",
                              isArchived(item),
                            )}`}
                          >
                            {getStatusIcon(item.status || "draft", isArchived(item))}
                            <span>{getStatusText(item.status || "draft", isArchived(item))}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </span>
                          {item.views !== undefined && item.views !== null && (
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
                    </div>
                    <div className="relative action-menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowActionMenu(showActionMenu === item.id ? null : item.id)
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        disabled={Object.values(loadingActions).some((loading) => loading)}
                      >
                        <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                      </button>
                      {showActionMenu === item.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                          {/* View button - always show except for rejected */}
                          {item.status !== "rejected" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewVideo(item)
                              }}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          )}

                          {/* Edit button - show for non-archived videos */}
                          {!isArchived(item) &&
                            (item.status === "draft" ||
                              item.status === "published" ||
                              item.status === "pending_approval") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditVideo(item)
                                }}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                              >
                                <EditIcon className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                            )}

                          {/* Send for Approval button - only for draft videos that are not archived */}
                          {!isArchived(item) && item.status === "draft" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSendForApproval(item.id)
                              }}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-blue-50 text-blue-600 transition-colors"
                              disabled={isActionLoading(item.id, "approval")}
                            >
                              {isActionLoading(item.id, "approval") ? (
                                <LoaderIcon className="w-4 h-4 animate-spin" />
                              ) : (
                                <ClockIcon className="w-4 h-4" />
                              )}
                              <span>{isActionLoading(item.id, "approval") ? "Sending..." : "Send for Approval"}</span>
                            </button>
                          )}

                          {/* Publish button - only for approved videos that are not archived */}
                          {!isArchived(item) && item.status === "approved" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                updateVideoStatus(item.id, "published")
                              }}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-emerald-50 text-emerald-600 transition-colors"
                              disabled={isActionLoading(item.id, "status")}
                            >
                              {isActionLoading(item.id, "status") ? (
                                <LoaderIcon className="w-4 h-4 animate-spin" />
                              ) : (
                                <SendIcon className="w-4 h-4" />
                              )}
                              <span>{isActionLoading(item.id, "status") ? "Publishing..." : "Publish"}</span>
                            </button>
                          )}

                          {/* Archive button - only for non-archived videos */}
                          {!isArchived(item) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleArchiveVideo(item.id)
                              }}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-amber-50 text-amber-600 transition-colors"
                              disabled={isActionLoading(item.id, "archive")}
                            >
                              {isActionLoading(item.id, "archive") ? (
                                <LoaderIcon className="w-4 h-4 animate-spin" />
                              ) : (
                                <ArchiveIcon className="w-4 h-4" />
                              )}
                              <span>{isActionLoading(item.id, "archive") ? "Archiving..." : "Archive"}</span>
                            </button>
                          )}

                          {/* Unarchive button - only for archived videos */}
                          {isArchived(item) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUnarchiveVideo(item.id)
                              }}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-green-50 text-green-600 transition-colors"
                              disabled={isActionLoading(item.id, "unarchive")}
                            >
                              {isActionLoading(item.id, "unarchive") ? (
                                <LoaderIcon className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCwIcon className="w-4 h-4" />
                              )}
                              <span>{isActionLoading(item.id, "unarchive") ? "Unarchiving..." : "Unarchive"}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === "active" ? (
                    <VideoIcon className="w-8 h-8 text-slate-400" />
                  ) : (
                    <ArchiveIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No {activeTab} videos found</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || (activeTab === "active" && filterStatus !== "all")
                    ? "Try adjusting your search or filter criteria"
                    : activeTab === "active"
                      ? "Get started by uploading your first video"
                      : "No archived videos yet"}
                </p>
                {!searchTerm && activeTab === "active" && filterStatus === "all" && (
                  <button
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Upload Your First Video
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Video Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={createModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Upload New Video</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setVideoForm({ title: "", description: "", video: null })
                    setVideoPreview(null)
                    setVideoError("")
                    setCreateError("")
                    setCreateSuccess("")
                    if (videoInputRef.current) {
                      videoInputRef.current.value = ""
                    }
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={isCreating}
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleCreateVideo} className="p-6">
                {/* Success Message */}
                {createSuccess && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <p className="text-green-800">{createSuccess}</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {createError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-5 h-5 text-red-600" />
                      <p className="text-red-800">{createError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Video Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Video File *</label>

                    {/* Video Preview - Full Width */}
                    {videoPreview && (
                      <div className="mb-4">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full rounded-lg border border-slate-200"
                          style={{ maxHeight: "500px" }}
                        >
                          Your browser does not support the video tag.
                        </video>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoPreview(null)
                            setVideoForm((prev) => ({ ...prev, video: null }))
                            if (videoInputRef.current) {
                              videoInputRef.current.value = ""
                            }
                          }}
                          className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                          disabled={isCreating}
                        >
                          Remove Video
                        </button>
                      </div>
                    )}

                    {/* Video Upload Area */}
                    {!videoPreview && (
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          isVideoDragOver ? "border-purple-500 bg-purple-50" : "border-slate-300 hover:border-slate-400"
                        } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                        onDragOver={!isCreating ? handleVideoDragOver : undefined}
                        onDragLeave={!isCreating ? handleVideoDragLeave : undefined}
                        onDrop={!isCreating ? handleVideoDrop : undefined}
                      >
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                            <VideoIcon className="w-8 h-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-lg text-slate-600 mb-2">
                              <button
                                type="button"
                                onClick={() => !isCreating && videoInputRef.current?.click()}
                                className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                                disabled={isCreating}
                              >
                                Click to upload video
                              </button>{" "}
                              or drag and drop
                            </p>
                            <p className="text-sm text-slate-500">MP4, MOV up to 250 MB</p>
                          </div>
                        </div>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleVideoInputChange}
                          className="hidden"
                          disabled={isCreating}
                        />
                      </div>
                    )}

                    {/* Video Error */}
                    {videoError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircleIcon className="w-4 h-4 text-red-600" />
                          <p className="text-red-600 text-sm">{videoError}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title Input */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={videoForm.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your video title..."
                      maxLength={100}
                      disabled={isCreating}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">{videoForm.title.length}/100 characters</p>
                      {videoForm.title.length < 3 && videoForm.title.length > 0 && (
                        <p className="text-xs text-red-500">Minimum 3 characters required</p>
                      )}
                    </div>
                  </div>

                  {/* Description Input */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                      Video Description *
                    </label>
                    <TipTapEditor
                      content={videoForm.description}
                      onChange={(content) => handleFormChange("description", content)}
                      placeholder="Enter your video description..."
                      className="min-h-[300px]"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">
                        {stripHtmlTags(videoForm.description).length}/1000 characters (minimum 10 required)
                      </p>
                      {stripHtmlTags(videoForm.description).length < 10 &&
                        stripHtmlTags(videoForm.description).length > 0 && (
                          <p className="text-xs text-red-500">Minimum 10 characters required</p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setVideoForm({ title: "", description: "", video: null })
                      setVideoPreview(null)
                      setVideoError("")
                      setCreateError("")
                      setCreateSuccess("")
                      if (videoInputRef.current) {
                        videoInputRef.current.value = ""
                      }
                    }}
                    disabled={isCreating}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isCreating ||
                      !videoForm.title.trim() ||
                      videoForm.title.trim().length < 3 ||
                      !videoForm.description.trim() ||
                      stripHtmlTags(videoForm.description).length < 10 ||
                      !videoForm.video
                    }
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isCreating ? (
                      <>
                        <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
                        Uploading Video...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-5 h-5 mr-2" />
                        Upload Video
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={editModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-200"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-slate-800">Edit Video</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(editVideoForm.status || "draft")}`}
                  >
                    {getStatusIcon(editVideoForm.status || "draft")}
                    <span>{editVideoForm.status || "draft"}</span>
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setUpdateError("")
                    setUpdateSuccess("")
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={isUpdating}
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleUpdateVideo} className="p-6">
                {/* Success Message */}
                {updateSuccess && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <p className="text-green-800">{updateSuccess}</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {updateError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-5 h-5 text-red-600" />
                      <p className="text-red-800">{updateError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      value={editVideoForm.title}
                      onChange={(e) => handleEditFormChange("title", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your video title..."
                      maxLength={100}
                      disabled={isUpdating}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">{editVideoForm.title.length}/100 characters</p>
                      {editVideoForm.title.length < 3 && editVideoForm.title.length > 0 && (
                        <p className="text-xs text-red-500">Minimum 3 characters required</p>
                      )}
                    </div>
                  </div>

                  {/* Video Display - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Current Video</label>
                    {editVideoForm.videoId && (
                      <div className="mb-4">
                        <Video videoId={editVideoForm.videoId} />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-2">
                      Video Description *
                    </label>
                    <TipTapEditor
                      content={editVideoForm.description}
                      onChange={(content) => handleEditFormChange("description", content)}
                      placeholder="Edit your video description..."
                      className="min-h-[300px]"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">
                        {stripHtmlTags(editVideoForm.description).length}/1000 characters (minimum 10 required)
                      </p>
                      {stripHtmlTags(editVideoForm.description).length < 10 &&
                        stripHtmlTags(editVideoForm.description).length > 0 && (
                          <p className="text-xs text-red-500">Minimum 10 characters required</p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setUpdateError("")
                      setUpdateSuccess("")
                    }}
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isUpdating ||
                      !editVideoForm.title.trim() ||
                      editVideoForm.title.trim().length < 3 ||
                      !editVideoForm.description.trim() ||
                      stripHtmlTags(editVideoForm.description).length < 10
                    }
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isUpdating ? (
                      <>
                        <LoaderIcon className="animate-spin w-4 h-4 mr-2" />
                        Updating Video...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Update Video
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Video Modal */}
      {showViewModal && viewVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div
            ref={viewModalRef}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all duration-200"
          >
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewVideo.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>by {viewVideo.creator?.username || viewVideo.author?.username}</span>
                    <span className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(viewVideo.created_at)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>{viewVideo.views || 0} views</span>
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(
                        viewVideo.status || "draft",
                        isArchived(viewVideo),
                      )}`}
                    >
                      {getStatusIcon(viewVideo.status || "draft", isArchived(viewVideo))}
                      <span>{getStatusText(viewVideo.status || "draft", isArchived(viewVideo))}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setViewVideo(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                >
                  <XIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Video Player */}
              <div className="mb-8">
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  {!videoLoadError[`view-${viewVideo.id}`] ? (
                    <Video videoId={viewVideo.video_id} />
                  ) : (
                    <div className="w-full aspect-video bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircleIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-lg text-slate-600 mb-2">Unable to load video</p>
                        <p className="text-sm text-slate-500">The video file may be corrupted or unavailable</p>
                        <button
                          onClick={() => {
                            setVideoLoadError((prev) => ({
                              ...prev,
                              [`view-${viewVideo.id}`]: false,
                            }))
                          }}
                          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Description */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Description</h4>
                <div className="prose prose-lg prose-slate max-w-none bg-gray-50 p-6 rounded-2xl">
                  <TipTapContentDisplay content={viewVideo.description} />
                </div>
              </div>

              {/* Video Details */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Video Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium text-gray-900">{viewVideo.format || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">{viewVideo.duration_formatted || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900">
                        {getStatusText(viewVideo.status || "draft", isArchived(viewVideo))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Archived:</span>
                      <span className="font-medium text-gray-900">{isArchived(viewVideo) ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Creator Information</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold">
                        {(viewVideo.creator?.username || viewVideo.author?.username || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {viewVideo.creator?.username || viewVideo.author?.username}
                      </p>
                      <p className="text-gray-600">{viewVideo.creator?.email || viewVideo.author?.email}</p>
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium mt-2">
                        {viewVideo.creator?.role || viewVideo.author?.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
