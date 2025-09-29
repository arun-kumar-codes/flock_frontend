"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import {
  X,
  Calendar,
  Clock,
  ThumbsUp,
  MessageCircle,
  Send,
  Edit,
  Check,
  Trash,
  MoreVertical,
  UserCheck,
  Loader2,
  UserPlus,
} from "lucide-react"
import Image from "next/image"
import { addComment, editComments, deleteComment, viewBLog, addFollowing, removeFollowing } from "@/api/content"
import { useSelector } from "react-redux"
import TipTapContentDisplay from "@/components/tiptap-content-display"
import { useRouter } from "next/navigation"
import profileImg from "../../assets/profile.png"

interface BlogModalProps {
  blog: any
  onClose: () => void
  onToggleLike: (blogId: number) => void
  onRefreshBlogs: () => void
}

export function BlogModal({ blog, onClose, onToggleLike, onRefreshBlogs }: BlogModalProps) {
  const user = useSelector((state: any) => state.user)
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(blog.is_liked)
  const [likeCount, setLikeCount] = useState(blog.likes)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [showCommentMenu, setShowCommentMenu] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const commentMenuRef = useRef<HTMLDivElement>(null)
  const [isFollowing, setFollowing] = useState(blog.is_following_author)
  const [isLoading, setIsLoading] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState<{ [key: number]: boolean }>({})
  const router = useRouter()
  const commentsToShow = [...blog.comments].reverse()
  const [isSaving, setIsSaving] = useState(false)
  const [commentPost,setCommentPost]=useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }

      // Check if click is outside the open comment menu
      if (showCommentMenu !== null) {
        console.log(showCommentMenu)
        const menu = document.getElementById(`comment-menu-${showCommentMenu}`)
        if (menu && !menu.contains(event.target as Node)) {
          setShowCommentMenu(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose, showCommentMenu])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleRoute = () => {
    //console.log("user:::",user);
    if (user.isLogin) {
      return true
    }
    router.push("/login")
  }

  const handleViewBlog = async () => {
    try {
      if (!handleRoute()) {
        return
      }

      await viewBLog(blog.id)
    } catch (error) {
      console.error("Error viewing blog:", error)
    }
  }

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString + "z")
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!handleRoute()) {
      return
    }
    if (!newComment.trim()) return
    setCommentPost(true);

    try {
      await addComment(blog.id, newComment.trim())
      setNewComment("")
      onRefreshBlogs()
    } catch (error) {
      console.error("Error adding comment:", error)
    }finally{
      setCommentPost(false);
    }
  }

  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id)
    setEditCommentText(comment.comment)
    setShowCommentMenu(null)
  }

  const handleSaveEditComment = async (commentId: number) => {
    if (!editCommentText.trim()) return

    setIsSaving(true)

    try {
      await editComments(commentId, editCommentText.trim())
      setEditingCommentId(null)
      setEditCommentText("")
      onRefreshBlogs()
    } catch (error) {
      console.error("Error updating comment:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    setShowCommentMenu(null)
    try {
      await deleteComment(commentId)
      onRefreshBlogs()
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
    if (!handleRoute()) {
      return
    }

    setIsLiked((prev: boolean) => !prev)
    setLikeCount((prev: number) => (isLiked ? prev - 1 : prev + 1))

    // Trigger animation
    setLikeAnimation((prev) => ({ ...prev, [blog.id]: true }))
    setTimeout(() => {
      setLikeAnimation((prev) => ({ ...prev, [blog.id]: false }))
    }, 500)

    try {
      await onToggleLike(blog.id)
      onRefreshBlogs()
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  useEffect(() => {
    if (!blog.is_viewed && user.isLogin) {
      handleViewBlog()
    }
  })

  const handleFollowClick = async () => {
    if (!handleRoute()) {
      return
    }
    setIsLoading(true)

    try {
      if (isFollowing) {
        await removeFollowing(blog.author.id)
        setFollowing(false)
      } else {
        await addFollowing(blog.author.id)
        setFollowing(true)
      }
      onRefreshBlogs()
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
        className="theme-bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 theme-border-b flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold theme-text-primary mb-2">{blog.title}</h2>
              <div className="flex items-center space-x-4 text-sm theme-text-secondary">
                <span>by {blog.author.username}</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.created_at)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </span>
              </div>
              <button
                onClick={handleFollowClick}
                disabled={isLoading}
                className={`flex items-center gap-2 mt-2 px-5 py-2 rounded-full transition-all duration-300 shadow-sm border font-medium ${isFollowing
                    ? "theme-button-secondary theme-text-secondary hover:theme-text-primary theme-border"
                    : "theme-button-primary text-white hover:opacity-90"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
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
            <button onClick={onClose} className="p-2 theme-button-secondary rounded-lg transition-colors flex-shrink-0">
              <X className="w-6 h-6 theme-text-muted" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Blog Image */}
          {blog.image && (
            <div className="p-6 theme-border-b">
              <Image
                src={blog.image || "/placeholder.svg"}
                alt={blog.title}
                width={800}
                height={400}
                className="w-full object-cover rounded-lg"
              />
            </div>
          )}
          {/* Blog Content */}
          <div className="p-6 pt-0 theme-border-b">
            <TipTapContentDisplay content={blog.content} className="theme-text-secondary" />
          </div>

          {/* Engagement Section */}
          <div className="p-6 theme-border-b">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
                    : "theme-button-secondary theme-text-secondary hover:theme-text-primary"
                  }`}
              >
                <ThumbsUp
                  className={`w-5 h-5 ${isLiked ? "fill-current" : ""} ${likeAnimation[blog.id] ? "animate-pop-purple" : ""}`}
                />
                <span>{likeCount} Likes</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold theme-text-primary mb-4">Comments ({blog.comments_count})</h3>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex space-x-3">
                <Image
                  src={user.profileImage ? user.profileImage : profileImg || "/placeholder.svg"}
                  alt="Your avatar"
                  width={40}
                  height={40}
                  className="rounded-full flex-shrink-0 w-10 h-10 object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 theme-input rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim()||commentPost}
                      className="px-4 py-2 theme-button-primary text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {commentsToShow.map((comment: any) => (
                <div key={comment.id} className="flex space-x-3 items-center">
                  <Image
                    src={
                      comment.commenter.profile_picture
                        ? comment.commenter.profile_picture
                        : profileImg || "/placeholder.svg"
                    }
                    alt={comment.commenter.username}
                    width={40}
                    height={40}
                    className="rounded-full flex-shrink-0 w-10 h-10"
                  />
                  <div className="flex-1">
                    <div className="theme-bg-secondary rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium theme-text-primary text-sm">{comment.commenter.username}</span>
                          <span className="text-xs theme-text-muted">{formatCommentDate(comment.commented_at)}</span>
                        </div>

                        {/* Comment Actions Menu */}
                        {user && comment.commented_by === user.id && (
                          <div className="relative" ref={commentMenuRef}>
                            <button
                              onClick={() => toggleCommentMenu(comment.id)}
                              className="p-1 theme-button-secondary rounded transition-colors"
                            >
                              <MoreVertical className="w-3 h-3 theme-text-muted" />
                            </button>
                            {showCommentMenu === comment.id && (
                              <div
                                id={`comment-menu-${comment.id}`}
                                className="absolute right-0 top-full mt-1 w-32 theme-bg-card rounded-lg shadow-lg theme-border py-1 z-10"
                              >
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:theme-bg-secondary transition-colors"
                                >
                                  <Edit className="w-3 h-3 theme-text-muted" />
                                  <span className="theme-text-secondary">Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  <Trash className="w-3 h-3 text-red-500" />
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
                            className="w-full p-2 theme-input rounded text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                              disabled={!editCommentText.trim() || isSaving}
                              className="px-3 py-1 theme-button-primary cursor-pointer text-white rounded text-xs hover:opacity-90 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              <span>{isSaving ? "Saving..." : "Save"}</span>
                            </button>

                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 theme-button-secondary cursor-pointer  theme-text-secondary rounded text-xs hover:theme-text-primary transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="theme-text-secondary text-sm">{comment.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {blog.comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                <p className="theme-text-muted">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
