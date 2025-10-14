"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"
import { useRouter } from "next/navigation"

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
  TrashIcon,
  MessageCircleOff,
  MessageCircleIcon,
  ImageIcon,
  Share2,
  Check,
} from "lucide-react"
import Image from "next/image"
import { useSelector } from "react-redux"
import {
  getMyVideos,
  createVideo,
  updateVideo,
  publishContent,
  archiveVideo,
  unarchiveVideo,
  deleteCretorVideo,
  toggleCommentOnVideo,
  toggleVideoLike,
  addCommentToVideo,
  editVideoComment,
  deleteVideoComment,
  getTaskStatus,
} from "@/api/content"
import TipTapEditor from "@/components/tiptap-editor"
import TipTapContentDisplay from "@/components/tiptap-content-display"
import Video from "@/components/Video"
import Scheduler from "@/components/Scheduler"

interface UserData {
  email: string
  username: string
  id: string
  imageUrl?: string
  videos: VideoType[]
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
    profile_picture: string | Blob | undefined
    email: string
    id: number
    role: string
    username: string
  }
}

interface VideoType {
  show_comments: any
  scheduled_at: string
  is_scheduled: any
  reason_for_rejection: string | null
  video_id: any
  creator: any
  id: number
  slug?: string
  title: string
  description: string
  author: Author
  created_at: string
  created_by: number
  comments: Comment[]
  comments_count: number
  liked_by: number[]
  likes: number
  is_liked?: boolean
  video_url?: string
  thumbnail?: string | File | null
  status?: string | null
  archived?: boolean | null
  createdAt?: string
  views?: number
  category?: string
  duration?: string
  video?: string
  duration_formatted?: string
  format?: string
  keywords?: string[]
  locations?: string[]
  age_restricted?: boolean
  brand_tags?: string[]
  paid_promotion?: boolean
}

interface CreateVideoData {
  title: string
  description: string
  status?: string
  category?: string
  video?: File | null
  thumbnail?: File | null
  is_draft?: boolean
  keywords?: string[]
  locations?: string[]
  age_restricted: boolean
  brand_tags?: string[]
  paid_promotion?: boolean
}

interface EditVideoData {
  id: number
  title: string
  description: string
  status?: string
  category?: string
  videoId?: string
  thumbnail?: File |string | null
  existingVideoUrl?: string
  is_draft?: boolean
  keywords?: string[]
  locations?: string[]
  age_restricted: boolean
  brand_tags?: string[]
  paid_promotion?: boolean
}

export default function VideoDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>({
    email: "",
    username: "",
    id: "",
    imageUrl: "",
    videos: [],
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState<"active" | "archived" | "rejected">("active")
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [createSuccess, setCreateSuccess] = useState("")
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [fetchError, setFetchError] = useState("")
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewVideo, setViewVideo] = useState<VideoType | null>(null)
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledAt, setScheduledAt] = useState<Date | null>(new Date(new Date().getTime() + 30 * 60 * 1000))

  // Like state for view modal
  const [isLiked, setIsLiked] = useState(false)
  const [copied, setCopied] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'loading';
    message: string;
    description?: string;
    duration?: number;
  }>>([])

  // Polling state
  const [pollingTaskId, setPollingTaskId] = useState<string | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  //store id for url
  const [createdVideoId, setCreatedVideoId] = useState<string | null>(null)

  // Comment states for view modal
  const [newComment, setNewComment] = useState("")
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [isEditingComment, setIsEditingComment] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)

  // Loading states for different actions
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({})

  // File upload states
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoError, setVideoError] = useState("")
  const [isVideoDragOver, setIsVideoDragOver] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const [isThumbnailDragOver, setIsThumbnailDragOver] = useState(false)

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
    is_draft: false,
    keywords: [],
    locations: [],
    age_restricted: false,
    brand_tags: [],
    paid_promotion: false,
  })

  // Edit video form state
  const [editVideoForm, setEditVideoForm] = useState<EditVideoData>({
    id: 0,
    title: "",
    description: "",
    status: "draft",
    category: "General",
    videoId: "",
    thumbnail: null,
    existingVideoUrl: "",
    is_draft: true,
    keywords: [],
    locations: [],
    age_restricted: false,
    brand_tags: [],
    paid_promotion: false,
  })

  // Store original edit form data for comparison
  const [originalEditData, setOriginalEditData] = useState<EditVideoData>({
    id: 0,
    title: "",
    description: "",
    status: "draft",
    category: "General",
    videoId: "",
    thumbnail: null,
    existingVideoUrl: "",
    is_draft: true,
    keywords: [],
    locations: [],
    age_restricted: false,
    brand_tags: [],
    paid_promotion: false,
  })


  // Toast helper functions
const addToast = (toast: {
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
  description?: string;
  duration?: number;
}) => {
  const id = `toast-${Date.now()}-${Math.random()}`
  console.log('🔔 Adding toast:', { id, ...toast })
  setToasts((prev) => {
    const newToasts = [...prev, { id, ...toast }]
    console.log('Current toasts:', newToasts)
    return newToasts
  })
  return id
}

const removeToast = (id: string) => {
  console.log('🗑️ Removing toast:', id)
  setToasts((prev) => prev.filter((toast) => toast.id !== id))
}

const updateToast = (id: string, updates: Partial<{
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
  description?: string;
}>) => {
  console.log('✏️ Updating toast:', id, updates)
  setToasts((prev) =>
    prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast))
  )
}

// Polling function
const pollTaskStatus = async (taskId: string, toastId: string) => {
  try {
    const response = await getTaskStatus(taskId)
    const { state, status, result, error } = response.data

    if (state === 'SUCCESS') {
      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      setPollingTaskId(null)

      // ✅ Update toast to success
      updateToast(toastId, {
        type: 'success',
        message: 'Upload Successful!',
        description: result?.message || 'Your video has been uploaded successfully.'
      })

       // ✅ Remove success toast after duration
      setTimeout(() => removeToast(toastId), 5000)

      // Refresh video list
      await fetchUserVideos()

    } else if (state === 'FAILURE') {
      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      setPollingTaskId(null)

      // ✅ Update toast to error
      updateToast(toastId, {
        type: 'error',
        message: 'Upload Failed',
        description: error || 'There was an error uploading your video.'
      })

      setTimeout(() => removeToast(toastId), 7000)

    } else if (state === 'STARTED') {
      // ✅ Update toast when upload actually starts
      updateToast(toastId, {
        type: 'loading',
        message: 'Uploading Video...',
        description: status || 'Your video is being uploaded to the server.',
      })

    }
    // 🔹 ADD THIS NEW CASE ↓↓↓
    else if (state === 'PENDING') {
      // This ensures the "Processing" toast updates properly while queued
      updateToast(toastId, {
        type: 'loading',
        message: 'Processing video...',
        description: 'Preparing your upload, please wait...',
      })
    }
    // 🔹 END ADDITION

  } catch (error) {
    console.error('Error polling task status:', error)
    // Stop polling on error
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setPollingTaskId(null)

    updateToast(toastId, {
      type: 'error',
      message: 'Error Checking Status',
      description: 'Could not check upload status. Please refresh the page.'
    })

    setTimeout(() => removeToast(toastId), 7000)
  }
}

// Cleanup polling on unmount
useEffect(() => {
  return () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
  }
}, [])

  // Comment states

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

  const [locationInput, setLocationInput] = useState("")
  const [editLocationInput, setEditLocationInput] = useState("")

  const [brandTagInput, setBrandTagInput] = useState("")
  const [editBrandTagInput, setEditBrandTagInput] = useState("")

  const addLocation = () => {
  if (!locationInput.trim()) return

  const allLocations = locationInput
    .split(",")
    .map((loc) => loc.trim())
    .filter((loc) => loc.length > 0)

  const uniqueNew = Array.from(new Set(allLocations))
  const existing = videoForm.locations || []
  const finalLocations = [...existing]

  uniqueNew.forEach((loc) => {
    if (!finalLocations.includes(loc)) {
      finalLocations.push(loc)
    }
  })

  setVideoForm((prev) => ({
    ...prev,
    locations: finalLocations,
  }))

  setLocationInput("")
}

const removeLocation = (loc: string) => {
  setVideoForm((prev) => ({
    ...prev,
    locations: prev.locations?.filter((l) => l !== loc) || [],
  }))
}

const addEditLocation = () => {
  if (!editLocationInput.trim()) return

  const allLocations = editLocationInput
    .split(",")
    .map((loc) => loc.trim())
    .filter((loc) => loc.length > 0)

  const uniqueNew = Array.from(new Set(allLocations))
  const existing = editVideoForm.locations || []
  const finalLocations = [...existing]

  uniqueNew.forEach((loc) => {
    if (!finalLocations.includes(loc)) {
      finalLocations.push(loc)
    }
  })

  setEditVideoForm((prev) => ({
    ...prev,
    locations: finalLocations,
  }))

  setEditLocationInput("")
}

const removeEditLocation = (loc: string) => {
  setEditVideoForm((prev) => ({
    ...prev,
    locations: prev.locations?.filter((l) => l !== loc) || [],
  }))
}

  const handleLocationKeyPress = (e: React.KeyboardEvent, isEdit = false) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (isEdit) {
        addEditLocation()
      } else {
        addLocation()
      }
    }
  }

  const [keywordInput, setKeywordInput] = useState("")
  const [editKeywordInput, setEditKeywordInput] = useState("")

  const addKeyword = () => {
    if (!keywordInput.trim()) return;

    // Split by comma or space → trim → filter empty → lowercase
    const allKeywords = keywordInput
      .split(",") // splits on any space or comma
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
      .map((k) => k.toLowerCase()); // optional: normalize to lowercase

    // Deduplicate
    const uniqueNew = Array.from(new Set(allKeywords));

    // Merge with existing keywords, avoiding duplicates
    const existing = videoForm.keywords || [];
    const finalKeywords = [...existing];

    uniqueNew.forEach((k) => {
      if (!finalKeywords.includes(k)) {
        finalKeywords.push(k);
      }
    });

    setVideoForm((prev) => ({
      ...prev,
      keywords: finalKeywords,
    }));

    setKeywordInput(""); // clear input
  };



  const removeKeyword = (keyword: string) => {
    setVideoForm((prev) => ({
      ...prev,
      keywords: prev.keywords?.filter((k) => k !== keyword) || [],
    }))
  }
  const addEditKeyword = () => {
    if (!editKeywordInput.trim()) return;

    // Split by comma or space → trim → filter empty → lowercase
    const allKeywords = editKeywordInput
      .split(",") // split on space or comma
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
      .map((k) => k.toLowerCase()); // optional lowercase

    // Deduplicate
    const uniqueNew = Array.from(new Set(allKeywords));

    // Merge with existing keywords, avoiding duplicates
    const existing = editVideoForm.keywords || [];
    const finalKeywords = [...existing];

    uniqueNew.forEach((k) => {
      if (!finalKeywords.includes(k)) {
        finalKeywords.push(k);
      }
    });

    setEditVideoForm((prev) => ({
      ...prev,
      keywords: finalKeywords,
    }));

    setEditKeywordInput(""); // clear input
  };


  const handleToggleComments = async (videoId: any) => {
    try {
      const reponse = await toggleCommentOnVideo(videoId);

      if (reponse?.status === 200) {
        setUpdateSuccess("Comments toggled successfully!");
        fetchUserVideos(); // Refresh video list to reflect changes
      }
    } catch (error: any) {
      console.error("Error toggling comments:", error);
      setUpdateError(error?.response?.data?.message || "Failed to toggle comments");
    } finally {
      setTimeout(() => setUpdateSuccess(""), 1000);
      setShowActionMenu(null);
    }


  }

  const removeEditKeyword = (keyword: string) => {
    setEditVideoForm((prev) => ({
      ...prev,
      keywords: prev.keywords?.filter((k) => k !== keyword) || [],
    }))
  }

  const handleKeywordKeyPress = (e: React.KeyboardEvent, isEdit = false) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (isEdit) {
        addEditKeyword()
      } else {
        addKeyword()
      }
    }
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

  // Load draft from localStorage when page mounts
useEffect(() => {
    const savedDraft = localStorage.getItem("videoFormDraft")
    if (savedDraft) {
      try {
        setVideoForm(JSON.parse(savedDraft))
      } catch (err) {
        console.error("Error parsing saved draft:", err)
      }
    }
  }, [])

  // Save draft whenever videoForm changes
useEffect(() => {
  localStorage.setItem("videoFormDraft", JSON.stringify(videoForm))
}, [videoForm])


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

  const getThumbnailUrl = (thumbnail: string | File | null | undefined): string => {
  if (!thumbnail) return "/placeholder.svg?height=60&width=80"

  if (typeof thumbnail === "string") {
    return thumbnail // backend URL
  }
  return URL.createObjectURL(thumbnail)
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Video validation function
  // const validateVideo = (file: File): string | null => {
  //   const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov"]
  //   const maxSize = 500 * 1024 * 1024 // 500MB

  //   if (!allowedTypes.includes(file.type)) {
  //     return "Please select a valid video file (MP4, WebM, OGG, AVI, or MOV)"
  //   }

  //   if (file.size > maxSize) {
  //     return "Video size must be less than 250MB"
  //   }

  //   return null
  // }

  // Handle video selection for create form
  const handleVideoSelect = (file: File) => {
    // const error = validateVideo(file)
    // if (error) {
    //   setVideoError(error)
    //   return
    // }

    // setVideoError("")
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
  const fetchUserVideos = useCallback(async () => {
  try {
    setFetchError("")
    const response = await getMyVideos()
    if (response?.data?.videos) {
      const userVideos = response.data.videos.map((video: VideoType) => ({
        ...video,
        createdAt: video.created_at,
        status: video.status,
        views: video.views || 0,
      }))

      setUserData((prev) => ({
        ...prev,
        videos: userVideos,
      }))

      // Update viewVideo if modal is open
      if(viewVideo){
        const updatedVideo = userVideos.find((video: VideoType) => video.id === viewVideo.id)
        if(updatedVideo){
          console.log("Updated video with comments:", updatedVideo.comments)
          console.log("Comments count:", updatedVideo.comments_count)
          setViewVideo(updatedVideo)
          setIsLiked(updatedVideo.is_liked || false)
        }
      }
    }
  } catch (error) {
    console.error("Error fetching user videos:", error)
    setFetchError("Failed to fetch your videos")
  }
}, [viewVideo])

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

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    videoId: number | null
    videoTitle: string
  }>({
    isOpen: false,
    videoId: null,
    videoTitle: "",
  })

  const handleSendForPublish = async (videoId: number) => {
    try {
      setActionLoading(videoId, "approval", true)
      setUpdateError("")
      const response = await publishContent(videoId) // This should be updated to publish directly
      if (response?.status === 200) {
        // Get updated video data from backend
        await fetchUserVideos();
        setUpdateSuccess("Video published successfully!")
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to publish video")
      }
    } catch (error: any) {
      console.error("Error publishing video:", error)
      setUpdateError(error?.response?.data?.message || "Failed to publish video")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(videoId, "approval", false)
      setShowActionMenu(null)
    }
  }

  const handleDeleteVideo = async (videoId: number) => {
    try {
      setActionLoading(videoId, "delete", true)
      setUpdateError("")
      const response = await deleteCretorVideo(videoId)
      if (response?.status === 200) {
        setUserData((prev) => ({
          ...prev,
          videos: prev.videos?.filter((video) => video.id !== videoId) || [],
        }))
        setUpdateSuccess("Video deleted successfully!")
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to delete video")
      }
    } catch (error: any) {
      console.error("Error deleting video:", error)
      setUpdateError(error?.response?.data?.message || "Failed to delete video")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(videoId, "delete", false)
      setShowActionMenu(null)
      setDeleteConfirmation({ isOpen: false, videoId: null, videoTitle: "" })
      fetchUserVideos()
    }
  }

  const openDeleteConfirmation = (videoId: number, videoTitle: string) => {
    setDeleteConfirmation({
      isOpen: true,
      videoId,
      videoTitle,
    })
  }

  const updateVideoStatus = async (videoId: number, newStatus: string) => {
    try {
      setActionLoading(videoId, "status", true)
      setUpdateError("")
      const formData = new FormData()
      formData.append("status", newStatus)
      const response = await updateVideo(videoId, formData)
      if (response?.status === 200 || response?.data) {
        // Get updated video data from backend
        await fetchUserVideos();
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
    //console.log("Edit video clicked:", video.id)
    //console.log("Video data:", video)
    setShowActionMenu(null)
    setUpdateError("")
    setUpdateSuccess("")
    setThumbnailPreview(null)

    const editData = {
      id: video.id,
      title: video.title,
      description: video.description,
      status: video.status || "draft",
      category: video.category || "General",
      videoId: video.video_id || video.id.toString(),
      existingVideoUrl: video.video_url || video.video || "",
      is_draft: video.status === "draft",
      keywords: video.keywords || [],
      locations: video.locations || [],
      thumbnail: video.thumbnail || null,
      age_restricted: video.age_restricted || false,
      brand_tags: video.brand_tags || [],
      paid_promotion: video.paid_promotion || false,
    }

    //console.log("Edit data:", editData)
    setEditVideoForm(editData)
    setOriginalEditData(editData)
    setShowEditModal(true)
  }

  // Handle view video
  const handleViewVideo = async (video: VideoType) => {
    //console.log("View video clicked:", video)
    setShowActionMenu(null)
    setViewVideo(video)
    setVideoLoadError({}) // Reset video load errors
    setShowViewModal(true)
    // Initialize like status
    setIsLiked(video.is_liked || false)
  }

  // Handle like toggle
  const handleToggleLike = async () => {

    console.log("Like toggle");
    if (!viewVideo) return

    setIsLiked((prev) => !prev)
    try {

      const response = await toggleVideoLike(viewVideo.id)
      if (response?.status === 200 || response?.success === true) {
        // Get updated video data from backend
        await fetchUserVideos();
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  // Handle add comment
  const handleAddComment = async () => {
    if (!viewVideo || !newComment.trim()) return

    console.log("Adding comment:", newComment.trim())
    console.log("Current viewVideo comments before:", viewVideo.comments?.length || 0)
    setIsAddingComment(true)
    try {
      const response = await addCommentToVideo(viewVideo.id, newComment.trim())
      console.log("Add comment response:", response)
      if (response?.status === 201 || response?.success === true) {
        setNewComment("")
        // Get updated video data from backend - this will automatically update viewVideo
        console.log("Fetching updated video data...")
        await fetchUserVideos()
        console.log("Fetch completed")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsAddingComment(false)
    }
  }

  // Handle edit comment
  const handleEditComment = async () => {
    if (!viewVideo || !editingCommentId || !editCommentText.trim()) return

    setIsEditingComment(true)
    try {
      const response = await editVideoComment(editingCommentId, editCommentText.trim())
      if (response?.status === 200 || response?.success === true) {
        setEditingCommentId(null)
        setEditCommentText("")
        // Get updated video data from backend - this will automatically update viewVideo
        await fetchUserVideos()
      }
    } catch (error) {
      console.error("Error editing comment:", error)
    } finally {
      setIsEditingComment(false)
    }
  }

  // Handle delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!viewVideo) return

    setDeletingCommentId(commentId)
    try {
      const response = await deleteVideoComment(commentId)
      if (response?.status === 200 || response?.success === true) {
        // Get updated video data from backend - this will automatically update viewVideo
        await fetchUserVideos()
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
    } finally {
      setDeletingCommentId(null)
    }
  }

  // Start editing a comment
  const startEditComment = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId)
    setEditCommentText(currentText)
  }

  // Cancel editing
  const cancelEditComment = () => {
    setEditingCommentId(null)
    setEditCommentText("")
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

      const currentKeywords = editVideoForm.keywords || []
      const originalKeywords = originalEditData.keywords || []
      if (JSON.stringify(currentKeywords.sort()) !== JSON.stringify(originalKeywords.sort())) {
        formData.append("keywords", JSON.stringify(currentKeywords))
        hasChanges = true
      }

      const currentLocations = editVideoForm.locations || []
      const originalLocations = originalEditData.locations || []
      if (JSON.stringify(currentLocations.sort()) !== JSON.stringify(originalLocations.sort())) {
        formData.append("locations", JSON.stringify(currentLocations))
        hasChanges = true
      }

      if (editVideoForm.age_restricted !== originalEditData.age_restricted) {
        formData.append("age_restricted", editVideoForm.age_restricted ? "true" : "false")
        hasChanges = true
      }

      // Compare brand tags
      const currentBrandTags = editVideoForm.brand_tags || []
      const originalBrandTags = originalEditData.brand_tags || []
      if (JSON.stringify(currentBrandTags.sort()) !== JSON.stringify(originalBrandTags.sort())) {
        formData.append("brand_tags", JSON.stringify(currentBrandTags))
        hasChanges = true
      }

      // Compare paid_promotion
      if (editVideoForm.paid_promotion !== originalEditData.paid_promotion) {
        formData.append("paid_promotion", editVideoForm.paid_promotion ? "true" : "false")
        hasChanges = true
      }

      if (editVideoForm.thumbnail instanceof File) {
        formData.append("thumbnail", editVideoForm.thumbnail)
        hasChanges = true
      } else if (editVideoForm.thumbnail === null && originalEditData.thumbnail !== null) {
        // Thumbnail removed
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
        const updatedVideo: Partial<VideoType> = {
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
            is_draft: true,
            keywords: [],
            thumbnail: null,
            age_restricted: false,
          })
          setOriginalEditData({
            id: 0,
            title: "",
            description: "",
            status: "draft",
            category: "General",
            videoId: "",
            existingVideoUrl: "",
            thumbnail: null,
            is_draft: true,
            keywords: [],
            age_restricted: false,
          })
          setEditKeywordInput("")
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

  if (
    isScheduled &&
    (!scheduledAt ||
      scheduledAt < new Date(Date.now() + 5 * 60 * 1000) ||
      scheduledAt > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  ) {
    setCreateError("Please select a valid future date and time for scheduling.")
    return
  }

  setIsCreating(true)
  let uploadToastId: string | null = null

  try {

    setShowCreateModal(false)

    // Show "Processing" toast immediately
    if (uploadToastId) removeToast(uploadToastId);
    uploadToastId = addToast({
      type: 'loading',
      message: 'Processing video...',
      description: 'Please wait while we prepare your upload.',
    })

    const formData = new FormData()
    formData.append("title", videoForm.title.trim())
    formData.append("description", videoForm.description.trim())
    formData.append("is_draft", videoForm.is_draft ? "true" : "false")
    formData.append("age_restricted", videoForm.age_restricted ? "true" : "false")
    formData.append("paid_promotion", videoForm.paid_promotion ? "true" : "false")

    if (videoForm.brand_tags && videoForm.brand_tags.length > 0) {
      formData.append("brand_tags", JSON.stringify(videoForm.brand_tags))
    }

    formData.append("video", videoForm.video)
    if (videoForm.keywords && videoForm.keywords.length > 0) {
      formData.append("keywords", JSON.stringify(videoForm.keywords))
    }

    if (videoForm.locations && videoForm.locations.length > 0) {
      formData.append("locations", JSON.stringify(videoForm.locations))
    }

    if (videoForm.thumbnail) {
      formData.append("thumbnail", videoForm.thumbnail)
    }

    if (scheduledAt && isScheduled) {
      formData.append("scheduled_at", scheduledAt.toISOString())
    }

    const response = await createVideo(formData)

    if (response?.status === 202 && response?.data?.task_id) {
      if (response?.data?.video_id) {
        setCreatedVideoId(response.data.video_id.toString());
      }
      // Create uploading toast
       updateToast(uploadToastId, {
        type: 'loading',
        message: 'Starting Upload...',
        description: 'Preparing your video for upload.',
      })

      // Start polling for task status
      const taskId = response.data.task_id
      setPollingTaskId(taskId)

      // Poll every 2 seconds
      pollingIntervalRef.current = setInterval(() => {
        pollTaskStatus(taskId, uploadToastId!)
      }, 2000)

      // Initial poll
      pollTaskStatus(taskId, uploadToastId)

      // Reset form
      localStorage.removeItem("videoFormDraft")
      setVideoForm({
        title: "",
        description: "",
        video: null,
        thumbnail: null,
        is_draft: false,
        keywords: [],
        locations: [],
        age_restricted: false,
        brand_tags: [],
        paid_promotion: false,
      })
      setVideoPreview(null)
      setVideoError("")
      setKeywordInput("")
      setLocationInput("")
      setBrandTagInput("")
      if (videoInputRef.current) {
        videoInputRef.current.value = ""
      }
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = ""
      }

    } else {
      setCreateError("Failed to create video. Please try again.")
    }
  } catch (error: any) {
    console.error("Error creating video:", error)
    setCreateError(error?.response?.data?.message || "Failed to create video. Please try again.")

    // Show error toast if upload toast was created
    if (uploadToastId !== null)  {
      updateToast(uploadToastId, {
        type: 'error',
        message: 'Upload Failed',
        description: error?.response?.data?.message || 'Failed to start video upload.'
      })
      setTimeout(() => removeToast(uploadToastId!), 7000)
    }
  } finally {
    setIsCreating(false)
  }
}

  const handleFormChange = (field: keyof CreateVideoData, value: string | boolean) => {
    setVideoForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (createError) {
      setCreateError("")
    }
  }

  const handleEditFormChange = (field: keyof EditVideoData, value: string | boolean) => {
    setEditVideoForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (updateError) {
      setUpdateError("")
    }
  }

  // -------------------- BRAND TAG HANDLERS --------------------
const addBrandTag = () => {
  if (!brandTagInput.trim()) return

  const allTags = brandTagInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

  const uniqueNew = Array.from(new Set(allTags))
  const existing = videoForm.brand_tags || []
  const finalTags = [...existing]

  uniqueNew.forEach((tag) => {
    if (!finalTags.includes(tag)) {
      finalTags.push(tag)
    }
  })

  setVideoForm((prev) => ({
    ...prev,
    brand_tags: finalTags,
  }))
  setBrandTagInput("")
}

const removeBrandTag = (tag: string) => {
  setVideoForm((prev) => ({
    ...prev,
    brand_tags: prev.brand_tags?.filter((t) => t !== tag) || [],
  }))
}

const addEditBrandTag = () => {
  if (!editBrandTagInput.trim()) return

  const allTags = editBrandTagInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

  const uniqueNew = Array.from(new Set(allTags))
  const existing = editVideoForm.brand_tags || []
  const finalTags = [...existing]

  uniqueNew.forEach((tag) => {
    if (!finalTags.includes(tag)) {
      finalTags.push(tag)
    }
  })

  setEditVideoForm((prev) => ({
    ...prev,
    brand_tags: finalTags,
  }))
  setEditBrandTagInput("")
}

const removeEditBrandTag = (tag: string) => {
  setEditVideoForm((prev) => ({
    ...prev,
    brand_tags: prev.brand_tags?.filter((t) => t !== tag) || [],
  }))
}

const handleBrandTagKeyPress = (e: React.KeyboardEvent, isEdit = false) => {
  if (e.key === "Enter") {
    e.preventDefault()
    if (isEdit) {
      addEditBrandTag()
    } else {
      addBrandTag()
    }
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

    return status || "draft"
  }

  // Get active (non-archived) videos
  const activeVideos =
    userData.videos?.filter((item) => (!item.archived && item.status === "published") || item.status === "draft") || []

  // Get archived videos
  const archivedVideos = userData.videos?.filter((item) => item.archived) || []

  const rejectedVideos = userData.videos?.filter((item) => item.status === "rejected") || []

  // Filter content based on active tab and search/filter criteria
  const getFilteredContent = () => {
    const sourceVideos =
      activeTab === "active" ? activeVideos : activeTab === "archived" ? archivedVideos : rejectedVideos

    return sourceVideos.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && getPlainTextDescription(item.description).toLowerCase().includes(searchTerm.toLowerCase()))

      if (activeTab === "archived" || activeTab === "rejected") {
        return matchesSearch // For archived and rejected tabs, just match search
      }

      // For active tab, also apply status filter
      const matchesFilter = filterStatus === "all" || item.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }

  const filteredContent = getFilteredContent()

  const handleArchiveVideo = async (videoId: number) => {
    try {
      setActionLoading(videoId, "archive", true)
      setUpdateError("")
      const response = await archiveVideo(videoId)
      if (response?.status === 200) {
        // Get updated video data from backend
        await fetchUserVideos();
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

  const handleUnarchiveVideo = async (videoId: number) => {
    try {
      setActionLoading(videoId, "unarchive", true)
      setUpdateError("")
      const response = await unarchiveVideo(videoId)
      if (response?.status === 200) {
        // Get updated video data from backend
        await fetchUserVideos();
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

  const handleThumbnailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    setThumbnailPreview(URL.createObjectURL(file))
        setVideoForm((prev) => ({ ...prev, thumbnail: file }))
      }
    }

    const handleThumbnailDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsThumbnailDragOver(true)
    }

    const handleThumbnailDragLeave = () => setIsThumbnailDragOver(false)

    const handleThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsThumbnailDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        setThumbnailPreview(URL.createObjectURL(file))
        setVideoForm((prev) => ({ ...prev, thumbnail: file }))
      }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      <div className="fixed top-4 right-4 z-[100] max-w-md">
        {toasts.map((toast) => {
          console.log('Rendering toast:', toast.id, toast.message)
          return (
            <div
              key={toast.id}
              className={`flex items-start space-x-3 p-4 rounded-lg border shadow-lg mb-3 animate-slide-in-right ${
                toast.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : toast.type === 'error'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex-shrink-0">
                {toast.type === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                {toast.type === 'error' && <AlertCircleIcon className="w-5 h-5 text-red-600" />}
                {toast.type === 'loading' && <LoaderIcon className="w-5 h-5 text-blue-600 animate-spin" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{toast.message}</p>
                {toast.description && <p className="text-sm text-gray-600 mt-1">{toast.description}</p>}
              </div>
              {toast.type !== 'loading' && (
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <main className="max-w-full mx-auto p-1 md:px-2 lg:px-2 md:py-4">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-xl md:text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-800 via-red-500 to-purple-900 bg-clip-text text-transparent mb-2 sm:mb-3">
                  Video Management
                </h1>
                <p className="text-slate-600 text-sm md:text-base lg:text-lg">
                  Manage Your Videos and track your performance.
                </p>
              </div>
              <div className="flex justify-center sm:justify-end">
                <div className="w-10 h-10 md:w-12 md:h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <VideoIcon className="w-5 h-5 md:w-6 md:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-slate-600">Total Active</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">{activeVideos.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <VideoIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-slate-600">Published</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">
                  {activeVideos.filter((item) => item.status === "published").length}
                </p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-slate-600">Archived</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">{archivedVideos.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <ArchiveIcon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 lg:p-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-slate-800">Your Videos</h3>
              <button
                className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm lg:text-base"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Upload New Video</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-col md:flex-row space-x-1 bg-slate-100 p-2 rounded-lg mb-4">
              <button
                onClick={() => {
                  setActiveTab("active")
                  setFilterStatus("all")
                }}
                className={`flex-1 px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors ${activeTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <div className="flex items-center justify-center space-x-1 cursor-pointer lg:space-x-2">
                  <VideoIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Active Videos</span>
                  <span className="sm:hidden">Active</span>
                  <span className="bg-slate-200 text-slate-700 px-1.5 lg:px-2 py-0.5 rounded-full text-xs">
                    {activeVideos.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("archived")
                  setFilterStatus("all")
                }}
                className={`flex-1 px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors ${activeTab === "archived" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <div className="flex items-center justify-center cursor-pointer space-x-1 lg:space-x-2">
                  <ArchiveIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Archived</span>
                  <span className="sm:hidden">Archive</span>
                  <span className="bg-slate-200 text-slate-700 px-1.5 lg:px-2 py-0.5 rounded-full text-xs">
                    {archivedVideos.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("rejected")
                  setFilterStatus("all")
                }}
                className={`flex-1 px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors ${activeTab === "rejected" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <div className="flex items-center justify-center cursor-pointer space-x-1 lg:space-x-2">
                  <XIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Rejected</span>
                  <span className="sm:hidden">Reject</span>
                  <span className="bg-red-100 text-red-700 px-1.5 lg:px-2 py-0.5 rounded-full text-xs">
                    {rejectedVideos.length}
                  </span>
                </div>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab} videos...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
                />
              </div>
              {activeTab === "active" && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 lg:px-4 py-2 border cursor-pointer border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base min-w-0 sm:min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              )}
            </div>
          </div>

          <div className="p-3 lg:p-6">
            {filteredContent.length > 0 ? (
              <div className="space-y-3 lg:space-y-4">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:p-4 border md:border border-slate-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-200 gap-3 sm:gap-4"
                  >
                    <div className="flex flex-col sm:flex-row md:items-start space-y-3 sm:space-y-0 sm:space-x-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewVideo(item)
                      }}
                    >
                      {/* Video Thumbnail */}
                      {item.thumbnail && (
                        <div className="flex-shrink-0 relative">
                          <div className="relative w-full h-40 sm:h-32 sm:w-48 rounded-t-lg sm:rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                            <Image
                              src={getThumbnailUrl(item.thumbnail) || "/placeholder.svg?height=60&width=80"}
                              alt={item.title}
                              fill
                              className="md:rounded-lg object-cover w-16 h-12 sm:w-20 sm:h-15 lg:w-20 lg:h-15"
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-black/50 rounded-full flex items-center justify-center">
                              <PlayIcon className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white ml-0.5" />
                            </div>
                          </div>
                          {item.duration && (
                            <div className="absolute bottom-0.5 right-0.5 lg:bottom-1 lg:right-1 bg-black/70 text-white text-xs px-1 rounded">
                              {item.duration_formatted}
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className="flex-1 cursor-pointer p-2 min-w-0"
                      >
                        <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-2 sm:gap-3 mb-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-800 text-sm lg:text-base line-clamp-2">
                              {item.title}
                            </h4>
                            <div className="sm:hidden relative action-menu-container flex-shrink-0 self-start sm:self-center">
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
                                <div className="absolute right-0 top-full mt-1 w-48 lg:w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                                  {/* View button - always show except for rejected */}

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

                                  {/* Edit button - show for non-archived videos */}
                                  {!isArchived(item) && (
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

                                  {!isArchived(item) && item.status === "draft" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSendForPublish(item.id)
                                      }}
                                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-blue-50 text-blue-600 transition-colors"
                                      disabled={isActionLoading(item.id, "approval")}
                                    >
                                      {isActionLoading(item.id, "approval") ? (
                                        <LoaderIcon className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <SendIcon className="w-4 h-4" />
                                      )}
                                      <span>{isActionLoading(item.id, "approval") ? "Publishing..." : "Publish"}</span>
                                    </button>
                                  )}
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
                                  {!isArchived(item) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleArchiveVideo(item.id)
                                      }}
                                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-orange-50 text-orange-600 transition-colors"
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
                                      <span>
                                        {isActionLoading(item.id, "unarchive") ? "Unarchiving..." : "Unarchive"}
                                      </span>
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openDeleteConfirmation(item.id, item.title)
                                    }}
                                    className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 transition-colors"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {item.is_scheduled ? (
                            <div className="text-xs text-blue-600 font-medium flex items-center space-x-1 bg-blue-100 border border-blue-200 px-2 py-1 rounded-full w-fit">
                              <ClockIcon className="w-3 h-3" />
                              <span>Scheduled for {new Date(item.scheduled_at + "z").toLocaleString()}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
  <span
    className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 w-fit ${getStatusColor(
      item.status || "draft",
      isArchived(item),
    )}`}
  >
    {getStatusIcon(item.status || "draft", isArchived(item))}
    <span>{getStatusText(item.status || "draft", isArchived(item))}</span>
  </span>

  {item.age_restricted && (
    <span className="inline-flex items-center px-2 py-1 text-[11px] font-semibold bg-red-100 text-red-700 rounded-full border border-red-300">
      🔞 18+
    </span>
  )}
</div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs text-slate-500">
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
                            <span>👍 {item.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>💬 {item.comments_count}</span>
                          </span>
                        </div>

                        {item.status === "rejected" && item.reason_for_rejection && (
                          <div className="my-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <XIcon className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                                <p className="text-sm text-red-700">{item.reason_for_rejection}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="hidden sm:block relative action-menu-container flex-shrink-0 self-start sm:self-center">
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
                        <div className="absolute right-0 top-full mt-1 w-48 lg:w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                          {/* View button - always show except for rejected */}

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewVideo(item)
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span>View </span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleComments(item.id)
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                          >
                            {item.show_comments ? <><MessageCircleOff className="w-4 h-4" /> <span >Turn off comment</span></> :
                              <><MessageCircleIcon className="w-4 h-4" /> <span> Turn on comment</span> </>
                            }
                          </button>
  <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/viewer/video/${item.slug || item.id}`;

    async function copyToClipboard() {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }

    copyToClipboard();
  }}
  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
  title="Copy share link"
>
  {copied ? (
    <>
      <Check className="w-4 h-4 text-green-600" />
      <span>Copied!</span>
    </>
  ) : (
    <>
      <Share2 className="w-4 h-4" />
      <span>Share</span>
    </>
  )}
</button>


                          {/* Edit button - show for non-archived videos */}
                          {!isArchived(item) && (
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

                          {!isArchived(item) && item.status === "draft" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSendForPublish(item.id)
                              }}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-blue-50 text-blue-600 transition-colors"
                              disabled={isActionLoading(item.id, "approval")}
                            >
                              {isActionLoading(item.id, "approval") ? (
                                <LoaderIcon className="w-4 h-4 animate-spin" />
                              ) : (
                                <SendIcon className="w-4 h-4" />
                              )}
                              <span>{isActionLoading(item.id, "approval") ? "Publishing..." : "Publish"}</span>
                            </button>
                          )}
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
                          {!isArchived(item) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleArchiveVideo(item.id)
                              }}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-orange-50 text-orange-600 transition-colors"
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openDeleteConfirmation(item.id, item.title)
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 transition-colors"
                          >
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
                    className="inline-flex cursor-pointer items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0  bg-black/50 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Delete Video</h3>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete "{deleteConfirmation.videoTitle}"? This action cannot be undone.
            </p>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteConfirmation({ isOpen: false, videoId: null, videoTitle: "" })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirmation.videoId && handleDeleteVideo(deleteConfirmation.videoId)}
                disabled={deleteConfirmation.videoId ? isActionLoading(deleteConfirmation.videoId, "delete") : false}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {deleteConfirmation.videoId && isActionLoading(deleteConfirmation.videoId, "delete") ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <form className="p-6">
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
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isVideoDragOver ? "border-purple-500 bg-purple-50" : "border-slate-300 hover:border-slate-400"
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
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Custom Thumbnail (optional)
                    </label>

                    {/* Preview */}
                      {thumbnailPreview && (
                        <div className="mb-4">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-full rounded-lg border border-slate-200 object-contain"
                            style={{ maxHeight: "500px" }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnailPreview(null)
                              setVideoForm((prev) => ({ ...prev, thumbnail: null }))
                              if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""
                            }}
                            className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                            disabled={isCreating}
                          >
                            Remove Thumbnail
                          </button>
                        </div>
                      )}

                    {/* Upload Area */}
                    {!thumbnailPreview && (
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          isThumbnailDragOver ? "border-purple-500 bg-purple-50" : "border-slate-300 hover:border-slate-400"
                        } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                        onDragOver={!isCreating ? handleThumbnailDragOver : undefined}
                        onDragLeave={!isCreating ? handleThumbnailDragLeave : undefined}
                        onDrop={!isCreating ? handleThumbnailDrop : undefined}
                      >
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-lg text-slate-600 mb-2">
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
                        {stripHtmlTags(videoForm.description).length}/5000 characters (minimum 10 required)
                      </p>
                      {stripHtmlTags(videoForm.description).length < 10 &&
                        stripHtmlTags(videoForm.description).length > 0 && (
                          <p className="text-xs text-red-500">Minimum 10 characters required</p>
                        )}
                    </div>
                  </div>

                 {/* Location Input */}
<div>
  <label htmlFor="locations" className="block text-sm font-medium text-slate-700 mb-2">
    Locations (Optional)
  </label>
  <div className="flex gap-2 mb-3">
    <input
      type="text"
      id="locations"
      value={locationInput}
      onChange={(e) => setLocationInput(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
      placeholder="Add a location..."
      disabled={isCreating}
    />
    <button
      type="button"
      onClick={addLocation}
      disabled={!locationInput.trim() || isCreating}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add
    </button>
  </div>

  {videoForm.locations && videoForm.locations.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {videoForm.locations.map((locations, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
        >
          {locations}
          <button
            type="button"
            onClick={() => removeLocation(locations)}
            disabled={isCreating}
            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors disabled:opacity-50"
          >
            <XIcon className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  )}
</div>

{/* Paid Promotion Toggle */}
<div className="flex items-center gap-2 mt-4">
  <input
    type="checkbox"
    id="paidPromotion"
    checked={videoForm.paid_promotion}
    onChange={(e) => handleFormChange("paid_promotion", e.target.checked)}
    className="w-4 h-4 accent-purple-600"
  />
  <label htmlFor="paidPromotion" className="text-sm text-slate-700">
    Contains paid promotion
  </label>
</div>

{/* Brand Tags Input */}
<div className="mt-4">
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Brand Tags
  </label>
  <div className="flex items-center gap-2">
    <input
      type="text"
      value={brandTagInput}
      onChange={(e) => setBrandTagInput(e.target.value)}
      onKeyDown={(e) => handleBrandTagKeyPress(e)}
      placeholder="Add brand names (comma separated or Enter)"
      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
    />
    <button
      type="button"
      onClick={addBrandTag}
      disabled={!brandTagInput.trim() || isCreating}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add
    </button>
  </div>

  {videoForm.brand_tags && videoForm.brand_tags.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {videoForm.brand_tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeBrandTag(tag)}
            className="hover:bg-purple-200 rounded-full p-0.5"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )}
</div>

                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 mb-2">
                      Keywords (Optional)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id="keywords"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => handleKeywordKeyPress(e)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Add a keyword..."
                        disabled={isCreating}
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        disabled={!keywordInput.trim() || isCreating}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                    {videoForm.keywords && videoForm.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {videoForm.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              disabled={isCreating}
                              className="hover:bg-purple-200 rounded-full p-0.5 transition-colors disabled:opacity-50"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Press Enter or click Add to add keywords. You can add multiple keywords at once by separating them with a comma. Click × to remove a keyword.
                  </p>
                </div>

                <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="age_restricted"
                  checked={videoForm.age_restricted || false}
                  onChange={(e) => handleFormChange("age_restricted", e.target.checked)}
                  className="
                    w-5 h-5
                    accent-indigo-600
                    cursor-pointer
                    rounded
                    appearance-none
                    border border-slate-300
                    checked:bg-indigo-600
                    checked:border-indigo-600
                    relative
                  "
                />
                Mark as Age Restricted (not for kids)
              </label>
            </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="is_scheduled"
                      checked={isScheduled}
                      onChange={(e) => {
                        setIsScheduled(e.target.checked)
                        if (!e.target.checked) {
                          setScheduledAt(null)
                        }
                      }}
                      className="
        w-5 h-5
        accent-indigo-600
        cursor-pointer
        rounded
        appearance-none
        border border-slate-300
        checked:bg-indigo-600
        checked:border-indigo-600
        relative
      "
                    />
                    Schedule Publish
                  </label>
                  {isScheduled && <Scheduler value={scheduledAt} onChange={setScheduledAt}></Scheduler>}
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="is_draft"
                      checked={videoForm.is_draft}
                      className="
                      w-5 h-5
                      accent-indigo-600
                      cursor-pointer
                      rounded
                      appearance-none
                      border border-slate-300
                      checked:bg-indigo-600
                      checked:border-indigo-600
                      relative
                    "
                    onChange={(e) => handleFormChange("is_draft", e.target.checked)}
                    />
                    Save as Draft
                  </label>
                </div>



                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setVideoPreview(null)
                      setThumbnailPreview(null)
                      setVideoError("")
                      setCreateError("")
                      setCreateSuccess("")
                      setKeywordInput("")
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
                      stripHtmlTags(videoForm.description).length < 10 ||
                      !videoForm.video
                    }
                    onClick={handleCreateVideo}
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
                    setEditKeywordInput("")
                    setThumbnailPreview(null)
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

                  {/* Thumbnail Upload */}
                    <div>
                      <label htmlFor="edit-thumbnail" className="block text-sm font-medium text-slate-700 mb-2">
                        Thumbnail
                      </label>
                      <div className="mb-3">
                        {thumbnailPreview ? (

                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail Preview"
                            className="w-48 h-28 object-cover rounded-lg border"
                          />
                        ) : editVideoForm.thumbnail && typeof editVideoForm.thumbnail === "string" ? (
                          <img
                            src={editVideoForm.thumbnail}
                            alt="Current Thumbnail"
                            className="w-48 h-28 object-cover rounded-lg border"
                          />
                        ) : (
                          <p className="text-xs text-slate-500">No thumbnail selected</p>
                        )}
                      </div>

                      <input
                        type="file"
                        id="edit-thumbnail"
                        accept="image/*"
                        onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setEditVideoForm((prev) => ({
                            ...prev,
                            thumbnail: file,
                          }))
                          setThumbnailPreview(URL.createObjectURL(file)) // preview URL
                        }
                      }}

                        disabled={isUpdating}
                        className="block w-full text-sm text-slate-600
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-purple-50 file:text-purple-700
                                  hover:file:bg-purple-100"
                      />
                      {/* Remove Thumbnail Button */}
{(thumbnailPreview || editVideoForm.thumbnail) && (
  <div className="mt-3">
    <button
      type="button"
      onClick={() => {
        setThumbnailPreview(null)
        setEditVideoForm((prev) => ({ ...prev, thumbnail: null }))
      const fileInput = document.getElementById('edit-thumbnail') as HTMLInputElement
          if (fileInput) {
            fileInput.value = ''
          }
        }}
      disabled={isUpdating}
      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg
                 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Remove Thumbnail
    </button>
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
                        {stripHtmlTags(editVideoForm.description).length}/5000 characters (minimum 10 required)
                      </p>
                      {stripHtmlTags(editVideoForm.description).length < 10 &&
                        stripHtmlTags(editVideoForm.description).length > 0 && (
                          <p className="text-xs text-red-500">Minimum 10 characters required</p>
                        )}
                    </div>
                  </div>

{/* Location Input - Add this section */}
<div>
  <label htmlFor="edit-locations" className="block text-sm font-medium text-slate-700 mb-2">
    Locations (Optional)
  </label>
  <div className="flex gap-2 mb-3">
    <input
      type="text"
      id="edit-locations"
      value={editLocationInput}
      onChange={(e) => setEditLocationInput(e.target.value)}
      onKeyPress={(e) => handleLocationKeyPress(e, true)}
      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
      placeholder="Add a location..."
      disabled={isUpdating}
    />
    <button
      type="button"
      onClick={addEditLocation}
      disabled={!editLocationInput.trim() || isUpdating}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add
    </button>
  </div>

  {editVideoForm.locations && editVideoForm.locations.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {editVideoForm.locations.map((locations, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
        >
          {locations}
          <button
            type="button"
            onClick={() => removeEditLocation(locations)}
            disabled={isUpdating}
            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors disabled:opacity-50"
          >
            <XIcon className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  )}
</div>

{/* Paid Promotion Toggle */}
<div className="flex items-center gap-2 mt-4">
  <input
    type="checkbox"
    id="editPaidPromotion"
    checked={editVideoForm.paid_promotion}
    onChange={(e) => handleEditFormChange("paid_promotion", e.target.checked)}
    className="w-4 h-4 accent-purple-600"
  />
  <label htmlFor="editPaidPromotion" className="text-sm text-slate-700">
    Contains paid promotion
  </label>
</div>

{/* Brand Tags Input */}
<div className="mt-4">
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Brand Tags
  </label>
  <div className="flex items-center gap-2">
    <input
      type="text"
      value={editBrandTagInput}
      onChange={(e) => setEditBrandTagInput(e.target.value)}
      onKeyDown={(e) => handleBrandTagKeyPress(e, true)}
      placeholder="Add brand names"
      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
    />
    <button
      type="button"
      onClick={addEditBrandTag}
      disabled={!editBrandTagInput.trim() || isUpdating}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add
    </button>
  </div>

  {editVideoForm.brand_tags && editVideoForm.brand_tags.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {editVideoForm.brand_tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeEditBrandTag(tag)}
            className="rounded-full p-0.5"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )}
</div>

                  <div>
                    <label htmlFor="edit-keywords" className="block text-sm font-medium text-slate-700 mb-2">
                      Keywords (Optional)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id="edit-keywords"
                        value={editKeywordInput}
                        onChange={(e) => setEditKeywordInput(e.target.value)}
                        onKeyPress={(e) => handleKeywordKeyPress(e, true)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Add a keyword..."
                        disabled={isUpdating}
                      />
                      <button
                        type="button"
                        onClick={addEditKeyword}
                        disabled={!editKeywordInput.trim() || isUpdating}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                    {editVideoForm.keywords && editVideoForm.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editVideoForm.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeEditKeyword(keyword)}
                              disabled={isUpdating}
                              className="hover:bg-purple-200 rounded-full p-0.5 transition-colors disabled:opacity-50"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Press Enter or click Add to add keywords. You can add multiple keywords at once by separating them with a comma. Click × to remove a keyword.
                    </p>
                  </div>

                  <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editVideoForm.age_restricted || false}
                    onChange={(e) => handleEditFormChange("age_restricted", e.target.checked)}
                    disabled={isUpdating}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Mark as age restricted</span>
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  If enabled, this video will be shown with an <span className="font-semibold text-red-600">18+</span> badge.
                </p>
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
                      setEditKeywordInput("")
                      setThumbnailPreview(null)
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
            <div className=" p-4 border-b border-gray-200">
              <div className="flex items-center justify-between ">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800">View Video</h3>
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
            <div className="p-4 md:p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
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

              <div>
                <div className="flex items-start justify-between mb-4">
  <div className="flex flex-col space-y-2 flex-1">
    <div className="flex items-center flex-wrap gap-2">
      <h4 className="text-2xl sm:text-3xl font-bold text-slate-800">{viewVideo.title}</h4>

      {viewVideo.paid_promotion && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
          💰 Paid Promotion
        </span>
      )}
    </div>
  </div>

<div className="flex items-center gap-2">
  <button
    onClick={handleToggleLike}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
      isLiked
        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
    title={isLiked ? "Unlike this video" : "Like this video"}
  >
    <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
    <span>{isLiked ? 'Liked' : 'Like'}</span>
  </button>

    <button
  onClick={(e) => {
    e.preventDefault();
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/viewer/video/${viewVideo.id}`;

    async function copyToClipboard() {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }

    copyToClipboard();
  }}
  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all duration-200"
  title="Copy share link"
>
  {copied ? (
    <>
      <Check className="w-4 h-4 text-green-600" />
      <span>Copied!</span>
    </>
  ) : (
    <>
      <Share2 className="w-4 h-4" />
      <span>Share</span>
    </>
  )}
  </button>
  </div>
</div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-4">
                  <span className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(viewVideo.created_at).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{viewVideo.views || 0} views</span>
                  </span>
                  <button
                    onClick={handleToggleLike}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      isLiked
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className={isLiked ? '❤️' : '🤍'}>
                      {isLiked ? '❤️' : '🤍'}
                    </span>
                    <span>{viewVideo.likes} likes</span>
                  </button>
                  <span className="flex items-center space-x-1">
                    <span>💬 {viewVideo.comments_count} comments</span>
                  </span>
                </div>
                <div className="mb-4 sm:mb-6">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border flex items-center space-x-1 w-fit ${getStatusColor(
                      viewVideo.status || "draft",
                      isArchived(viewVideo),
                    )}`}
                  >
                    {getStatusIcon(viewVideo.status || "draft", isArchived(viewVideo))}
                    <span>{getStatusText(viewVideo.status || "draft", isArchived(viewVideo))}</span>
                  </span>
                </div>
              </div>

              {/* Video Description */}
              <div className="mb-8">
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Description</h4>
                <div className="prose prose-lg prose-slate max-w-none bg-gray-50 md:p-6 rounded-2xl">
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
                    <div className="flex justify-between">
                      <span className="text-gray-600">Likes:</span>
                      <button
                        onClick={handleToggleLike}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                          isLiked
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={isLiked ? "Unlike this video" : "Like this video"}
                      >
                        <span className="text-sm">
                          {isLiked ? '❤️' : '🤍'}
                        </span>
                        <span className="font-medium text-gray-900">{viewVideo.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Creator Information</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold">
                        {(viewVideo.creator?.username || viewVideo.author?.username || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs md:text-sm">
                        {viewVideo.creator?.username || viewVideo.author?.username}
                      </p>
                      <p className="text-gray-600 text-xs md:text-sm">
                        {viewVideo.creator?.email || viewVideo.author?.email}
                      </p>
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium mt-2">
                        {viewVideo.creator?.role || viewVideo.author?.role}
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>

              {viewVideo.locations && viewVideo.locations.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Location</h4>
  <div className="bg-gray-50 rounded-2xl p-6 theme-border-b">
    <div className="flex flex-wrap gap-2">
      {viewVideo.locations.map((loc: string, idx: number) => (
        <span
          key={`${loc}-${idx}`}
          className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 text-sm font-medium rounded-full border border-purple-200"
        >
         📍 {loc}
        </span>
      ))}
    </div>
  </div>
  </div>
)}

              {viewVideo.keywords && viewVideo.keywords.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Keywords</h4>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex flex-wrap gap-2">
                      {viewVideo.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full border border-emerald-200"
                        >
                          <span className="text-emerald-600 mr-1">#</span>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {viewVideo.brand_tags && viewVideo.brand_tags.length > 0 && (
  <div className="mb-8">
    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Brand Tags</h4>
    <div className="bg-gray-50 rounded-2xl p-6">
      <div className="flex flex-wrap gap-2">
        {viewVideo.brand_tags.map((tag: string, idx: number) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200"
          >
            🏷️ {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
)}


              <div className="mb-8">
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Comments ({viewVideo.comments_count}) {!viewVideo.show_comments && <span className="bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-lg">
                          Comments are disabled
                        </span>}
                </h4>

                {/* Add Comment Section */}
                {viewVideo.show_comments && (
                  <div className="mb-6">
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows={3}
                          disabled={isAddingComment}
                        />
                      </div>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isAddingComment}
                        className="px-6 py-3 mb-1 h-12 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-2xl hover:from-red-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium self-end"
                      >
                        {isAddingComment ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          "Post"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                {viewVideo.comments && viewVideo.comments.length > 0 ? (
                  <div className="space-y-4">
                    {viewVideo.comments
                      .sort((a, b) => {
                        // Show creator's comments first
                        const aIsCreator = a.commenter?.id === user?.id
                        const bIsCreator = b.commenter?.id === user?.id
                        if (aIsCreator && !bIsCreator) return -1
                        if (!aIsCreator && bIsCreator) return 1
                        return 0
                      })
                      .map((comment) => {
                        const isCreator = comment.commenter?.id === user?.id
                        const isEditing = editingCommentId === comment.id

                        return (
                          <div key={comment.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {comment.commenter.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="font-semibold text-gray-900">{comment.commenter.username}</span>
                                  {isCreator && (
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                      You
                                    </span>
                                  )}
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    {comment.commenter.role}
                                  </span>
                                  <span className="text-xs text-gray-500">{formatDate(comment.commented_at)}</span>
                                </div>

                                {isEditing ? (
                                  <div className="space-y-3">
                                    <textarea
                                      value={editCommentText}
                                      onChange={(e) => setEditCommentText(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                      rows={3}
                                      disabled={isEditingComment}
                                    />
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={handleEditComment}
                                        disabled={!editCommentText.trim() || isEditingComment}
                                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                      >
                                        {isEditingComment ? "Saving..." : "Save"}
                                      </button>
                                      <button
                                        onClick={cancelEditComment}
                                        disabled={isEditingComment}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm font-medium"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                                    {isCreator && (
                                      <div className="flex space-x-2 mt-3">
                                        <button
                                          onClick={() => startEditComment(comment.id, comment.comment)}
                                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(comment.id)}
                                          disabled={deletingCommentId === comment.id}
                                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 text-sm font-medium"
                                        >
                                          {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <MessageCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">No comments yet</h4>
                    <p className="text-gray-600">Be the first to comment on this video.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
