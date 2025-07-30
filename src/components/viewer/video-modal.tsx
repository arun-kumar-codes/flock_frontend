"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import {
  XIcon,
  CalendarIcon,
  ClockIcon,
  ThumbsUpIcon,
  HeartIcon,
  MessageCircleIcon,
  SendIcon,
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  MaximizeIcon,
  EditIcon,
  CheckIcon,
  TrashIcon,
  MoreVerticalIcon,
  EyeIcon,
} from "lucide-react"
import { useSelector } from "react-redux"
import { addCommentToVideo, editVideoComment, deleteVideoComment } from "@/api/content"
import TipTapContentDisplay from "../tiptap-content-display"

interface VideoModalProps {
  video: any
  onClose: () => void
  onToggleLike: (videoId: number) => void
  onToggleFavorite: (videoId: number) => void
  onRefreshVideos: () => void
}

export function VideoModal({ video, onClose, onToggleLike, onToggleFavorite, onRefreshVideos }: VideoModalProps) {
  const user = useSelector((state: any) => state.user)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [showCommentMenu, setShowCommentMenu] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const commentMenuRef = useRef<HTMLDivElement>(null)

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

  // Initialize video when component mounts
  useEffect(() => {
    if (videoRef.current && video.video) {
      videoRef.current.load() // Reload the video element
    }
  }, [video.video])

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

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
        })
      }
    }
  }

  const handleVideoPlay = () => {
    setIsPlaying(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      videoRef.current.volume = volume
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (videoRef.current && !isNaN(time)) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
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
                <span className="flex items-center space-x-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{formatViews(video.views)} views</span>
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{video.category}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
              <XIcon className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative  rounded-lg overflow-hidden">


              
              <video
                ref={videoRef}
                className="w-full aspect-video object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                poster={video.thumbnail}
                preload="metadata"
                crossOrigin="anonymous"
              >
                <source src={video.video || video.videoUrl} type="video/mp4" />
                <source src={video.video || video.videoUrl} type="video/webm" />
                <source src={video.video || video.videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayPause}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-5 h-5 text-white" />
                    ) : (
                      <PlayIcon className="w-5 h-5 text-white" />
                    )}
                  </button>

                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-white text-sm min-w-[40px]">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ffffff ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`,
                      }}
                    />
                    <span className="text-white text-sm min-w-[40px]">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button onClick={toggleMute} className="p-1 hover:bg-white/20 rounded transition-colors">
                      {isMuted ? (
                        <VolumeXIcon className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2Icon className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <button onClick={handleFullscreen} className="p-1 hover:bg-white/20 rounded transition-colors">
                      <MaximizeIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Video Description */}
          <div className="p-6 border-b border-slate-200">
            <div className="prose prose-slate max-w-none">
              {/* <p className="text-slate-700 leading-relaxed">{video.description}</p> */}
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
              <button
                onClick={() => onToggleFavorite(video.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  video.isFavorite
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <HeartIcon className={`w-5 h-5 ${video.isFavorite ? "fill-current" : ""}`} />
                <span>{video.isFavorite ? "Favorited" : "Add to Favorites"}</span>
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
