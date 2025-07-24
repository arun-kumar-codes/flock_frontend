// "use client"

// import { useState, useEffect, useRef } from "react"
// import type React from "react"
// import { useRouter } from "next/navigation"
// import { archiveBlog, createBlog, getMyBlog, sendForApproval, unarchiveBlog, updateBlog } from "@/api/content"
// import { useDispatch } from "react-redux"
// import { logOut } from "@/slice/userSlice"
// import profileImage from "@/assets/profile.png"
// import {
//   PlusIcon,
//   LogOutIcon,
//   SearchIcon,
//   MoreVerticalIcon,
//   EditIcon,
//   EyeIcon,
//   CalendarIcon,
//   FileTextIcon,
//   TrendingUpIcon,
//   UserIcon,
//   XIcon,
//   SaveIcon,
//   AlertCircleIcon,
//   CheckCircleIcon,
//   ImageIcon,
//   SendIcon,
//   ArchiveIcon,
//   LoaderIcon,
//   ClockIcon,
//   RefreshCwIcon,
// } from "lucide-react"
// import Image from "next/image"
// import { useSelector } from "react-redux"
// import Loader from "@/components/Loader"

// interface UserData {
//   email: string
//   username: string
//   id: string
//   imageUrl?: string
//   content?: Blog[]
// }

// interface Author {
//   email: string
//   id: number
//   role: string
//   username: string
// }

// interface Blog {
//   id: number
//   title: string
//   content: string
//   author: Author
//   created_at: string
//   created_by: number
//   comments: any[]
//   comments_count: number
//   liked_by: number[]
//   likes: number
//   image?: string
//   status?: string | null
//   archived?: boolean | null
//   description?: string
//   createdAt?: string
//   views?: number
//   category?: string
// }

// interface CreateBlogData {
//   title: string
//   content: string
//   status?: string
//   category?: string
//   image?: File | null
// }

// interface EditBlogData extends CreateBlogData {
//   id: number
//   existingImageUrl?: string
// }

// export default function Dashboard() {
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const [userData, setUserData] = useState<UserData>({
//     email: "",
//     username: "",
//     id: "",
//     imageUrl: "",
//     content: [],
//   })
//   const [showUserDetails, setShowUserDetails] = useState(false)
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterStatus, setFilterStatus] = useState("all")
//   const [activeTab, setActiveTab] = useState<"active" | "archived">("active")
//   const [showActionMenu, setShowActionMenu] = useState<number | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isCreating, setIsCreating] = useState(false)
//   const [isUpdating, setIsUpdating] = useState(false)
//   const [createError, setCreateError] = useState("")
//   const [createSuccess, setCreateSuccess] = useState("")
//   const [updateError, setUpdateError] = useState("")
//   const [updateSuccess, setUpdateSuccess] = useState("")
//   const [fetchError, setFetchError] = useState("")
//   const [showViewModal, setShowViewModal] = useState(false)
//   const [viewBlog, setViewBlog] = useState<Blog | null>(null)

//   // Loading states for different actions
//   const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({})

//   // Image upload states
//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
//   const [imageError, setImageError] = useState("")
//   const [isDragOver, setIsDragOver] = useState(false)
//   const [isEditDragOver, setIsEditDragOver] = useState(false)
//   const [removeExistingImage, setRemoveExistingImage] = useState(false)

//   // Create blog form state
//   const [blogForm, setBlogForm] = useState<CreateBlogData>({
//     title: "",
//     content: "",
//     status: "draft",
//     category: "General",
//     image: null,
//   })

//   // Edit blog form state
//   const [editBlogForm, setEditBlogForm] = useState<EditBlogData>({
//     id: 0,
//     title: "",
//     content: "",
//     status: "draft",
//     category: "General",
//     image: null,
//     existingImageUrl: "",
//   })

//   // Store original edit form data for comparison
//   const [originalEditData, setOriginalEditData] = useState<EditBlogData>({
//     id: 0,
//     title: "",
//     content: "",
//     status: "draft",
//     category: "General",
//     image: null,
//     existingImageUrl: "",
//   })

//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const createModalRef = useRef<HTMLDivElement>(null)
//   const editModalRef = useRef<HTMLDivElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const editFileInputRef = useRef<HTMLInputElement>(null)
//   const viewModalRef = useRef<HTMLDivElement>(null)

//   const user = useSelector((state: any) => state.user)

//   useEffect(() => {
//     if (user.role.toLowerCase() === "admin") {
//       router.replace("/admin")
//     } else if (user.role.toLowerCase() === "viewer") {
//       router.replace("/viewer")
//     }
//   }, [])

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowUserDetails(false)
//       }
//       if (!event.target || !(event.target as Element).closest(".action-menu-container")) {
//         setShowActionMenu(null)
//       }
//       if (createModalRef.current && !createModalRef.current.contains(event.target as Node) && showCreateModal) {
//         setShowCreateModal(false)
//       }
//       if (editModalRef.current && !editModalRef.current.contains(event.target as Node) && showEditModal) {
//         setShowEditModal(false)
//       }
//       if (viewModalRef.current && !viewModalRef.current.contains(event.target as Node) && showViewModal) {
//         setShowViewModal(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [showCreateModal, showEditModal, showViewModal])

//   // Helper function to set loading state for specific actions
//   const setActionLoading = (blogId: number, action: string, loading: boolean) => {
//     setLoadingActions((prev) => ({
//       ...prev,
//       [`${blogId}-${action}`]: loading,
//     }))
//   }

//   // Helper function to check if action is loading
//   const isActionLoading = (blogId: number, action: string) => {
//     return loadingActions[`${blogId}-${action}`] || false
//   }

//   // Helper function to safely check if blog is archived
//   const isArchived = (blog: Blog): boolean => {
//     return blog.archived === true
//   }

//   // Image validation function
//   const validateImage = (file: File): string | null => {
//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
//     const maxSize = 5 * 1024 * 1024 // 5MB

//     if (!allowedTypes.includes(file.type)) {
//       return "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
//     }

//     if (file.size > maxSize) {
//       return "Image size must be less than 5MB"
//     }

//     return null
//   }

//   // Handle image selection for create form
//   const handleImageSelect = (file: File) => {
//     const error = validateImage(file)
//     if (error) {
//       setImageError(error)
//       return
//     }

//     setImageError("")
//     setBlogForm((prev) => ({ ...prev, image: file }))
//     const reader = new FileReader()
//     reader.onload = (e) => {
//       setImagePreview(e.target?.result as string)
//     }
//     reader.readAsDataURL(file)
//   }

//   // Handle image selection for edit form
//   const handleEditImageSelect = (file: File) => {
//     const error = validateImage(file)
//     if (error) {
//       setImageError(error)
//       return
//     }

//     setImageError("")
//     setEditBlogForm((prev) => ({ ...prev, image: file }))
//     setRemoveExistingImage(false)
//     const reader = new FileReader()
//     reader.onload = (e) => {
//       setEditImagePreview(e.target?.result as string)
//     }
//     reader.readAsDataURL(file)
//   }

//   // Handle file input change for create
//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       handleImageSelect(file)
//     }
//   }

//   // Handle file input change for edit
//   const handleEditFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       handleEditImageSelect(file)
//     }
//   }

//   // Handle drag and drop for create
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(true)
//   }

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(false)
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(false)
//     const file = e.dataTransfer.files?.[0]
//     if (file) {
//       handleImageSelect(file)
//     }
//   }

//   // Handle drag and drop for edit
//   const handleEditDragOver = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsEditDragOver(true)
//   }

//   const handleEditDragLeave = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsEditDragOver(false)
//   }

//   const handleEditDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsEditDragOver(false)
//     const file = e.dataTransfer.files?.[0]
//     if (file) {
//       handleEditImageSelect(file)
//     }
//   }

//   // Remove image for create
//   const removeImage = () => {
//     setBlogForm((prev) => ({ ...prev, image: null }))
//     setImagePreview(null)
//     setImageError("")
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   // Remove image for edit
//   const removeEditImage = () => {
//     setEditBlogForm((prev) => ({ ...prev, image: null }))
//     setEditImagePreview(null)
//     setRemoveExistingImage(true)
//     setImageError("")
//     if (editFileInputRef.current) {
//       editFileInputRef.current.value = ""
//     }
//   }

//   // Fetch user's blogs
//   const fetchUserBlogs = async () => {
//     try {
//       setFetchError("")
//       const response = await getMyBlog()
//       console.log("Fetch blogs response:", response)
//       if (response?.data?.blogs) {
//         const userBlogs = response.data.blogs
//           .filter((blog: Blog) => blog.created_by === user?.id || blog.author?.id === user?.id)
//           .map((blog: Blog) => ({
//             ...blog,
//             description: generateExcerpt(blog.content),
//             createdAt: blog.created_at,
//             status: blog.status || "draft",
//             views: Math.floor(Math.random() * 1000),
//             category: blog.author?.role === "Creator" ? "Programming" : "General",
//           }))

//         setUserData((prev) => ({
//           ...prev,
//           content: userBlogs,
//         }))
//       }
//     } catch (error) {
//       console.error("Error fetching user blogs:", error)
//       setFetchError("Failed to fetch your blogs")
//     }
//   }

//   // Helper function to generate excerpt
//   const generateExcerpt = (content: string, maxLength = 100): string => {
//     const textContent = content.replace(/<[^>]*>/g, "")
//     return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
//   }

//   useEffect(() => {
//     if (user) {
//       if (!user.is_profile_completed) {
//         router.push("/dashboard/profile")
//       } else {
//         setUserData((prev) => ({
//           ...prev,
//           email: user.email || "",
//           username: user.username || "",
//           id: user.id || "",
//         }))
//         fetchUserBlogs()
//       }
//       setIsLoading(false)
//     }
//   }, [user, router])

//   if (isLoading) {
//     return <Loader />
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("access_token")
//     localStorage.removeItem("refresh_token")
//     localStorage.removeItem("user")
//     dispatch(logOut())
//     router.push("/login")
//   }

//   // Send blog for approval
//   const handleSendForApproval = async (blogId: number) => {
//     try {
//       setActionLoading(blogId, "approval", true)
//       setUpdateError("")
//       const response = await sendForApproval(blogId)
//       if (response?.status === 200) {
//         setUserData((prev) => ({
//           ...prev,
//           content:
//             prev.content?.map((blog) => (blog.id === blogId ? { ...blog, status: "pending_approval" } : blog)) || [],
//         }))
//         setUpdateSuccess("Blog sent for approval successfully!")
//         setTimeout(() => setUpdateSuccess(""), 3000)
//       } else {
//         throw new Error("Failed to send blog for approval")
//       }
//     } catch (error: any) {
//       console.error("Error sending blog for approval:", error)
//       setUpdateError(error?.response?.data?.message || "Failed to send blog for approval")
//       setTimeout(() => setUpdateError(""), 3000)
//     } finally {
//       setActionLoading(blogId, "approval", false)
//       setShowActionMenu(null)
//     }
//   }

//   // Archive blog
//   const handleArchiveBlog = async (blogId: number) => {
//     try {
//       setActionLoading(blogId, "archive", true)
//       setUpdateError("")
//       const response = await archiveBlog(blogId)
//       if (response?.status === 200) {
//         setUserData((prev) => ({
//           ...prev,
//           content: prev.content?.map((blog) => (blog.id === blogId ? { ...blog, archived: true } : blog)) || [],
//         }))
//         setUpdateSuccess("Blog archived successfully!")
//         setTimeout(() => setUpdateSuccess(""), 3000)
//       } else {
//         throw new Error("Failed to archive blog")
//       }
//     } catch (error: any) {
//       console.error("Error archiving blog:", error)
//       setUpdateError(error?.response?.data?.message || "Failed to archive blog")
//       setTimeout(() => setUpdateError(""), 3000)
//     } finally {
//       setActionLoading(blogId, "archive", false)
//       setShowActionMenu(null)
//     }
//   }

//   // Unarchive blog
//   const handleUnarchiveBlog = async (blogId: number) => {
//     try {
//       setActionLoading(blogId, "unarchive", true)
//       setUpdateError("")
//       const response = await unarchiveBlog(blogId)
//       if (response?.status === 200) {
//         setUserData((prev) => ({
//           ...prev,
//           content: prev.content?.map((blog) => (blog.id === blogId ? { ...blog, archived: false } : blog)) || [],
//         }))
//         setUpdateSuccess("Blog unarchived successfully!")
//         setTimeout(() => setUpdateSuccess(""), 3000)
//       } else {
//         throw new Error("Failed to unarchive blog")
//       }
//     } catch (error: any) {
//       console.error("Error unarchiving blog:", error)
//       setUpdateError(error?.response?.data?.message || "Failed to unarchive blog")
//       setTimeout(() => setUpdateError(""), 3000)
//     } finally {
//       setActionLoading(blogId, "unarchive", false)
//       setShowActionMenu(null)
//     }
//   }

//   // Update blog status (draft to published)
//   const updateBlogStatus = async (blogId: number, newStatus: string) => {
//     try {
//       setActionLoading(blogId, "status", true)
//       setUpdateError("")
//       const response = await updateBlog(blogId, { status: newStatus })
//       if (response?.status === 200 || response?.data) {
//         setUserData((prev) => ({
//           ...prev,
//           content: prev.content?.map((blog) => (blog.id === blogId ? { ...blog, status: newStatus } : blog)) || [],
//         }))
//         setUpdateSuccess(`Blog ${newStatus === "published" ? "published" : "updated"} successfully!`)
//         setTimeout(() => setUpdateSuccess(""), 3000)
//       } else {
//         throw new Error("Failed to update blog status")
//       }
//     } catch (error: any) {
//       console.error("Error updating blog status:", error)
//       setUpdateError(error?.response?.data?.message || "Failed to update blog status")
//       setTimeout(() => setUpdateError(""), 3000)
//     } finally {
//       setActionLoading(blogId, "status", false)
//       setShowActionMenu(null)
//     }
//   }

//   const getImageUrl = (imagePath: string | null | undefined): string | null => {
//     if (!imagePath) return null
//     if (imagePath.startsWith("static")) return `http://116.202.210.102:5055/${imagePath}`
//     const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
//     return `${baseUrl}/${imagePath}`
//   }

//   // Enhanced edit blog handler
//   const handleEditBlog = (blog: Blog) => {
//     console.log("Edit blog clicked:", blog.id)
//     setShowActionMenu(null)
//     setUpdateError("")
//     setUpdateSuccess("")
//     setImageError("")
//     setRemoveExistingImage(false)

//     const editData = {
//       id: blog.id,
//       title: blog.title,
//       content: blog.content,
//       status: blog.status || "draft",
//       category: blog.category || "General",
//       image: null,
//       existingImageUrl: blog.image || "",
//     }

//     setEditBlogForm(editData)
//     setOriginalEditData(editData) // Store original data for comparison

//     const imageUrl = getImageUrl(blog.image)
//     if (imageUrl) {
//       setEditImagePreview(imageUrl)
//     } else {
//       setEditImagePreview(null)
//     }

//     if (editFileInputRef.current) {
//       editFileInputRef.current.value = ""
//     }

//     setShowEditModal(true)
//   }

//   // Handle view blog
//   const handleViewBlog = (blog: Blog) => {
//     console.log("View blog clicked:", blog.id)
//     setShowActionMenu(null)
//     setViewBlog(blog)
//     setShowViewModal(true)
//   }

//   // Enhanced update blog handler - only send changed values
//   const handleUpdateBlog = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setUpdateError("")
//     setUpdateSuccess("")

//     // Enhanced validation
//     if (!editBlogForm.title.trim()) {
//       setUpdateError("Title is required")
//       return
//     }

//     if (editBlogForm.title.trim().length < 3) {
//       setUpdateError("Title must be at least 3 characters long")
//       return
//     }

//     if (!editBlogForm.content.trim()) {
//       setUpdateError("Content is required")
//       return
//     }

//     if (editBlogForm.content.trim().length < 10) {
//       setUpdateError("Content must be at least 10 characters long")
//       return
//     }

//     setIsUpdating(true)

//     try {
//       // Create FormData only with changed values
//       const formData = new FormData()
//       let hasChanges = false

//       // Check for changes and only add changed fields
//       if (editBlogForm.title.trim() !== originalEditData.title) {
//         formData.append("title", editBlogForm.title.trim())
//         hasChanges = true
//       }

//       if (editBlogForm.content.trim() !== originalEditData.content) {
//         formData.append("content", editBlogForm.content.trim())
//         hasChanges = true
//       }

//       if (editBlogForm.status !== originalEditData.status) {
//         formData.append("status", editBlogForm.status || "draft")
//         hasChanges = true
//       }

//       if (editBlogForm.category !== originalEditData.category) {
//         formData.append("category", editBlogForm.category || "General")
//         hasChanges = true
//       }

//       // Handle image updates
//       if (editBlogForm.image) {
//         formData.append("image", editBlogForm.image)
//         hasChanges = true
//       } else if (removeExistingImage) {
//         formData.append("remove_image", "true")
//         hasChanges = true
//       }

//       if (!hasChanges) {
//         setUpdateError("No changes detected")
//         setIsUpdating(false)
//         return
//       }

//       const response = await updateBlog(editBlogForm.id, formData)
//       if (response?.status === 200 || response?.data) {
//         const updatedBlog = {
//           ...editBlogForm,
//           title: editBlogForm.title.trim(),
//           content: editBlogForm.content.trim(),
//           description: generateExcerpt(editBlogForm.content.trim()),
//           image: response.data?.image || (removeExistingImage ? null : editBlogForm.existingImageUrl),
//         }

//         setUserData((prev) => ({
//           ...prev,
//           content:
//             prev.content?.map((blog) => (blog.id === editBlogForm.id ? { ...blog, ...updatedBlog } : blog)) || [],
//         }))

//         setUpdateSuccess("Blog updated successfully!")
//         setTimeout(() => {
//           setShowEditModal(false)
//           setUpdateSuccess("")
//           setEditImagePreview(null)
//           setRemoveExistingImage(false)
//           setEditBlogForm({
//             id: 0,
//             title: "",
//             content: "",
//             status: "draft",
//             category: "General",
//             image: null,
//             existingImageUrl: "",
//           })
//           setOriginalEditData({
//             id: 0,
//             title: "",
//             content: "",
//             status: "draft",
//             category: "General",
//             image: null,
//             existingImageUrl: "",
//           })
//         }, 2000)
//       } else {
//         throw new Error("Failed to update blog")
//       }
//     } catch (error: any) {
//       console.error("Error updating blog:", error)
//       setUpdateError(error?.response?.data?.message || error?.message || "Failed to update blog. Please try again.")
//     } finally {
//       setIsUpdating(false)
//     }
//   }

//   const handleCreateBlog = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setCreateError("")
//     setCreateSuccess("")

//     // Validation
//     if (!blogForm.title.trim()) {
//       setCreateError("Title is required")
//       return
//     }

//     if (!blogForm.content.trim()) {
//       setCreateError("Content is required")
//       return
//     }

//     if (blogForm.content.trim().length < 10) {
//       setCreateError("Content must be at least 10 characters long")
//       return
//     }

//     setIsCreating(true)

//     try {
//       const formData = new FormData()
//       formData.append("title", blogForm.title.trim())
//       formData.append("content", blogForm.content.trim())
//       if (blogForm.image) {
//         formData.append("image", blogForm.image)
//       }

//       const response = await createBlog(formData)
//       console.log("Create blog response:", response)

//       if (response?.status === 200 || response?.status === 201 || response?.data) {
//         setCreateSuccess("Blog created successfully!")
//         setBlogForm({
//           title: "",
//           content: "",
//           image: null,
//         })
//         setImagePreview(null)
//         setImageError("")
//         if (fileInputRef.current) {
//           fileInputRef.current.value = ""
//         }

//         await fetchUserBlogs()

//         setTimeout(() => {
//           setShowCreateModal(false)
//           setCreateSuccess("")
//         }, 2000)
//       } else {
//         setCreateError("Failed to create blog. Please try again.")
//       }
//     } catch (error: any) {
//       console.error("Error creating blog:", error)
//       setCreateError(error?.response?.data?.message || "Failed to create blog. Please try again.")
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   const handleFormChange = (field: keyof CreateBlogData, value: string) => {
//     setBlogForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//     if (createError) {
//       setCreateError("")
//     }
//   }

//   const handleEditFormChange = (field: keyof EditBlogData, value: string) => {
//     setEditBlogForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//     if (updateError) {
//       setUpdateError("")
//     }
//   }

//   const getStatusColor = (status: string, archived?: boolean) => {
//     if (archived) {
//       return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//     switch (status) {
//       case "published":
//         return "bg-emerald-100 text-emerald-800 border-emerald-200"
//       case "draft":
//         return "bg-amber-100 text-amber-800 border-amber-200"
//       case "pending_approval":
//         return "bg-blue-100 text-blue-800 border-blue-200"
//       case "rejected":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "approved":
//         return "bg-green-100 text-green-800 border-green-200"
//       default:
//         return "bg-slate-100 text-slate-800 border-slate-200"
//     }
//   }

//   const getStatusIcon = (status: string, archived?: boolean) => {
//     if (archived) {
//       return <ArchiveIcon className="w-3 h-3" />
//     }
//     switch (status) {
//       case "published":
//         return <TrendingUpIcon className="w-3 h-3" />
//       case "draft":
//         return <EditIcon className="w-3 h-3" />
//       case "pending_approval":
//         return <ClockIcon className="w-3 h-3" />
//       case "rejected":
//         return <XIcon className="w-3 h-3" />
//       case "approved":
//         return <CheckCircleIcon className="w-3 h-3" />
//       default:
//         return <FileTextIcon className="w-3 h-3" />
//     }
//   }

//   const getStatusText = (status: string, archived?: boolean) => {
//     if (archived) {
//       return "archived"
//     }
//     if (status == "pending_approval") {
//       return "pending approval"
//     }
//     return status || "draft"
//   }

//   // Get active (non-archived) blogs
//   const activeBlogs = userData.content?.filter((item) => !isArchived(item)) || []

//   // Get archived blogs
//   const archivedBlogs = userData.content?.filter((item) => isArchived(item)) || []

//   // Filter content based on active tab and search/filter criteria
//   const getFilteredContent = () => {
//     const sourceBlogs = activeTab === "active" ? activeBlogs : archivedBlogs
//     return sourceBlogs.filter((item) => {
//       const matchesSearch =
//         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))

//       if (activeTab === "archived") {
//         return matchesSearch // For archived tab, just match search
//       }

//       // For active tab, also apply status filter
//       const matchesFilter = filterStatus === "all" || item.status === filterStatus
//       return matchesSearch && matchesFilter
//     })
//   }

//   const filteredContent = getFilteredContent()

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
//                   <FileTextIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <h1 className="text-xl font-bold text-slate-800">ContentHub</h1>
//               </div>
//             </div>
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 className="flex items-center space-x-3 bg-white rounded-full p-1 pr-4 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
//                 onClick={() => setShowUserDetails(!showUserDetails)}
//               >
//                 <Image
//                   src="/placeholder.svg?height=32&width=32"
//                   alt="Profile"
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                 />
//                 <span className="text-sm font-medium text-slate-700">{userData.username}</span>
//               </button>
//               {showUserDetails && (
//                 <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-0 z-50 overflow-hidden">
//                   {/* Profile Header */}
//                   <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
//                     <div className="flex items-center space-x-4">
//                       <div className="relative">
//                         <Image
//                           src={profileImage || "/placeholder.svg"}
//                           alt="Profile"
//                           width={56}
//                           height={56}
//                           className="rounded-full border-3 border-white shadow-lg"
//                         />
//                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></div>
//                       </div>
//                       <div className="text-white">
//                         <h3 className="font-semibold text-lg">{userData.username}</h3>
//                         <p className="text-indigo-100 text-sm opacity-90">{userData.email}</p>
//                         <div className="flex items-center space-x-1 mt-1">
//                           <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
//                           <span className="text-xs text-indigo-100">Online</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {/* Profile Stats */}
//                   <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                       <div>
//                         <div className="text-lg font-bold text-slate-800">{activeBlogs.length}</div>
//                         <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
//                           <FileTextIcon className="w-3 h-3" />
//                           <span>Active</span>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-lg font-bold text-slate-800">
//                           {userData.content?.reduce((sum, item) => sum + (item.views || 0), 0) || 0}
//                         </div>
//                         <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
//                           <EyeIcon className="w-3 h-3" />
//                           <span>Views</span>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-lg font-bold text-slate-800">
//                           {activeBlogs.filter((item) => item.status === "published").length}
//                         </div>
//                         <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
//                           <TrendingUpIcon className="w-3 h-3" />
//                           <span>Published</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {/* Profile Menu */}
//                   <div className="py-2">
//                     <button
//                       onClick={() => router.push("/dashboard/profile")}
//                       className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group"
//                     >
//                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
//                         <UserIcon className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium text-slate-800">View Profile</div>
//                         <div className="text-xs text-slate-500">Manage your account settings</div>
//                       </div>
//                     </button>
//                     <button
//                       onClick={() => router.push("/dashboard/profile")}
//                       className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group"
//                     >
//                       <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
//                         <EditIcon className="w-4 h-4 text-purple-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium text-slate-800">Edit Profile</div>
//                         <div className="text-xs text-slate-500">Update your information</div>
//                       </div>
//                     </button>
//                     <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
//                       <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
//                         <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium text-slate-800">Analytics</div>
//                         <div className="text-xs text-slate-500">View your content performance</div>
//                       </div>
//                     </button>
//                     <div className="my-2 h-px bg-slate-200 mx-6"></div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-red-50 transition-colors group"
//                     >
//                       <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
//                         <LogOutIcon className="w-4 h-4 text-red-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium text-red-600">Sign Out</div>
//                         <div className="text-xs text-red-400">End your current session</div>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {userData.username}! 👋</h2>
//           <p className="text-slate-600">Manage your blogs and track your progress</p>
//         </div>

//         {/* Success/Error Messages */}
//         {(fetchError || updateError) && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <AlertCircleIcon className="w-5 h-5 text-red-600" />
//               <p className="text-red-800">{fetchError || updateError}</p>
//               {fetchError && (
//                 <button
//                   onClick={fetchUserBlogs}
//                   className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
//                 >
//                   Retry
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {updateSuccess && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <CheckCircleIcon className="w-5 h-5 text-green-600" />
//               <p className="text-green-800">{updateSuccess}</p>
//             </div>
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Total Active</p>
//                 <p className="text-2xl font-bold text-slate-800">{activeBlogs.length}</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <FileTextIcon className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Published</p>
//                 <p className="text-2xl font-bold text-slate-800">
//                   {activeBlogs.filter((item) => item.status === "published").length}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
//                 <TrendingUpIcon className="w-6 h-6 text-emerald-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Pending Approval</p>
//                 <p className="text-2xl font-bold text-slate-800">
//                   {activeBlogs.filter((item) => item.status === "pending_approval").length}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <ClockIcon className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Archived</p>
//                 <p className="text-2xl font-bold text-slate-800">{archivedBlogs.length}</p>
//               </div>
//               <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
//                 <ArchiveIcon className="w-6 h-6 text-gray-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content Management Section */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
//           <div className="p-6 border-b border-slate-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//               <h3 className="text-xl font-semibold text-slate-800">Your Blogs</h3>
//               <button
//                 className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
//                 onClick={() => setShowCreateModal(true)}
//               >
//                 <PlusIcon className="w-4 h-4 mr-2" />
//                 Create New Blog
//               </button>
//             </div>
//             {/* Tab Navigation */}
//             <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-4">
//               <button
//                 onClick={() => {
//                   setActiveTab("active")
//                   setFilterStatus("all")
//                 }}
//                 className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                   activeTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 <div className="flex items-center justify-center space-x-2">
//                   <FileTextIcon className="w-4 h-4" />
//                   <span>Active Blogs</span>
//                   <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">
//                     {activeBlogs.length}
//                   </span>
//                 </div>
//               </button>
//               <button
//                 onClick={() => {
//                   setActiveTab("archived")
//                   setFilterStatus("all")
//                 }}
//                 className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                   activeTab === "archived" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 <div className="flex items-center justify-center space-x-2">
//                   <ArchiveIcon className="w-4 h-4" />
//                   <span>Archived</span>
//                   <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">
//                     {archivedBlogs.length}
//                   </span>
//                 </div>
//               </button>
//             </div>
//             {/* Search and Filter */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="relative flex-1">
//                 <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder={`Search ${activeTab} blogs...`}
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
//               {activeTab === "active" && (
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="published">Published</option>
//                   <option value="draft">Draft</option>
//                   <option value="pending_approval">Pending Approval</option>
//                   <option value="rejected">Rejected</option>
//                   <option value="approved">Approved</option>
//                 </select>
//               )}
//             </div>
//           </div>
//           <div className="p-6">
//             {filteredContent.length > 0 ? (
//               <div className="space-y-4">
//                 {filteredContent.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all duration-200"
//                   >
//                     <div className="flex items-start space-x-4 flex-1">
//                       {/* Blog Image */}
//                       {item.image && (
//                         <div className="flex-shrink-0">
//                           <Image
//                             src={`http://116.202.210.102:5055/${item.image}`}
//                             alt={item.title}
//                             width={80}
//                             height={60}
//                             className="rounded-lg object-cover"
//                           />
//                         </div>
//                       )}
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h4 className="font-semibold text-slate-800">{item.title}</h4>
//                           <span
//                             className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(
//                               item.status || "draft",
//                               isArchived(item),
//                             )}`}
//                           >
//                             {getStatusIcon(item.status || "draft", isArchived(item))}
//                             <span>{getStatusText(item.status || "draft", isArchived(item))}</span>
//                           </span>
//                         </div>
//                         <p className="text-slate-600 text-sm mb-2">{item.description}</p>
//                         <div className="flex items-center space-x-4 text-xs text-slate-500">
//                           <span className="flex items-center space-x-1">
//                             <CalendarIcon className="w-3 h-3" />
//                             <span>{new Date(item.created_at).toLocaleDateString()}</span>
//                           </span>
//                           {item.views && (
//                             <span className="flex items-center space-x-1">
//                               <EyeIcon className="w-3 h-3" />
//                               <span>{item.views} views</span>
//                             </span>
//                           )}
//                           <span className="flex items-center space-x-1">
//                             <span>👍 {item.likes} likes</span>
//                           </span>
//                           <span className="flex items-center space-x-1">
//                             <span>💬 {item.comments_count} comments</span>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="relative action-menu-container">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setShowActionMenu(showActionMenu === item.id ? null : item.id)
//                         }}
//                         className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                         disabled={Object.values(loadingActions).some((loading) => loading)}
//                       >
//                         <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
//                       </button>
//                       {showActionMenu === item.id && (
//                         <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
//                           {/* View button - always show except for rejected */}
//                           {item.status !== "rejected" && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 handleViewBlog(item)
//                               }}
//                               className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
//                             >
//                               <EyeIcon className="w-4 h-4" />
//                               <span>View</span>
//                             </button>
//                           )}
//                           {/* Edit button - show for non-archived blogs */}
//                           {!isArchived(item) &&
//                             (item.status === "draft" ||
//                               item.status === "published" ||
//                               item.status === "pending_approval") && (
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   handleEditBlog(item)
//                                 }}
//                                 className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
//                               >
//                                 <EditIcon className="w-4 h-4" />
//                                 <span>Edit</span>
//                               </button>
//                             )}
//                           {/* Send for Approval button - only for draft blogs that are not archived */}
//                           {!isArchived(item) && item.status === "draft" && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 handleSendForApproval(item.id)
//                               }}
//                               className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-blue-50 text-blue-600 transition-colors"
//                               disabled={isActionLoading(item.id, "approval")}
//                             >
//                               {isActionLoading(item.id, "approval") ? (
//                                 <LoaderIcon className="w-4 h-4 animate-spin" />
//                               ) : (
//                                 <ClockIcon className="w-4 h-4" />
//                               )}
//                               <span>{isActionLoading(item.id, "approval") ? "Sending..." : "Send for Approval"}</span>
//                             </button>
//                           )}
//                           {/* Publish button - only for approved blogs that are not archived */}
//                           {!isArchived(item) && item.status === "approved" && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 updateBlogStatus(item.id, "published")
//                               }}
//                               className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-emerald-50 text-emerald-600 transition-colors"
//                               disabled={isActionLoading(item.id, "status")}
//                             >
//                               {isActionLoading(item.id, "status") ? (
//                                 <LoaderIcon className="w-4 h-4 animate-spin" />
//                               ) : (
//                                 <SendIcon className="w-4 h-4" />
//                               )}
//                               <span>{isActionLoading(item.id, "status") ? "Publishing..." : "Publish"}</span>
//                             </button>
//                           )}
//                           {/* Archive button - only for non-archived blogs */}
//                           {!isArchived(item) && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 handleArchiveBlog(item.id)
//                               }}
//                               className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-amber-50 text-amber-600 transition-colors"
//                               disabled={isActionLoading(item.id, "archive")}
//                             >
//                               {isActionLoading(item.id, "archive") ? (
//                                 <LoaderIcon className="w-4 h-4 animate-spin" />
//                               ) : (
//                                 <ArchiveIcon className="w-4 h-4" />
//                               )}
//                               <span>{isActionLoading(item.id, "archive") ? "Archiving..." : "Archive"}</span>
//                             </button>
//                           )}
//                           {/* Unarchive button - only for archived blogs */}
//                           {isArchived(item) && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 handleUnarchiveBlog(item.id)
//                               }}
//                               className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-green-50 text-green-600 transition-colors"
//                               disabled={isActionLoading(item.id, "unarchive")}
//                             >
//                               {isActionLoading(item.id, "unarchive") ? (
//                                 <LoaderIcon className="w-4 h-4 animate-spin" />
//                               ) : (
//                                 <RefreshCwIcon className="w-4 h-4" />
//                               )}
//                               <span>{isActionLoading(item.id, "unarchive") ? "Unarchiving..." : "Unarchive"}</span>
//                             </button>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   {activeTab === "active" ? (
//                     <FileTextIcon className="w-8 h-8 text-slate-400" />
//                   ) : (
//                     <ArchiveIcon className="w-8 h-8 text-slate-400" />
//                   )}
//                 </div>
//                 <h3 className="text-lg font-medium text-slate-800 mb-2">No {activeTab} blogs found</h3>
//                 <p className="text-slate-600 mb-4">
//                   {searchTerm || (activeTab === "active" && filterStatus !== "all")
//                     ? "Try adjusting your search or filter criteria"
//                     : activeTab === "active"
//                       ? "Get started by creating your first blog post"
//                       : "No archived blogs yet"}
//                 </p>
//                 {!searchTerm && activeTab === "active" && filterStatus === "all" && (
//                   <button
//                     className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     onClick={() => setShowCreateModal(true)}
//                   >
//                     <PlusIcon className="w-4 h-4 mr-2" />
//                     Create Your First Blog
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Enhanced Edit Blog Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div
//             ref={editModalRef}
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col transform transition-all duration-200"
//           >
//             {/* Modal Header */}
//             <div className="p-6 border-b border-slate-200 flex-shrink-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <h3 className="text-xl font-semibold text-slate-800">Edit Blog</h3>
//                   <span
//                     className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(editBlogForm.status || "draft")}`}
//                   >
//                     {getStatusIcon(editBlogForm.status || "draft")}
//                     <span>{editBlogForm.status || "draft"}</span>
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowEditModal(false)
//                     setEditImagePreview(null)
//                     setImageError("")
//                     setUpdateError("")
//                     setUpdateSuccess("")
//                     setRemoveExistingImage(false)
//                     if (editFileInputRef.current) {
//                       editFileInputRef.current.value = ""
//                     }
//                   }}
//                   className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                   disabled={isUpdating}
//                 >
//                   <XIcon className="w-5 h-5 text-slate-500" />
//                 </button>
//               </div>
//             </div>
//             {/* Modal Content - Scrollable */}
//             <div className="flex-1 overflow-y-auto">
//               <form onSubmit={handleUpdateBlog} className="p-6">
//                 {/* Success Message */}
//                 {updateSuccess && (
//                   <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <CheckCircleIcon className="w-5 h-5 text-green-600" />
//                       <p className="text-green-800">{updateSuccess}</p>
//                     </div>
//                   </div>
//                 )}
//                 {/* Error Message */}
//                 {updateError && (
//                   <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <AlertCircleIcon className="w-5 h-5 text-red-600" />
//                       <p className="text-red-800">{updateError}</p>
//                     </div>
//                   </div>
//                 )}
//                 <div className="space-y-6">
//                   {/* Title */}
//                   <div>
//                     <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-2">
//                       Blog Title *
//                     </label>
//                     <input
//                       type="text"
//                       id="edit-title"
//                       value={editBlogForm.title}
//                       onChange={(e) => handleEditFormChange("title", e.target.value)}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                       placeholder="Enter your blog title..."
//                       maxLength={200}
//                       disabled={isUpdating}
//                     />
//                     <div className="flex justify-between items-center mt-1">
//                       <p className="text-xs text-slate-500">{editBlogForm.title.length}/200 characters</p>
//                       {editBlogForm.title.length < 3 && editBlogForm.title.length > 0 && (
//                         <p className="text-xs text-red-500">Minimum 3 characters required</p>
//                       )}
//                     </div>
//                   </div>
//                   {/* Enhanced Image Upload */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Blog Image (Optional)</label>
//                     {/* Current/Preview Image */}
//                     {editImagePreview && !removeExistingImage && (
//                       <div className="mb-4 relative group">
//                         <Image
//                           src={editImagePreview || "/placeholder.svg"}
//                           alt="Blog image preview"
//                           width={400}
//                           height={200}
//                           className="w-full h-48 object-cover rounded-lg border border-slate-200"
//                         />
//                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
//                           <div className="flex space-x-2">
//                             <button
//                               type="button"
//                               onClick={() => editFileInputRef.current?.click()}
//                               className="px-3 py-1 bg-white text-slate-800 rounded text-sm hover:bg-slate-100 transition-colors"
//                               disabled={isUpdating}
//                             >
//                               Change
//                             </button>
//                             <button
//                               type="button"
//                               onClick={removeEditImage}
//                               className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
//                               disabled={isUpdating}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     {/* Upload Area */}
//                     {(!editImagePreview || removeExistingImage) && (
//                       <div
//                         className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//                           isEditDragOver ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-slate-400"
//                         } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
//                         onDragOver={!isUpdating ? handleEditDragOver : undefined}
//                         onDragLeave={!isUpdating ? handleEditDragLeave : undefined}
//                         onDrop={!isUpdating ? handleEditDrop : undefined}
//                       >
//                         <div className="flex flex-col items-center space-y-3">
//                           <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
//                             <ImageIcon className="w-8 h-8 text-slate-400" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-slate-600">
//                               <button
//                                 type="button"
//                                 onClick={() => !isUpdating && editFileInputRef.current?.click()}
//                                 className="text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
//                                 disabled={isUpdating}
//                               >
//                                 Click to upload
//                               </button>{" "}
//                               or drag and drop
//                             </p>
//                             <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
//                           </div>
//                         </div>
//                         <input
//                           ref={editFileInputRef}
//                           type="file"
//                           accept="image/*"
//                           onChange={handleEditFileInputChange}
//                           className="hidden"
//                           disabled={isUpdating}
//                         />
//                       </div>
//                     )}
//                     {/* Image Error */}
//                     {imageError && (
//                       <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
//                         <div className="flex items-center space-x-2">
//                           <AlertCircleIcon className="w-4 h-4 text-red-600" />
//                           <p className="text-red-600 text-sm">{imageError}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   {/* Content */}
//                   <div>
//                     <label htmlFor="edit-content" className="block text-sm font-medium text-slate-700 mb-2">
//                       Blog Content *
//                     </label>
//                     <textarea
//                       id="edit-content"
//                       value={editBlogForm.content}
//                       onChange={(e) => handleEditFormChange("content", e.target.value)}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors"
//                       placeholder="Write your blog content here..."
//                       rows={14}
//                       minLength={10}
//                       disabled={isUpdating}
//                     />
//                     <div className="flex justify-between items-center mt-1">
//                       <p className="text-xs text-slate-500">
//                         {editBlogForm.content.length} characters (minimum 10 required)
//                       </p>
//                       {editBlogForm.content.length < 10 && editBlogForm.content.length > 0 && (
//                         <p className="text-xs text-red-500">Minimum 10 characters required</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 {/* Form Actions */}
//                 <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-slate-200">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowEditModal(false)
//                       setEditImagePreview(null)
//                       setImageError("")
//                       setUpdateError("")
//                       setUpdateSuccess("")
//                       setRemoveExistingImage(false)
//                       if (editFileInputRef.current) {
//                         editFileInputRef.current.value = ""
//                       }
//                     }}
//                     disabled={isUpdating}
//                     className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={
//                       isUpdating ||
//                       !editBlogForm.title.trim() ||
//                       editBlogForm.title.trim().length < 3 ||
//                       !editBlogForm.content.trim() ||
//                       editBlogForm.content.trim().length < 10
//                     }
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                   >
//                     {isUpdating ? (
//                       <>
//                         <LoaderIcon className="animate-spin w-4 h-4 mr-2" />
//                         Updating Blog...
//                       </>
//                     ) : (
//                       <>
//                         <SaveIcon className="w-4 h-4 mr-2" />
//                         Update Blog
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Create Blog Modal - keeping existing implementation */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div
//             ref={createModalRef}
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-200"
//           >
//             {/* Modal Header */}
//             <div className="p-6 border-b border-slate-200 flex-shrink-0">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-slate-800">Create New Blog</h3>
//                 <button
//                   onClick={() => {
//                     setShowCreateModal(false)
//                     setBlogForm({ title: "", content: "", image: null })
//                     setImagePreview(null)
//                     setImageError("")
//                     setCreateError("")
//                     setCreateSuccess("")
//                     if (fileInputRef.current) {
//                       fileInputRef.current.value = ""
//                     }
//                   }}
//                   className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                 >
//                   <XIcon className="w-5 h-5 text-slate-500" />
//                 </button>
//               </div>
//             </div>
//             {/* Modal Content - Scrollable */}
//             <div className="flex-1 overflow-y-auto">
//               <form onSubmit={handleCreateBlog} className="p-6">
//                 {/* Success Message */}
//                 {createSuccess && (
//                   <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <CheckCircleIcon className="w-4 h-4 text-green-600" />
//                       <p className="text-green-800 text-sm">{createSuccess}</p>
//                     </div>
//                   </div>
//                 )}
//                 {/* Error Message */}
//                 {createError && (
//                   <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <AlertCircleIcon className="w-4 h-4 text-red-600" />
//                       <p className="text-red-800 text-sm">{createError}</p>
//                     </div>
//                   </div>
//                 )}
//                 <div className="space-y-6">
//                   {/* Title */}
//                   <div>
//                     <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
//                       Blog Title *
//                     </label>
//                     <input
//                       type="text"
//                       id="title"
//                       value={blogForm.title}
//                       onChange={(e) => handleFormChange("title", e.target.value)}
//                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       placeholder="Enter your blog title..."
//                       maxLength={200}
//                     />
//                     <p className="text-xs text-slate-500 mt-1">{blogForm.title.length}/200 characters</p>
//                   </div>
//                   {/* Image Upload */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Blog Image (Optional)</label>
//                     {/* Image Preview */}
//                     {imagePreview && (
//                       <div className="mb-4 relative">
//                         <Image
//                           src={imagePreview || "/placeholder.svg"}
//                           alt="Preview"
//                           width={400}
//                           height={200}
//                           className="w-full h-48 object-cover rounded-lg border border-slate-200"
//                         />
//                         <button
//                           type="button"
//                           onClick={removeImage}
//                           className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                         >
//                           <XIcon className="w-4 h-4" />
//                         </button>
//                       </div>
//                     )}
//                     {/* Upload Area */}
//                     {!imagePreview && (
//                       <div
//                         className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                           isDragOver ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-slate-400"
//                         }`}
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop}
//                       >
//                         <div className="flex flex-col items-center space-y-2">
//                           <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
//                             <ImageIcon className="w-6 h-6 text-slate-400" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-slate-600">
//                               <button
//                                 type="button"
//                                 onClick={() => fileInputRef.current?.click()}
//                                 className="text-indigo-600 hover:text-indigo-700 font-medium"
//                               >
//                                 Click to upload
//                               </button>{" "}
//                               or drag and drop
//                             </p>
//                             <p className="text-xs text-slate-500">PNG, JPG, GIF, WebP up to 5MB</p>
//                           </div>
//                         </div>
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept="image/*"
//                           onChange={handleFileInputChange}
//                           className="hidden"
//                         />
//                       </div>
//                     )}
//                     {/* Image Error */}
//                     {imageError && (
//                       <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
//                         {imageError}
//                       </div>
//                     )}
//                   </div>
//                   {/* Content */}
//                   <div>
//                     <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
//                       Blog Content *
//                     </label>
//                     <textarea
//                       id="content"
//                       value={blogForm.content}
//                       onChange={(e) => handleFormChange("content", e.target.value)}
//                       className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                       placeholder="Write your blog content here..."
//                       rows={12}
//                       minLength={10}
//                     />
//                     <p className="text-xs text-slate-500 mt-1">
//                       {blogForm.content.length} characters (minimum 10 required)
//                     </p>
//                   </div>
//                 </div>
//                 {/* Form Actions */}
//                 <div className="flex space-x-3 mt-8 pt-6 border-t border-slate-200">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowCreateModal(false)
//                       setBlogForm({ title: "", content: "", image: null })
//                       setImagePreview(null)
//                       setImageError("")
//                       setCreateError("")
//                       setCreateSuccess("")
//                       if (fileInputRef.current) {
//                         fileInputRef.current.value = ""
//                       }
//                     }}
//                     disabled={isCreating}
//                     className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isCreating || !blogForm.title.trim() || !blogForm.content.trim()}
//                     className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                   >
//                     {isCreating ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <SaveIcon className="w-4 h-4 mr-2" />
//                         Create Blog
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Blog Modal */}
//       {showViewModal && viewBlog && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div
//             ref={viewModalRef}
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
//           >
//             {/* Modal Header */}
//             <div className="p-6 border-b border-slate-200 flex-shrink-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <h3 className="text-xl font-semibold text-slate-800">{viewBlog.title}</h3>
//                   <span
//                     className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(
//                       viewBlog.status || "draft",
//                       isArchived(viewBlog),
//                     )}`}
//                   >
//                     {getStatusIcon(viewBlog.status || "draft", isArchived(viewBlog))}
//                     <span>{getStatusText(viewBlog.status || "draft", isArchived(viewBlog))}</span>
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowViewModal(false)
//                     setViewBlog(null)
//                   }}
//                   className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                 >
//                   <XIcon className="w-5 h-5 text-slate-500" />
//                 </button>
//               </div>
//               {/* Blog Meta Info */}
//               <div className="flex items-center space-x-4 mt-4 text-sm text-slate-600">
//                 <div className="flex items-center space-x-1">
//                   <UserIcon className="w-4 h-4" />
//                   <span>By {viewBlog.author.username}</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <CalendarIcon className="w-4 h-4" />
//                   <span>{new Date(viewBlog.created_at).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <EyeIcon className="w-4 h-4" />
//                   <span>{viewBlog.views || 0} views</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <span>👍 {viewBlog.likes} likes</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <span>💬 {viewBlog.comments_count} comments</span>
//                 </div>
//               </div>
//             </div>
//             {/* Modal Content - Scrollable */}
//             <div className="flex-1 overflow-y-auto p-6">
//               {/* Blog Image */}
//               {viewBlog.image && (
//                 <div className="mb-6">
//                   <Image
//                     src={getImageUrl(viewBlog.image) || "/placeholder.svg?height=400&width=800"}
//                     alt={viewBlog.title}
//                     width={800}
//                     height={400}
//                     className="w-full h-64 object-cover rounded-lg border border-slate-200"
//                   />
//                 </div>
//               )}
//               {/* Blog Content */}
//               <div className="prose prose-slate max-w-none">
//                 <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{viewBlog.content}</div>
//               </div>
//             </div>
//             {/* Modal Footer */}
//             <div className="p-6 border-t border-slate-200 flex-shrink-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   {/* Action buttons based on status and archived state */}
//                   {!isArchived(viewBlog) && viewBlog.status === "draft" && (
//                     <>
//                       <button
//                         onClick={() => {
//                           setShowViewModal(false)
//                           handleEditBlog(viewBlog)
//                         }}
//                         className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                       >
//                         <EditIcon className="w-4 h-4 mr-2" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowViewModal(false)
//                           handleSendForApproval(viewBlog.id)
//                         }}
//                         className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                         disabled={isActionLoading(viewBlog.id, "approval")}
//                       >
//                         <ClockIcon className="w-4 h-4 mr-2" />
//                         {isActionLoading(viewBlog.id, "approval") ? "Sending..." : "Send for Approval"}
//                       </button>
//                     </>
//                   )}
//                   {!isArchived(viewBlog) && viewBlog.status === "published" && (
//                     <>
//                       <button
//                         onClick={() => {
//                           setShowViewModal(false)
//                           handleEditBlog(viewBlog)
//                         }}
//                         className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                       >
//                         <EditIcon className="w-4 h-4 mr-2" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowViewModal(false)
//                           handleArchiveBlog(viewBlog.id)
//                         }}
//                         className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//                         disabled={isActionLoading(viewBlog.id, "archive")}
//                       >
//                         <ArchiveIcon className="w-4 h-4 mr-2" />
//                         {isActionLoading(viewBlog.id, "archive") ? "Archiving..." : "Archive"}
//                       </button>
//                     </>
//                   )}
//                   {!isArchived(viewBlog) && viewBlog.status === "pending_approval" && (
//                     <button
//                       onClick={() => {
//                         setShowViewModal(false)
//                         handleEditBlog(viewBlog)
//                       }}
//                       className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       <EditIcon className="w-4 h-4 mr-2" />
//                       Edit
//                     </button>
//                   )}
//                   {isArchived(viewBlog) && (
//                     <button
//                       onClick={() => {
//                         setShowViewModal(false)
//                         handleUnarchiveBlog(viewBlog.id)
//                       }}
//                       className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                       disabled={isActionLoading(viewBlog.id, "unarchive")}
//                     >
//                       <RefreshCwIcon className="w-4 h-4 mr-2" />
//                       {isActionLoading(viewBlog.id, "unarchive") ? "Unarchiving..." : "Unarchive"}
//                     </button>
//                   )}
//                   {!isArchived(viewBlog) && viewBlog.status === "approved" && (
//                     <button
//                       onClick={() => {
//                         setShowViewModal(false)
//                         updateBlogStatus(viewBlog.id, "published")
//                       }}
//                       className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                       disabled={isActionLoading(viewBlog.id, "status")}
//                     >
//                       <SendIcon className="w-4 h-4 mr-2" />
//                       {isActionLoading(viewBlog.id, "status") ? "Publishing..." : "Publish"}
//                     </button>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowViewModal(false)
//                     setViewBlog(null)
//                   }}
//                   className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import {
  FileTextIcon,
  VideoIcon,
  TrendingUpIcon,
  EyeIcon,
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon,
  BarChart3Icon,
  CalendarIcon,
} from "lucide-react"

interface StatsData {
  totalBlogs: number
  totalVideos: number
  totalViews: number
  publishedContent: number
}

export default function CreatorDashboard() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  const [stats, setStats] = useState<StatsData>({
    totalBlogs: 0,
    totalVideos: 0,
    totalViews: 0,
    publishedContent: 0,
  })

  // Mock stats - replace with actual API calls
  useEffect(() => {
    // Simulate fetching stats
    setStats({
      totalBlogs: 12,
      totalVideos: 8,
      totalViews: 2450,
      publishedContent: 15,
    })
  }, [])

  const contentTypes = [
    {
      title: "Blog Management",
      description: "Create, edit, and manage your blog posts. Share your thoughts and expertise with your audience.",
      icon: FileTextIcon,
      href: "/dashboard/blogs",
      color: "from-indigo-600 to-purple-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      stats: `${stats.totalBlogs} blogs`,
      features: ["Rich text editor", "Image uploads", "SEO optimization", "Draft management"],
    },
    {
      title: "Video Management",
      description: "Upload, organize, and manage your video content. Engage your audience with visual storytelling.",
      icon: VideoIcon,
      href: "/dashboard/videos",
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      stats: `${stats.totalVideos} videos`,
      features: ["Video uploads", "Thumbnail management", "Comments system", "Analytics tracking"],
    },
  ]

  const quickActions = [
    {
      title: "Create New Blog",
      description: "Start writing your next blog post",
      icon: FileTextIcon,
      action: () => router.push("/dashboard/blogs"),
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "Upload Video",
      description: "Share your latest video content",
      icon: VideoIcon,
      action: () => router.push("/dashboard/videos"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  const recentActivity = [
    {
      type: "blog",
      title: "Getting Started with React Hooks",
      action: "published",
      time: "2 hours ago",
      views: 145,
    },
    {
      type: "video",
      title: "Advanced TypeScript Patterns",
      action: "uploaded",
      time: "1 day ago",
      views: 89,
    },
    {
      type: "blog",
      title: "Building Scalable APIs",
      action: "draft saved",
      time: "2 days ago",
      views: 0,
    },
  ]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl mb-8">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12 md:py-16">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-2 mb-4">
                <SparklesIcon className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-300 font-medium">Creator Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, {user?.username || "Creator"}! 👋
              </h1>
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Your creative hub awaits. Manage your content, track your progress, and engage with your audience all in
                one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/dashboard/blogs")}
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Content
                </button>
                <button
                  onClick={() => {
                    // Add analytics route when available
                    console.log("Analytics coming soon!")
                  }}
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <BarChart3Icon className="w-5 h-5 mr-2" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 right-12 -mb-8 w-16 h-16 bg-yellow-300/20 rounded-full"></div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Blogs</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalBlogs}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileTextIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Videos</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalVideos}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <VideoIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold text-slate-800">{stats.publishedContent}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Types */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Content Management</h2>
              <p className="text-slate-600">Choose the type of content you want to create or manage</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {contentTypes.map((type) => (
                <div
                  key={type.title}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer"
                  onClick={() => router.push(type.href)}
                >
                  <div
                    className={`w-14 h-14 ${type.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <type.icon className={`w-7 h-7 ${type.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {type.title}
                  </h3>

                  <p className="text-slate-600 mb-4 leading-relaxed">{type.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500">{type.stats}</span>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>

                  <div className="space-y-2">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                        <span className="text-xs text-slate-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white p-4 rounded-xl transition-colors text-left group`}
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-semibold">{action.title}</h4>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === "blog" ? "bg-indigo-100" : "bg-purple-100"
                      }`}
                    >
                      {activity.type === "blog" ? (
                        <FileTextIcon
                          className={`w-4 h-4 ${activity.type === "blog" ? "text-indigo-600" : "text-purple-600"}`}
                        />
                      ) : (
                        <VideoIcon className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{activity.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-500 capitalize">{activity.action}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                      {activity.views > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          <EyeIcon className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">{activity.views} views</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">Stay consistent!</p>
                  <p className="text-xs text-slate-500">You've been active for 7 days straight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
