"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import ShareButton from "@/components/viewer/ShareButton";
import {
  getBlogById,
  addComment,
  editComments,
  deleteComment,
  viewBLog,
  toggleBlogLike,
} from "@/api/content";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Eye,
  Clock,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Calendar,
} from "lucide-react";
import Loader from "@/components/Loader";
import TipTapContentDisplay from "@/components/tiptap-content-display";

interface Blog {
  blog: {
    id: number;
    title: string;
    content: string;
    author: {
      id: number;
      username: string;
      email: string;
      profile_picture?: string;
    };
    created_at: string;
    created_by: number;
    comments: Array<{
      id: number;
      comment: string;
      commented_at: string;
      commented_by: number;
      commenter: {
        id: number;
        username: string;
        email: string;
        profile_picture?: string;
      };
    }>;
    comments_count: number;
    liked_by: number[];
    likes: number;
    image?: string;
    archived: boolean;
    status: string;
    is_liked: boolean;
    views?: number;
    readTime?: string;
    excerpt?: string;
    age_restricted?: boolean;
    paid_promotion?: boolean;
    show_comments?: boolean;
    keywords?: string[];
    locations?: string[];
    brand_tags?: string[];
  };
}

export default function DashboardBlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  const [blog, setBlog] = useState<Blog | null>(null);
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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        // Get blog data
        const blogResponse = await getBlogById(params.id);
        console.log("Blog API Response:", blogResponse);

        if (blogResponse?.data) {
          console.log("Blog data:", blogResponse.data);
          setBlog(blogResponse.data);
          setIsLiked(blogResponse.data.blog?.is_liked || false);

          // Increment view count
          await viewBLog(params.id);
        } else {
          console.error("No blog data received");
          setError("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlog();
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

  const handleLike = async () => {
    try {
      const response = await toggleBlogLike(params.id);
      if (response?.status === 200 || response?.success === true) {
        setIsLiked(!isLiked);
        // Refresh blog data to get updated like count
        const blogResponse = await getBlogById(params.id);
        if (blogResponse?.data) {
          setBlog(blogResponse.data);
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
      const response = await addComment(params.id, newComment.trim());
      if (response?.status === 201 || response?.success === true) {
        setNewComment("");
        // Refresh blog data to get updated comments
        const blogResponse = await getBlogById(params.id);
        if (blogResponse?.data) {
          setBlog(blogResponse.data);
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
      const response = await editComments(
        editingCommentId,
        editCommentText.trim()
      );
      if (response?.status === 200 || response?.success === true) {
        setEditingCommentId(null);
        setEditCommentText("");
        // Refresh blog data
        const blogResponse = await getBlogById(params.id);
        if (blogResponse?.data) {
          setBlog(blogResponse.data);
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
      const response = await deleteComment(commentId);
      if (response?.status === 200 || response?.success === true) {
        // Refresh blog data
        const blogResponse = await getBlogById(params.id);
        if (blogResponse?.data) {
          setBlog(blogResponse.data);
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

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
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
  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Blog Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The blog you're looking for doesn't exist.
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
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 shadow-sm border border-slate-200 hover:shadow-md transition-shadow theme-text-secondary hover:theme-text-primary transition-all duration-200 mb-4 cursor-pointer bg-transparent theme-bg-hover active:scale-95 rounded-4xl p-2 hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Blogs</span>
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
          {/* Main Blog Content */}
          <div className="xl:col-span-2">
            {/* Blog Image */}
            {blog.blog?.image && (
              <div className="theme-bg-card rounded-lg overflow-hidden mb-4 shadow-lg theme-border">
                <div className="relative w-full aspect-video">
                  <Image
                    src={blog.blog.image}
                    alt={blog.blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Blog Info */}
            <div className="theme-bg-card rounded-lg p-6 shadow-sm theme-border">
              <h1 className="text-2xl md:text-3xl font-bold theme-text-primary mb-4">
                {blog.blog?.title || "Untitled Blog"}
              </h1>

              {/* Blog Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 text-sm text-gray-500">
  <span className="flex items-center gap-1 w-full xs:w-auto">
    <Eye className="w-4 h-4" />
    {(blog.blog?.views || 0).toLocaleString()} views
  </span>
  <span className="flex items-center gap-1 w-full xs:w-auto">
    <Clock className="w-4 h-4" />
    {calculateReadTime(blog.blog?.content || "")}
  </span>
  <span className="flex items-center gap-1 w-full xs:w-auto">
    <Calendar className="w-4 h-4" />
    {formatDate(blog.blog?.created_at || "")}
  </span>
</div>


              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                  {blog.blog?.author?.profile_picture ? (
                    <Image
                      src={blog.blog.author.profile_picture}
                      alt={blog.blog?.author?.username || "Author"}
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
                    {blog.blog?.author?.username || "Unknown Author"}
                  </p>
                  <p className="text-sm theme-text-secondary">
                    {blog.blog?.author?.email || "No email available"}
                  </p>
                </div>
              </div>

              {/* Blog Content */}
              <div className="mb-6 prose prose-slate max-w-none theme-text-primary">
                <TipTapContentDisplay content={blog.blog?.content || "No content available"} />
              </div>

              {/* Keywords */}
              {blog.blog?.keywords && blog.blog.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium theme-text-primary mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.blog?.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-sm rounded-full"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations */}
              {blog.blog?.locations && blog.blog.locations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium theme-text-primary mb-2">
                    Locations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.blog?.locations.map((location, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full flex items-center gap-1"
                      >
                        📍 {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Tags */}
              {blog.blog?.brand_tags && blog.blog.brand_tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium theme-text-primary mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.blog?.brand_tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                      >
                        🏷️ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Metadata Badges */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {/* Age Restricted Badge */}
                  {blog.blog?.age_restricted && (
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium rounded-full border border-red-200 dark:border-red-700">
                      🔞 18+ Restricted
                    </span>
                  )}

                  {/* Paid Promotion Badge */}
                  {blog.blog?.paid_promotion && (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-medium px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-700">
                      💰 Paid Promotion
                    </span>
                  )}

                  {/* Status Badge */}
                  {blog.blog?.status && (
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${
                        blog.blog.status === "published"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700"
                          : blog.blog.status === "draft"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {blog.blog.status === "published"
                        ? "✅ Published"
                        : blog.blog.status === "draft"
                        ? "📝 Draft"
                        : blog.blog.status}
                    </span>
                  )}

                  {/* Comments Status */}
                  {blog.blog?.show_comments !== undefined && (
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${
                        blog.blog.show_comments
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {blog.blog.show_comments
                        ? "💬 Comments Enabled"
                        : "🚫 Comments Disabled"}
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
                  <span>{blog.blog?.likes || 0} likes</span>
                </button>

                <ShareButton
                  kind="blog"
                  id={params.id}
                  title={blog.blog?.title || "Check out this blog"}
                  summary={blog.blog?.content || ""}
                  onCopied={(url) => console.log("Shared URL:", url)}
                />
              </div>
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="xl:col-span-1">
            <div className="theme-bg-card rounded-lg shadow-sm theme-border">
              {/* Comments Header */}
              <div className="p-4 border-b theme-border">
                <h3 className="text-lg font-semibold theme-text-primary flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({blog.blog?.comments_count || 0})
                  {blog.blog?.show_comments === false && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      Disabled
                    </span>
                  )}
                </h3>
              </div>

              {/* Add Comment - Only show if comments are enabled */}
              {blog.blog?.show_comments ? (
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
                      Comments are disabled for this blog
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      The author has turned off commenting
                    </p>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="max-h-96 overflow-y-auto">
                {blog.blog?.comments && blog.blog.comments.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {blog.blog?.comments
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
                                      <div className="absolute right-5 top-0 w-30 theme-bg-card rounded-lg shadow-lg border theme-border z-20">
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
                ) : blog.blog?.show_comments ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium theme-text-primary mb-2">
                      No comments yet
                    </h4>
                    <p className="theme-text-secondary text-sm">
                      Be the first to comment on this blog.
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



