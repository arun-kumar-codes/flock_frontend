"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ThumbsUpIcon,
  PlayIcon,
  RefreshCwIcon,
  BookOpenIcon,
  FilterIcon,
  UserIcon,
} from "lucide-react";
import SearchIcon from "@/assets/Search_Icon.svg";
import VideoIcon from "@/assets/Video_Icon.svg";
import Logo from "@/assets/logo.svg";
import BlogIcon from "@/assets/BlogSvg.png";
import Image from "next/image";
import Loader from "@/components/Loader";
import {
  getDashboardContent,
  getFollowings,
  toggleBlogLike,
  toggleVideoLike,
  getAllTrendingContent,
  getBlog,
  getMostViewed,
  getMostLiked,
} from "@/api/content";
import { useSelector } from "react-redux";
import { getAllCreators } from "@/api/user";

interface Creator {
  email: string;
  id: number;
  role: string;
  username: string;
  profile_picture?: string;
  followers_count: number;
  following_count: number;
  monthly_earnings: number;
  total_earnings: number;
}

interface Commenter {
  email: string;
  id: number;
  role: string;
  username: string;
}

interface Comment {
  id: number;
  video_id?: number;
  blog_id?: number;
  comment: string;
  commented_at: string;
  commented_by: number;
  commenter: Commenter;
}

interface Video {
  keywords: string[];
  id: number;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  is_liked: boolean;
  created_at: string;
  created_by: number;
  creator: Creator;
  comments: Comment[];
  comments_count: number;
  liked_by: number[];
  viewed_by: number[];
  archived: boolean;
  status: string;
  category?: string;
  isFavorite?: boolean;
  author?: Creator;
  type: "video";
  age_restricted?: boolean;
  paid_promotion?: boolean;
}

interface Blog {
  keywords: string[];
  is_liked: boolean;
  id: number;
  title: string;
  content: string;
  author: Creator;
  created_at: string;
  created_by: number;
  comments: Comment[];
  comments_count: number;
  liked_by: number[];
  likes: number;
  image?: string;
  archived: boolean;
  status: string;
  excerpt?: string;
  thumbnail?: string;
  readAt?: string;
  readTime?: string;
  category?: string;
  isFavorite?: boolean;
  publishedAt?: string;
  type: "blog";
  age_restricted?: boolean;
  paid_promotion?: boolean;
}

type ContentItem = Video | Blog;

interface Following {
  email: string;
  followers_count: string;
  following_count: string;
  id: string;
  profile_picture: string | null;
  role: string;
  username: string;
}

interface FollowingResponse {
  following: Following[];
  following_count: number;
}

const stripHtmlAndDecode = (html: string): string => {
  if (!html) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  let text = tempDiv.textContent || tempDiv.innerText || "";
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "...")
    .trim();
  return text;
};

const truncateText = (text: string, maxLength = 120): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const generateExcerpt = (content: string, image?: string): string => {
  const maxLength = image ? 150 : 600;
  const textContent = content.replace(/<[^>]*>/g, "");
  return textContent.length > maxLength
    ? textContent.substring(0, maxLength) + "..."
    : textContent;
};

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

export default function DashboardPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Following states
  const [selectedFollowing, setSelectedFollowing] = useState<string>("all");
  const [followings, setFollowings] = useState<Following[]>([]);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);
  const [followingError, setFollowingError] = useState("");

  const [contentTypeFilter, setContentTypeFilter] = useState<
    "all" | "videos" | "blogs"
  >("all");

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null);
  const [likeAnimation, setLikeAnimation] = useState<{
    [key: string]: boolean;
  }>({});

  // Trending content state
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [trendingError, setTrendingError] = useState("");
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Most Viewed content state
  const [mostViewedContent, setMostViewedContent] = useState<ContentItem[]>([]);
  const [isLoadingMostViewed, setIsLoadingMostViewed] = useState(true);
  const [mostViewedError, setMostViewedError] = useState("");
  const [isDraggingMostViewed, setIsDraggingMostViewed] = useState(false);
  const [startXMostViewed, setStartXMostViewed] = useState(0);
  const [scrollLeftMostViewed, setScrollLeftMostViewed] = useState(0);

  // Most Liked content state
  const [mostLikedContent, setMostLikedContent] = useState<ContentItem[]>([]);
  const [isLoadingMostLiked, setIsLoadingMostLiked] = useState(true);
  const [mostLikedError, setMostLikedError] = useState("");
  const [isDraggingMostLiked, setIsDraggingMostLiked] = useState(false);
  const [startXMostLiked, setStartXMostLiked] = useState(0);
  const [scrollLeftMostLiked, setScrollLeftMostLiked] = useState(0);

  // Creators state
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoadingCreators, setIsLoadingCreators] = useState(true);
  const [creatorsError, setCreatorsError] = useState("");
  const [isDraggingCreators, setIsDraggingCreators] = useState(false);
  const [startXCreators, setStartXCreators] = useState(0);
  const [scrollLeftCreators, setScrollLeftCreators] = useState(0);

  // Blog state
  const [blogs, setBlogs] = useState<ContentItem[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [blogsError, setBlogsError] = useState("");
  const [isDraggingBlogs, setIsDraggingBlogs] = useState(false);
  const [startXBlogs, setStartXBlogs] = useState(0);
  const [scrollLeftBlogs, setScrollLeftBlogs] = useState(0);

  // Video overlay state
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);

  const fetchTrendingContent = async () => {
    setTrendingError("");
    try {
      const response = await getAllTrendingContent();

      if (response?.data) {
        const mixedTrendingContent: ContentItem[] = [];

        // Process trending videos
        if (response.data.videos) {
          const videosWithUIFields = response.data.videos.map((video: any) => ({
            ...video,
            type: "video" as const,
            isFavorite: false,
            views: video.views || 0,
            author: video.creator,
            comments: video.comments || [],
            comments_count: video.comments_count || video.comments?.length || 0,
          }));
          mixedTrendingContent.push(...videosWithUIFields);
        }

        // Process trending blogs
        if (response.data.blogs) {
          const blogsWithUIFields = response.data.blogs.map((blog: any) => ({
            ...blog,
            type: "blog" as const,
            excerpt: generateExcerpt(blog.content, blog.image),
            readTime: calculateReadTime(blog.content),
            isFavorite: false,
            publishedAt: blog.created_at,
            comments: blog.comments || [],
            comments_count: blog.comments_count || blog.comments?.length || 0,
          }));
          mixedTrendingContent.push(...blogsWithUIFields);
        }

        // Shuffle the content to show videos and blogs in random order
        const shuffledContent = mixedTrendingContent.sort(
          () => Math.random() - 0.5
        );
        setTrendingContent(shuffledContent);
      }
    } catch (error) {
      console.error("Error fetching trending content:", error);
      setTrendingError("Failed to fetch trending content. Please try again.");
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const fetchMostViewedContent = async () => {
    setMostViewedError("");
    try {
      const response = await getMostViewed();

      if (response?.data) {
        const mixedMostViewedContent: ContentItem[] = [];

        // Process most viewed videos
        if (response.data.videos) {
          const videosWithUIFields = response.data.videos.map((video: any) => ({
            ...video,
            type: "video" as const,
            isFavorite: false,
            views: video.views || 0,
            author: video.creator,
            comments: video.comments || [],
            comments_count: video.comments_count || video.comments?.length || 0,
          }));
          mixedMostViewedContent.push(...videosWithUIFields);
        }

        // Process most viewed blogs
        if (response.data.blogs) {
          const blogsWithUIFields = response.data.blogs.map((blog: any) => ({
            ...blog,
            type: "blog" as const,
            excerpt: generateExcerpt(blog.content, blog.image),
            readTime: calculateReadTime(blog.content),
            isFavorite: false,
            publishedAt: blog.created_at,
            comments: blog.comments || [],
            comments_count: blog.comments_count || blog.comments?.length || 0,
          }));
          mixedMostViewedContent.push(...blogsWithUIFields);
        }

        setMostViewedContent(mixedMostViewedContent);
      }
    } catch (error) {
      console.error("Error fetching most viewed content:", error);
      setMostViewedError(
        "Failed to fetch most viewed content. Please try again."
      );
    } finally {
      setIsLoadingMostViewed(false);
    }
  };

  const fetchMostLikedContent = async () => {
    setMostLikedError("");
    try {
      const response = await getMostLiked();

      if (response?.data) {
        const mixedMostLikedContent: ContentItem[] = [];

        // Process most liked videos
        if (response.data.videos) {
          const videosWithUIFields = response.data.videos.map((video: any) => ({
            ...video,
            type: "video" as const,
            isFavorite: false,
            views: video.views || 0,
            author: video.creator,
            comments: video.comments || [],
            comments_count: video.comments_count || video.comments?.length || 0,
          }));
          mixedMostLikedContent.push(...videosWithUIFields);
        }

        // Process most liked blogs
        if (response.data.blogs) {
          const blogsWithUIFields = response.data.blogs.map((blog: any) => ({
            ...blog,
            type: "blog" as const,
            excerpt: generateExcerpt(blog.content, blog.image),
            readTime: calculateReadTime(blog.content),
            isFavorite: false,
            publishedAt: blog.created_at,
            comments: blog.comments || [],
            comments_count: blog.comments_count || blog.comments?.length || 0,
          }));
          mixedMostLikedContent.push(...blogsWithUIFields);
        }

        setMostLikedContent(mixedMostLikedContent);
      }
    } catch (error) {
      console.error("Error fetching most liked content:", error);
      setMostLikedError(
        "Failed to fetch most liked content. Please try again."
      );
    } finally {
      setIsLoadingMostLiked(false);
    }
  };

  const fetchCreators = async () => {
    setCreatorsError("");
    try {
      const response = await getAllCreators();

      if (response?.data?.creators) {
        setCreators(response.data.creators);
      } else {
        setCreatorsError("No creators data received");
      }
    } catch (error) {
      console.error("Error fetching creators:", error);
      setCreatorsError("Failed to fetch creators. Please try again.");
    } finally {
      setIsLoadingCreators(false);
    }
  };

  const fetchBlogs = async () => {
    setBlogsError("");
    try {
      const response = await getBlog();

      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs.map((blog: any) => ({
          ...blog,
          type: "blog" as const,
          excerpt: generateExcerpt(blog.content, blog.image),
          readTime: calculateReadTime(blog.content),
          isFavorite: blog.is_liked || false,
          publishedAt: blog.created_at,
          comments: blog.comments || [],
          comments_count: blog.comments_count || blog.comments?.length || 0,
        }));
        setBlogs(blogsWithUIFields);
      } else {
        setBlogsError("No blogs data received");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogsError("Failed to fetch blogs. Please try again.");
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  const fetchFollowingData = async () => {
    setFollowingError("");
    try {
      let response;
      if (user.isLogin === false) {
        response = await getAllCreators();
        setFollowings(response.data.creators);
      } else {
        response = await getFollowings();
        setFollowings(response.data.following);
        setFollowingCount(response.data.following_count);
      }
    } catch (error) {
      console.error("Error fetching following data:", error);
      setFollowingError("Failed to fetch following data. Please try again.");
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  const fetchContent = async () => {
    setFetchError("");
    try {
      let response;

      if (selectedFollowing !== "all") {
        const selectedUser = followings.find(
          (f) => f.username === selectedFollowing
        );
        if (selectedUser) {
          response = await getDashboardContent(selectedUser.id);
        } else {
          response = await getDashboardContent();
        }
      } else {
        response = await getDashboardContent();
      }

      const mixedContent: ContentItem[] = [];

      // Process videos
      if (response?.data?.videos) {
        const videosWithUIFields = response.data.videos.map((video: any) => ({
          ...video,
          type: "video" as const,
          isFavorite: false,
          views: video.views || 0,
          author: video.creator,
          comments: video.comments || [],
          comments_count: video.comments_count || video.comments?.length || 0,
        }));
        mixedContent.push(...videosWithUIFields);
        console.log("VIDEO WITH FIELDS : ");
        console.log(videosWithUIFields);
      }

      // Process blogs
      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs.map((blog: any) => ({
          ...blog,
          type: "blog" as const,
          excerpt: generateExcerpt(blog.content, blog.image),
          readTime: calculateReadTime(blog.content),
          isFavorite: false,
          publishedAt: blog.created_at,
          comments: blog.comments || [],
          comments_count: blog.comments_count || blog.comments?.length || 0,
        }));

        mixedContent.push(...blogsWithUIFields);
      }

      // Sort mixed content by creation date (newest first)
      mixedContent.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setContent(mixedContent);
    } catch (error) {
      console.error("Error fetching content:", error);
      setFetchError("Failed to fetch content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    console.log("Fetching content on mount");
  }, [selectedFollowing, contentTypeFilter]);

  useEffect(() => {
    fetchFollowingData();
    fetchTrendingContent();
    fetchMostViewedContent(); // Call most viewed fetch function
    fetchMostLikedContent(); // Call most liked fetch function
    fetchCreators(); // Call creators fetch function
    fetchBlogs(); // Call blogs fetch function
    console.log("Fetching following data on mount");
  }, []);

  const toggleVideoFavorite = (videoId: number) => {
    setContent((prev) =>
      prev.map((item) =>
        item.type === "video" && item.id === videoId
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  };

  const handleToggleVideoLike = async (videoId: number) => {
    try {
      await toggleVideoLike(videoId);
      // await fetchContent()
    } catch (error) {
      console.error("Error toggling video like:", error);
      setFetchError("Failed to update like status. Please try again.");
      setTimeout(() => setFetchError(""), 3000);
    }
  };

  const handleToggleBlogLike = async (blogId: number) => {
    try {
      await toggleBlogLike(blogId);
      // await fetchContent()
    } catch (error) {
      console.error("Error toggling blog like:", error);
      setFetchError("Failed to update like status. Please try again.");
      setTimeout(() => setFetchError(""), 3000);
    }
  };

  // Filter function for main content
  const filterContent = (items: ContentItem[]) => {
    const searchText = searchTerm.toLowerCase();

    return items.filter((item) => {
      const matchesContentType =
        contentTypeFilter === "all" ||
        (contentTypeFilter === "videos" && item.type === "video") ||
        (contentTypeFilter === "blogs" && item.type === "blog");

      if (!matchesContentType) return false;

      if (searchText === "") return true; // Show all if no search term

      if (item.type === "video") {
        const plainDescription = stripHtmlAndDecode(item.description);
        return (
          item.title.toLowerCase().includes(searchText) ||
          item.creator.username.toLowerCase().includes(searchText) ||
          plainDescription.toLowerCase().includes(searchText) ||
          (Array.isArray(item.keywords) &&
            item.keywords.some((kw: any) =>
              kw.toLowerCase().includes(searchText)
            ))
        );
      } else {
        return (
          item.title.toLowerCase().includes(searchText) ||
          item.author.username.toLowerCase().includes(searchText) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(searchText)) ||
          (Array.isArray(item.keywords) &&
            item.keywords.some((kw: any) =>
              kw.toLowerCase().includes(searchText)
            ))
        );
      }
    });
  };

  const filteredTrendingContent = filterContent(trendingContent);
  const filteredMostViewedContent = filterContent(mostViewedContent);
  const filteredMostLikedContent = filterContent(mostLikedContent);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleVideoClick = async (video: Video) => {
    router.push(`/viewer/video/${video.id}`);
  };

  const handleBlogClick = (blog: Blog) => {
    router.push(`/viewer/blog/${blog.id}`);
    setShowContentMenu(null);
  };

  const handleVideoLikeToggle = (e: any, videoId: number) => {
    e.stopPropagation();

    // Optimistic update
    setContent((prev) =>
      prev.map((item) =>
        item.type === "video" && item.id === videoId
          ? {
              ...item,
              is_liked: !item.is_liked,
              likes: item.is_liked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );

    // Trigger animation
    setLikeAnimation((prev) => ({ ...prev, [`video-${videoId}`]: true }));
    setTimeout(() => {
      setLikeAnimation((prev) => ({ ...prev, [`video-${videoId}`]: false }));
    }, 500);

    handleToggleVideoLike(videoId);
  };

  const handleBlogLikeToggle = (e: any, blogId: number) => {
    e.stopPropagation();

    // Optimistic update
    setContent((prev) =>
      prev.map((item) =>
        item.type === "blog" && item.id === blogId
          ? {
              ...item,
              is_liked: !item.is_liked,
              likes: item.is_liked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );

    // Trigger animation
    setLikeAnimation((prev) => ({ ...prev, [`blog-${blogId}`]: true }));
    setTimeout(() => {
      setLikeAnimation((prev) => ({ ...prev, [`blog-${blogId}`]: false }));
    }, 500);

    handleToggleBlogLike(blogId);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIsLoadingFollowing(true);
    fetchContent();
    fetchFollowingData();
  };

  const handleViewAllTrending = () => {
    // Navigate to trending page or show all trending content
    console.log("View all trending content");
    // You can implement navigation here
  };

  const handleTrendingCardClick = (item: ContentItem) => {
    if (item.type === "video") {
      handleVideoClick(item);
    } else {
      handleBlogClick(item);
    }
  };

  // Mouse and touch event handlers for carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Creators mouse and touch event handlers
  const handleCreatorsMouseDown = (e: React.MouseEvent) => {
    setIsDraggingCreators(true);
    setStartXCreators(e.pageX);
  };

  const handleCreatorsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCreators) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startXCreators) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeftCreators - walk;
  };

  const handleCreatorsMouseUp = () => {
    setIsDraggingCreators(false);
  };

  const handleCreatorsMouseLeave = () => {
    setIsDraggingCreators(false);
  };

  const handleCreatorsTouchStart = (e: React.TouchEvent) => {
    setIsDraggingCreators(true);
    setStartXCreators(e.touches[0].pageX);
  };

  const handleCreatorsTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingCreators) return;
    const x = e.touches[0].pageX;
    const walk = (x - startXCreators) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeftCreators - walk;
  };

  const handleCreatorsTouchEnd = () => {
    setIsDraggingCreators(false);
  };

  // Blog mouse and touch event handlers
  const handleBlogsMouseDown = (e: React.MouseEvent) => {
    setIsDraggingBlogs(true);
    setStartXBlogs(e.pageX);
  };

  const handleBlogsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingBlogs) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startXBlogs) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeftBlogs - walk;
  };

  const handleBlogsMouseUp = () => {
    setIsDraggingBlogs(false);
  };

  const handleBlogsMouseLeave = () => {
    setIsDraggingBlogs(false);
  };

  const handleBlogsTouchStart = (e: React.TouchEvent) => {
    setIsDraggingBlogs(true);
    setStartXBlogs(e.touches[0].pageX);
  };

  const handleBlogsTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingBlogs) return;
    const x = e.touches[0].pageX;
    const walk = (x - startXBlogs) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeftBlogs - walk;
  };

  const handleBlogsTouchEnd = () => {
    setIsDraggingBlogs(false);
  };

  // Most Viewed mouse and touch event handlers
  const handleMostViewedMouseDown = (e: React.MouseEvent) => {
    setIsDraggingMostViewed(true);
    setStartXMostViewed(e.pageX);
  };

  const handleMostViewedMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingMostViewed) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startXMostViewed) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeftMostViewed - walk;
  };

  const handleMostViewedMouseUp = () => {
    setIsDraggingMostViewed(false);
  };

  const handleMostViewedMouseLeave = () => {
    setIsDraggingMostViewed(false);
  };

  const handleMostViewedTouchStart = (e: React.TouchEvent) => {
    setIsDraggingMostViewed(true);
    setStartXMostViewed(e.touches[0].pageX);
  };

  const handleMostViewedTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingMostViewed) return;
    const x = e.touches[0].pageX;
    const walk = (x - startXMostViewed) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeftMostViewed - walk;
  };

  const handleMostViewedTouchEnd = () => {
    setIsDraggingMostViewed(false);
  };

  // Most Liked mouse and touch event handlers
  const handleMostLikedMouseDown = (e: React.MouseEvent) => {
    setIsDraggingMostLiked(true);
    setStartXMostLiked(e.pageX);
  };

  const handleMostLikedMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingMostLiked) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startXMostLiked) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeftMostLiked - walk;
  };

  const handleMostLikedMouseUp = () => {
    setIsDraggingMostLiked(false);
  };

  const handleMostLikedMouseLeave = () => {
    setIsDraggingMostLiked(false);
  };

  const handleMostLikedTouchStart = (e: React.TouchEvent) => {
    setIsDraggingMostLiked(true);
    setStartXMostLiked(e.touches[0].pageX);
  };

  const handleMostLikedTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingMostLiked) return;
    const x = e.touches[0].pageX;
    const walk = (x - startXMostLiked) * 2;
    const container = e.currentTarget as HTMLElement;
    container.scrollLeft = scrollLeftMostLiked - walk;
  };

  const handleMostLikedTouchEnd = () => {
    setIsDraggingMostLiked(false);
  };

  // Handle Flock video button click
  const handleFlockVideoClick = () => {
    setShowVideoOverlay(true);
  };

  // Handle video end - redirect to videos section
  const handleVideoEnd = () => {
    setShowVideoOverlay(false);
    router.push("/viewer/videos");
  };

  // Handle video overlay close
  const handleCloseVideoOverlay = () => {
    setShowVideoOverlay(false);
  };

  if (isLoading || isLoadingFollowing) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen theme-bg-primary transition-colors duration-300">
      <div className="lg:px-2 py-4">
        {/* Search and Filter */}
        <div className="mb-4 md:mb-4 theme-border ml-2">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative w-full md:w-[60%]">
              <Image
                src={SearchIcon}
                alt="Search"
                className="absolute right-1.5 md:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-6 md:h-6"
              />
              <input
                type="text"
                placeholder="Search videos and articles by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-6 md:pl-4 md:pr-12 py-3 border-1 border-[#CDCDCD] rounded-4xl theme-text-primary theme-placeholder focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all text-xs md:text-base font-poppins"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
              {/* <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value as "all" | "videos" | "blogs")}
                 className="pl-10 pr-8 py-2 md:py-3 theme-input rounded-xl theme-text-primary min-w-[180px] focus:ring-2 focus:ring-purple-500 focus:border-transparent md:text-base text-sm"
                >
                  <option value="all">All Content</option>
                  <option value="videos">Videos Only</option>
                  <option value="blogs">Blogs Only</option>
                </select>
              </div> */}

              <div className="relative inline-block">
                {/* Left Icon */}
                <FilterIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-text-secondary" />

                <select
                  value={contentTypeFilter}
                  onChange={(e) =>
                    setContentTypeFilter(
                      e.target.value as "all" | "videos" | "blogs"
                    )
                  }
                  className="pl-10 pr-8 py-2 md:py-3 theme-bg-secondary cursor-pointer rounded-4xl theme-text-primary min-w-[180px] appearance-none focus:ring-1 focus:ring-gray-400 focus:border-transparent md:text-base text-sm"
                >
                  <option value="all">All Content</option>
                  <option value="videos">Videos Only</option>
                  <option value="blogs">Blogs Only</option>
                </select>

                {/* Right caret (custom dropdown arrow) */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-4 h-4 theme-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

              <div className="relative inline-block">
                {/* Left filter icon */}
                {/* <FilterIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />

                <select
                  value={selectedFollowing}
                  onChange={(e) => setSelectedFollowing(e.target.value)}
                  disabled={isLoadingFollowing}
                  className="pl-10 pr-8 py-2 md:py-3 theme-input rounded-xl theme-text-primary min-w-[180px] appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent md:text-base text-sm"
                >
                  <option value="all">
                    {user.isLogin ? "All Following" : "All Creators"}
                  </option>
                  {followings.length > 0 ? (
                    followings.map((following) => (
                      <option key={following.id} value={following.username}>
                        {following.username}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Followers
                    </option>
                  )}
                </select> */}

                {/* Right dropdown arrow */}
                {/* <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span> */}
              </div>

              {/* <button
                onClick={() => {
                  handleRefresh();
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 cursor-pointer  py-2 md:py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs md:text-sm font-medium shadow-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCwIcon
                  className={`w-3 h-3 md:w-4 md:h-4 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
                <span>{isLoading ? "Loading..." : "Refresh"}</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Black Banner - Hey Flock Your Most Viewed List is here */}
        <div className="mb-2 p-1">
          <div className="bg-black rounded-4xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {/* Left Text */}
            <span className="text-white text-xl md:text-2xl font-medium text-center md:text-left tracking-wider">
              Hey Flock Your Most
            </span>

            {/* Central Logo Element */}
            <div className="relative flex items-center justify-center">
              {/* SVG Button (centered on top) */}
              <button
                onClick={handleFlockVideoClick}
                className="absolute -top-[-2] bg-gray-400/40 rounded-full p-2 hover:bg-gray-400/60 transition-transform duration-200 transform hover:scale-110 shadow-md cursor-pointer"
              >
                <svg
                  width="29"
                  height="28"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9783 27.3545L12.001 27.3426C12.0333 27.321 12.0668 27.3043 12.1002 27.2828L25.5272 19.5664C25.852 19.3668 26.1623 19.1326 26.4441 18.8529C28.3617 16.9408 28.3617 13.842 26.4441 11.9292C26.1384 11.6245 25.8077 11.3778 25.4494 11.1693L8.51926 1.4409C8.4941 1.43004 8.48321 1.4354 8.4533 1.41934C7.70187 0.966395 6.82082 0.705887 5.87765 0.705887C3.11992 0.705887 0.882324 2.93649 0.882324 5.68626V22.7273V22.7333C0.882324 24.086 1.98011 25.1807 3.33681 25.1807C4.69105 25.1807 5.79252 24.086 5.79252 22.7333C5.79252 22.7249 5.78899 22.7166 5.78899 22.7082H5.80816L5.80571 7.55784C5.84175 6.91843 6.36434 6.40522 7.01991 6.40522C7.21533 6.40522 7.39141 6.44943 7.56167 6.53432L22.2159 14.344C22.572 14.5556 22.8188 14.9452 22.8188 15.3897C22.8188 15.8755 22.536 16.2956 22.126 16.4928C22.114 16.4987 22.1344 16.5035 22.1416 16.5094L9.62318 23.1671L9.62563 23.1696C8.85487 23.5733 8.324 24.3693 8.324 25.2966C8.324 26.6267 9.40614 27.7059 10.7401 27.7059C11.1945 27.7059 11.6151 27.5745 11.9783 27.3545Z"
                    fill="#C14C42"
                  />
                </svg>
              </button>

              {/* White background with logo */}
              <div className="bg-white rounded-4xl px-4 py-2 md:px-6 md:py-3 flex items-center justify-center gap-2 md:gap-3">
                <Image
                  src={Logo}
                  alt="Flock Logo"
                  width={120}
                  height={40}
                  className="h-8 md:h-10 w-auto"
                />
                <span className="text-[#2C50A2] font-bold text-lg md:text-xl uppercase tracking-wider">
                  FLOCK
                </span>
              </div>
            </div>

            {/* Right Text */}
            <span className="text-white text-xl md:text-2xl font-medium text-center md:text-right tracking-wide">
              Viewed Video List is here
            </span>
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-8">
          {/* Trending Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-semibold theme-text-primary ml-2">
              Trending
            </h2>
            {/* <button
              onClick={handleViewAllTrending}
              className="text-black hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              View All &gt;
            </button> */}
          </div>

          {/* Trending Content Carousel */}
          {isLoadingTrending ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-${index}`} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl min-h-[400px]"></div>
                </div>
              ))}
            </div>
          ) : trendingError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{trendingError}</p>
              <button
                onClick={fetchTrendingContent}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Trending Content Cards - Scrollable */}
              <div
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
              >
                {filteredTrendingContent.length > 0 ? (
                  filteredTrendingContent.map((item, index) => (
                    <div
                      key={`trending-${item.type}-${item.id}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100"
                      onClick={() => handleTrendingCardClick(item)}
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {item.type === "video" ? (
                            <img
                              src={
                                item.thumbnail && item.thumbnail !== ""
                                  ? item.thumbnail
                                  : `/placeholder.svg?height=200&width=320&text=${encodeURIComponent(
                                      item.title
                                    )}&query=Professional video thumbnail`
                              }
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/0  transition-all duration-300 flex items-center justify-center">
                            <div className="w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 scale-100">
                              {item.type === "video" ? (
                                <Image
                                  src={VideoIcon}
                                  alt="Video"
                                  className="w-18 h-18 text-gray-900 ml-0.5"
                                />
                              ) : (
                                <Image
                                  src={BlogIcon}
                                  alt="Blog"
                                  className="w-18 h-18 text-gray-900"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : // Show message when no trending content matches filters
                trendingContent.length > 0 &&
                  filteredTrendingContent.length === 0 ? (
                  <div className="flex-shrink-0 w-full text-center py-8">
                    <div className="bg-white rounded-4xl shadow-sm p-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Image
                            src={SearchIcon}
                            alt="Search"
                            className="w-8 h-8"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          No trending content found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Fallback cards when no trending content is available
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`fallback-${index}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100"
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                {index === 0 ? (
                                  <PlayIcon className="w-8 h-8 text-gray-500" />
                                ) : index === 1 ? (
                                  <BookOpenIcon className="w-8 h-8 text-gray-500" />
                                ) : (
                                  <PlayIcon className="w-8 h-8 text-gray-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                No trending content available
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Most Viewed Section */}
        <div className="mb-8">
          {/* Most Viewed Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-semibold theme-text-primary ml-2">
              Most Viewed
            </h2>
            {/* <button
              onClick={() => {
                // Navigate to most viewed page or show all most viewed content
                console.log("View all most viewed content");
                // You can implement navigation here
              }}
              className="text-black hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              View All &gt;
            </button> */}
          </div>

          {/* Most Viewed Content Carousel */}
          {isLoadingMostViewed ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`loading-most-viewed-${index}`}
                  className="animate-pulse"
                >
                  <div className="bg-gray-200 rounded-4xl min-h-[400px]"></div>
                </div>
              ))}
            </div>
          ) : mostViewedError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{mostViewedError}</p>
              <button
                onClick={fetchMostViewedContent}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Most Viewed Content Cards - Scrollable */}
              <div
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseDown={handleMostViewedMouseDown}
                onMouseMove={handleMostViewedMouseMove}
                onMouseUp={handleMostViewedMouseUp}
                onMouseLeave={handleMostViewedMouseLeave}
                onTouchStart={handleMostViewedTouchStart}
                onTouchMove={handleMostViewedTouchMove}
                onTouchEnd={handleMostViewedTouchEnd}
                onScroll={(e) =>
                  setScrollLeftMostViewed(e.currentTarget.scrollLeft)
                }
              >
                {filteredMostViewedContent.length > 0 ? (
                  filteredMostViewedContent.map((item, index) => (
                    <div
                      key={`most-viewed-${item.type}-${item.id}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100"
                      onClick={() => handleTrendingCardClick(item)}
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {item.type === "video" ? (
                            <img
                              src={
                                item.thumbnail && item.thumbnail !== ""
                                  ? item.thumbnail
                                  : `/placeholder.svg?height=200&width=320&text=${encodeURIComponent(
                                      item.title
                                    )}&query=Professional video thumbnail`
                              }
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/0  transition-all duration-300 flex items-center justify-center">
                            <div className="w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg scale-100">
                              {item.type === "video" ? (
                                <Image
                                  src={VideoIcon}
                                  alt="Video"
                                  className="w-18 h-18 text-gray-900 ml-0.5"
                                />
                              ) : (
                                <Image
                                  src={BlogIcon}
                                  alt="Blog"
                                  className="w-18 h-18 text-gray-900"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : // Show message when no most viewed content matches filters
                mostViewedContent.length > 0 &&
                  filteredMostViewedContent.length === 0 ? (
                  <div className="flex-shrink-0 w-full text-center py-8">
                    <div className="bg-white rounded-4xl shadow-sm p-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Image
                            src={SearchIcon}
                            alt="Search"
                            className="w-8 h-8"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          No most viewed content found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Fallback cards when no most viewed content is available
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`fallback-most-viewed-${index}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100"
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                {index === 0 ? (
                                  <PlayIcon className="w-8 h-8 text-gray-500" />
                                ) : index === 1 ? (
                                  <BookOpenIcon className="w-8 h-8 text-gray-500" />
                                ) : (
                                  <PlayIcon className="w-8 h-8 text-gray-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                No most viewed content available
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Most Liked Section */}
        <div className="mb-8">
          {/* Most Liked Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-semibold theme-text-primary ml-2">
              Most Liked
            </h2>
            {/* <button
              onClick={() => {
                // Navigate to most liked page or show all most liked content
                console.log("View all most liked content");
                // You can implement navigation here
              }}
              className="text-black hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              View All &gt;
            </button> */}
          </div>

          {/* Most Liked Content Carousel */}
          {isLoadingMostLiked ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`loading-most-liked-${index}`}
                  className="animate-pulse"
                >
                  <div className="bg-gray-200 rounded-4xl min-h-[400px]"></div>
                </div>
              ))}
            </div>
          ) : mostLikedError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{mostLikedError}</p>
              <button
                onClick={fetchMostLikedContent}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Most Liked Content Cards - Scrollable */}
              <div
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseDown={handleMostLikedMouseDown}
                onMouseMove={handleMostLikedMouseMove}
                onMouseUp={handleMostLikedMouseUp}
                onMouseLeave={handleMostLikedMouseLeave}
                onTouchStart={handleMostLikedTouchStart}
                onTouchMove={handleMostLikedTouchMove}
                onTouchEnd={handleMostLikedTouchEnd}
                onScroll={(e) =>
                  setScrollLeftMostLiked(e.currentTarget.scrollLeft)
                }
              >
                {filteredMostLikedContent.length > 0 ? (
                  filteredMostLikedContent.map((item, index) => (
                    <div
                      key={`most-liked-${item.type}-${item.id}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100"
                      onClick={() => handleTrendingCardClick(item)}
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {item.type === "video" ? (
                            <img
                              src={
                                item.thumbnail && item.thumbnail !== ""
                                  ? item.thumbnail
                                  : `/placeholder.svg?height=200&width=320&text=${encodeURIComponent(
                                      item.title
                                    )}&query=Professional video thumbnail`
                              }
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/0  transition-all duration-300 flex items-center justify-center">
                            <div className="w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg scale-100">
                              {item.type === "video" ? (
                                <Image
                                  src={VideoIcon}
                                  alt="Video"
                                  className="w-18 h-18 text-gray-900 ml-0.5"
                                />
                              ) : (
                                <Image
                                  src={BlogIcon}
                                  alt="Blog"
                                  className="w-18 h-18 text-gray-900"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : // Show message when no most liked content matches filters
                mostLikedContent.length > 0 &&
                  filteredMostLikedContent.length === 0 ? (
                  <div className="flex-shrink-0 w-full text-center py-8">
                    <div className="bg-white rounded-4xl shadow-sm p-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Image
                            src={SearchIcon}
                            alt="Search"
                            className="w-8 h-8"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          No most liked content found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Fallback cards when no most liked content is available
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`fallback-most-liked-${index}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100"
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                {index === 0 ? (
                                  <PlayIcon className="w-8 h-8 text-gray-500" />
                                ) : index === 1 ? (
                                  <BookOpenIcon className="w-8 h-8 text-gray-500" />
                                ) : (
                                  <PlayIcon className="w-8 h-8 text-gray-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                No most liked content available
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* All Creators Section */}
        <div className="mb-8">
          {/* Creators Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-semibold theme-text-primary ml-2">
              All Creators
            </h2>
            {/* <button
              onClick={() => router.push("/viewer/creators")}
              className="text-black hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              View All &gt;
            </button> */}
          </div>

          {isLoadingCreators ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`loading-creator-${index}`}
                  className="animate-pulse flex-shrink-0 w-full md:w-64"
                >
                  <div className="bg-gray-200 rounded-2xl min-h-[300px]"></div>
                </div>
              ))}
            </div>
          ) : creatorsError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{creatorsError}</p>
              <button
                onClick={fetchCreators}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Creators Content Cards - Scrollable */}
              <div
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseDown={handleCreatorsMouseDown}
                onMouseMove={handleCreatorsMouseMove}
                onMouseUp={handleCreatorsMouseUp}
                onMouseLeave={handleCreatorsMouseLeave}
                onTouchStart={handleCreatorsTouchStart}
                onTouchMove={handleCreatorsTouchMove}
                onTouchEnd={handleCreatorsTouchEnd}
                onScroll={(e) =>
                  setScrollLeftCreators(e.currentTarget.scrollLeft)
                }
              >
                {creators.length > 0
                  ? creators.map((creator, index) => (
                      <div
                        key={`creator-${creator.id}`}
                        className="group cursor-pointer flex-shrink-0 w-full md:w-64"
                      >
                        <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                          <div className="aspect-[3/4] relative overflow-hidden">
                            {creator.profile_picture ? (
                              <Image
                                src={creator.profile_picture}
                                alt={creator.username || creator.email}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <UserIcon className="w-10 h-10 text-gray-500" />
                                  </div>
                                  <p className="text-sm text-gray-500 font-medium">
                                    {creator.username ||
                                      creator.email.split("@")[0]}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Creator Name Overlay - Only on Hover and when profile picture exists */}
                            {creator.profile_picture && (
                              <div className="absolute inset-0 bg-black/0 transition-all duration-300 flex items-end mb-2 px-2">
                                <div className="w-full bg-white/20 px-4 py-3 text-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                                  <h3 className="text-white font-semibold text-base truncate">
                                    {creator.username ||
                                      creator.email.split("@")[0]}
                                  </h3>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  : // Fallback cards when no creators are available
                    Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={`fallback-creator-${index}`}
                        className="group cursor-pointer flex-shrink-0 w-full md:w-64"
                      >
                        <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                          <div className="aspect-[3/4] relative overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <PlayIcon className="w-8 h-8 text-gray-500" />
                                </div>
                                <p className="text-sm text-gray-500">
                                  No creators available
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>

        {/* Blog Articles Section */}
        {/* <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-semibold text-black">
              Blog Articles
            </h2>
            <button
              onClick={() => router.push("/viewer/blogs")}
              className="text-black hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              View All &gt;
            </button>
          </div>

          {isLoadingBlogs ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`loading-blog-${index}`}
                  className="animate-pulse flex-shrink-0 w-full md:w-90"
                >
                  <div className="bg-gray-200 rounded-2xl min-h-[400px]"></div>
                </div>
              ))}
            </div>
          ) : blogsError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{blogsError}</p>
              <button
                onClick={fetchBlogs}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="relative">
              <div
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseDown={handleBlogsMouseDown}
                onMouseMove={handleBlogsMouseMove}
                onMouseUp={handleBlogsMouseUp}
                onMouseLeave={handleBlogsMouseLeave}
                onTouchStart={handleBlogsTouchStart}
                onTouchMove={handleBlogsTouchMove}
                onTouchEnd={handleBlogsTouchEnd}
                onScroll={(e) => setScrollLeftBlogs(e.currentTarget.scrollLeft)}
              >
                {blogs.length > 0
                  ? blogs.map((blog, index) => {
                      const blogItem = blog as any;
                      return (
                        <div
                          key={`blog-${blogItem.id}`}
                          className="group cursor-pointer flex-shrink-0 w-full md:w-85 max-h-300px"
                          onClick={() => handleBlogClick(blogItem as Blog)}
                        >
                          <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div className="aspect-[4/3] relative overflow-hidden rounded-b-4xl bg-white">
                              <Image
                                src={blogItem.image || "/placeholder.svg"}
                                alt={blogItem.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-md p-4 rounded-b-4xl">
                                <div className="flex items-center text-white text-sm space-x-4">
                                  <span>
                                    • {formatViews(blogItem.views || 0)}
                                  </span>
                                  <span>
                                    • {formatDate(blogItem.created_at)}
                                  </span>
                                  <span>• Blog</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="text-lg font-bold mb-2 text-black line-clamp-2">
                                {blogItem.title}
                              </h3>

                              <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
                                <span className="truncate">
                                  {blogItem.readTime}
                                </span>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBlogLike(blogItem.id);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                  <ThumbsUpIcon className="w-4 h-4 text-gray-600" />
                                  <span>{blogItem.likes || 0}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  :
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`fallback-blog-${index}`}
                        className="group cursor-pointer flex-shrink-0 w-full md:w-80"
                      >
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                          <div className="aspect-[4/3] relative overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <BookOpenIcon className="w-8 h-8 text-gray-500" />
                                </div>
                                <p className="text-sm text-gray-500">
                                  No blog articles available
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div> */}

        {/* Fullscreen Animation Modal */}
        {showVideoOverlay && (
  <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
    {/* Video container */}
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Video element - no controls, no hover effects */}
      <video
        src="/Flock-Video.mp4"
        className="w-full h-full pointer-events-none"
        autoPlay
        muted
        playsInline
        style={{
          backgroundColor: "black",
          border: "none",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onMouseUp={(e) => e.preventDefault()}
        onMouseMove={(e) => e.preventDefault()}
        onMouseEnter={(e) => e.preventDefault()}
        onMouseLeave={(e) => e.preventDefault()}
        onMouseOver={(e) => e.preventDefault()}
        onMouseOut={(e) => e.preventDefault()}
        onFocus={(e) => e.preventDefault()}
        onBlur={(e) => e.preventDefault()}
        onEnded={handleVideoEnd}
        tabIndex={-1}
      />

      {/* Optional fallback (hidden unless error) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-gray-600"
        style={{ display: "none" }}
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Video Not Found</h3>
          <p className="text-sm text-gray-400">Redirecting to videos section...</p>
        </div>
      </div>
    </div>

  </div>
)}

      </div>
    </div>
  );
}
