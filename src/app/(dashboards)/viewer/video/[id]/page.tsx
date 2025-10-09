"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import {
  getVideoById,
  addView,
  toggleVideoLike,
  addCommentToVideo,
  deleteVideoComment,
  editVideoComment,
  addWatchTime,
} from "@/api/content";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Clock,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import Loader from "@/components/Loader";

interface Video {
  video: {
    video: string;
    thumbnail: string;
    duration: number;
    duration_formatted: string;
    views: number;
    likes: number;
    is_liked: boolean;
    created_at: string;
    description: string;
    title: string;
    creator: {
      id: number;
      username: string;
      email: string;
      profile_picture?: string;
    };
    comments: Array<{
      id: number;
      comment: string;
      commented_at: string;
      commenter: {
        id: number;
        username: string;
        email: string;
        profile_picture?: string;
      };
    }>;
    comments_count: number;
    keywords?: string[];
    locations?: string[];
    brand_tags?: string[];
    age_restricted?: boolean;
    paid_promotion?: boolean;
    status?: string;
    show_comments?: boolean;
  };
}

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  const [video, setVideo] = useState<Video | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null
  );
  const [showCommentMenu, setShowCommentMenu] = useState<number | null>(null);

  const [watchTime, setWatchTime] = useState(0);
  const [lastWatchTimeUpdate, setLastWatchTimeUpdate] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);

        // Get video data
        const videoResponse = await getVideoById(params.id);
        console.log("Video API Response:", videoResponse);

        if (videoResponse?.data) {
          console.log("Video data:", videoResponse.data);
          console.log("Video URL:", videoResponse.data.video);
          console.log(
            "Video object structure:",
            Object.keys(videoResponse.data)
          );

          // Check if video is an object and extract the URL
          let extractedVideoUrl = videoResponse.data.video;
          if (
            typeof extractedVideoUrl === "object" &&
            extractedVideoUrl !== null
          ) {
            // The video URL is nested inside the video object as video.video
            extractedVideoUrl =
              extractedVideoUrl.video ||
              extractedVideoUrl.url ||
              extractedVideoUrl.src ||
              extractedVideoUrl.file ||
              extractedVideoUrl.path ||
              extractedVideoUrl.video_url;
            console.log("Extracted video URL:", extractedVideoUrl);
          }

          setVideo(videoResponse.data);
          setVideoUrl(extractedVideoUrl || "");
          setIsLiked(videoResponse.data.video?.is_liked || false);

          // Increment view count
          await addView(params.id);
        } else {
          console.error("No video data received");
          setError("Video not found");
        }
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVideo();
    }
  }, [params.id]);

  // Handle clicking outside comment menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !event.target ||
        !(event.target as Element).closest(".comment-menu-container")
      ) {
        setShowCommentMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Note: Watch time tracking is disabled for iframe videos due to CORS restrictions
  // Cloudflare Stream handles analytics on their end

  const handleLike = async () => {
    try {
      const response = await toggleVideoLike(params.id);
      if (response?.status === 200 || response?.success === true) {
        setIsLiked(!isLiked);
        // Refresh video data to get updated like count
        const videoResponse = await getVideoById(params.id);
        if (videoResponse?.data) {
          setVideo(videoResponse.data);
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsAddingComment(true);
    try {
      const response = await addCommentToVideo(params.id, newComment.trim());
      if (response?.status === 201 || response?.success === true) {
        setNewComment("");
        // Refresh video data to get updated comments
        const videoResponse = await getVideoById(params.id);
        if (videoResponse?.data) {
          setVideo(videoResponse.data);
        }
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleEditComment = async () => {
    if (!editingCommentId || !editCommentText.trim()) return;

    setIsEditingComment(true);
    try {
      const response = await editVideoComment(
        editingCommentId,
        editCommentText.trim()
      );
      if (response?.status === 200 || response?.success === true) {
        setEditingCommentId(null);
        setEditCommentText("");
        // Refresh video data
        const videoResponse = await getVideoById(params.id);
        if (videoResponse?.data) {
          setVideo(videoResponse.data);
        }
      }
    } catch (err) {
      console.error("Error editing comment:", err);
    } finally {
      setIsEditingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setDeletingCommentId(commentId);
    try {
      const response = await deleteVideoComment(commentId);
      if (response?.status === 200 || response?.success === true) {
        // Refresh video data
        const videoResponse = await getVideoById(params.id);
        if (videoResponse?.data) {
          setVideo(videoResponse.data);
        }
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const startEditComment = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentText);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return "0:00";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  if (!video)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Video Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The video you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 mb-4 cursor-pointer bg-transparent hover:bg-gray-100 active:scale-95 rounded-4xl p-2 hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </div>

         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
           {/* Main Video Content */}
           <div className="xl:col-span-2">
             {/* Video Player */}
             <div className="bg-black rounded-lg overflow-hidden mb-6 relative">
               {videoUrl ? (
                 <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                   <iframe
                     src={videoUrl}
                     className="absolute inset-0 w-full h-full"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     title={video.video?.title || "Video"}
                     onLoad={() => console.log("Video iframe loaded")}
                     onError={() => console.error("Video iframe failed to load")}
                     style={{
                       objectFit: 'contain',
                       backgroundColor: '#000'
                     }}
                   />
                 </div>
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-800" style={{ minHeight: '400px' }}>
                   <div className="text-center text-white">
                     <p className="text-lg font-medium mb-2">
                       Video not available
                     </p>
                     <p className="text-sm text-gray-300">
                       The video file could not be loaded
                     </p>
                     <p className="text-xs text-gray-400 mt-2">
                       Video URL: {videoUrl || "No URL provided"}
                     </p>
                   </div>
                 </div>
               )}
             </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {video.video?.title || "Untitled Video"}
              </h1>

              {/* Video Stats */}
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {(video.video?.views || 0).toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(video.video?.duration || 0)}
                </span>
                <span>{formatDate(video.video?.created_at || "")}</span>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                  {video.video?.creator?.profile_picture ? (
                    <Image
                      src={video.video.creator.profile_picture}
                      alt={video.video?.creator?.username || "Creator"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {video.video?.creator?.username || "Unknown Creator"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {video.video?.creator?.email || "No email available"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      video.video?.description || "No description available",
                  }}
                />
              </div>

              {/* Keywords */}
              {video.video?.keywords && video.video.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {video.video?.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations */}
              {video.video?.locations && video.video.locations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Locations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {video.video?.locations.map((location, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1"
                      >
                        📍 {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Tags */}
              {video.video?.brand_tags && video.video.brand_tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Brand Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {video.video?.brand_tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                      >
                        🏷️ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Metadata Badges */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {/* Age Restricted Badge */}
                  {video.video?.age_restricted && (
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200">
                      🔞 18+ Restricted
                    </span>
                  )}

                  {/* Paid Promotion Badge */}
                  {video.video?.paid_promotion && (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full border border-yellow-200">
                      💰 Paid Promotion
                    </span>
                  )}

                  {/* Status Badge */}
                  {video.video?.status && (
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${
                      video.video.status === 'published' 
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : video.video.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {video.video.status === 'published' ? '✅ Published' : 
                       video.video.status === 'draft' ? '📝 Draft' : 
                       video.video.status}
                    </span>
                  )}

                  {/* Comments Status */}
                  {video.video?.show_comments !== undefined && (
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${
                      video.video.show_comments 
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {video.video.show_comments ? '💬 Comments Enabled' : '🚫 Comments Disabled'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{video.video?.likes || 0} likes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Comments Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({video.video?.comments_count || 0})
                </h3>
              </div>

              {/* Add Comment */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      disabled={isAddingComment}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isAddingComment}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAddingComment ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="max-h-96 overflow-y-auto">
                {video.video?.comments && video.video.comments.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {video.video?.comments
                      .sort((a, b) => {
                        // Show user's comments first
                        const aIsUser = a.commenter?.id === user?.id;
                        const bIsUser = b.commenter?.id === user?.id;
                        if (aIsUser && !bIsUser) return -1;
                        if (!aIsUser && bIsUser) return 1;
                        return 0;
                      })
                      .map((comment) => {
                        const isUserComment =
                          comment.commenter?.id === user?.id;
                        const isEditing = editingCommentId === comment.id;

                        return (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              {comment.commenter?.profile_picture ? (
                                <Image
                                  src={comment.commenter.profile_picture}
                                  alt={
                                    comment.commenter?.username || "Commenter"
                                  }
                                  width={32}
                                  height={32}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 text-sm">
                                    {comment.commenter?.username || "Anonymous"}
                                  </span>
                                  {isUserComment && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                      You
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatDate(comment.commented_at)}
                                  </span>
                                </div>
                                {isUserComment && (
                                  <div className="relative comment-menu-container">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCommentMenu(
                                          showCommentMenu === comment.id
                                            ? null
                                            : comment.id
                                        );
                                      }}
                                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4 text-gray-500" />
                                    </button>
                                    {showCommentMenu === comment.id && (
                                      <div className="absolute right-5 top-0  w-30 bg-white rounded-lg shadow-lg border border-gray-200  z-20">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditComment(
                                              comment.id,
                                              comment.comment || ""
                                            );
                                            setShowCommentMenu(null);
                                          }}
                                          className="flex items-center space-x-2 w-full px-2 py-1 text-left text-sm hover:bg-gray-50 transition-colors"
                                        >
                                          <Edit className="w-4 h-4" />
                                          <span>Edit</span>
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteComment(comment.id);
                                            setShowCommentMenu(null);
                                          }}
                                          disabled={deletingCommentId === comment.id}
                                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                                        >
                                          {deletingCommentId === comment.id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <Trash2 className="w-4 h-4" />
                                          )}
                                          <span>
                                            {deletingCommentId === comment.id
                                              ? "Deleting..."
                                              : "Delete"}
                                          </span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {isEditing ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editCommentText}
                                    onChange={(e) =>
                                      setEditCommentText(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                    rows={2}
                                    disabled={isEditingComment}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleEditComment}
                                      disabled={
                                        !editCommentText.trim() ||
                                        isEditingComment
                                      }
                                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                      {isEditingComment ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                      onClick={cancelEditComment}
                                      disabled={isEditingComment}
                                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {comment.comment || "No comment text"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">
                      No comments yet
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Be the first to comment on this video.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
