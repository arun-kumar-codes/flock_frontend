"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVerticalIcon,
  HeartIcon,
  ThumbsUpIcon,
  BookOpenIcon,
  FilterIcon,
  RefreshCwIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import Image from "next/image";
import SearchIcon from "@/assets/Search_Icon.svg";
import {
  getBlog,
  toggleBlogLike,
  getCreatorBlog,
  getFollowings,
} from "@/api/content";
import { getAllCreators } from "@/api/user";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { BlogModal } from "@/components/viewer/blog-modal";

interface Author {
  email: string;
  id: number;
  role: string;
  username: string;
}

interface Commenter {
  email: string;
  id: number;
  role: string;
  username: string;
}

interface Comment {
  id: number;
  blog_id: number;
  comment: string;
  commented_at: string;
  commented_by: number;
  commenter: Commenter;
}

interface Blog {
  is_liked: boolean;
  id: number;
  title: string;
  content: string;
  author: Author;
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
  keywords?: string[];
  age_restricted?: boolean;
  paid_promotion?: boolean;
}

interface Following {
  email: string;
  followers_count: number;
  following_count: number;
  id: number;
  profile_picture: string | null;
  role: string;
  username: string;
}

export default function BlogPage() {
  const router = useRouter();
  const [selectedFollowing, setSelectedFollowing] = useState<string>("all");
  const [followings, setFollowings] = useState<Following[]>([]);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const user = useSelector((state: any) => state.user);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [likeAnimation, setLikeAnimation] = useState<{
    [key: number]: boolean;
  }>({});
  const contentMenuRef = useRef<HTMLDivElement>(null);

  const isDark = user.theme === "dark";

  //console.log(user);

  //console.log(isDark);

  const blogsPerPage = 6;

  useEffect(() => {
    const role = user.role?.toLowerCase();
    if (role === "creator") {
      router.push("/dashboard");
      return;
    } else if (role === "admin") {
      router.push("/admin");
      return;
    }

    fetchFollowingData();

    fetchBlogs();
  }, [user, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentMenuRef.current &&
        !contentMenuRef.current.contains(event.target as Node)
      ) {
        setShowContentMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchFollowingData = async () => {
    setIsLoadingFollowing(true);
    try {
      if (user.isLogin === false) {
        const response = await getAllCreators();
        setFollowings(response.data.creators);
        setFollowingCount(response.data.creators.length || 0);
        setIsLoadingFollowing(false);
        return;
      }
      const response = await getFollowings();
      if (response?.data?.following) {
        setFollowings(response.data.following);
        setFollowingCount(response.data.following_count || 0);
      } else {
        console.error(
          "Failed to fetch following data - unexpected response structure"
        );
      }
    } catch (error) {
      console.error("Error fetching following data:", error);
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
    setShowContentMenu(null);
  };

  const fetchBlogs = async () => {
    setFetchError("");

    try {
      let response;

      if (selectedFollowing !== "all") {
        const selectedUser = followings.find(
          (f) => f.username === selectedFollowing
        );
        if (selectedUser) {
          response = await getCreatorBlog(String(selectedUser.id));
        }
      } else {
        response = await getBlog();
      }

      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs.map((blog: Blog) => ({
          ...blog,
          excerpt: generateExcerpt(blog.content, blog.image),
          readAt: new Date().toISOString().split("T")[0],
          readTime: calculateReadTime(blog.content),
          isFavorite: false,
          publishedAt: blog.created_at,
        }));
        setBlogs(blogsWithUIFields);
        if (selectedBlog) {
          const updatedSelectedBlog = blogsWithUIFields.find(
            (blog: Blog) => blog.id === selectedBlog.id
          );
          if (updatedSelectedBlog) {
            setSelectedBlog(updatedSelectedBlog);
          }
        }
      } else {
        setFetchError("Failed to fetch blogs - unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setFetchError("Failed to fetch blogs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchBlogs();
    fetchFollowingData();
  };

  useEffect(() => {
    if (followings.length > 0) {
      fetchBlogs();
    }
  }, [selectedFollowing, followings]);

  const fetchUpdatedBlogs = async () => {
    setFetchError("");
    try {
      let response;

      if (selectedFollowing !== "all") {
        const selectedUser = followings.find(
          (f) => f.username === selectedFollowing
        );
        if (selectedUser) {
          response = await getCreatorBlog(String(selectedUser.id));
        }
      } else {
        response = await getBlog();
      }

      if (response?.data?.blogs) {
        const blogsWithUIFields = response.data.blogs.map((blog: Blog) => ({
          ...blog,
          excerpt: generateExcerpt(blog.content, blog.image),
          thumbnail: "/placeholder.svg?height=200&width=300",
          readAt: new Date().toISOString().split("T")[0],
          readTime: calculateReadTime(blog.content),
          isFavorite: false,
          publishedAt: blog.created_at,
        }));
        setBlogs(blogsWithUIFields);
        if (selectedBlog) {
          const updatedSelectedBlog = blogsWithUIFields.find(
            (blog: Blog) => blog.id === selectedBlog.id
          );
          if (updatedSelectedBlog) {
            setSelectedBlog(updatedSelectedBlog);
          }
        }
      } else {
        setFetchError("Failed to fetch blogs - unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setFetchError("Failed to fetch blogs. Please try again.");
    }
  };

  const generateExcerpt = (
    content: string,
    image: string | undefined
  ): string => {
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

  const toggleLike = async (blogId: number) => {
    // 1. Optimistic update
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              is_liked: !blog.is_liked,
              likes: blog.is_liked ? blog.likes - 1 : blog.likes + 1,
            }
          : blog
      )
    );

    // 2. Trigger animation
    setLikeAnimation((prev) => ({ ...prev, [blogId]: true }));
    setTimeout(() => {
      setLikeAnimation((prev) => ({ ...prev, [blogId]: false }));
    }, 500);

    try {
      await toggleBlogLike(blogId);
    } catch (error) {
      console.error("Error toggling blog like:", error);
      // Revert optimistic update on error
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === blogId
            ? {
                ...blog,
                is_liked: !blog.is_liked,
                likes: blog.is_liked ? blog.likes - 1 : blog.likes + 1,
              }
            : blog
        )
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredBlogs = blogs.filter((blog) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      blog.title.toLowerCase().includes(lowerSearch) ||
      blog.author.username.toLowerCase().includes(lowerSearch) ||
      (blog.category && blog.category.toLowerCase().includes(lowerSearch)) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(lowerSearch)) ||
      // ✅ check keywords if not empty
      (Array.isArray(blog.keywords) &&
        blog.keywords.some((kw) => kw.toLowerCase().includes(lowerSearch)));

    const matchesFilter =
      filterCategory === "all" || blog.category === filterCategory;

    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentBlogs = filteredBlogs.slice(
    currentPage * blogsPerPage,
    (currentPage + 1) * blogsPerPage
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

  if (isLoading || isLoadingFollowing) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen theme-bg-primary transition-colors duration-300">
      <div className="lg:px-3 py-6">
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
        placeholder="Search articles by title, author, or content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-4 pr-6 md:pl-4 md:pr-12 py-3 border-1 border-[#CDCDCD] rounded-4xl theme-text-primary placeholder-gray-500 focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all text-xs md:text-base font-poppins"
      />
    </div>

    {/* Filters */}
    <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
      <div className="relative inline-block">
        {/* Left Icon */}
        <FilterIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 dark:text-gray-400" />

        <select
          value={selectedFollowing}
          onChange={(e) => setSelectedFollowing(e.target.value)}
          disabled={isLoadingFollowing}
          className="pl-10 pr-8 py-2 md:py-3 bg-[#EAEEF6] cursor-pointer rounded-4xl theme-text-primary min-w-[180px] appearance-none focus:ring-1 focus:ring-gray-400 focus:border-transparent md:text-base text-sm"
        >
          <option value="all">
            {user.isLogin ? "All Following" : "All Creators"}
          </option>
          {followings.map((following) => (
            <option key={following.id} value={following.username}>
              {following.username}
            </option>
          ))}
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


        {/* Mixed Blog Grid Layout */}
        {currentBlogs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Featured Blog (Large Card) */}
            {currentBlogs[0] && (
              <div
                className="lg:col-span-2 lg:row-span-2 group cursor-pointer"
                onClick={() => handleBlogClick(currentBlogs[0])}
              >
                <div className="theme-bg-card rounded-4xl shadow-sm hover:shadow-lg theme-border overflow-hidden h-full flex flex-col transition-all duration-300 ml-2">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    {currentBlogs[0].image ? (
                      <Image
                        src={currentBlogs[0].image || "/placeholder.svg"}
                        alt={currentBlogs[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                        <BookOpenIcon className="w-12 h-12 text-purple-500" />
                      </div>
                    )}

                    {/* Always show 18+ badge in top-right */}
                    {currentBlogs[0].age_restricted && (
                      <div className="absolute top-4 right-4 bg-red-700 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md z-10">
                        18+
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 text-sm theme-text-muted">
                        <span className="font-medium">
                          {currentBlogs[0].author.username}
                        </span>
                        <span>•</span>
                        <span>{formatDate(currentBlogs[0].created_at)}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 theme-text-primary group-hover:text-purple-500 transition-colors line-clamp-3">
                      {currentBlogs[0].title}
                    </h2>

                    <p className="theme-text-secondary mb-6 line-clamp-4 flex-1 text-base leading-relaxed">
                      {currentBlogs[0].excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        {currentBlogs[0].paid_promotion && (
                          <span className="inline-flex items-center px-2.5 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-xs font-medium border border-yellow-200 dark:border-yellow-800">
                            💰 Paid Promotion
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(currentBlogs[0].id);
                          }}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                            currentBlogs[0].is_liked
                              ? "bg-blue-500/10 text-blue-500"
                              : "theme-button-secondary theme-text-secondary hover:theme-text-primary"
                          }`}
                        >
                          <ThumbsUpIcon
                            className={`w-4 h-4 ${
                              currentBlogs[0].is_liked ? "fill-current" : ""
                            } ${
                              likeAnimation[currentBlogs[0].id]
                                ? "animate-pop"
                                : ""
                            }`}
                          />
                          <span>{currentBlogs[0].likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentBlogs.slice(1, 5).map((blog, index) => (
              <div
                key={blog.id}
                className="lg:col-span-1 group cursor-pointer"
                onClick={() => handleBlogClick(blog)}
              >
                <div className="theme-bg-card rounded-4xl shadow-sm hover:shadow-lg theme-border overflow-hidden h-full flex flex-col transition-all duration-300 ml-2">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {blog.image ? (
                      <Image
                        src={blog.image || "/placeholder.svg"}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                        <BookOpenIcon className="w-8 h-8 text-purple-500" />
                      </div>
                    )}
                    {blog.age_restricted && (
                      <div className="absolute top-6 right-6 bg-red-700 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md">
                        18+
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-xs theme-text-muted">
                        <span className="font-medium">
                          {blog.author.username}
                        </span>
                        <span>•</span>
                        <span>{formatDate(blog.created_at)}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-3 theme-text-primary group-hover:text-purple-500 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="theme-text-secondary mb-4 line-clamp-3 flex-1 text-sm">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        {blog.paid_promotion && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-[10px] font-medium border border-yellow-200 dark:border-yellow-800">
                            💰 Paid
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(blog.id);
                        }}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs font-medium ${
                          blog.is_liked
                            ? "bg-blue-500/10 text-blue-500"
                            : "theme-button-secondary theme-text-secondary hover:theme-text-primary"
                        }`}
                      >
                        <ThumbsUpIcon
                          className={`w-3 h-3 ${
                            blog.is_liked ? "fill-current" : ""
                          } ${likeAnimation[blog.id] ? "animate-pop" : ""}`}
                        />
                        <span>{blog.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpenIcon className="w-10 h-10 theme-text-muted" />
            </div>
            <h3 className="text-xl font-semibold mb-2 theme-text-primary">
              No articles found
            </h3>
            <p className="mb-6 max-w-md mx-auto theme-text-secondary">
              {searchTerm ||
              filterCategory !== "all" ||
              selectedFollowing !== "all"
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "No articles are available at the moment. Check back later for new content."}
            </p>
            {(searchTerm ||
              filterCategory !== "all" ||
              selectedFollowing !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setSelectedFollowing("all");
                }}
                className="px-6 py-3 theme-button-primary rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
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

        {/* Blog Modal */}
        {showBlogModal && selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onClose={() => setShowBlogModal(false)}
            onToggleLike={toggleLike}
            onRefreshBlogs={fetchUpdatedBlogs}
            // isDark={isDark}
          />
        )}
      </div>
    </div>
  );
}
