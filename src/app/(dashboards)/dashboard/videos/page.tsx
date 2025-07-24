"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { logOut } from "@/slice/userSlice"
import profileImage from "@/assets/profile.png"
import {
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  EditIcon,
  EyeIcon,
  CalendarIcon,
  VideoIcon,
  TrendingUpIcon,
  UserIcon,
  XIcon,
  SaveIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ImageIcon,
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
  addVideoComment,
  editVideoComment,
} from "@/api/content"

interface UserData {
  email: string
  username: string
  id: string
  imageUrl?: string
  videos?: Video[]
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

interface Video {
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
}

interface CreateVideoData {
  title: string
  description: string
  status?: string
  category?: string
  video?: File | null
  thumbnail?: File | null
}

interface EditVideoData extends CreateVideoData {
  id: number
  existingVideoUrl?: string
  existingThumbnailUrl?: string
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
  const [viewVideo, setViewVideo] = useState<Video | null>(null)

  // Loading states for different actions
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({})

  // File upload states
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [editVideoPreview, setEditVideoPreview] = useState<string | null>(null)
  const [editThumbnailPreview, setEditThumbnailPreview] = useState<string | null>(null)
  const [videoError, setVideoError] = useState("")
  const [thumbnailError, setThumbnailError] = useState("")
  const [isVideoDragOver, setIsVideoDragOver] = useState(false)
  const [isThumbnailDragOver, setIsThumbnailDragOver] = useState(false)
  const [isEditVideoDragOver, setIsEditVideoDragOver] = useState(false)
  const [isEditThumbnailDragOver, setIsEditThumbnailDragOver] = useState(false)
  const [removeExistingVideo, setRemoveExistingVideo] = useState(false)
  const [removeExistingThumbnail, setRemoveExistingThumbnail] = useState(false)

  // Video loading states
  const [videoLoadError, setVideoLoadError] = useState<{ [key: string]: boolean }>({})

  // Create video form state
  const [videoForm, setVideoForm] = useState<CreateVideoData>({
    title: "",
    description: "",
    status: "draft",
    category: "General",
    video: null,
    thumbnail: null,
  })

  // Edit video form state
  const [editVideoForm, setEditVideoForm] = useState<EditVideoData>({
    id: 0,
    title: "",
    description: "",
    status: "draft",
    category: "General",
    video: null,
    thumbnail: null,
    existingVideoUrl: "",
    existingThumbnailUrl: "",
  })

  // Store original edit form data for comparison
  const [originalEditData, setOriginalEditData] = useState<EditVideoData>({
    id: 0,
    title: "",
    description: "",
    status: "draft",
    category: "General",
    video: null,
    thumbnail: null,
    existingVideoUrl: "",
    existingThumbnailUrl: "",
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
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const editVideoInputRef = useRef<HTMLInputElement>(null)
  const editThumbnailInputRef = useRef<HTMLInputElement>(null)
  const viewModalRef = useRef<HTMLDivElement>(null)

  const user = useSelector((state: any) => state.user)

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
  const isArchived = (video: Video): boolean => {
    return video.archived === true
  }

  // Enhanced video URL function with better error handling
  const getVideoUrl = (videoPath: string | null | undefined): string | null => {
    if (!videoPath) return null

    // Handle different URL formats
    if (videoPath.startsWith("http://") || videoPath.startsWith("https://")) {
      return videoPath
    }

    if (videoPath.startsWith("static")) {
      return `http://116.202.210.102:5055/${videoPath}`
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = videoPath.startsWith("/") ? videoPath.slice(1) : videoPath
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    return `${baseUrl}/${cleanPath}`
  }

  const getThumbnailUrl = (thumbnailPath: string | null | undefined): string | null => {
    if (!thumbnailPath) return null

    // Handle different URL formats
    if (thumbnailPath.startsWith("http://") || thumbnailPath.startsWith("https://")) {
      return thumbnailPath
    }

    if (thumbnailPath.startsWith("static")) {
      return `http://116.202.210.102:5055/${thumbnailPath}`
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = thumbnailPath.startsWith("/") ? thumbnailPath.slice(1) : thumbnailPath
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    return `${baseUrl}/${cleanPath}`
  }

  // Video validation function
  const validateVideo = (file: File): string | null => {
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov"]
    const maxSize = 500 * 1024 * 1024 // 500MB

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid video file (MP4, WebM, OGG, AVI, or MOV)"
    }

    if (file.size > maxSize) {
      return "Video size must be less than 500MB"
    }

    return null
  }

  // Thumbnail validation function
  const validateThumbnail = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
    }

    if (file.size > maxSize) {
      return "Thumbnail size must be less than 5MB"
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

  // Handle thumbnail selection for create form
  const handleThumbnailSelect = (file: File) => {
    const error = validateThumbnail(file)
    if (error) {
      setThumbnailError(error)
      return
    }
    setThumbnailError("")
    setVideoForm((prev) => ({ ...prev, thumbnail: file }))
    const reader = new FileReader()
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle video selection for edit form
  const handleEditVideoSelect = (file: File) => {
    const error = validateVideo(file)
    if (error) {
      setVideoError(error)
      return
    }
    setVideoError("")
    setEditVideoForm((prev) => ({ ...prev, video: file }))
    setRemoveExistingVideo(false)
    const url = URL.createObjectURL(file)
    setEditVideoPreview(url)
  }

  // Handle thumbnail selection for edit form
  const handleEditThumbnailSelect = (file: File) => {
    const error = validateThumbnail(file)
    if (error) {
      setThumbnailError(error)
      return
    }
    setThumbnailError("")
    setEditVideoForm((prev) => ({ ...prev, thumbnail: file }))
    setRemoveExistingThumbnail(false)
    const reader = new FileReader()
    reader.onload = (e) => {
      setEditThumbnailPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // File input handlers
  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleVideoSelect(file)
    }
  }

  const handleThumbnailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleThumbnailSelect(file)
    }
  }

  const handleEditVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleEditVideoSelect(file)
    }
  }

  const handleEditThumbnailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleEditThumbnailSelect(file)
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

  const handleThumbnailDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsThumbnailDragOver(true)
  }

  const handleThumbnailDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsThumbnailDragOver(false)
  }

  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsThumbnailDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleThumbnailSelect(file)
    }
  }

  // Drag and drop handlers for edit form
  const handleEditVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditVideoDragOver(true)
  }

  const handleEditVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditVideoDragOver(false)
  }

  const handleEditVideoDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditVideoDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleEditVideoSelect(file)
    }
  }

  const handleEditThumbnailDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditThumbnailDragOver(true)
  }

  const handleEditThumbnailDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditThumbnailDragOver(false)
  }

  const handleEditThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditThumbnailDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleEditThumbnailSelect(file)
    }
  }

  // Remove files
  const removeVideo = () => {
    setVideoForm((prev) => ({ ...prev, video: null }))
    setVideoPreview(null)
    setVideoError("")
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  const removeThumbnail = () => {
    setVideoForm((prev) => ({ ...prev, thumbnail: null }))
    setThumbnailPreview(null)
    setThumbnailError("")
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ""
    }
  }

  const removeEditVideo = () => {
    setEditVideoForm((prev) => ({ ...prev, video: null }))
    setEditVideoPreview(null)
    setRemoveExistingVideo(true)
    setVideoError("")
    if (editVideoInputRef.current) {
      editVideoInputRef.current.value = ""
    }
  }

  const removeEditThumbnail = () => {
    setEditVideoForm((prev) => ({ ...prev, thumbnail: null }))
    setEditThumbnailPreview(null)
    setRemoveExistingThumbnail(true)
    setThumbnailError("")
    if (editThumbnailInputRef.current) {
      editThumbnailInputRef.current.value = ""
    }
  }

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !viewVideo) return

    setIsSubmittingComment(true)
    setCommentError("")

    try {
      const response = await addVideoComment(viewVideo.id, { content: newComment.trim() })
      if (response?.status === 200 || response?.status === 201) {
        setNewComment("")
        setCommentSuccess("Comment added successfully!")
        setTimeout(() => setCommentSuccess(""), 3000)
        // Refresh the video data to get updated comments
        await fetchUserVideos()
        // Update the current viewVideo with new comments
        const updatedVideo = userData.videos?.find((video) => video.id === viewVideo.id)
        if (updatedVideo) {
          setViewVideo(updatedVideo)
          setComments(updatedVideo.comments)
        }
      }
    } catch (error: any) {
      setCommentError(error?.response?.data?.message || "Failed to add comment")
      setTimeout(() => setCommentError(""), 3000)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // Handle comment edit
  const handleCommentEdit = async (commentId: number) => {
    if (!editCommentText.trim()) return

    try {
      const response = await editVideoComment(commentId, { content: editCommentText.trim() })
      if (response?.status === 200) {
        setEditingCommentId(null)
        setEditCommentText("")
        setCommentSuccess("Comment updated successfully!")
        setTimeout(() => setCommentSuccess(""), 3000)
        // Refresh the video data to get updated comments
        await fetchUserVideos()
        // Update the current viewVideo with updated comments
        const updatedVideo = userData.videos?.find((video) => video.id === viewVideo?.id)
        if (updatedVideo) {
          setViewVideo(updatedVideo)
          setComments(updatedVideo.comments)
        }
      }
    } catch (error: any) {
      setCommentError(error?.response?.data?.message || "Failed to update comment")
      setTimeout(() => setCommentError(""), 3000)
    }
  }

  // Start editing a comment
  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditCommentText(comment.comment)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingCommentId(null)
    setEditCommentText("")
  }

  // Fetch user's videos
  const fetchUserVideos = async () => {
    try {
      setFetchError("")
      const response = await getMyVideos()
      console.log("Fetch videos response:", response)

      if (response?.data?.videos) {
        const userVideos = response.data.videos
          .filter((video: Video) => video.created_by === user?.id || video.author?.id === user?.id)
          .map((video: Video) => ({
            ...video,
            createdAt: video.created_at,
            status: video.status || "draft",
            views: video.views || Math.floor(Math.random() * 1000),
            category: video.author?.role === "Creator" ? "Programming" : "General",
          }))

        setUserData((prev) => ({
          ...prev,
          videos: userVideos,
        }))
      }
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
  const handleEditVideo = (video: Video) => {
    console.log("Edit video clicked:", video.id)
    setShowActionMenu(null)
    setUpdateError("")
    setUpdateSuccess("")
    setVideoError("")
    setThumbnailError("")
    setRemoveExistingVideo(false)
    setRemoveExistingThumbnail(false)

    const editData = {
      id: video.id,
      title: video.title,
      description: video.description,
      status: video.status || "draft",
      category: video.category || "General",
      video: null,
      thumbnail: null,
      existingVideoUrl: video.video_url || "",
      existingThumbnailUrl: video.thumbnail || "",
    }

    setEditVideoForm(editData)
    setOriginalEditData(editData) // Store original data for comparison

    // Set video preview
    const videoUrl = getVideoUrl(video.video_url)
    console.log("Setting edit video preview:", videoUrl)
    setEditVideoPreview(videoUrl)

    // Set thumbnail preview
    const thumbnailUrl = getThumbnailUrl(video.thumbnail)
    console.log("Setting edit thumbnail preview:", thumbnailUrl)
    setEditThumbnailPreview(thumbnailUrl)

    // Clear file inputs
    if (editVideoInputRef.current) {
      editVideoInputRef.current.value = ""
    }
    if (editThumbnailInputRef.current) {
      editThumbnailInputRef.current.value = ""
    }

    setShowEditModal(true)
  }

  // Handle view video
  const handleViewVideo = async (video: Video) => {
    console.log("View video clicked:", video.id)
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

      // Handle video updates
      if (editVideoForm.video) {
        formData.append("video", editVideoForm.video)
        hasChanges = true
      } else if (removeExistingVideo) {
        formData.append("remove_video", "true")
        hasChanges = true
      }

      // Handle thumbnail updates
      if (editVideoForm.thumbnail) {
        formData.append("thumbnail", editVideoForm.thumbnail)
        hasChanges = true
      } else if (removeExistingThumbnail) {
        formData.append("remove_thumbnail", "true")
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
          video_url: response.data?.video_url || (removeExistingVideo ? null : editVideoForm.existingVideoUrl),
          thumbnail: response.data?.thumbnail || (removeExistingThumbnail ? null : editVideoForm.existingThumbnailUrl),
        }

        setUserData((prev) => ({
          ...prev,
          videos:
            prev.videos?.map((video) => (video.id === editVideoForm.id ? { ...video, ...updatedVideo } : video)) || [],
        }))

        setUpdateSuccess("Video updated successfully!")
        setTimeout(() => {
          setShowEditModal(false)
          setUpdateSuccess("")
          setEditVideoPreview(null)
          setEditThumbnailPreview(null)
          setRemoveExistingVideo(false)
          setRemoveExistingThumbnail(false)
          setEditVideoForm({
            id: 0,
            title: "",
            description: "",
            status: "draft",
            category: "General",
            video: null,
            thumbnail: null,
            existingVideoUrl: "",
            existingThumbnailUrl: "",
          })
          setOriginalEditData({
            id: 0,
            title: "",
            description: "",
            status: "draft",
            category: "General",
            video: null,
            thumbnail: null,
            existingVideoUrl: "",
            existingThumbnailUrl: "",
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

    if (!videoForm.thumbnail) {
      setCreateError("Thumbnail is required")
      return
    }

    setIsCreating(true)

    try {
      const formData = new FormData()
      formData.append("title", videoForm.title.trim())
      formData.append("description", videoForm.description.trim())
      formData.append("video", videoForm.video)
      formData.append("thumbnail", videoForm.thumbnail)

      const response = await createVideo(formData)
      console.log("Create video response:", response)

      if (response?.status === 200 || response?.status === 201 || response?.data) {
        setCreateSuccess("Video created successfully!")
        setVideoForm({
          title: "",
          description: "",
          video: null,
          thumbnail: null,
        })
        setVideoPreview(null)
        setThumbnailPreview(null)
        setVideoError("")
        setThumbnailError("")

        if (videoInputRef.current) {
          videoInputRef.current.value = ""
        }
        if (thumbnailInputRef.current) {
          thumbnailInputRef.current.value = ""
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

  // Handle video load error
  const handleVideoLoadError = (videoId: string) => {
    setVideoLoadError((prev) => ({
      ...prev,
      [videoId]: true,
    }))
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
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))

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
                              {item.duration}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
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
                        <p className="text-slate-600 text-sm mb-2 line-clamp-2">{item.description}</p>
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-200"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Upload New Video</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setVideoForm({ title: "", description: "", video: null, thumbnail: null })
                    setVideoPreview(null)
                    setThumbnailPreview(null)
                    setVideoError("")
                    setThumbnailError("")
                    setCreateError("")
                    setCreateSuccess("")
                    if (videoInputRef.current) {
                      videoInputRef.current.value = ""
                    }
                    if (thumbnailInputRef.current) {
                      thumbnailInputRef.current.value = ""
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
                    {/* Video Preview */}
                    {videoPreview && (
                      <div className="mb-4 relative group">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-64 object-cover rounded-lg border border-slate-200"
                        >
                          Your browser does not support the video tag.
                        </video>
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          disabled={isCreating}
                        >
                          <XIcon className="w-4 h-4" />
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
                            <p className="text-sm text-slate-500">MP4, WebM, OGG, AVI, MOV up to 500MB</p>
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

                  {/* Thumbnail Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Thumbnail Image *</label>
                    {/* Thumbnail Preview */}
                    {thumbnailPreview && (
                      <div className="mb-4 relative group">
                        <Image
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          width={400}
                          height={225}
                          className="w-full h-48 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          disabled={isCreating}
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Thumbnail Upload Area */}
                    {!thumbnailPreview && (
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          isThumbnailDragOver
                            ? "border-purple-500 bg-purple-50"
                            : "border-slate-300 hover:border-slate-400"
                        } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                        onDragOver={!isCreating ? handleThumbnailDragOver : undefined}
                        onDragLeave={!isCreating ? handleThumbnailDragLeave : undefined}
                        onDrop={!isCreating ? handleThumbnailDrop : undefined}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <button
                                type="button"
                                onClick={() => !isCreating && thumbnailInputRef.current?.click()}
                                className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                                disabled={isCreating}
                              >
                                Click to upload thumbnail
                              </button>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
                          </div>
                        </div>
                        <input
                          ref={thumbnailInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailInputChange}
                          className="hidden"
                          disabled={isCreating}
                        />
                      </div>
                    )}

                    {/* Thumbnail Error */}
                    {thumbnailError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircleIcon className="w-4 h-4 text-red-600" />
                          <p className="text-red-600 text-sm">{thumbnailError}</p>
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
                    <textarea
                      id="description"
                      value={videoForm.description}
                      onChange={(e) => handleFormChange("description", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors"
                      placeholder="Describe your video..."
                      rows={6}
                      maxLength={1000}
                      minLength={10}
                      disabled={isCreating}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">
                        {videoForm.description.length}/1000 characters (minimum 10 required)
                      </p>
                      {videoForm.description.length < 10 && videoForm.description.length > 0 && (
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
                      setVideoForm({ title: "", description: "", video: null, thumbnail: null })
                      setVideoPreview(null)
                      setThumbnailPreview(null)
                      setVideoError("")
                      setThumbnailError("")
                      setCreateError("")
                      setCreateSuccess("")
                      if (videoInputRef.current) {
                        videoInputRef.current.value = ""
                      }
                      if (thumbnailInputRef.current) {
                        thumbnailInputRef.current.value = ""
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
                      videoForm.description.trim().length < 10 ||
                      !videoForm.video ||
                      !videoForm.thumbnail
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
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
                    setEditVideoPreview(null)
                    setEditThumbnailPreview(null)
                    setVideoError("")
                    setThumbnailError("")
                    setUpdateError("")
                    setUpdateSuccess("")
                    setRemoveExistingVideo(false)
                    setRemoveExistingThumbnail(false)
                    if (editVideoInputRef.current) {
                      editVideoInputRef.current.value = ""
                    }
                    if (editThumbnailInputRef.current) {
                      editThumbnailInputRef.current.value = ""
                    }
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

                  {/* Video Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Video File (Optional)</label>
                    {/* Current/Preview Video */}
                    {editVideoPreview && !removeExistingVideo && (
                      <div className="mb-4 relative group">
                        <video
                          src={editVideoPreview}
                          controls
                          className="w-full h-64 object-cover rounded-lg border border-slate-200"
                          onError={() => handleVideoLoadError(`edit-${editVideoForm.id}`)}
                        >
                          Your browser does not support the video tag.
                        </video>
                        {videoLoadError[`edit-${editVideoForm.id}`] && (
                          <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <AlertCircleIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm text-slate-500">Unable to load video preview</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editVideoInputRef.current?.click()}
                              className="px-3 py-1 bg-white text-slate-800 rounded text-sm hover:bg-slate-100 transition-colors"
                              disabled={isUpdating}
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={removeEditVideo}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                              disabled={isUpdating}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    {(!editVideoPreview || removeExistingVideo) && (
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          isEditVideoDragOver
                            ? "border-purple-500 bg-purple-50"
                            : "border-slate-300 hover:border-slate-400"
                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                        onDragOver={!isUpdating ? handleEditVideoDragOver : undefined}
                        onDragLeave={!isUpdating ? handleEditVideoDragLeave : undefined}
                        onDrop={!isUpdating ? handleEditVideoDrop : undefined}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                            <VideoIcon className="w-8 h-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <button
                                type="button"
                                onClick={() => !isUpdating && editVideoInputRef.current?.click()}
                                className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                                disabled={isUpdating}
                              >
                                Click to upload
                              </button>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">MP4, WebM, OGG, AVI, MOV up to 500MB</p>
                          </div>
                        </div>
                        <input
                          ref={editVideoInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleEditVideoInputChange}
                          className="hidden"
                          disabled={isUpdating}
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

                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail Image (Optional)</label>
                    {/* Current/Preview Thumbnail */}
                    {editThumbnailPreview && !removeExistingThumbnail && (
                      <div className="mb-4 relative group">
                        <Image
                          src={editThumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          width={400}
                          height={225}
                          className="w-full h-48 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editThumbnailInputRef.current?.click()}
                              className="px-3 py-1 bg-white text-slate-800 rounded text-sm hover:bg-slate-100 transition-colors"
                              disabled={isUpdating}
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={removeEditThumbnail}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                              disabled={isUpdating}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    {(!editThumbnailPreview || removeExistingThumbnail) && (
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          isEditThumbnailDragOver
                            ? "border-purple-500 bg-purple-50"
                            : "border-slate-300 hover:border-slate-400"
                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                        onDragOver={!isUpdating ? handleEditThumbnailDragOver : undefined}
                        onDragLeave={!isUpdating ? handleEditThumbnailDragLeave : undefined}
                        onDrop={!isUpdating ? handleEditThumbnailDrop : undefined}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <button
                                type="button"
                                onClick={() => !isUpdating && editThumbnailInputRef.current?.click()}
                                className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                                disabled={isUpdating}
                              >
                                Click to upload
                              </button>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
                          </div>
                        </div>
                        <input
                          ref={editThumbnailInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleEditThumbnailInputChange}
                          className="hidden"
                          disabled={isUpdating}
                        />
                      </div>
                    )}

                    {/* Thumbnail Error */}
                    {thumbnailError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircleIcon className="w-4 h-4 text-red-600" />
                          <p className="text-red-600 text-sm">{thumbnailError}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-2">
                      Video Description *
                    </label>
                    <textarea
                      id="edit-description"
                      value={editVideoForm.description}
                      onChange={(e) => handleEditFormChange("description", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors"
                      placeholder="Describe your video..."
                      rows={6}
                      maxLength={1000}
                      minLength={10}
                      disabled={isUpdating}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">
                        {editVideoForm.description.length}/1000 characters (minimum 10 required)
                      </p>
                      {editVideoForm.description.length < 10 && editVideoForm.description.length > 0 && (
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
                      setEditVideoPreview(null)
                      setEditThumbnailPreview(null)
                      setVideoError("")
                      setThumbnailError("")
                      setUpdateError("")
                      setUpdateSuccess("")
                      setRemoveExistingVideo(false)
                      setRemoveExistingThumbnail(false)
                      if (editVideoInputRef.current) {
                        editVideoInputRef.current.value = ""
                      }
                      if (editThumbnailInputRef.current) {
                        editThumbnailInputRef.current.value = ""
                      }
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
                      editVideoForm.description.trim().length < 10
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={viewModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-200"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-slate-800">{viewVideo.title}</h3>
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
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setViewVideo(null)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Video Meta Info */}
              <div className="flex items-center space-x-4 mt-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <UserIcon className="w-4 h-4" />
                  <span>By {viewVideo.creator?.username || viewVideo.author?.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(viewVideo.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{viewVideo.views || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>👍 {viewVideo.likes} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>💬 {viewVideo.comments_count} comments</span>
                </div>
                {viewVideo.duration && (
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{viewVideo.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Video Player */}
                {viewVideo.video_url && (
                  <div className="mb-6">
                    {!videoLoadError[`view-${viewVideo.id}`] ? (
                      <video
                        src={getVideoUrl(viewVideo.video_url) || "/placeholder.svg?height=400&width=800"}
                        controls
                        className="w-full h-96 object-cover rounded-lg border border-slate-200"
                        poster={getThumbnailUrl(viewVideo.thumbnail) || "/placeholder.svg?height=400&width=800"}
                        onError={() => handleVideoLoadError(`view-${viewVideo.id}`)}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-96 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
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
                )}

                {/* Video Description */}
                <div className="prose prose-slate max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{viewVideo.description}</div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Comments ({comments.length})</h4>

                {/* Success/Error Messages */}
                {commentSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <p className="text-green-800 text-sm">{commentSuccess}</p>
                    </div>
                  </div>
                )}

                {commentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircleIcon className="w-4 h-4 text-red-600" />
                      <p className="text-red-800 text-sm">{commentError}</p>
                    </div>
                  </div>
                )}

                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={profileImage || "/placeholder.svg"}
                        alt="Your avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={3}
                        disabled={isSubmittingComment}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-slate-500">{newComment.length}/500 characters</span>
                        <button
                          type="submit"
                          disabled={!newComment.trim() || isSubmittingComment}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {isSubmittingComment ? "Posting..." : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3 p-4 bg-slate-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Image
                            src={profileImage || "/placeholder.svg"}
                            alt={`${comment.commenter?.username || "User"}'s avatar`}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-slate-800">
                              {comment.commenter?.username || "Anonymous User"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(comment.commented_at).toLocaleDateString()}
                            </span>
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                rows={3}
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleCommentEdit(comment.id)}
                                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                                  disabled={!editCommentText.trim()}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-1 bg-slate-300 text-slate-700 rounded text-sm hover:bg-slate-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-slate-700 text-sm leading-relaxed">{comment.comment}</p>
                              {(comment.commenter?.id === user?.id || comment.commented_by === user?.id) && (
                                <button
                                  onClick={() => startEditingComment(comment)}
                                  className="mt-2 text-xs text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-slate-400 text-xl">💬</span>
                      </div>
                      <p className="text-slate-500 text-sm">No comments yet</p>
                      <p className="text-slate-400 text-xs">Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Action buttons based on status and archived state */}
                  {!isArchived(viewVideo) && viewVideo.status === "draft" && (
                    <>
                      <button
                        onClick={() => {
                          setShowViewModal(false)
                          handleEditVideo(viewVideo)
                        }}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowViewModal(false)
                          handleSendForApproval(viewVideo.id)
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={isActionLoading(viewVideo.id, "approval")}
                      >
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {isActionLoading(viewVideo.id, "approval") ? "Sending..." : "Send for Approval"}
                      </button>
                    </>
                  )}

                  {!isArchived(viewVideo) && viewVideo.status === "published" && (
                    <>
                      <button
                        onClick={() => {
                          setShowViewModal(false)
                          handleEditVideo(viewVideo)
                        }}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowViewModal(false)
                          handleArchiveVideo(viewVideo.id)
                        }}
                        className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        disabled={isActionLoading(viewVideo.id, "archive")}
                      >
                        <ArchiveIcon className="w-4 h-4 mr-2" />
                        {isActionLoading(viewVideo.id, "archive") ? "Archiving..." : "Archive"}
                      </button>
                    </>
                  )}

                  {!isArchived(viewVideo) && viewVideo.status === "pending_approval" && (
                    <button
                      onClick={() => {
                        setShowViewModal(false)
                        handleEditVideo(viewVideo)
                      }}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <EditIcon className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}

                  {isArchived(viewVideo) && (
                    <button
                      onClick={() => {
                        setShowViewModal(false)
                        handleUnarchiveVideo(viewVideo.id)
                      }}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={isActionLoading(viewVideo.id, "unarchive")}
                    >
                      <RefreshCwIcon className="w-4 h-4 mr-2" />
                      {isActionLoading(viewVideo.id, "unarchive") ? "Unarchiving..." : "Unarchive"}
                    </button>
                  )}

                  {!isArchived(viewVideo) && viewVideo.status === "approved" && (
                    <button
                      onClick={() => {
                        setShowViewModal(false)
                        updateVideoStatus(viewVideo.id, "published")
                      }}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      disabled={isActionLoading(viewVideo.id, "status")}
                    >
                      <SendIcon className="w-4 h-4 mr-2" />
                      {isActionLoading(viewVideo.id, "status") ? "Publishing..." : "Publish"}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setViewVideo(null)
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
