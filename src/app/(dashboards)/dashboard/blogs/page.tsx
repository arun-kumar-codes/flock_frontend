"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { archiveBlog, createBlog, getMyBlog, sendForApproval, unarchiveBlog, updateBlog } from "@/api/content"
import {
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  EditIcon,
  EyeIcon,
  CalendarIcon,
  FileTextIcon,
  TrendingUpIcon,
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
} from "lucide-react"
import Image from "next/image"
import { useSelector } from "react-redux"
import TipTapEditor from "@/components/tiptap-editor"
import TipTapContentDisplay from "@/components/tiptap-content-display"
import Loader2 from "@/components/Loader2"

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
  image?: string
  status?: string | null
  archived?: boolean | null
  description?: string
  createdAt?: string
  views?: number
  category?: string
}

interface CreateBlogData {
  title: string
  content: string
  status?: string
  category?: string
  image?: File | null
}

interface EditBlogData extends CreateBlogData {
  id: number
  existingImageUrl?: string
}

const BlogCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between p-6 border border-slate-200 rounded-xl bg-white">
      <div className="flex items-start space-x-4 flex-1">
        <div className="flex-shrink-0 w-20 h-16 bg-slate-200 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-5 bg-slate-200 rounded w-48"></div>
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-3 bg-slate-200 rounded w-24"></div>
            <div className="h-3 bg-slate-200 rounded w-20"></div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
            <div className="h-3 bg-slate-200 rounded w-18"></div>
          </div>
        </div>
      </div>
      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
    </div>
  </div>
)

const StatsCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-8 bg-slate-200 rounded w-12"></div>
        </div>
        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  </div>
)

export default function BlogsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>({
    email: "",
    username: "",
    id: "",
    imageUrl: "",
    content: [],
  })
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
  const [viewBlog, setViewBlog] = useState<Blog | null>(null)

  // Loading states for different actions
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({})

  // Image upload states
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [isEditDragOver, setIsEditDragOver] = useState(false)
  const [removeExistingImage, setRemoveExistingImage] = useState(false)

  // Create blog form state
  const [blogForm, setBlogForm] = useState<CreateBlogData>({
    title: "",
    content: "",
    status: "draft",
    category: "General",
    image: null,
  })

  // Edit blog form state
  const [editBlogForm, setEditBlogForm] = useState<EditBlogData>({
    id: 0,
    title: "",
    content: "",
    status: "draft",
    category: "General",
    image: null,
    existingImageUrl: "",
  })

  // Store original edit form data for comparison
  const [originalEditData, setOriginalEditData] = useState<EditBlogData>({
    id: 0,
    title: "",
    content: "",
    status: "draft",
    category: "General",
    image: null,
    existingImageUrl: "",
  })

  const createModalRef = useRef<HTMLDivElement>(null)
  const editModalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)
  const viewModalRef = useRef<HTMLDivElement>(null)

  const user = useSelector((state: any) => state.user)

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

  // Helper function to set loading state for specific actions
  const setActionLoading = (blogId: number, action: string, loading: boolean) => {
    setLoadingActions((prev) => ({
      ...prev,
      [`${blogId}-${action}`]: loading,
    }))
  }

  // Helper function to check if action is loading
  const isActionLoading = (blogId: number, action: string) => {
    return loadingActions[`${blogId}-${action}`] || false
  }

  // Helper function to safely check if blog is archived
  const isArchived = (blog: Blog): boolean => {
    return blog.archived === true
  }

  // Image validation function
  const validateImage = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
    }

    if (file.size > maxSize) {
      return "Image size must be less than 5MB"
    }

    return null
  }

  // Handle image selection for create form
  const handleImageSelect = (file: File) => {
    const error = validateImage(file)
    if (error) {
      setImageError(error)
      return
    }

    setImageError("")
    setBlogForm((prev) => ({ ...prev, image: file }))

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle image selection for edit form
  const handleEditImageSelect = (file: File) => {
    const error = validateImage(file)
    if (error) {
      setImageError(error)
      return
    }

    setImageError("")
    setEditBlogForm((prev) => ({ ...prev, image: file }))
    setRemoveExistingImage(false)

    const reader = new FileReader()
    reader.onload = (e) => {
      setEditImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle file input change for create
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  // Handle file input change for edit
  const handleEditFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleEditImageSelect(file)
    }
  }

  // Handle drag and drop for create
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  // Handle drag and drop for edit
  const handleEditDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditDragOver(true)
  }

  const handleEditDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditDragOver(false)
  }

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsEditDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleEditImageSelect(file)
    }
  }

  // Remove image for create
  const removeImage = () => {
    setBlogForm((prev) => ({ ...prev, image: null }))
    setImagePreview(null)
    setImageError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remove image for edit
  const removeEditImage = () => {
    setEditBlogForm((prev) => ({ ...prev, image: null }))
    setEditImagePreview(null)
    setRemoveExistingImage(true)
    setImageError("")
    if (editFileInputRef.current) {
      editFileInputRef.current.value = ""
    }
  }

  // Fetch user's blogs
  const fetchUserBlogs = async () => {
    try {
      setFetchError("")
      const response = await getMyBlog()
      //console.log("Fetch blogs response:", response)
      if (response?.data?.blogs) {
        const userBlogs = response.data.blogs
          .filter((blog: Blog) => blog.created_by === user?.id || blog.author?.id === user?.id)
          .map((blog: Blog) => ({
            ...blog,
            description: generateExcerpt(blog.content),
            createdAt: blog.created_at,
            status: blog.status || "draft",
            views: blog.views || 0,
            category: blog.author?.role === "Creator" ? "Programming" : "General",
          }))

        setUserData((prev) => ({
          ...prev,
          content: userBlogs,
        }))
         setIsLoading(false)
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
      setUserData((prev) => ({
        ...prev,
        email: user.email || "",
        username: user.username || "",
        id: user.id || "",
      }))
      fetchUserBlogs()
     
    }
  }, [user])

  // Send blog for approval
  const handleSendForApproval = async (blogId: number) => {
    try {
      setActionLoading(blogId, "approval", true)
      setUpdateError("")
      const response = await sendForApproval(blogId)
      if (response?.status === 200) {
        setUserData((prev) => ({
          ...prev,
          content:
            prev.content?.map((blog) => (blog.id === blogId ? { ...blog, status: "pending_approval" } : blog)) || [],
        }))
        setUpdateSuccess("Blog sent for approval successfully!")
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to send blog for approval")
      }
    } catch (error: any) {
      console.error("Error sending blog for approval:", error)
      setUpdateError(error?.response?.data?.message || "Failed to send blog for approval")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(blogId, "approval", false)
      setShowActionMenu(null)
    }
  }

  // Archive blog
  const handleArchiveBlog = async (blogId: number) => {
    try {
      setActionLoading(blogId, "archive", true)
      setUpdateError("")
      const response = await archiveBlog(blogId)
      if (response?.status === 200) {
        setUserData((prev) => ({
          ...prev,
          content: prev.content?.map((blog) => (blog.id === blogId ? { ...blog, archived: true } : blog)) || [],
        }))
        setUpdateSuccess("Blog archived successfully!")
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to archive blog")
      }
    } catch (error: any) {
      console.error("Error archiving blog:", error)
      setUpdateError(error?.response?.data?.message || "Failed to archive blog")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(blogId, "archive", false)
      setShowActionMenu(null)
    }
  }

  // Unarchive blog
  const handleUnarchiveBlog = async (blogId: number) => {
    try {
      setActionLoading(blogId, "unarchive", true)
      setUpdateError("")
      const response = await unarchiveBlog(blogId)
      if (response?.status === 200) {
        setUserData((prev) => ({
          ...prev,
          content: prev.content?.map((blog) => (blog.id === blogId ? { ...blog, archived: false } : blog)) || [],
        }))
        setUpdateSuccess("Blog unarchived successfully!")
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to unarchive blog")
      }
    } catch (error: any) {
      console.error("Error unarchiving blog:", error)
      setUpdateError(error?.response?.data?.message || "Failed to unarchive blog")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(blogId, "unarchive", false)
      setShowActionMenu(null)
    }
  }

  // Update blog status (draft to published)
  const updateBlogStatus = async (blogId: number, newStatus: string) => {
    try {
      setActionLoading(blogId, "status", true)
      setUpdateError("")
      const response = await updateBlog(blogId, { status: newStatus })
      if (response?.status === 200 || response?.data) {
        setUserData((prev) => ({
          ...prev,
          content: prev.content?.map((blog) => (blog.id === blogId ? { ...blog, status: newStatus } : blog)) || [],
        }))
        setUpdateSuccess(`Blog ${newStatus === "published" ? "published" : "updated"} successfully!`)
        setTimeout(() => setUpdateSuccess(""), 3000)
      } else {
        throw new Error("Failed to update blog status")
      }
    } catch (error: any) {
      console.error("Error updating blog status:", error)
      setUpdateError(error?.response?.data?.message || "Failed to update blog status")
      setTimeout(() => setUpdateError(""), 3000)
    } finally {
      setActionLoading(blogId, "status", false)
      setShowActionMenu(null)
    }
  }

  // Enhanced edit blog handler
  const handleEditBlog = (blog: Blog) => {
    //console.log("Edit blog clicked:", blog.id)
    setShowActionMenu(null)
    setUpdateError("")
    setUpdateSuccess("")
    setImageError("")
    setRemoveExistingImage(false)

    const editData = {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      status: blog.status || "draft",
      category: blog.category || "General",
      image: null,
      existingImageUrl: blog.image || "",
    }

    setEditBlogForm(editData)
    setOriginalEditData(editData) // Store original data for comparison

    const imageUrl = blog.image
    if (imageUrl) {
      setEditImagePreview(imageUrl)
    } else {
      setEditImagePreview(null)
    }

    if (editFileInputRef.current) {
      editFileInputRef.current.value = ""
    }

    setShowEditModal(true)
  }

  // Handle view blog
  const handleViewBlog = (blog: Blog) => {
    //console.log("View blog clicked:", blog.id)
    setShowActionMenu(null)
    setViewBlog(blog)
    setShowViewModal(true)
  }

  // Enhanced update blog handler - only send changed values
  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateError("")
    setUpdateSuccess("")

    // Enhanced validation
    if (!editBlogForm.title.trim()) {
      setUpdateError("Title is required")
      return
    }

    if (editBlogForm.title.trim().length < 3) {
      setUpdateError("Title must be at least 3 characters long")
      return
    }

    if (!editBlogForm.content.trim()) {
      setUpdateError("Content is required")
      return
    }

    if (editBlogForm.content.trim().length < 10) {
      setUpdateError("Content must be at least 10 characters long")
      return
    }

    setIsUpdating(true)

    try {
      // Create FormData only with changed values
      const formData = new FormData()
      let hasChanges = false

      // Check for changes and only add changed fields
      if (editBlogForm.title.trim() !== originalEditData.title) {
        formData.append("title", editBlogForm.title.trim())
        hasChanges = true
      }

      if (editBlogForm.content.trim() !== originalEditData.content) {
        formData.append("content", editBlogForm.content.trim())
        hasChanges = true
      }

      if (editBlogForm.status !== originalEditData.status) {
        formData.append("status", editBlogForm.status || "draft")
        hasChanges = true
      }

      if (editBlogForm.category !== originalEditData.category) {
        formData.append("category", editBlogForm.category || "General")
        hasChanges = true
      }

      // Handle image updates
      if (editBlogForm.image) {
        formData.append("image", editBlogForm.image)
        hasChanges = true
      } else if (removeExistingImage) {
        formData.append("remove_image", "true")
        hasChanges = true
      }

      if (!hasChanges) {
        setUpdateError("No changes detected")
        setIsUpdating(false)
        return
      }

      const response = await updateBlog(editBlogForm.id, formData)

      if (response?.status === 200 || response?.data) {
        const updatedBlog = {
          ...editBlogForm,
          title: editBlogForm.title.trim(),
          content: editBlogForm.content.trim(),
          description: generateExcerpt(editBlogForm.content.trim()),
          image: response.data?.image || (removeExistingImage ? null : editBlogForm.existingImageUrl),
        }

        setUserData((prev) => ({
          ...prev,
          content:
            prev.content?.map((blog) => (blog.id === editBlogForm.id ? { ...blog, ...updatedBlog } : blog)) || [],
        }))

        setUpdateSuccess("Blog updated successfully!")
        setTimeout(() => {
          setShowEditModal(false)
          setUpdateSuccess("")
          setEditImagePreview(null)
          setRemoveExistingImage(false)
          setEditBlogForm({
            id: 0,
            title: "",
            content: "",
            status: "draft",
            category: "General",
            image: null,
            existingImageUrl: "",
          })
          setOriginalEditData({
            id: 0,
            title: "",
            content: "",
            status: "draft",
            category: "General",
            image: null,
            existingImageUrl: "",
          })
        }, 2000)
      } else {
        throw new Error("Failed to update blog")
      }
    } catch (error: any) {
      console.error("Error updating blog:", error)
      setUpdateError(error?.response?.data?.message || error?.message || "Failed to update blog. Please try again.")
    } finally {
      setIsUpdating(false)
    }
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
      const formData = new FormData()
      formData.append("title", blogForm.title.trim())
      formData.append("content", blogForm.content.trim())
      if (blogForm.image) {
        formData.append("image", blogForm.image)
      }

      const response = await createBlog(formData)
      //console.log("Create blog response:", response)

      if (response?.status === 200 || response?.status === 201 || response?.data) {
        setCreateSuccess("Blog created successfully!")
        setBlogForm({
          title: "",
          content: "",
          image: null,
        })
        setImagePreview(null)
        setImageError("")

        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        await fetchUserBlogs()

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
    if (createError) {
      setCreateError("")
    }
  }

  const handleEditFormChange = (field: keyof EditBlogData, value: string) => {
    setEditBlogForm((prev) => ({
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
        return <FileTextIcon className="w-3 h-3" />
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

  // Get active (non-archived) blogs
  const activeBlogs = userData.content?.filter((item) => !isArchived(item)) || []

  // Get archived blogs
  const archivedBlogs = userData.content?.filter((item) => isArchived(item)) || []

  // Filter content based on active tab and search/filter criteria
  const getFilteredContent = () => {
    const sourceBlogs = activeTab === "active" ? activeBlogs : archivedBlogs

    return sourceBlogs.filter((item) => {
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

  if (isLoading) {
    return (
    <Loader2></Loader2>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    Blog Management
                  </h1>
                  <p className="text-slate-600 text-lg">Create, edit, and manage your blog posts with style</p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileTextIcon className="w-8 h-8 text-white" />
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
                    onClick={fetchUserBlogs}
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Active</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {activeBlogs.length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <FileTextIcon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Published</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {activeBlogs.filter((item) => item.status === "published").length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <TrendingUpIcon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pending Approval</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {activeBlogs.filter((item) => item.status === "pending_approval").length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <ClockIcon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Archived</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                      {archivedBlogs.length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <ArchiveIcon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="p-8 border-b border-slate-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Your Blogs
                </h3>
                <button
                  className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create New Blog
                </button>
              </div>

              <div className="flex space-x-2 bg-slate-100/80 p-2 rounded-xl mb-6 backdrop-blur-sm">
                <button
                  onClick={() => {
                    setActiveTab("active")
                    setFilterStatus("all")
                  }}
                  className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    activeTab === "active"
                      ? "bg-white text-slate-900 shadow-lg scale-105"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <FileTextIcon className="w-4 h-4" />
                    <span>Active Blogs</span>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold">
                      {activeBlogs.length}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("archived")
                    setFilterStatus("all")
                  }}
                  className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    activeTab === "archived"
                      ? "bg-white text-slate-900 shadow-lg scale-105"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ArchiveIcon className="w-4 h-4" />
                    <span>Archived</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-bold">
                      {archivedBlogs.length}
                    </span>
                  </div>
                </button>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab} blogs...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-500 shadow-sm"
                />
              </div>
            </div>

            <div className="p-8">
              {filteredContent.length > 0 ? (
                <div className="space-y-4">
                  {filteredContent.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-6 border border-slate-200/50 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        {item.image && (
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={80}
                              height={60}
                              className="rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                            />
                          </div>
                        )}
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewBlog(item)
                          }}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-lg">
                              {item.title}
                            </h4>
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center space-x-1 ${getStatusColor(
                                item.status || "draft",
                                isArchived(item),
                              )}`}
                            >
                              {getStatusIcon(item.status || "draft", isArchived(item))}
                              <span>{getStatusText(item.status || "draft", isArchived(item))}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <span className="flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-lg">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-lg text-blue-700">
                              <EyeIcon className="w-4 h-4" />
                              <span>{item.views} views</span>
                            </span>
                            <span className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-lg text-green-700">
                              <span>👍 {item.likes} likes</span>
                            </span>
                            <span className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-lg text-purple-700">
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
                          className="p-3 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-110"
                          disabled={Object.values(loadingActions).some((loading) => loading)}
                        >
                          <MoreVerticalIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
                        </button>
                        {showActionMenu === item.id && (
                          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-[9999]">
                            {/* View button - always show except for rejected */}
                            {item.status !== "rejected" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewBlog(item)
                                }}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                              >
                                <EyeIcon className="w-4 h-4" />
                                <span>View</span>
                              </button>
                            )}
                            {/* Edit button - show for non-archived blogs */}
                            {!isArchived(item) &&
                              (item.status === "draft" ||
                                item.status === "published" ||
                                item.status === "pending_approval") && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditBlog(item)
                                  }}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                                >
                                  <EditIcon className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                              )}
                            {/* Send for Approval button - only for draft blogs that are not archived */}
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
                            {/* Publish button - only for approved blogs that are not archived */}
                            {!isArchived(item) && item.status === "approved" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateBlogStatus(item.id, "published")
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
                            {/* Archive button - only for non-archived blogs */}
                            {!isArchived(item) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleArchiveBlog(item.id)
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
                            {/* Unarchive button - only for archived blogs */}
                            {isArchived(item) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUnarchiveBlog(item.id)
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
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    {activeTab === "active" ? (
                      <FileTextIcon className="w-10 h-10 text-slate-400" />
                    ) : (
                      <ArchiveIcon className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">No {activeTab} blogs found</h3>
                  <p className="text-slate-600 mb-6 text-lg">
                    {searchTerm || (activeTab === "active" && filterStatus !== "all")
                      ? "Try adjusting your search or filter criteria"
                      : activeTab === "active"
                        ? "Get started by creating your first blog post"
                        : "No archived blogs yet"}
                  </p>
                  {!searchTerm && activeTab === "active" && filterStatus === "all" && (
                    <button
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Create Your First Blog
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Create Blog Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div
                ref={createModalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800">Create New Blog</h3>
                    <button
                      onClick={() => {
                        setShowCreateModal(false)
                        setBlogForm({ title: "", content: "", image: null })
                        setImagePreview(null)
                        setImageError("")
                        setCreateError("")
                        setCreateSuccess("")
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
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
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Blog Image (Optional)</label>
                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="mb-4 relative">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              width={400}
                              height={200}
                              className="w-full h-48 object-cover rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {/* Upload Area */}
                        {!imagePreview && (
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                              isDragOver ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-slate-400"
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-600">
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                  >
                                    Click to upload
                                  </button>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-slate-500">PNG, JPG,JPEG, GIF, WebP up to 5MB</p>
                              </div>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileInputChange}
                              className="hidden"
                            />
                          </div>
                        )}
                        {/* Image Error */}
                        {imageError && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                            {imageError}
                          </div>
                        )}
                      </div>
                      {/* Content - TipTap Editor */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Blog Content *</label>
                        <TipTapEditor
                          content={blogForm.content}
                          onChange={(content) => handleFormChange("content", content)}
                          placeholder="Start writing your blog content..."
                          className="min-h-[300px]"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          {blogForm.content.replace(/<[^>]*>/g, "").length} characters (minimum 10 required)
                        </p>
                      </div>
                    </div>
                    {/* Form Actions */}
                    <div className="flex space-x-3 mt-8 pt-6 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false)
                          setBlogForm({ title: "", content: "", image: null })
                          setImagePreview(null)
                          setImageError("")
                          setCreateError("")
                          setCreateSuccess("")
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
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

          {/* Edit Blog Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div
                ref={editModalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800">Edit Blog</h3>
                    <button
                      onClick={() => {
                        setShowEditModal(false)
                        setEditBlogForm({
                          id: 0,
                          title: "",
                          content: "",
                          status: "draft",
                          category: "General",
                          image: null,
                          existingImageUrl: "",
                        })
                        setEditImagePreview(null)
                        setRemoveExistingImage(false)
                        setImageError("")
                        setUpdateError("")
                        setUpdateSuccess("")
                        if (editFileInputRef.current) {
                          editFileInputRef.current.value = ""
                        }
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <XIcon className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>
                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <form onSubmit={handleUpdateBlog} className="p-6">
                    {/* Success Message */}
                    {updateSuccess && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <p className="text-green-800 text-sm">{updateSuccess}</p>
                        </div>
                      </div>
                    )}
                    {/* Error Message */}
                    {updateError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircleIcon className="w-4 h-4 text-red-600" />
                          <p className="text-red-800 text-sm">{updateError}</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-2">
                          Blog Title *
                        </label>
                        <input
                          type="text"
                          id="edit-title"
                          value={editBlogForm.title}
                          onChange={(e) => handleEditFormChange("title", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter your blog title..."
                          maxLength={200}
                        />
                        <p className="text-xs text-slate-500 mt-1">{editBlogForm.title.length}/200 characters</p>
                      </div>
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Blog Image (Optional)</label>
                        {/* Current/Preview Image */}
                        {editImagePreview && !removeExistingImage && (
                          <div className="mb-4 relative">
                            <Image
                              src={editImagePreview || "/placeholder.svg"}
                              alt="Preview"
                              width={400}
                              height={200}
                              className="w-full h-48 object-cover rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={removeEditImage}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {/* Upload Area */}
                        {(!editImagePreview || removeExistingImage) && (
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                              isEditDragOver
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-slate-300 hover:border-slate-400"
                            }`}
                            onDragOver={handleEditDragOver}
                            onDragLeave={handleEditDragLeave}
                            onDrop={handleEditDrop}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-600">
                                  <button
                                    type="button"
                                    onClick={() => editFileInputRef.current?.click()}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                  >
                                    Click to upload
                                  </button>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-slate-500">PNG, JPG, GIF, WebP up to 5MB</p>
                              </div>
                            </div>
                            <input
                              ref={editFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleEditFileInputChange}
                              className="hidden"
                            />
                          </div>
                        )}
                        {/* Image Error */}
                        {imageError && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                            {imageError}
                          </div>
                        )}
                      </div>
                      {/* Content - TipTap Editor */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Blog Content *</label>
                        <TipTapEditor
                          content={editBlogForm.content}
                          onChange={(content) => handleEditFormChange("content", content)}
                          placeholder="Edit your blog content..."
                          className="min-h-[300px]"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          {editBlogForm.content.replace(/<[^>]*>/g, "").length} characters (minimum 10 required)
                        </p>
                      </div>
                    </div>
                    {/* Form Actions */}
                    <div className="flex space-x-3 mt-8 pt-6 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false)
                          setEditBlogForm({
                            id: 0,
                            title: "",
                            content: "",
                            status: "draft",
                            category: "General",
                            image: null,
                            existingImageUrl: "",
                          })
                          setEditImagePreview(null)
                          setRemoveExistingImage(false)
                          setImageError("")
                          setUpdateError("")
                          setUpdateSuccess("")
                          if (editFileInputRef.current) {
                            editFileInputRef.current.value = ""
                          }
                        }}
                        disabled={isUpdating}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating || !editBlogForm.title.trim() || !editBlogForm.content.trim()}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <SaveIcon className="w-4 h-4 mr-2" />
                            Update Blog
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* View Blog Modal */}
          {showViewModal && viewBlog && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div
                ref={viewModalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800">View Blog</h3>
                    <button
                      onClick={() => {
                        setShowViewModal(false)
                        setViewBlog(null)
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <XIcon className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>
                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Blog Image */}
                    {viewBlog.image && (
                      <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                        <Image
                          src={viewBlog.image || "/placeholder.svg"}
                          alt={viewBlog.title}
                          width={800}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {/* Blog Info */}
                    <div>
                      <h4 className="text-3xl font-bold text-slate-800 mb-4">{viewBlog.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                        <span className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(viewBlog.created_at).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <EyeIcon className="w-4 h-4" />
                          <span>{viewBlog.views || 0} views</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>👍 {viewBlog.likes} likes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>💬 {viewBlog.comments_count} comments</span>
                        </span>
                      </div>
                      <div className="mb-6">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full border flex items-center space-x-1 w-fit ${getStatusColor(
                            viewBlog.status || "draft",
                            isArchived(viewBlog),
                          )}`}
                        >
                          {getStatusIcon(viewBlog.status || "draft", isArchived(viewBlog))}
                          <span>{getStatusText(viewBlog.status || "draft", isArchived(viewBlog))}</span>
                        </span>
                      </div>
                    </div>
                    {/* Author Info */}
                    <div className="border-t border-slate-200 pt-6 mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {viewBlog.author?.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{viewBlog.author?.username || "Unknown"}</p>
                          <p className="text-sm text-slate-600">{viewBlog.author?.email || ""}</p>
                          <p className="text-xs text-slate-500 capitalize">{viewBlog.author?.role || "User"}</p>
                        </div>
                      </div>
                    </div>
                    {/* Blog Content */}
                    <div className="max-w-none">
                      <TipTapContentDisplay content={viewBlog.content} className="text-slate-700" />
                    </div>
                    {/* Comments Section */}
                    <div className="border-t border-slate-200 pt-6">
                      <h5 className="text-lg font-semibold text-slate-800 mb-4">
                        Comments ({viewBlog.comments_count})
                      </h5>
                      {viewBlog.comments && viewBlog.comments.length > 0 ? (
                        <div className="space-y-4">
                          {viewBlog.comments.map((comment: any, index: number) => (
                            <div key={index} className="flex space-x-3 p-4 bg-slate-50 rounded-lg">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {comment.author?.username?.charAt(0).toUpperCase() ||
                                      comment.user?.username?.charAt(0).toUpperCase() ||
                                      "U"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-medium text-slate-800 text-sm">
                                    {comment.author?.username || comment.user?.username || "Anonymous"}
                                  </p>
                                  <span className="text-xs text-slate-500">
                                    {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ""}
                                  </span>
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                  {comment.content || comment.text || "No content"}
                                </p>
                                {comment.author?.role && (
                                  <p className="text-xs text-slate-500 mt-1 capitalize">{comment.author.role}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-slate-400 text-xl">💬</span>
                          </div>
                          <p className="text-slate-600 text-sm">No comments yet</p>
                          <p className="text-slate-500 text-xs">Be the first to comment on this blog post</p>
                        </div>
                      )}
                    </div>
                    {/* Blog Stats */}
                    <div className="border-t border-slate-200 pt-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">{viewBlog.likes}</p>
                          <p className="text-sm text-slate-600">Likes</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">{viewBlog.comments_count}</p>
                          <p className="text-sm text-slate-600">Comments</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">{viewBlog.views || 0}</p>
                          <p className="text-sm text-slate-600">Views</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
