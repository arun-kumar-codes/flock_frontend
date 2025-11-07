"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import ShareButton from "@/components/viewer/ShareButton";
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
  console.log("window url", videoUrl);
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

          // Modify the video URL to add custom styling parameters
          let finalVideoUrl = extractedVideoUrl || "";

          // If it's a Cloudflare Stream URL, convert it to iframe embed with custom params
          if (
            finalVideoUrl &&
            (finalVideoUrl.includes("videodelivery.net") ||
              finalVideoUrl.includes("cloudflarestream.com"))
          ) {
            // Extract video ID from various URL formats
            const videoIdMatch = finalVideoUrl.match(/([a-f0-9]{32})/);
            if (videoIdMatch) {
              const videoId = videoIdMatch[1];
              // Use iframe embed URL with autoplay enabled for better UX
              finalVideoUrl = `https://customer-2134ee9mui3goprl.cloudflarestream.com/${videoId}/iframe?autoplay=1&loop=0&muted=0&preload=auto&controls=true`;
            }
          }

          setVideoUrl(finalVideoUrl);
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
            className="px-4 py-2 bg-blue-600 text-white border-2 rounded-lg hover:bg-blue-700"
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
    <div className="min-h-screen theme-bg-primary transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 shadow-sm border border-slate-200 hover:shadow-md transition-shadow theme-text-secondary hover:theme-text-primary duration-200 mb-4 cursor-pointer bg-transparent theme-bg-hover active:scale-95 rounded-4xl p-2"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
          {/* Main Video Content */}
          <div className="xl:col-span-2">
            {/* Video Player */}
            <div className="theme-bg-card rounded-lg overflow-hidden mb-4 shadow-lg theme-border">
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={videoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    border: "none",
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  title={video.video?.title || "Video"}
                />
              </div>
            </div>

            {/* Video Info */}
            <div className="theme-bg-card rounded-lg p-6 shadow-sm theme-border">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold theme-text-primary mb-4 leading-snug">
                {video.video?.title || "Untitled Video"}
              </h1>

              {/* Video Stats */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm theme-text-secondary">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Eye className="w-4 h-4 shrink-0" />
                  {(video.video?.views || 0).toLocaleString()} views
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-4 h-4 shrink-0" />
                  {formatDuration(video.video?.duration || 0)}
                </span>
                <span className="whitespace-nowrap">
                  {formatDate(video.video?.created_at || "")}
                </span>
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
                  <p className="font-medium theme-text-primary">
                    {video.video?.creator?.username || "Unknown Creator"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="">
                <div
                  className="text-sm sm:text-lg md:text-lg theme-text-secondary leading-relaxed prose prose-sm max-w-none break-words"
                  dangerouslySetInnerHTML={{
                    __html:
                      video.video?.description || "No description available",
                  }}
                />
              </div>

              {/* Keywords */}
              {video.video?.keywords && video.video.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium theme-text-primary mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {video.video?.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
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
                  <h3 className="text-sm font-medium theme-text-primary mb-2">
                    Locations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {video.video?.locations.map((location, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full flex items-center gap-1"
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
                  <h3 className="text-sm font-medium theme-text-primary mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {video.video?.brand_tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full"
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
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium rounded-full border border-red-200 dark:border-red-700">
                      🔞 18+ Restricted
                    </span>
                  )}

                  {/* Paid Promotion Badge */}
                  {video.video?.paid_promotion && (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-medium px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-700">
                      💰 Paid Promotion
                    </span>
                  )}

                  
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    isLiked
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "theme-bg-secondary theme-text-primary hover:opacity-80"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{video.video?.likes || 0} likes</span>
                </button>

                <ShareButton
                  kind="video"
                  id={params.id}
                  title={video.video?.title || "Check out this video"}
                  summary={video.video?.description || ""}
                  onCopied={(url: string) => console.log("Shared URL:", url)}
                />
              </div>
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="lg:col-span-1">
            <div className="theme-bg-card rounded-lg shadow-sm theme-border">
              {/* Comments Header */}
              <div className="p-4 border-b theme-border">
                <h3 className="text-lg font-semibold theme-text-primary flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({video.video?.comments_count || 0})
                  {!video.video?.show_comments && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      Disabled
                    </span>
                  )}
                </h3>
              </div>

              {/* Add Comment - Only show if comments are enabled */}
              {video.video?.show_comments ? (
                <div className="p-4 border-b theme-border">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none theme-bg-card theme-text-primary placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
              ) : (
                <div className="p-4 border-b theme-border">
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                    <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Comments are disabled for this video
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      The creator has turned off commenting
                    </p>
                  </div>
                </div>
              )}

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
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                                  <span className="font-medium theme-text-primary text-sm">
                                    {comment.commenter?.username || "Anonymous"}
                                  </span>
                                  {isUserComment && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                      You
                                    </span>
                                  )}
                                  <span className="text-xs theme-text-secondary">
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
                                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                                    >
                                      <MoreVertical className="w-4 h-4 theme-text-secondary" />
                                    </button>
                                    {showCommentMenu === comment.id && (
                                      <div className="absolute right-5 top-0  w-30 theme-bg-card rounded-lg shadow-lg border theme-border z-20">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditComment(
                                              comment.id,
                                              comment.comment || ""
                                            );
                                            setShowCommentMenu(null);
                                          }}
                                          className="flex items-center space-x-2 w-full px-2 py-1 text-left text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-900 transition-colors cursor-pointer"
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
                                          disabled={
                                            deletingCommentId === comment.id
                                          }
                                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                          {deletingCommentId === comment.id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin" />
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm theme-bg-card theme-text-primary"
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
                                  <p className="theme-text-secondary text-sm leading-relaxed">
                                    {comment.comment || "No comment text"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : video.video?.show_comments ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">
                      No comments yet
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Be the first to comment on this video.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

