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
  MessageSquareOff,
} from "lucide-react"
import { useSelector } from "react-redux"
import {
  addCommentToVideo,
  editVideoComment,
  deleteVideoComment,
  addView,
  addWatchTime,
  removeFollowing,
  addFollowing,
} from "@/api/content"
import TipTapContentDisplay from "../tiptap-content-display"
import { Stream } from "@cloudflare/stream-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import profileImg from "../../assets/profile.png"
import Video from "../Video"
interface VideoModalProps {
  video: any
  onClose: () => void
  onToggleLike: (videoId: number) => void
  onRefreshVideos: () => void
}
export function VideoModal({ video, onClose, onToggleLike, onRefreshVideos }: VideoModalProps) {

  console.log("Videos in modal:", video);
  const user = useSelector((state: any) => state.user)
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [showCommentMenu, setShowCommentMenu] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(video.is_liked);
  const [likeCount, setLikeCount] = useState(video.likes);
  // Watch time tracking state
  const [startTime, setStartTime] = useState<number | null>(null)
  const [totalWatchTime, setTotalWatchTime] = useState(0)
  const [hasViewBeenAdded, setHasViewBeenAdded] = useState(false)
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const commentMenuRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setFollowing] = useState(video.is_following) // State to track
  const [likeAnimation, setLikeAnimation] = useState(false);
  const router = useRouter();
  const watchTimeRef = useRef(0) // Use ref to ensure we have the latest value in cleanup
  // Update ref whenever totalWatchTime changes
  const [isSaving, setIsSaving] = useState(false);
  // Separate author comments and regular comments
  const authorComments = video.comments.filter((comment: any) =>
    comment.commented_by === video.author?.id || comment.commented_by === video.creator?.id
  );
  const regularComments = video.comments.filter((comment: any) =>
    comment.commented_by !== video.author?.id && comment.commented_by !== video.creator?.id
  );
  // Author comments first (newest first), then regular comments (newest first)
  const showComment = [...authorComments.reverse(), ...regularComments.reverse()];
  const [videoLoading, setVideoLoading] = useState(true);
  const [commentLoader, setCommentLoader] = useState(false);

  useEffect(() => {
    watchTimeRef.current = totalWatchTime
  }, [totalWatchTime])
  const handlePlay = () => {
    //console.log("Video started playing")
    setStartTime(Date.now())
    // Only call addView once per video session

    if (user.isLogin) {
      addView(video.id)
        .then(() => {
          setHasViewBeenAdded(true)
          //console.log("View added successfully")
        })
        .catch((error) => console.error("Error adding view:", error))
    }

  }
  const handlePause = () => {
    //console.log("Video paused")
    if (startTime) {
      const now = Date.now()
      const sessionDuration = Math.floor((now - startTime) / 1000) // in seconds
      setTotalWatchTime((prev) => prev + sessionDuration)
      setStartTime(null)
      //console.log("Session watch time:", sessionDuration, "seconds")
    }
  }
  const handleEnded = () => {
    //console.log("Video ended")
    if (startTime) {
      const now = Date.now()
      const sessionDuration = Math.floor((now - startTime) / 1000) // in seconds
      setTotalWatchTime((prev) => prev + sessionDuration)
      setStartTime(null)
      //console.log("Final session watch time:", sessionDuration, "seconds")
    }
  }
  // Function to send watch time to API
  const sendWatchTimeToAPI = async (watchTime: number) => {
    if (watchTime > 0 && user.isLogin) {
      try {
        await addWatchTime(video.id, watchTime)
        //console.log("Watch time sent to API:", watchTime, "seconds")
      } catch (error) {
        console.error("Error sending watch time:", error)
      }
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
    onClose()
  }
  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }

      if (showCommentMenu !== null) {
        console.log(showCommentMenu);
        const menu = document.getElementById(`comment-menu-${showCommentMenu}`);
        if (menu && !menu.contains(event.target as Node)) {
          setShowCommentMenu(null);
        }
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
      if (finalWatchTime > 0 && user.isLogin) {
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
    const date = new Date(dateString + 'z')
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }


  const handleRoute = () => {

    //console.log(user);

    if (!user || !user.isLogin) {
      router.push("/login");
      return true;
    }

    return false;

  }


  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCommentLoader(true);

    if (handleRoute()) {
      return;
    }
    if (!newComment.trim()) return
    try {
      await addCommentToVideo(video.id, newComment.trim())
      setNewComment("")
      onRefreshVideos()
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setCommentLoader(false);
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
      await editVideoComment(commentId, editCommentText.trim())
      setEditingCommentId(null)
      setEditCommentText("")
      onRefreshVideos()
    } catch (error) {
      console.error("Error updating comment:", error)
    } finally {
      setIsSaving(false);
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

    //console.log("Click on like");

    if (handleRoute()) {
      return
    }

    setLikeAnimation(true)
    setTimeout(() => setLikeAnimation(false), 500)
    setIsLiked((prev: boolean) => !prev);
    setLikeCount((prev: number) => isLiked ? prev - 1 : prev + 1);

    //console.log(user);
    try {
      onToggleLike(video.id)
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }
  const handleClick = async () => {
    if (handleRoute()) {
      return;
    }
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">


      <div
        ref={modalRef}
        className="theme-bg-card rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 theme-border-b flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="flex items-center flex-wrap gap-2 text-2xl font-bold theme-text-primary mb-2">
  <span>{video.title}</span>

  {video.age_restricted && (
    <span
      className="
        px-2 py-0.5 
        rounded-full 
        text-xs font-semibold 
        bg-red-100 text-red-700 
        dark:bg-red-900/30 dark:text-red-300 
        border border-red-200 dark:border-red-800/40
        shadow-sm
      "
    >
      18+ content
    </span>
  )}
</h2>

              <div className="flex items-center space-x-4 text-sm theme-text-secondary">
                <span>by {video.creator?.username || video.author?.username} test</span>
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
                    ? "theme-button-secondary theme-text-secondary hover:theme-text-primary theme-border"
                    : "theme-button-primary text-white hover:opacity-90"
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
            <button
              onClick={handleClose}
              className="p-2 theme-button-secondary rounded-lg transition-colors flex-shrink-0"
            >
              <XIcon className="w-6 h-6 theme-text-muted" />
            </button>
          </div>
        </div>
        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="p-6 theme-border-b">
           
<div className="relative w-full h-full rounded-lg overflow-hidden bg-black min-h-[200px] md:min-h-[610px]">
  {videoLoading && (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white" />
    </div>
  )}

              <Stream
                src={video.video_id}
                controls
                autoplay={false}
                responsive
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onLoadedData={() => setVideoLoading(false)}
                className="w-full h-full object-cover" // 👈 ensures video fills container
              />
              
            </div>


          </div>



          {/* 
                 {video.keywords && video.keywords.length > 0 && (
            <div className="py-3 ">
              <div className="flex flex-wrap gap-2 pl-2">
                {video.keywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                 className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium text-blue-500"
                  >
                    <span className="mr-1">#</span>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )} */}


{/* Video Description + Keywords + Locations */}
          <div className="p-6 pt-2 theme-border-b">
            <div className="prose prose-slate max-w-none">
              <div>
                <h1 className="text-white text-2xl mb-4">Description</h1>
              </div>

              <TipTapContentDisplay content={video.description} className="theme-text-secondary" />

     {/* Brand Tags */}
{video.brand_tags && video.brand_tags.length > 0 && (
  <div>
    <h4 className="text-sm font-semibold theme-text-primary mb-2">Brand Tags</h4>
    <div className="flex flex-wrap gap-2">
      {video.brand_tags.map((brand: string, index: number) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-sm"
        >
          🏷 {brand}
        </span>
      ))}
    </div>
  </div>
)}

    {/* Keywords Section */}
    {video.keywords && video.keywords.length > 0 && (
      <div className="mt-6">
        <h4 className="text-sm font-semibold theme-text-primary mb-2">Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {video.keywords.map((keyword: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 
                         dark:bg-purple-900/30 dark:text-purple-300 text-sm transition-colors"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Locations Section */}
    {video.locations && video.locations.length > 0 && (
      <div className="mt-4">
        <h4 className="text-sm font-semibold theme-text-primary mb-2">Locations</h4>
        <div className="flex flex-wrap gap-2">
          {video.locations.map((loc: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 
                         dark:bg-blue-900/30 dark:text-blue-300 text-sm transition-colors"
            >
              {loc}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
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
                <ThumbsUpIcon className={`w-5 h-5 ${isLiked ? "fill-current" : ""} ${likeAnimation ? "animate-pop-purple" : ""}`} />
                <span>{likeCount} Likes</span>
              </button>
            </div>
          </div>
          {/* Comments Section */}
          {video.show_comments
            ? (<div className="p-6">
              <h3 className="text-lg font-semibold theme-text-primary mb-4">Comments ({video.comments_count || 0})</h3>

              {/* Creator Comment at Top */}
              {video.creator_comment && (
                <div className="mb-6 p-4 theme-bg-secondary rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Image
                      src={video.creator?.profile_picture || video.author?.profile_picture || profileImg}
                      alt={video.creator?.username || video.author?.username}
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8 object-cover"
                    />
                    <span className="font-medium theme-text-primary text-sm">
                      {video.creator?.username || video.author?.username} (Creator)
                    </span>
                    <span className="text-xs theme-text-muted">
                      {formatCommentDate(video.creator_comment.commented_at)}
                    </span>
                  </div>
                  <p className="theme-text-secondary text-sm">{video.creator_comment.comment}</p>
                </div>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <Image
                    src={user.profileImage ? user.profileImage : profileImg}
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
                        disabled={!newComment.trim() || commentLoader}
                        className="px-4 py-2 theme-button-primary text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                {showComment && showComment.length > 0 ? (
                  showComment
                    .map((comment: any) => (
                      <div key={comment.id} className="flex space-x-3 items-center">
                        <div className="w-10 h-10 theme-button-secondary rounded-full flex items-center justify-center flex-shrink-0">

                          <Image
                            src={comment.commenter.profile_picture ? comment.commenter.profile_picture : profileImg}
                            alt={comment.commenter.username}
                            width={40}
                            height={40}
                            className="rounded-full flex-shrink-0 w-10 h-10"

                          />

                        </div>
                        <div className="flex-1">
                          <div className="theme-bg-secondary rounded-lg p-3">
                            {/* YouTube-style pinned label for author comments */}
                            {comment.commented_by === video.author?.id || comment.commented_by === video.creator?.id ? (
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Author</span>
                                </div>
                              </div>
                            ) : null}
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium theme-text-primary text-sm">
                                  {comment.commenter.username}
                                </span>
                                <span className="text-xs theme-text-muted">
                                  {formatCommentDate(comment.commented_at)}
                                </span>
                              </div>
                              {/* Comment Actions Menu */}
                              {user && comment.commented_by === user.id && (
                                <div className="relative" ref={commentMenuRef}>
                                  <button
                                    onClick={() => toggleCommentMenu(comment.id)}
                                    className="p-1 theme-button-secondary rounded transition-colors"
                                  >
                                    <MoreVerticalIcon className="w-3 h-3 theme-text-muted" />
                                  </button>
                                  {showCommentMenu === comment.id && (
                                    <div id={`comment-menu-${comment.id}`} className="absolute right-0 top-full mt-1 w-32 theme-bg-card rounded-lg shadow-lg theme-border py-1 z-10">
                                      <button
                                        onClick={() => handleEditComment(comment)}
                                        className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:theme-bg-secondary transition-colors"
                                      >
                                        <EditIcon className="w-3 h-3 theme-text-muted" />
                                        <span className="theme-text-secondary">Edit</span>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                                    className="px-3 py-1 theme-button-primary text-white rounded text-xs hover:opacity-90 transition-colors disabled:opacity-50 flex items-center space-x-1"
                                  >
                                    {isSaving ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <CheckIcon className="w-3 h-3" />
                                    )}
                                    <span>{isSaving ? "Saving..." : "Save"}</span>
                                  </button>

                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 theme-button-secondary theme-text-secondary rounded text-xs hover:theme-text-primary transition-colors"
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
                    ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircleIcon className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                    <p className="theme-text-muted">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>


            </div>) : (
              <div className="text-center py-8">
                <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <MessageSquareOff className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Comments are turned off for this video
                </p>
              </div>

            )

          }


        </div>
      </div>
    </div>
  )
}
