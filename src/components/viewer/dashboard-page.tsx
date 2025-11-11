"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlayIcon,
  BookOpenIcon,
  FilterIcon,
  UserIcon,
} from "lucide-react";
import SearchIcon from "@/assets/Search_Icon.svg";
import VideoIcon from "@/assets/Video_Icon.svg";
import Lottie from "lottie-react";
import logoAnimation from "@/assets/logo animation.json";
import bannerBg from "@/assets/LSbg.jpg";
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
import { getAllCreators, getCreatorById } from "@/api/user";
import { Inter } from "next/font/google";

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

const inter = Inter({ subsets: ["latin"] });

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

  // ---- Auth helpers (add once) ----
    const isAuthenticated = Boolean(user?.isLogin);

    const goLoginWithNext = (nextPath: string) => {
      router.push(`/login?next=${encodeURIComponent(nextPath)}`);
    };

    const requireAuth = (nextPath: string, cb: () => void) => {
      if (!isAuthenticated) {
        goLoginWithNext(nextPath);
        return;
      }
      cb();
    };

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
  
  // Most Viewed content state
  const [mostViewedContent, setMostViewedContent] = useState<ContentItem[]>([]);
  const [isLoadingMostViewed, setIsLoadingMostViewed] = useState(true);
  const [mostViewedError, setMostViewedError] = useState("");

  // Most Liked content state
  const [mostLikedContent, setMostLikedContent] = useState<ContentItem[]>([]);
  const [isLoadingMostLiked, setIsLoadingMostLiked] = useState(true);
  const [mostLikedError, setMostLikedError] = useState("");

  // Creators state
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoadingCreators, setIsLoadingCreators] = useState(true);
  const [creatorsError, setCreatorsError] = useState("");

  // Blog state
  const [blogs, setBlogs] = useState<ContentItem[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [blogsError, setBlogsError] = useState("");

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

  const handleVideoClick = (video: Video) => {
  const next = `/viewer/video/${video.id}`;
  requireAuth(next, () => router.push(next));
};

const handleBlogClick = (blog: Blog) => {
  const next = `/viewer/blog/${blog.id}`;
  requireAuth(next, () => router.push(next));
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
    <div className={`min-h-screen theme-bg-primary transition-colors duration-300 ${inter.className}`}>
      <div className="lg:px-2 py-4">
            
       {/* Hero Banner with background image */}
<section className="mb-10 mx-3 md:mx-6">
  <div
  className="w-full rounded-[48px] flex flex-col lg:flex-row items-end 
             justify-end lg:justify-end
             px-4 md:px-10 py-10 md:py-14 relative overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
    style={{
      backgroundImage: `url(${bannerBg.src})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* semi-transparent overlay */}
    <div className="absolute inset-0 bg-black/10 rounded-[28px] pointer-events-none" />

    {/* Left: Animated Flock Bird - Mobile-like view for vertical layout */}
    <div className="relative z-10 flex items-center justify-center w-full lg:w-auto lg:justify-start lg:-mb-78 lg:-mt-44 lg:-ml-50 -mt-10 -mb-30">
      <div className="w-[280px] h-[240px] sm:w-[350px] sm:h-[300px] md:w-[420px] md:h-[340px] lg:w-[800px] lg:h-[600px]">
        <Lottie animationData={logoAnimation} loop autoplay />
      </div>
    </div>

    {/* Right: Headline + Search - Mobile-like centered for vertical layout */}
    <div
      className="relative z-10 w-full flex flex-col items-center lg:items-end 
                 text-center lg:text-left lg:pr-3 lg:-ml-40 lg:-mt-5 lg:-mb-4 px-4 lg:mr-10"
    >
      <h1
  className="text-[22px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px]
             font-extrabold text-white leading-[1.15] tracking-tight
             max-w-[90%] lg:max-w-none text-center lg:text-center lg:mr-11 transition-all duration-500"
>
        The Creator Hub for the <br />
        Connected Generation
      </h1>

      <p className="mt-2 lg:ml-9 text-white/90 text-[15px] text-center lg:text-left max-w-[85%] lg:max-w-none text-center lg:text-center lg:mr-10">
        Discover Tools, Community and Collaboration – all in one place
      </p>

      {/* Search Bar */}
      <div
        className="mt-5 flex items-center gap-2 w-full max-w-[400px] sm:max-w-[450px] lg:max-w-[530px] h-[38px] lg:h-[40px]
                   bg-white rounded-full px-3 py-1.5 shadow-lg"
      >
        {/* Dropdown pill */}
        <div className="relative flex-shrink-0 -ml-2">
         <select
  value={contentTypeFilter}
  onChange={(e) =>
    setContentTypeFilter(e.target.value as "all" | "videos" | "blogs")
  }
  className="appearance-none pl-3 pr-6 py-2.5 px-2 
             text-[10px] sm:text-[11px] md:text-[12px] lg:text-[11px]
             font-medium text-gray-700 bg-[#f3f3f3] rounded-full 
             focus:outline-none cursor-pointer leading-tight
             [&>option]:text-[10px] [&>option]:sm:text-[11px] [&>option]:md:text-[12px]"
  style={{
    fontSize: "13px",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    lineHeight: "1.1",
  }}
>
  <option value="all">All</option>
  <option value="videos">Videos</option>
  <option value="blogs">Blogs</option>
</select>

          {/* Dropdown arrow */}
          <svg
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 pointer-events-none"
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
        </div>

        {/* Input */}
        <div className="relative flex-1">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent py-2 pr-10 pl-2 
                       text-[12px] sm:text-[13px] lg:text-[14px]
                       text-gray-800 focus:outline-none placeholder:text-gray-500"
          />
          {/* Search icon - solid black */}
          <Image
            src={SearchIcon}
            alt="Search"
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       w-3 h-3 sm:w-[18px] sm:h-[18px] lg:w-4 lg:h-4 opacity-100 brightness-0"
          />
        </div>
      </div>
    </div>
  </div>
</section>

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
                  className="
                    flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory 
                    scrollbar-hide pb-4 px-1
                  "
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                {filteredTrendingContent.length > 0 ? (
                  filteredTrendingContent.map((item, index) => (
                    <div
                      key={`trending-${item.type}-${item.id}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100 snap-center"
                      onClick={() => handleTrendingCardClick(item)}
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                        <div
                          className="relative w-full rounded-3xl bg-black overflow-hidden flex items-center justify-center"
                          style={{ aspectRatio: "16 / 9" }}
                        >
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
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300 bg-black"
                            />
                          )}

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110">
                              {item.type === "video" ? (
                                <Image
                                  src={VideoIcon}
                                  alt="Video"
                                  className="w-12 h-12 ml-0.5"
                                />
                              ) : (
                                <Image
                                  src={BlogIcon}
                                  alt="Blog"
                                  className="w-12 h-12"
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
                className="
                  flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory 
                  scrollbar-hide pb-4 px-1
                "
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {filteredMostViewedContent.length > 0 ? (
                  filteredMostViewedContent.map((item, index) => (
                    <div
                      key={`most-viewed-${item.type}-${item.id}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100"
                      onClick={() => handleTrendingCardClick(item)}
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                        <div
  className="relative w-full rounded-3xl bg-black overflow-hidden flex items-center justify-center"
  style={{ aspectRatio: "16 / 9" }}
>
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
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300 bg-black"
                            />
                          )}

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110">
                              {item.type === "video" ? (
                                <Image
                                  src={VideoIcon}
                                  alt="Video"
                                  className="w-12 h-12 ml-0.5"
                                />
                              ) : (
                                <Image
                                  src={BlogIcon}
                                  alt="Blog"
                                  className="w-12 h-12"
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
                className="
                  flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory 
                  scrollbar-hide pb-4 px-1
                "
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {filteredMostLikedContent.length > 0 ? (
                  filteredMostLikedContent.map((item, index) => (
                    <div
                      key={`most-liked-${item.type}-${item.id}`}
                      className="group cursor-pointer flex-shrink-0 w-full md:w-100"
                      onClick={() => handleTrendingCardClick(item)}
                    >
                      <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                        <div
  className="relative w-full rounded-3xl bg-black overflow-hidden flex items-center justify-center"
  style={{ aspectRatio: "16 / 9" }}
>
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
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform duration-300 bg-black"

                            />
                          )}

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110">
                              {item.type === "video" ? (
                                <Image
                                  src={VideoIcon}
                                  alt="Video"
                                  className="w-12 h-12 ml-0.5"
                                />
                              ) : (
                                <Image
                                  src={BlogIcon}
                                  alt="Blog"
                                  className="w-12 h-12"
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
                className="
                  flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory 
                  scrollbar-hide pb-4 px-1
                "
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {creators.length > 0
                  ? creators.map((creator, index) => (
                      <div
                        key={`creator-${creator.id}`}
                        className="group cursor-pointer flex-shrink-0 w-[150px] sm:w-[180px] md:w-50"
                        onClick={() => {
                              const next = `/viewer/creator/${creator.id}`;
                              requireAuth(next, () => router.push(next));
                            }}
                      >
                        <div className="bg-white rounded-4xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ml-2">
                          <div className="aspect-[3/4] relative overflow-hidden">
                            {creator.profile_picture ? (
                              <Image
                                src={creator.profile_picture}
                                alt={creator.username || "Creator"}
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
                                    {creator.username || "Creator"}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Creator Name Overlay - Only on Hover and when profile picture exists */}
                            {creator.profile_picture && (
                              <div className="absolute inset-0 bg-black/0 transition-all duration-300 flex items-end mb-2 px-2">
                                <div className="w-full bg-white/20 px-4 py-3 text-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                                  <h3 className="text-white font-semibold text-base truncate">
                                    {creator.username || "Creator"}
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
        <div className={`fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden ${inter.className}`}>
            {/* Video container */}
            <div className="relative w-full h-full max-w-[100%] sm:max-w-full flex items-center justify-center">
              {/* Video element - no controls, no hover effects */}
              <video
                src="/Flock-Video.mp4"
                className="w-full h-auto sm:h-full pointer-events-none"
                autoPlay
                muted
                playsInline
                style={{
                  backgroundColor: "white",
                  display: "cover",
                  maxWidth: "100%",
                  maxHeight: "100%",
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
                className="absolute inset-0 flex flex-col items-center justify-center "
                style={{ display: "none" }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Video Not Found
                  </h3>
                  <p className="text-sm text-gray-400">
                    Redirecting to videos section...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
