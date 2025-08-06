"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import {
  XIcon,
  CalendarIcon,
  ClockIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  SendIcon,
  EditIcon,
  CheckIcon,
  TrashIcon,
  MoreVerticalIcon,
  UserPlus,
  Loader2,
  UserCheck,
} from "lucide-react"
import { useSelector } from "react-redux"
import { addCommentToVideo, editVideoComment, deleteVideoComment, addView, addWatchTime, removeFollowing,addFollowing } from "@/api/content"
import TipTapContentDisplay from "../tiptap-content-display"
import { Stream } from "@cloudflare/stream-react"
interface VideoModalProps {
  video: any
  onClose: () => void
  onToggleLike: (videoId: number) => void
  onToggleFavorite: (videoId: number) => void
  onRefreshVideos: () => void
}
export function VideoModal({ video, onClose, onToggleLike, onToggleFavorite, onRefreshVideos }: VideoModalProps) {
  const user = useSelector((state: any) => state.user)
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [showCommentMenu, setShowCommentMenu] = useState<number | null>(null)
  // Watch time tracking state
  const [startTime, setStartTime] = useState<number | null>(null)
  const [totalWatchTime, setTotalWatchTime] = useState(0)
  const [hasViewBeenAdded, setHasViewBeenAdded] = useState(false)
  const [loading, setLoading] = useState(true) 
  const modalRef = useRef<HTMLDivElement>(null)
  const commentMenuRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setFollowing] = useState(video.is_following) // State to track

  const watchTimeRef = useRef(0) // Use ref to ensure we have the latest value in cleanup
  // Update ref whenever totalWatchTime changes
  useEffect(() => {
    watchTimeRef.current = totalWatchTime
  }, [totalWatchTime])
  const handlePlay = () => {
    console.log("Video started playing")
    setStartTime(Date.now())
    // Only call addView once per video session
    if (video && !video.is_viewed && !hasViewBeenAdded) {
      addView(video.id)
        .then(() => {
          setHasViewBeenAdded(true)
          console.log("View added successfully")
        })
        .catch((error) => console.error("Error adding view:", error))
    }
  }
  const handlePause = () => {
    console.log("Video paused")
    if (startTime) {
      const now = Date.now()
      const sessionDuration = Math.floor((now - startTime) / 1000) // in seconds
      setTotalWatchTime((prev) => prev + sessionDuration)
      setStartTime(null)
      console.log("Session watch time:", sessionDuration, "seconds")
    }
  }
  const handleEnded = () => {
    console.log("Video ended")
    if (startTime) {
      const now = Date.now()
      const sessionDuration = Math.floor((now - startTime) / 1000) // in seconds
      setTotalWatchTime((prev) => prev + sessionDuration)
      setStartTime(null)
      console.log("Final session watch time:", sessionDuration, "seconds")
    }
  }
  // Function to send watch time to API
  const sendWatchTimeToAPI = async (watchTime: number) => {
    if (watchTime > 0) {
      try {
        await addWatchTime(video.id, watchTime)
        console.log("Watch time sent to API:", watchTime, "seconds")
      } catch (error) {
        console.error("Error sending watch time:", error)
      }
    } else {
      console.log("Watch time is 0, not calling API")
    }
  }
  // Handle modal close
  const handleClose = () => {
    // Calculate any remaining watch time if video is currently playing
    let finalWatchTime = totalWatchTime
    if (startTime) {
      const now = Date.now()
      const sessionDuration = Math.floor((now - startTime) / 1000)
      finalWatchTime += sessionDuration
    }
    console.log("Modal closing, final watch time:", finalWatchTime, "seconds")
    // Send watch time to API before closing
    if (finalWatchTime > 0) {
      sendWatchTimeToAPI(finalWatchTime)
    }
    onClose()
  }
  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
      if (commentMenuRef.current && !commentMenuRef.current.contains(event.target as Node)) {
        setShowCommentMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [totalWatchTime, startTime]) // Include dependencies for closure
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Calculate final watch time including current session
      let finalWatchTime = watchTimeRef.current
      if (startTime) {
        const now = Date.now()
        const sessionDuration = Math.floor((now - startTime) / 1000)
        finalWatchTime += sessionDuration
      }
      console.log("Component unmounting, final watch time:", finalWatchTime, "seconds")
      // Send watch time to API on unmount
      if (finalWatchTime > 0) {
        sendWatchTimeToAPI(finalWatchTime)
      }
    }
  }, []) // Empty dependency array for unmount only
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }
  const formatWatchTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const pad = (num: number) => String(num).padStart(2, "0")
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    } else {
      return `${pad(minutes)}:${pad(seconds)}`
    }
  }
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      await addCommentToVideo(video.id, newComment.trim())
      setNewComment("")
      onRefreshVideos()
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }
  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id)
    setEditCommentText(comment.comment)
    setShowCommentMenu(null)
  }
  const handleSaveEditComment = async (commentId: number) => {
    if (!editCommentText.trim()) return
    try {
      await editVideoComment(commentId, editCommentText.trim())
      setEditingCommentId(null)
      setEditCommentText("")
      onRefreshVideos()
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }
  const handleDeleteComment = async (commentId: number) => {
    setShowCommentMenu(null)
    try {
      await deleteVideoComment(commentId)
      onRefreshVideos()
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText("")
  }
  const toggleCommentMenu = (commentId: number) => {
    setShowCommentMenu(showCommentMenu === commentId ? null : commentId)
  }
  const handleLike = async () => {
    try {
      await onToggleLike(video.id)
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }
 const handleClick=async()=>{
    setIsLoading(true)
    try {
      if (isFollowing) {
        await removeFollowing(video.author.id)
        setFollowing(false)
      } else {
        await addFollowing(video.author.id)
        setFollowing(true)
      }
      onRefreshVideos()
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{video.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <span>by {video.creator?.username || video.author?.username}</span>
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(video.created_at)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{video.duration_formatted || video.duration}</span>
                </span>
              </div>
                <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 mt-2 px-5 py-2 rounded-full transition-all duration-300 shadow-sm border font-medium
        ${isFollowing 
          ? 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300' 
          : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500'
        }
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
    >
      {isLoading ? (
        <Loader2 className="animate-spin w-5 h-5" />
      ) : isFollowing ? (
        <>
          <UserCheck className="w-5 h-5 text-green-600" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-5 h-5 text-white" />
          <span>Follow</span>
        </>
      )}
    </button>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
              <XIcon className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>
        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative rounded-lg overflow-hidden">
              <div className="w-full h-full rounded-lg overflow-hidden">
                <div style={{ objectFit: "cover", width: "100%", height: "100%" }}>
                   {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
          <div className="loader" /> 
               <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white"></div>

        </div>
      )}
                  <Stream
                    controls
                    autoplay={false}
                    responsive
                    src={video.video_id}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                      onLoadedData={() => setLoading(false)}
                      onWaiting={() => setLoading(true)}
                 
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Video Description */}
          <div className="p-6 border-b border-slate-200">
            <div className="prose prose-slate max-w-none">
              <TipTapContentDisplay content={video.description} className="text-gray-700" />
            </div>
          </div>
          {/* Engagement Section */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  video.is_liked
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <ThumbsUpIcon className={`w-5 h-5 ${video.is_liked ? "fill-current" : ""}`} />
                <span>{video.likes} Likes</span>
              </button>
            </div>
          </div>
          {/* Comments Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Comments ({video.comments_count || 0})</h3>
            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-purple-600">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <SendIcon className="w-4 h-4" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            {/* Comments List */}
            <div className="space-y-4">
              {video.comments && video.comments.length > 0 ? (
                video.comments
                  .sort((a: any, b: any) => new Date(b.commented_at).getTime() - new Date(a.commented_at).getTime())
                  .map((comment: any) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-slate-600">
                          {comment.commenter.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-slate-800 text-sm">{comment.commenter.username}</span>
                              <span className="text-xs text-slate-500">{formatCommentDate(comment.commented_at)}</span>
                            </div>
                            {/* Comment Actions Menu */}
                            {user && comment.commented_by === user.id && (
                              <div className="relative" ref={commentMenuRef}>
                                <button
                                  onClick={() => toggleCommentMenu(comment.id)}
                                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                                >
                                  <MoreVerticalIcon className="w-3 h-3 text-slate-500" />
                                </button>
                                {showCommentMenu === comment.id && (
                                  <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                                    <button
                                      onClick={() => handleEditComment(comment)}
                                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                                    >
                                      <EditIcon className="w-3 h-3 text-slate-500" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment.id)}
                                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <TrashIcon className="w-3 h-3 text-red-500" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows={2}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSaveEditComment(comment.id)
                                  }
                                  if (e.key === "Escape") {
                                    handleCancelEdit()
                                  }
                                }}
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSaveEditComment(comment.id)}
                                  disabled={!editCommentText.trim()}
                                  className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                                >
                                  <CheckIcon className="w-3 h-3" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1 bg-slate-300 text-slate-700 rounded text-xs hover:bg-slate-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-slate-700 text-sm">{comment.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircleIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
