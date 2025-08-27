// "use client"
// import type React from "react"
// import { useState, useEffect, useRef } from "react"
// import Image from "next/image"
// import { getBlogByStatus, getVideoByStatus, approveBlog, rejectBlog, approveVideo, rejectVideo } from "@/api/content"
// import {
//   ClockIcon,
//   FileTextIcon,
//   VideoIcon,
//   SearchIcon,
//   MoreVerticalIcon,
//   EyeIcon,
//   CheckIcon,
//   XIcon,
//   UserIcon,
//   CalendarIcon,
//   ThumbsUpIcon,
//   MessageCircleIcon,
//   PlayIcon,
//   HeartIcon,
//   PauseIcon,
//   Volume2Icon,
//   VolumeXIcon,
//   MaximizeIcon,
// } from "lucide-react"
// import TipTapContentDisplay from "@/components/tiptap-content-display"
// import { VideoModal } from "@/components/viewer/video-modal"
// import Video from "@/components/Video"

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
//   comments_count: number
//   likes: number
//   image?: string
// }

// interface Commenter {
//   email: string
//   id: number
//   role: string
//   username: string
// }

// interface Comment {
//   id: number
//   video_id: number
//   comment: string
//   commented_at: string
//   commented_by: number
//   commenter: Commenter
// }

// interface Video {
//   video_id: any
//   videoId: any
//   id: number
//   title: string
//   description: string
//   creator: Author
//   created_at: string
//   comments_count: number
//   likes: number
//   views: number
//   thumbnail: string
//   duration_formatted: string
//   video: string
//   duration: number
//   format: string
//   archived: boolean
//   comments?: Comment[]
// }

// const IMAGE_BASE_URL = "http://116.202.210.102:5055/"

// export default function PendingPage() {
//   const [activeTab, setActiveTab] = useState<"blogs" | "videos">("blogs")
//   const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([])
//   const [pendingVideos, setPendingVideos] = useState<Video[]>([])
//   const [loadingBlogs, setLoadingBlogs] = useState(false)
//   const [loadingVideos, setLoadingVideos] = useState(false)
//   const [blogSearchTerm, setBlogSearchTerm] = useState("")
//   const [videoSearchTerm, setVideoSearchTerm] = useState("")
//   const [showBlogActionMenu, setShowBlogActionMenu] = useState<string | null>(null)
//   const [showVideoActionMenu, setShowVideoActionMenu] = useState<string | null>(null)
//   const [isApproving, setIsApproving] = useState(false)
//   const [isRejecting, setIsRejecting] = useState(false)

//   // Video modal states
//   const [showVideoModal, setShowVideoModal] = useState(false)
//   const [videoToView, setVideoToView] = useState<Video | null>(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [isMuted, setIsMuted] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(1)

//   // Blog modal states
//   const [showBlogModal, setShowBlogModal] = useState(false)
//   const [blogToView, setBlogToView] = useState<Blog | null>(null)

//   const blogActionMenuRef = useRef<HTMLDivElement>(null)
//   const videoActionMenuRef = useRef<HTMLDivElement>(null)
//   const videoModalRef = useRef<HTMLDivElement>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const blogModalRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     // fetchPendingBlogs()
//     // fetchPendingVideos()
//   }, [])

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (blogActionMenuRef.current && !blogActionMenuRef.current.contains(event.target as Node)) {
//         setShowBlogActionMenu(null)
//       }
//       if (videoActionMenuRef.current && !videoActionMenuRef.current.contains(event.target as Node)) {
//         setShowVideoActionMenu(null)
//       }
//       if (videoModalRef.current && !videoModalRef.current.contains(event.target as Node) && showVideoModal) {
//         setShowVideoModal(false)
//       }
//       if (blogModalRef.current && !blogModalRef.current.contains(event.target as Node) && showBlogModal) {
//         setShowBlogModal(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [showVideoModal, showBlogModal])

//   // Initialize video when component mounts
//   useEffect(() => {
//     if (videoRef.current && videoToView?.video) {
//       videoRef.current.load()
//     }
//   }, [videoToView?.video])

//   const fetchPendingBlogs = async () => {
//     setLoadingBlogs(true)
//     try {
//       const response = await getBlogByStatus("pending_approval")
//       if (response?.data?.blogs) {
//         setPendingBlogs(response.data.blogs)
//       } else if (response?.blogs) {
//         setPendingBlogs(response.blogs)
//       }
//     } catch (error) {
//       console.error("Error fetching pending blogs:", error)
//     } finally {
//       setLoadingBlogs(false)
//     }
//   }

//   const fetchPendingVideos = async () => {
//     setLoadingVideos(true)
//     try {
//       const response = await getVideoByStatus("pending_approval")
//       if (response?.data?.videos) {
//         setPendingVideos(response.data.videos)
//       } else if (response?.videos) {
//         setPendingVideos(response.videos)
//       }
//     } catch (error) {
//       console.error("Error fetching pending videos:", error)
//     } finally {
//       setLoadingVideos(false)
//     }
//   }

//   const handleApproveBlog = async (blogId: number) => {
//     setIsApproving(true)
//     try {
//       const response = await approveBlog(blogId)
//       if (response?.status === 200 || response?.status === 201 || response?.success === true) {
//         setPendingBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
//         setShowBlogActionMenu(null)
//       }
//     } catch (error) {
//       console.error("Error approving blog:", error)
//     } finally {
//       setIsApproving(false)
//     }
//   }

//   const handleRejectBlog = async (blogId: number) => {
//     setIsRejecting(true)
//     try {
//       const response = await rejectBlog(blogId)
//       if (response?.status === 200 || response?.status === 201 || response?.success === true) {
//         setPendingBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
//         setShowBlogActionMenu(null)
//       }
//     } catch (error) {
//       console.error("Error rejecting blog:", error)
//     } finally {
//       setIsRejecting(false)
//     }
//   }

//   const handleApproveVideo = async (videoId: number) => {
//     setIsApproving(true)
//     try {
//       const response = await approveVideo(videoId)
//       if (response?.status === 200 || response?.status === 201 || response?.success === true) {
//         setPendingVideos((prev) => prev.filter((video) => video.id !== videoId))
//         setShowVideoActionMenu(null)
//       }
//     } catch (error) {
//       console.error("Error approving video:", error)
//     } finally {
//       setIsApproving(false)
//     }
//   }

//   const handleRejectVideo = async (videoId: number) => {
//     setIsRejecting(true)
//     try {
//       const response = await rejectVideo(videoId)
//       if (response?.status === 200 || response?.status === 201 || response?.success === true) {
//         setPendingVideos((prev) => prev.filter((video) => video.id !== videoId))
//         setShowVideoActionMenu(null)
//       }
//     } catch (error) {
//       console.error("Error rejecting video:", error)
//     } finally {
//       setIsRejecting(false)
//     }
//   }

//   const handleViewVideo = (video: Video) => {
//     setVideoToView(video)
//     setShowVideoModal(true)
//     setShowVideoActionMenu(null)
//     // Reset video player states
//     setIsPlaying(false)
//     setCurrentTime(0)
//     setDuration(0)
//   }

//   const handleViewBlog = (blog: Blog) => {
//     //console.log("handleViewBlog called with:", blog) // Debug log
//     setBlogToView(blog)
//     setShowBlogModal(true)
//     setShowBlogActionMenu(null)
//     //console.log("Blog modal should show:", true) // Debug log
//   }

//   // Double-click handlers
//   const handleBlogDoubleClick = (blog: Blog, event: React.MouseEvent) => {
//     // Prevent double-click if clicking on action menu button
//     const target = event.target as HTMLElement
//     if (target.closest("button")) {
//       return
//     }
//     handleViewBlog(blog)
//   }

//   const handleVideoDoubleClick = (video: Video, event: React.MouseEvent) => {
//     // Prevent double-click if clicking on action menu button
//     const target = event.target as HTMLElement
//     if (target.closest("button")) {
//       return
//     }
//     handleViewVideo(video)
//   }

//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) return null
//     return imagePath.startsWith("http") ? imagePath : `${IMAGE_BASE_URL}${imagePath}`
//   }

//   const generateExcerpt = (content: string, maxLength = 100): string => {
//     const textContent = content.replace(/<[^>]*>/g, "")
//     return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   const formatTime = (time: number) => {
//     if (isNaN(time)) return "0:00"
//     const minutes = Math.floor(time / 60)
//     const seconds = Math.floor(time % 60)
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`
//   }

//   const formatViews = (views: number) => {
//     if (views >= 1000000) {
//       return `${(views / 1000000).toFixed(1)}M`
//     } else if (views >= 1000) {
//       return `${(views / 1000).toFixed(1)}K`
//     }
//     return views.toString()
//   }

//   // Video player functions
//   const handlePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause()
//       } else {
//         videoRef.current.play().catch((error) => {
//           console.error("Error playing video:", error)
//         })
//       }
//     }
//   }

//   const handleVideoPlay = () => {
//     setIsPlaying(true)
//   }

//   const handleVideoPause = () => {
//     setIsPlaying(false)
//   }

//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       setCurrentTime(videoRef.current.currentTime)
//     }
//   }

//   const handleLoadedMetadata = () => {
//     if (videoRef.current) {
//       setDuration(videoRef.current.duration)
//       videoRef.current.volume = volume
//     }
//   }

//   const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const time = Number.parseFloat(e.target.value)
//     if (videoRef.current && !isNaN(time)) {
//       videoRef.current.currentTime = time
//       setCurrentTime(time)
//     }
//   }

//   const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newVolume = Number.parseFloat(e.target.value)
//     setVolume(newVolume)
//     if (videoRef.current) {
//       videoRef.current.volume = newVolume
//     }
//     setIsMuted(newVolume === 0)
//   }

//   const toggleMute = () => {
//     if (videoRef.current) {
//       if (isMuted) {
//         videoRef.current.volume = volume
//         setIsMuted(false)
//       } else {
//         videoRef.current.volume = 0
//         setIsMuted(true)
//       }
//     }
//   }

//   const handleFullscreen = () => {
//     if (videoRef.current) {
//       if (videoRef.current.requestFullscreen) {
//         videoRef.current.requestFullscreen()
//       }
//     }
//   }

//   const filteredPendingBlogs = pendingBlogs.filter((blog) => {
//     const matchesSearch =
//       blog.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
//       blog.content.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
//       blog.author.username.toLowerCase().includes(blogSearchTerm.toLowerCase())
//     return matchesSearch
//   })

//   const filteredPendingVideos = pendingVideos.filter((video) => {
//     const matchesSearch =
//       video.title.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
//       video.description.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
//       video.creator.username.toLowerCase().includes(videoSearchTerm.toLowerCase())
//     return matchesSearch
//   })

//   const totalPendingBlogs = pendingBlogs.length
//   const totalPendingVideos = pendingVideos.length
//   const totalPending = totalPendingBlogs + totalPendingVideos

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-slate-800 mb-2">Pending Approvals</h2>
//         <p className="text-slate-600">Review and approve pending content submissions</p>
//         <p className="text-sm text-slate-500 mt-2">💡 Tip: Double-click on any item to view details</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-600">Total Pending</p>
//               <p className="text-2xl font-bold text-slate-800">{totalPending}</p>
//             </div>
//             <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//               <ClockIcon className="w-6 h-6 text-yellow-600" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-600">Pending Blogs</p>
//               <p className="text-2xl font-bold text-slate-800">{totalPendingBlogs}</p>
//             </div>
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <FileTextIcon className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-600">Pending Videos</p>
//               <p className="text-2xl font-bold text-slate-800">{totalPendingVideos}</p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
//               <VideoIcon className="w-6 h-6 text-red-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-8">
//         <div className="border-b border-slate-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => setActiveTab("blogs")}
//               className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
//                 activeTab === "blogs"
//                   ? "border-purple-500 text-purple-600"
//                   : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 <FileTextIcon className="w-4 h-4" />
//                 <span>Pending Blogs</span>
//                 <span className="bg-yellow-100 text-yellow-600 py-1 px-2 rounded-full text-xs">
//                   {totalPendingBlogs}
//                 </span>
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab("videos")}
//               className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
//                 activeTab === "videos"
//                   ? "border-purple-500 text-purple-600"
//                   : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 <VideoIcon className="w-4 h-4" />
//                 <span>Pending Videos</span>
//                 <span className="bg-yellow-100 text-yellow-600 py-1 px-2 rounded-full text-xs">
//                   {totalPendingVideos}
//                 </span>
//               </div>
//             </button>
//           </nav>
//         </div>
//       </div>

//       {activeTab === "blogs" && (
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
//           <div className="p-6 border-b border-slate-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <h3 className="text-xl font-semibold text-slate-800">Pending Blog Approval</h3>
//               <button
//                 onClick={fetchPendingBlogs}
//                 disabled={loadingBlogs}
//                 className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
//               >
//                 {loadingBlogs ? "Refreshing..." : "Refresh Pending"}
//               </button>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-4 mt-4">
//               <div className="relative flex-1">
//                 <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search pending blogs..."
//                   value={blogSearchTerm}
//                   onChange={(e) => setBlogSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="p-6">
//             {loadingBlogs ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
//                 <p className="text-slate-600">Loading pending blogs...</p>
//               </div>
//             ) : filteredPendingBlogs.length > 0 ? (
//               <div className="space-y-4">
//                 {filteredPendingBlogs.map((blog) => (
//                   <div
//                     key={blog.id}
//                     className="flex items-start justify-between p-4 border border-yellow-200 rounded-lg hover:border-yellow-300 hover:shadow-sm transition-all duration-200 bg-yellow-50/30 cursor-pointer"
//                     onClick={(e) => handleBlogDoubleClick(blog, e)}
//                     title="Double-click to view blog details"
//                   >
//                     <div className="flex space-x-4 flex-1">
//                       {blog.image && (
//                         <div className="flex-shrink-0">
//                           <Image
//                             src={getImageUrl(blog.image) || "/placeholder.svg"}
//                             alt={blog.title}
//                             width={80}
//                             height={80}
//                             className="rounded-lg object-cover"
//                           />
//                         </div>
//                       )}
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h4 className="font-semibold text-slate-800 text-lg">{blog.title}</h4>
//                           <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
//                             Pending Approval
//                           </span>
//                         </div>
//                         <p className="text-slate-600 text-sm mb-3 line-clamp-2">{generateExcerpt(blog.content, 150)}</p>
//                         <div className="flex items-center space-x-6 text-sm text-slate-500 mb-2">
//                           <span className="flex items-center space-x-1">
//                             <UserIcon className="w-4 h-4" />
//                             <span>by {blog.author.username}</span>
//                           </span>
//                           <span className="flex items-center space-x-1">
//                             <CalendarIcon className="w-4 h-4" />
//                             <span>{formatDate(blog.created_at)}</span>
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-4 text-xs text-slate-500">
//                           <span className="flex items-center space-x-1">
//                             <ThumbsUpIcon className="w-3 h-3" />
//                             <span>{blog.likes} likes</span>
//                           </span>
//                           <span className="flex items-center space-x-1">
//                             <MessageCircleIcon className="w-3 h-3" />
//                             <span>{blog.comments_count} comments</span>
//                           </span>
//                           <span className="flex items-center space-x-1">
//                             <span>ID: {blog.id}</span>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="relative ml-4">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setShowBlogActionMenu(showBlogActionMenu === blog.id.toString() ? null : blog.id.toString())
//                         }}
//                         className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
//                       >
//                         <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
//                       </button>
//                       {showBlogActionMenu === blog.id.toString() && (
//                         <div
//                           className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20"
//                           ref={blogActionMenuRef}
//                         >
//                           <button
//                             onClick={() => handleViewBlog(blog)}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
//                           >
//                             <EyeIcon className="w-4 h-4" />
//                             <span>View Blog</span>
//                           </button>
//                           <button
//                             onClick={() => handleApproveBlog(blog.id)}
//                             disabled={isApproving}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 disabled:opacity-50"
//                           >
//                             <CheckIcon className="w-4 h-4" />
//                             <span>{isApproving ? "Approving..." : "Approve"}</span>
//                           </button>
//                           <button
//                             onClick={() => handleRejectBlog(blog.id)}
//                             disabled={isRejecting}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
//                           >
//                             <XIcon className="w-4 h-4" />
//                             <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <ClockIcon className="w-8 h-8 text-yellow-600" />
//                 </div>
//                 <h3 className="text-lg font-medium text-slate-800 mb-2">No pending blogs</h3>
//                 <p className="text-slate-600 mb-4">
//                   {blogSearchTerm ? "No pending blogs match your search" : "All blogs have been reviewed"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "videos" && (
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
//           <div className="p-6 border-b border-slate-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <h3 className="text-xl font-semibold text-slate-800">Pending Video Approval</h3>
//               <button
//                 onClick={fetchPendingVideos}
//                 disabled={loadingVideos}
//                 className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
//               >
//                 {loadingVideos ? "Refreshing..." : "Refresh Pending"}
//               </button>
//             </div>
//             {/* Search */}
//             <div className="flex flex-col sm:flex-row gap-4 mt-4">
//               <div className="relative flex-1">
//                 <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search pending videos..."
//                   value={videoSearchTerm}
//                   onChange={(e) => setVideoSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="p-6">
//             {loadingVideos ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
//                 <p className="text-slate-600">Loading pending videos...</p>
//               </div>
//             ) : filteredPendingVideos.length > 0 ? (
//               <div className="space-y-4">
//                 {filteredPendingVideos.map((video) => (
//                   <div
//                     key={video.id}
//                     className="flex items-start justify-between p-4 border border-yellow-200 rounded-lg hover:border-yellow-300 hover:shadow-sm transition-all duration-200 bg-yellow-50/30 cursor-pointer"
//                     onClick={(e) => handleVideoDoubleClick(video, e)}
//                     title="Double-click to view video details"
//                   >
//                     <div className="flex space-x-4 flex-1">
//                       {video.thumbnail && (
//                         <div className="flex-shrink-0 relative">
//                           <Image
//                             src={getImageUrl(video.thumbnail) || "/placeholder.svg"}
//                             alt={video.title}
//                             width={120}
//                             height={80}
//                             className="rounded-lg object-cover"
//                           />
//                           <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
//                             <PlayIcon className="w-8 h-8 text-white" />
//                           </div>
//                           {video.duration_formatted && (
//                             <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
//                               {video.duration_formatted}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h4 className="font-semibold text-slate-800 text-lg">{video.title}</h4>
//                           <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
//                             Pending Approval
//                           </span>
//                         </div>
//                         <p className="text-slate-600 text-sm mb-3 line-clamp-2">
//                           {generateExcerpt(video.description, 150)}
//                         </p>
//                         <div className="flex items-center space-x-6 text-sm text-slate-500 mb-2">
//                           <span className="flex items-center space-x-1">
//                             <UserIcon className="w-4 h-4" />
//                             <span>by {video.creator.username}</span>
//                           </span>
//                           <span className="flex items-center space-x-1">
//                             <CalendarIcon className="w-4 h-4" />
//                             <span>{formatDate(video.created_at)}</span>
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-4 text-xs text-slate-500">
//                           <span className="flex items-center space-x-1">
//                             <EyeIcon className="w-3 h-3" />
//                             <span>{video.views || 0} views</span>
//                           </span>
//                           <span className="flex items-center space-x-1">
//                             <ThumbsUpIcon className="w-3 h-3" />
//                             <span>{video.likes} likes</span>
//                           </span>
//                           <span className="flex items-center space-x-1">
//                             <MessageCircleIcon className="w-3 h-3" />
//                             <span>{video.comments_count} comments</span>
//                           </span>
//                           <span className="flex items-center space-x-1">
//                             <span>ID: {video.id}</span>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="relative ml-4">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setShowVideoActionMenu(
//                             showVideoActionMenu === video.id.toString() ? null : video.id.toString(),
//                           )
//                         }}
//                         className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
//                       >
//                         <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
//                       </button>
//                       {showVideoActionMenu === video.id.toString() && (
//                         <div
//                           className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20"
//                           ref={videoActionMenuRef}
//                         >
//                           <button
//                             onClick={() => handleViewVideo(video)}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
//                           >
//                             <EyeIcon className="w-4 h-4" />
//                             <span>View Video</span>
//                           </button>
//                           <button
//                             onClick={() => handleApproveVideo(video.id)}
//                             disabled={isApproving}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 disabled:opacity-50"
//                           >
//                             <CheckIcon className="w-4 h-4" />
//                             <span>{isApproving ? "Approving..." : "Approve"}</span>
//                           </button>
//                           <button
//                             onClick={() => handleRejectVideo(video.id)}
//                             disabled={isRejecting}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
//                           >
//                             <XIcon className="w-4 h-4" />
//                             <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <PlayIcon className="w-8 h-8 text-yellow-600" />
//                 </div>
//                 <h3 className="text-lg font-medium text-slate-800 mb-2">No pending videos</h3>
//                 <p className="text-slate-600 mb-4">
//                   {videoSearchTerm ? "No pending videos match your search" : "All videos have been reviewed"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Blog Modal - Updated with TipTap Content Display */}
//       {showBlogModal && blogToView && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
//           <div
//             ref={blogModalRef}
//             className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition-all duration-200"
//           >
//             <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex-1 pr-4">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Content Review</h2>
//                   <div className="flex items-center space-x-4 text-sm text-gray-600">
//                     <span>by {blogToView.author.username}</span>
//                     <span className="flex items-center space-x-1">
//                       <CalendarIcon className="w-4 h-4" />
//                       <span>{formatDate(blogToView.created_at)}</span>
//                     </span>
//                     <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending Review</span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowBlogModal(false)
//                     setBlogToView(null)
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
//                 >
//                   <XIcon className="w-6 h-6 text-gray-500" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
//               {/* Blog Header */}
//               <div className="mb-8">
//                 {blogToView.image && (
//                   <div className="mb-6">
//                     <Image
//                       src={getImageUrl(blogToView.image) || "/placeholder.svg"}
//                       alt={blogToView.title}
//                       width={800}
//                       height={400}
//                       className="w-full h-80 object-cover rounded-2xl shadow-lg"
//                     />
//                   </div>
//                 )}
//                 <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{blogToView.title}</h1>
//                 <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
//                       <span className="text-white font-semibold text-sm">
//                         {blogToView.author.username.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <span className="font-medium">by {blogToView.author.username}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <CalendarIcon className="w-4 h-4" />
//                     <span>{formatDate(blogToView.created_at)}</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-6">
//                   <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-xl">
//                     <HeartIcon className="w-5 h-5 text-red-500" />
//                     <span className="font-medium text-red-700">{blogToView.likes} likes</span>
//                   </div>
//                   <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl">
//                     <MessageCircleIcon className="w-5 h-5 text-blue-500" />
//                     <span className="font-medium text-blue-700">{blogToView.comments_count} comments</span>
//                   </div>
//                   <div className="px-4 py-2 bg-gray-100 rounded-xl">
//                     <span className="text-sm font-medium text-gray-700">ID: {blogToView.id}</span>
//                   </div>
//                 </div>
//               </div>
//               {/* Blog Content - Now with proper TipTap formatting */}
//               <div className="mb-8">
//                 <TipTapContentDisplay content={blogToView.content} className="text-gray-700" />
//               </div>
//               {/* Author Info */}
//               <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8">
//                 <h4 className="font-bold text-gray-900 mb-4">About the Author</h4>
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
//                     <span className="text-white font-bold">{blogToView.author.username.charAt(0).toUpperCase()}</span>
//                   </div>
//                   <div>
//                     <p className="font-bold text-gray-900">{blogToView.author.username}</p>
//                     <p className="text-gray-600">{blogToView.author.email}</p>
//                     <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mt-2">
//                       {blogToView.author.role}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               {/* Review Status Section - Instead of Comments */}
//               <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
//                 <div className="flex items-center space-x-3 mb-4">
//                   <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//                     <ClockIcon className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-gray-900">Content Under Review</h4>
//                     <p className="text-yellow-700 text-sm">This blog post is pending approval and review</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                   <div className="bg-white/50 rounded-xl p-4">
//                     <h5 className="font-semibold text-gray-900 mb-2">Review Status</h5>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
//                       <span className="text-sm text-gray-700">Awaiting Admin Review</span>
//                     </div>
//                   </div>
//                   <div className="bg-white/50 rounded-xl p-4">
//                     <h5 className="font-semibold text-gray-900 mb-2">Submission Date</h5>
//                     <p className="text-sm text-gray-700">{formatDate(blogToView.created_at)}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Video Modal */}
//       {showVideoModal && videoToView && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
//           <div
//             ref={videoModalRef}
//             className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-200"
//           >
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 border-b border-gray-200 flex-shrink-0">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1 pr-4">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Content Review</h2>
//                   <div className="flex items-center space-x-4 text-sm text-gray-600">
//                     <span>by {videoToView.creator?.username}</span>
//                     <span className="flex items-center space-x-1">
//                       <CalendarIcon className="w-4 h-4" />
//                       <span>{formatDate(videoToView.created_at)}</span>
//                     </span>
//                     <span className="flex items-center space-x-1">
//                       <ClockIcon className="w-4 h-4" />
//                       <span>{videoToView.duration_formatted}</span>
//                     </span>
//                     <span className="flex items-center space-x-1">
//                       <EyeIcon className="w-4 h-4" />
//                       <span>{formatViews(videoToView.views || 0)} views</span>
//                     </span>
//                     <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending Review</span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowVideoModal(false)
//                     setVideoToView(null)
//                     setIsPlaying(false)
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
//                 >
//                   <XIcon className="w-6 h-6 text-gray-500" />
//                 </button>
//               </div>
//             </div>
//             {/* Modal Content - Scrollable */}
//             <div className="flex-1 overflow-y-auto">
//               {/* Video Player */}
//               <div className="p-8 border-b border-gray-200">
//                 <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
//                   {/* <video
//                     ref={videoRef}
//                     className="w-full aspect-video object-contain"
//                     onTimeUpdate={handleTimeUpdate}
//                     onLoadedMetadata={handleLoadedMetadata}
//                     onPlay={handleVideoPlay}
//                     onPause={handleVideoPause}
//                     poster={getImageUrl(videoToView.thumbnail) || "/placeholder.svg"}
//                     preload="metadata"
//                     crossOrigin="anonymous"
//                   >
//                     <source src={getImageUrl(videoToView.video) || videoToView.video} type="video/mp4" />
//                     <source src={getImageUrl(videoToView.video) || videoToView.video} type="video/webm" />
//                     <source src={getImageUrl(videoToView.video) || videoToView.video} type="video/ogg" />
//                     Your browser does not support the video tag.
//                   </video> */}

//                   <Video videoId={videoToView.video_id}></Video>
//                   {/* Video Controls */}
//                   {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
//                     <div className="flex items-center space-x-4">
//                       <button
//                         onClick={handlePlayPause}
//                         className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
//                       >
//                         {isPlaying ? (
//                           <PauseIcon className="w-6 h-6 text-white" />
//                         ) : (
//                           <PlayIcon className="w-6 h-6 text-white" />
//                         )}
//                       </button>
//                       <div className="flex-1 flex items-center space-x-3">
//                         <span className="text-white text-sm min-w-[50px] font-medium">{formatTime(currentTime)}</span>
//                         <input
//                           type="range"
//                           min="0"
//                           max={duration || 0}
//                           value={currentTime}
//                           onChange={handleSeek}
//                           className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
//                           style={{
//                             background: `linear-gradient(to right, #ffffff ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`,
//                           }}
//                         />
//                         <span className="text-white text-sm min-w-[50px] font-medium">{formatTime(duration)}</span>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
//                           {isMuted ? (
//                             <VolumeXIcon className="w-5 h-5 text-white" />
//                           ) : (
//                             <Volume2Icon className="w-5 h-5 text-white" />
//                           )}
//                         </button>
//                         <input
//                           type="range"
//                           min="0"
//                           max="1"
//                           step="0.1"
//                           value={isMuted ? 0 : volume}
//                           onChange={handleVolumeChange}
//                           className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
//                         />
//                         <button
//                           onClick={handleFullscreen}
//                           className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                         >
//                           <MaximizeIcon className="w-5 h-5 text-white" />
//                         </button>
//                       </div>
//                     </div>
//                   </div> */}
//                 </div>
//               </div>
//               {/* Video Details */}
//               <div className="p-8 border-b border-gray-200">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{videoToView.title}</h1>
//                 <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
//                       <span className="text-white font-semibold">
//                         {videoToView.creator?.username.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <span className="font-medium">by {videoToView.creator?.username}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <CalendarIcon className="w-4 h-4" />
//                     <span>{formatDate(videoToView.created_at)}</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-6 mb-6">
//                   <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl">
//                     <EyeIcon className="w-5 h-5 text-blue-500" />
//                     <span className="font-medium text-blue-700">{formatViews(videoToView.views || 0)} views</span>
//                   </div>
//                   <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-xl">
//                     <HeartIcon className="w-5 h-5 text-red-500" />
//                     <span className="font-medium text-red-700">{videoToView.likes} likes</span>
//                   </div>
//                   <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-xl">
//                     <MessageCircleIcon className="w-5 h-5 text-green-500" />
//                     <span className="font-medium text-green-700">{videoToView.comments_count} comments</span>
//                   </div>
//                   <div className="px-4 py-2 bg-gray-100 rounded-xl">
//                     <span className="text-sm font-medium text-gray-700">ID: {videoToView.id}</span>
//                   </div>
//                 </div>
//               </div>
//               {/* Video Description */}
//               <div className="p-8 border-b border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
//                 <div className="prose prose-gray max-w-none">
//                   <TipTapContentDisplay content={videoToView.description} className="text-gray-700" />
//                 </div>
//               </div>
//               {/* Creator Info */}
//               <div className="p-8 border-b border-gray-200">
//                 <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
//                   <h4 className="font-bold text-gray-900 mb-4">About the Creator</h4>
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
//                       <span className="text-white font-bold">
//                         {videoToView.creator?.username.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="font-bold text-gray-900">{videoToView.creator?.username}</p>
//                       <p className="text-gray-600">{videoToView.creator?.email}</p>
//                       <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mt-2">
//                         {videoToView.creator?.role}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* Review Status Section */}
//               <div className="p-8">
//                 <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
//                   <div className="flex items-center space-x-3 mb-4">
//                     <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//                       <ClockIcon className="w-5 h-5 text-yellow-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-gray-900">Video Under Review</h4>
//                       <p className="text-yellow-700 text-sm">This video is pending approval and review</p>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//                     <div className="bg-white/50 rounded-xl p-4">
//                       <h5 className="font-semibold text-gray-900 mb-2">Review Status</h5>
//                       <div className="flex items-center space-x-2">
//                         <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
//                         <span className="text-sm text-gray-700">Awaiting Admin Review</span>
//                       </div>
//                     </div>
//                     <div className="bg-white/50 rounded-xl p-4">
//                       <h5 className="font-semibold text-gray-900 mb-2">Submission Date</h5>
//                       <p className="text-sm text-gray-700">{formatDate(videoToView.created_at)}</p>
//                     </div>
//                     <div className="bg-white/50 rounded-xl p-4">
//                       <h5 className="font-semibold text-gray-900 mb-2">Comments</h5>
//                       <p className="text-sm text-gray-700">Comments will be available after approval</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <style jsx>{`
//             .slider::-webkit-slider-thumb {
//               appearance: none;
//               width: 20px;
//               height: 20px;
//               border-radius: 50%;
//               background: #ffffff;
//               cursor: pointer;
//               border: 3px solid #ffffff;
//               box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
//             }
//             .slider::-moz-range-thumb {
//               width: 20px;
//               height: 20px;
//               border-radius: 50%;
//               background: #ffffff;
//               cursor: pointer;
//               border: 3px solid #ffffff;
//               box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
//             }
//           `}</style>
//         </div>
//       )}
//     </div>
//   )
// }
