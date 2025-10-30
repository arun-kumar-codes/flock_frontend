"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCreatorById } from "@/api/user";
import Loader from "@/components/Loader";
import Image from "next/image";
import placeholderImg from "../../../../../assets/profile.png";
import VideoIcon from "@/assets/Video_Icon.svg";
import { UserIcon } from "lucide-react";
import ShareButton from "@/components/viewer/ShareButton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

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

const formatViews = (views: number) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CreatorProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const [creator, setCreator] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  // Load creator + only published videos/blogs
  useEffect(() => {
    const fetchCreator = async () => {
      setIsLoading(true);
      try {
        const res = await getCreatorById(Number(id));
        if (res?.status === 200) {
          const { creator, videos, blogs } = res.data;

          const publishedVideos = (videos || [])
            .filter((v: any) => v.status?.toLowerCase() === "published")
            .sort((a: any, b: any) => a.id - b.id);

          const publishedBlogs = (blogs || [])
            .filter((b: any) => b.status?.toLowerCase() === "published")
            .sort((a: any, b: any) => a.id - b.id);

          setCreator({
            ...creator,
            videos: publishedVideos,
            blogs: publishedBlogs,
          });
        } else {
          setCreator(null);
        }
      } catch (err) {
        console.error("Error loading creator:", err);
        setCreator(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCreator();
  }, [id]);

  const handleVideoClick = (videoId: number) => {
    router.push(`/viewer/video/${videoId}`);
  };

  if (isLoading) return <Loader />;
  if (!creator) return <div className="theme-text-primary">Creator not found</div>;

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary transition-colors duration-300 py-8 px-6 md:px-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex justify-center md:justify-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-400 shadow-md">
            <Image
              src={creator.profile_picture || placeholderImg}
              alt={creator.username}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl theme-text-primary font-bold mb-2">
            {creator.username}
          </h1>
          <div className="flex text-xl justify-center md:justify-start gap-8 text-sm">
            <div className="text-center">
              <p className="theme-text-primary">Followers</p>
              <p className="font-semibold theme-text-primary">
                {creator.followers_count}
              </p>
            </div>
            <div className="text-center">
              <p className="theme-text-primary">Following</p>
              <p className="font-semibold theme-text-primary">
                {creator.following_count}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="theme-text-primary mb-4">
              {creator.bio || "No bio yet...."}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex justify-center md:justify-start rounded-xl p-1 mb-6 w-full md:w-auto mx-auto md:mx-0 transition-all duration-300 bg-gray-100/60 dark:bg-[#1e293b]/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <TabsTrigger
            value="videos"
            className={`flex items-center gap-2 px-6 py-2 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 ${
              activeTab === "videos"
                ? "bg-blue-600 text-black shadow-lg scale-[1.03]"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-[#334155]/70"
            }`}
          >
            🎬 Videos
          </TabsTrigger>

          <TabsTrigger
            value="blogs"
            className={`flex items-center gap-2 px-6 py-2 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 ${
              activeTab === "blogs"
                ? "bg-purple-600 text-black shadow-lg scale-[1.03]"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-[#334155]/70"
            }`}
          >
            📝 Blogs
          </TabsTrigger>
        </TabsList>

        {/* =========== VIDEOS TAB =========== */}
        <TabsContent value="videos" className="transition-all duration-300">
          {creator.videos?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-start">
              {creator.videos.map((video: any) => (
                <div
                  key={video.id}
                  className="group cursor-pointer h-full"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="theme-bg-card rounded-xl shadow-sm hover:shadow-md theme-border overflow-hidden transition-all duration-300 flex flex-col w-full max-w-[420px] mx-auto">
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg flex items-center justify-center bg-black">
                      <img
                        src={
                          video.thumbnail && video.thumbnail !== ""
                            ? video.thumbnail
                            : `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(
                                video.title
                              )}`
                        }
                        alt={video.title}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("placeholder.svg")) {
                            target.src = `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(
                              video.title
                            )}`;
                          }
                        }}
                      />

                      {/* Badges */}
                      {video.paid_promotion && (
                        <div className="absolute top-3 left-3 bg-yellow-400/90 text-gray-900 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg tracking-wide">
                          💰 Paid Promotion
                        </div>
                      )}
                      {video.age_restricted && (
                        <div className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                          18+
                        </div>
                      )}

                      {/* Duration */}
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {video.duration
                          ? formatDuration(Number.parseInt(video.duration))
                          : "8:38"}
                      </div>

                      {/* Play overlay */}
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

                    {/* Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex gap-3 flex-1 h-24">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden theme-bg-secondary">
                            {creator.profile_picture && creator.profile_picture !== "" ? (
                              <img
                                src={creator.profile_picture || "/placeholder.svg"}
                                alt={creator.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove("hidden");
                                }}
                              />
                            ) : null}
                            <UserIcon
                              className={`w-5 h-5 theme-text-muted ${
                                creator.profile_picture ? "hidden" : ""
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
                            {creator.username}
                          </p>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center text-xs theme-text-muted">
                              <span>{formatViews(video.views || 0)} views</span>
                              <span className="mx-1">•</span>
                              <span>{formatDate(video.created_at)}</span>
                            </div>

                            <ShareButton
                              kind="video"
                              id={video.id.toString()}
                              title={video.title}
                              summary={video.description || ""}
                              onCopied={(url) => console.log("Shared video URL:", url)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 italic mt-4">
              No videos uploaded yet.
            </p>
          )}
        </TabsContent>

        {/* =========== BLOGS TAB =========== */}
        <TabsContent value="blogs" className="transition-all duration-300">
          {creator.blogs?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-start">
              {creator.blogs.map((blog: any) => (
                <div
                  key={blog.id}
                  onClick={() => router.push(`/viewer/blog/${blog.id}`)}
                  className="group cursor-pointer h-full"
                >
                  <div className="theme-bg-card rounded-xl shadow-sm hover:shadow-md theme-border overflow-hidden transition-all duration-300 flex flex-col w-full max-w-[420px] mx-auto">
                    {/* Blog Cover */}
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg flex items-center justify-center bg-black">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("placeholder")) {
                              target.src = `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(
                                blog.title
                              )}`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">📝</span>
                        </div>
                      )}

                      {/* Paid Promotion Badge */}
                      {blog.paid_promotion && (
                        <div className="absolute top-3 left-3 bg-yellow-400/90 text-gray-900 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg tracking-wide">
                          💰 Paid Promotion
                        </div>
                      )}
                    </div>

                    {/* Blog Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex gap-3 flex-1">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden theme-bg-secondary">
                            {creator.profile_picture && creator.profile_picture !== "" ? (
                              <img
                                src={creator.profile_picture || "/placeholder.svg"}
                                alt={creator.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove("hidden");
                                }}
                              />
                            ) : null}
                            <UserIcon
                              className={`w-5 h-5 theme-text-muted ${
                                creator.profile_picture ? "hidden" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* Blog Details */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h3
                            title={blog.title}
                            className="font-semibold text-md leading-5 line-clamp-1 group-hover:text-purple-500 transition-colors theme-text-primary pt-2"
                          >
                            {blog.title}
                          </h3>

                          <p className="text-sm theme-text-secondary mt-2 line-clamp-1">
                            {stripHtmlAndDecode(blog.excerpt || blog.content || "No description available")}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-3">
                            <div className="flex items-center text-xs theme-text-muted">
                              <span>{formatViews(blog.views || 0)} views</span>
                              <span className="mx-1">•</span>
                              <span>{formatDate(blog.created_at || blog.published_at)}</span>
                            </div>

                            <ShareButton
                              kind="blog"
                              id={blog.id.toString()}
                              title={blog.title}
                              summary={blog.excerpt || ""}
                              onCopied={(url) => console.log("Shared blog URL:", url)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 italic mt-4">
              No blogs published yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
