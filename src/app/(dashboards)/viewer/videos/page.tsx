"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ThumbsUpIcon,
  PlayIcon,
  RefreshCwIcon,
  UserIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Share2,
} from "lucide-react";
import ShareButton from "@/components/viewer/ShareButton";
import Image from "next/image";
import SearchIcon from "@/assets/Search_Icon.svg";
import VideoIcon from "@/assets/Video_Icon.svg";
import Loader from "@/components/Loader";
import {
  getAllVideo,
  toggleVideoLike,
  getFollowings,
  getAllVideoCretor,
} from "@/api/content";
import { useSelector } from "react-redux";
import { getAllCreators } from "@/api/user";

interface Creator {
  email: string;
  id: number;
  role: string;
  username: string;
  avatar?: string;
  name?: string;
}

interface Commenter {
  email: string;
  id: number;
  role: string;
  username: string;
}

interface Comment {
  id: number;
  video_id: number;
  comment: string;
  commented_at: string;
  commented_by: number;
  commenter: Commenter;
}

interface Video {
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
  keywords?: string[];
  age_restricted?: boolean;
  paid_promotion?: boolean;
}

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

export default function VideoPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const isDark = user.theme === "dark";

  // ---- Auth helpers ----
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

  // Video states
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Following states
  const [selectedFollowing, setSelectedFollowing] = useState<string>("all");
  const [followings, setFollowings] = useState<Following[]>([]);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);
  const [followingError, setFollowingError] = useState("");

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null);
  const [likeAnimation, setLikeAnimation] = useState<{
    [key: number]: boolean;
  }>({});

  const [currentPage, setCurrentPage] = useState(0);
  const videosPerPage = 8;

  const fetchFollowingData = async () => {
    setFollowingError("");
    try {
      let response;

      if (user.isLogin) {
        response = await getFollowings();
      } else {
        response = await getAllCreators();
      }
      //console.log(response);
      if (response?.data) {
        const followingData = response.data;
        if (followingData.following) {
          setFollowings(followingData.following);
          setFollowingCount(
            followingData.following_count || followingData.following.length
          );
        } else if (followingData.creators) {
          setFollowings(followingData.creators);
        } else {
          setFollowingError("Following data format is incorrect");
        }
      } else {
        setFollowingError("No following data received");
      }
    } catch (error) {
      console.error("Error fetching following data:", error);
      setFollowingError("Failed to fetch following data");
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  const fetchVideos = async () => {
    setFetchError("");
    try {
      let response;

      if (selectedFollowing !== "all") {
        const selectedUser = followings.find(
          (f) => f.username === selectedFollowing
        );
        if (selectedUser) {
          response = await getAllVideoCretor(selectedUser.id);
        } else {
          response = await getAllVideo();
        }
      } else {
        response = await getAllVideo();
      }

      if (response?.data?.videos) {
        const videosWithUIFields = response.data.videos
          .filter(
            (video: any) => video.status === "published" && !video.archived
          )
          .map((video: any) => ({
            ...video,
            category:
              video.creator?.role === "Creator" ? "Educational" : "General",
            isFavorite: false,
            views: video.views || 0,
            author: video.creator,
            comments: video.comments || [],
            comments_count: video.comments_count || video.comments?.length || 0,
          }));
        setVideos(videosWithUIFields);

      } else {
        setFetchError("Failed to fetch videos - unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setFetchError("Failed to fetch videos. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoadingFollowing(true);
    setIsLoading(true);
    fetchVideos();
    fetchFollowingData();
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedFollowing]);

  useEffect(() => {
    fetchFollowingData();
    console.log("Fetching following data on mount");
  }, []);

  const toggleFavorite = (videoId: number) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? { ...video, isFavorite: !video.isFavorite }
          : video
      )
    );
  };

  const toggleLike = async (videoId: number) => {
    try {
      await toggleVideoLike(videoId);
      await fetchVideos();
    } catch (error) {
      console.error("Error toggling video like:", error);
      setFetchError("Failed to update like status. Please try again.");
      setTimeout(() => setFetchError(""), 3000);
    }
  };

  const filteredVideos = videos.filter((video) => {
    const lowerSearch = searchTerm.toLowerCase();
    const plainDescription = stripHtmlAndDecode(video.description);

    const matchesSearch =
      video.title.toLowerCase().includes(lowerSearch) ||
      video.creator.username.toLowerCase().includes(lowerSearch) ||
      plainDescription.toLowerCase().includes(lowerSearch) ||
      // ✅ search in keywords if available
      (Array.isArray(video.keywords) &&
        video.keywords.some((kw) => kw.toLowerCase().includes(lowerSearch)));

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const currentVideos = filteredVideos.slice(
    currentPage * videosPerPage,
    (currentPage + 1) * videosPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
  requireAuth(next, () => {
    router.push(next);
    setShowContentMenu(null);
  });
};

  const handleLikeToggle = async (e: any, videoId: number) => {
    e.stopPropagation();

    // 1. Optimistic update
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? {
              ...video,
              is_liked: !video.is_liked,
              likes: video.is_liked ? video.likes - 1 : video.likes + 1,
            }
          : video
      )
    );

    // 2. Trigger animation
    setLikeAnimation((prev) => ({ ...prev, [videoId]: true }));
    setTimeout(() => {
      setLikeAnimation((prev) => ({ ...prev, [videoId]: false }));
    }, 500);

    try {
      await toggleVideoLike(videoId);
    } catch (error) {
      console.error("Error toggling video like:", error);

      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId
            ? {
                ...video,
                is_liked: !video.is_liked,
                likes: video.is_liked ? video.likes - 1 : video.likes + 1,
              }
            : video
        )
      );
    }
  };

  if (isLoading || isLoadingFollowing) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen theme-bg-primary transition-colors duration-300">
      <div className="px-5 md:px-6 py-6 ml-4">
        {/* Search and Filter */}
        <div className="mb-4 md:mb-4 theme-border ml-2">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-[60%]">
              <Image
                src={SearchIcon}
                alt="Search"
                className="absolute right-1.5 md:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-6 md:h-6"
              />
              <input
                type="text"
                placeholder="Search videos by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-6 md:pl-4 md:pr-12 py-3 border-1 border-[#CDCDCD] rounded-4xl theme-text-primary placeholder-gray-500 focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all text-xs md:text-base font-poppins"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
              <div className="relative inline-block">
                {/* Left Icon */}
                <FilterIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 dark:text-gray-400 theme-text-secondary" />

                <select
                  value={selectedFollowing}
                  onChange={(e) => setSelectedFollowing(e.target.value)}
                  disabled={isLoadingFollowing}
                  className="pl-10 pr-8 py-2 md:py-3 theme-bg-secondary cursor-pointer rounded-4xl theme-text-primary min-w-[180px] appearance-none focus:ring-1 focus:ring-gray-400 focus:border-transparent md:text-base text-sm"
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
                </select>

                {/* Right caret (custom dropdown arrow) */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-start">
          {currentVideos.length > 0 ? (
            currentVideos.map((video) => {
              const plainDescription = stripHtmlAndDecode(video.description);
              const truncatedDescription = truncateText(plainDescription, 80);

              return (
                <div
                  key={video.id}
                  className="group cursor-pointer h-full"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="theme-bg-card rounded-xl shadow-sm hover:shadow-md theme-border overflow-hidden transition-all duration-300 flex flex-col w-full">
                      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                      <img
                        src={
                          video.thumbnail && video.thumbnail !== ""
                            ? video.thumbnail
                            : `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(
                                video.title
                              )}&query=Professional outdoor adventure thumbnail design, turquoise/teal colored object placed on red sandstone cliff edge, dramatic desert landscape background with blue sky and clouds, minimalist composition, natural daylight photography, adventure travel aesthetic, clean modern design, high contrast colors`
                        }
                        alt={video.title}
                        className="w-full h-full object-contain bg-black transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("placeholder.svg")) {
                            target.src = `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(
                              video.title
                            )}&query=Professional outdoor adventure thumbnail design, turquoise/teal colored object placed on red sandstone cliff edge, dramatic desert landscape background with blue sky and clouds, minimalist composition, natural daylight photography, adventure travel aesthetic, clean modern design, high contrast colors`;
                          }
                        }}
                      />

                      {/* Paid Promotion Badge */}
                      {video.paid_promotion && (
                        <div className="absolute top-3 left-3 bg-yellow-400/90 text-gray-900 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg tracking-wide">
                          💰 Paid Promotion
                        </div>
                      )}

                      {/* Age Restriction Badge */}
                      {video.age_restricted && (
                        <div className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                          18+
                        </div>
                      )}

                      {/* Duration overlay */}
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {video.duration
                          ? formatDuration(Number.parseInt(video.duration))
                          : "8:38"}
                      </div>

                      {/* Play button overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                          <Image
                            src={VideoIcon}
                            alt="Video"
                            className="w-10 h-10 md:w-12 md:h-12 ml-0.5"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="px-3 py-2 flex-1 flex flex-col">
                      <div className="flex gap-3 flex-1 h-24">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden theme-bg-secondary">
                            {video.creator?.avatar &&
                            video.creator.avatar !== "" ? (
                              <img
                                src={video.creator.avatar || "/placeholder.svg"}
                                alt={video.creator.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : null}
                            <UserIcon
                              className={`w-5 h-5 theme-text-muted ${
                                video.creator?.avatar ? "hidden" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h3
                            title={video.title}
                            className="font-semibold text-md leading-5 line-clamp-2 group-hover:text-purple-500 transition-colors theme-text-primary pt-2 flex items-start"
                          >
                            {video.title.length > 25
                              ? video.title.substring(0, 25) + "..."
                              : video.title}
                          </h3>

                          <p className="text-sm theme-text-secondary mt-2 truncate">
                            {video.creator?.username || "Unknown Creator"}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center text-xs theme-text-muted">
                              <span>{formatViews(video.views || 0)} views</span>
                              <span className="mx-1">•</span>
                              <span>{formatDate(video.created_at)}</span>
                            </div>

                            <button
                              onClick={(e) => handleLikeToggle(e, video.id)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all text-xs ${
                                video.is_liked
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "theme-text-muted hover:text-blue-500"
                              }`}
                            >
                              <ThumbsUpIcon
                                className={`w-3 h-3 ${
                                  video.is_liked ? "fill-current" : ""
                                } ${
                                  likeAnimation[video.id] ? "animate-pop" : ""
                                }`}
                              />
                              <span>{video.likes}</span>
                            </button>
                            <ShareButton
                                                kind="video"
                                                id={video.id.toString()}
                                                title={video.title}
                                                summary={video.description || ""}
                                                onCopied={(url: string) => console.log("Shared URL:", url)}
                                              />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 theme-border">
                <Image src={VideoIcon} alt="Video" className="w-20 h-20" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 theme-text-primary">
                No videos found
              </h3>
              <p className="mb-8 max-w-md mx-auto theme-text-secondary">
                {searchTerm
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "No videos are available at the moment. Check back later for new content."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedFollowing("all");
                  }}
                  className="px-6 py-3 theme-button-primary rounded-xl transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-12">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-3 rounded-full theme-button-secondary hover:opacity-80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="w-5 h-5 theme-text-secondary" />
            </button>

            <div className="px-4 py-2 rounded-lg theme-bg-card theme-border">
              <span className="text-sm font-medium theme-text-primary">
                {currentPage + 1} of {totalPages}
              </span>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="p-3 rounded-full theme-button-secondary hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightIcon className="w-5 h-5 theme-text-secondary cursor-pointer" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
