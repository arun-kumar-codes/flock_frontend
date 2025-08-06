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
  UserCheck,
  Loader2,
  UserPlus,
} from "lucide-react"
import Image from "next/image"
import profileImg from "@/assets/profile.png"
import { addComment, editComments, deleteComment,viewBLog ,addFollowing,removeFollowing} from "@/api/content"
import { useSelector } from "react-redux"
import TipTapContentDisplay from "@/components/tiptap-content-display"

interface BlogModalProps {
  blog: any
  onClose: () => void
  onToggleLike: (blogId: number) => void
  onToggleFavorite: (blogId: number) => void
  onRefreshBlogs: () => void
}

export function BlogModal({ blog, onClose, onToggleLike, onToggleFavorite, onRefreshBlogs }: BlogModalProps) {
  const user = useSelector((state: any) => state.user)
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [showCommentMenu, setShowCommentMenu] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const commentMenuRef = useRef<HTMLDivElement>(null)
  const [isFollowing, setFollowing] = useState(blog.is_following_author);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
      if (commentMenuRef.current && !commentMenuRef.current.contains(event.target as Node)) {
        setShowCommentMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewBlog = async () => {
    try {
      await viewBLog(blog.id)
    } catch (error) {
      console.error("Error viewing blog:", error) 
    }}

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await addComment(blog.id, newComment.trim())
      setNewComment("")
      onRefreshBlogs()
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
      await editComments(commentId, editCommentText.trim())
      setEditingCommentId(null)
      setEditCommentText("")
      onRefreshBlogs()
    } catch (error) {
      console.error("Error updating comment:", error)
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
    await onToggleLike(blog.id)
    onRefreshBlogs()
  }
  useEffect(() => {
    if (!blog.is_viewed) {
      handleViewBlog() 
    }
  }) 

  const handleClick=async()=>{
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{blog.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <span>by {blog.author.username}</span>
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(blog.created_at)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{blog.category}</span>
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
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
              <XIcon className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Blog Image */}
          {blog.image && (
            <div className="p-6 border-b border-slate-200">
              <Image
                src={blog.image || "/placeholder.svg"}
                alt={blog.title}
                width={800}
                height={400}
                className="w-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Blog Content - Now with proper TipTap formatting */}
          <div className="p-6 border-b border-slate-200">
            <TipTapContentDisplay content={blog.content} className="text-slate-700" />
          </div>

          {/* Engagement Section */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  blog.is_liked
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <ThumbsUpIcon className={`w-5 h-5 ${blog.is_liked ? "fill-current" : ""}`} />
                <span>{blog.likes} Likes</span>
              </button>
{/* 
              <button
                onClick={() => onToggleFavorite(blog.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  blog.isFavorite
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <HeartIcon className={`w-5 h-5 ${blog.isFavorite ? "fill-current" : ""}`} />
                <span>{blog.isFavorite ? "Favorited" : "Add to Favorites"}</span>
              </button> */}
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Comments ({blog.comments_count})</h3>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex space-x-3">
                <Image
                  src={profileImg || "/placeholder.svg"}
                  alt="Your avatar"
                  
                  className="rounded-full flex-shrink-0 w-10 h-10"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
              {blog.comments
                .sort((a: any, b: any) => new Date(b.commented_at).getTime() - new Date(a.commented_at).getTime())
                .map((comment: any) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Image
                      src={profileImg || "/placeholder.svg"}
                      alt={comment.commenter.username}
                    
                      className="rounded-full flex-shrink-0 w-10 h-10"
                    />
                    <div className="flex-1">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-slate-800 text-sm">{comment.commenter.username}</span>
                            <span className="text-xs text-slate-500">{formatCommentDate(comment.commented_at)}</span>
                          </div>

                          {/* Comment Actions Menu */}
                          {user && comment.commented_by === user.id && (
                            <div className="relative">
                              <button
                                onClick={() => toggleCommentMenu(comment.id)}
                                className="p-1 hover:bg-slate-200 rounded transition-colors"
                              >
                                <MoreVerticalIcon className="w-3 h-3 text-slate-500" />
                              </button>
                              {showCommentMenu === comment.id && (
                                <div
                                  className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10"
                                  ref={commentMenuRef}
                                >
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
                              className="w-full p-2 border border-slate-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
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
                ))}
            </div>

            {blog.comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircleIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
