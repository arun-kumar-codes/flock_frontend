"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, UsersIcon, AlertCircleIcon, RefreshCwIcon, FilterIcon, UserIcon, MailIcon } from 'lucide-react'
import Image from "next/image"
import { useSelector } from "react-redux"
import Loader from "@/components/Loader"
import { getFollower } from "@/api/content"

interface Follower {
  email: string
  followers_count: number
  following_count: number
  id: number
  profile_picture: string | null
  role: string
  username: string
}

interface FollowerResponse {
  followers: Follower[]
  followers_count: number
}

export default function FollowersPage() {
  const router = useRouter()
  const user = useSelector((state: any) => state.user)
  
  // Followers states
  const [followers, setFollowers] = useState<Follower[]>([])
  const [followersCount, setFollowersCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  
  // UI states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [sortBy, setSortBy] = useState("username") // username, followers_count, following_count, recent

  useEffect(() => {
    if (!user || !user.role) return
    
    const role = user.role.toLowerCase()
    if (role === "viewer") {
      router.push("/viewer/dashboard")
      return
    } else if (role === "admin") {
      router.push("/admin/dashboard")
      return
    }
    
    fetchFollowers()
  }, [user, router])

  const fetchFollowers = async () => {
    setFetchError("")
    setIsLoading(true)
    try {
      console.log("Fetching followers data...")
      const response = await getFollower()
      console.log("Followers response:", response)
      
      if (response?.data) {
        const followerData: FollowerResponse = response.data
        if (followerData.followers && Array.isArray(followerData.followers)) {
          setFollowers(followerData.followers)
          setFollowersCount(followerData.followers_count || followerData.followers.length)
          console.log("Followers data set:", followerData.followers)
        } else {
          console.error("Followers data is not in expected format:", followerData)
          setFetchError("Followers data format is incorrect")
        }
      } else {
        console.error("No data in followers response:", response)
        setFetchError("No followers data received")
      }
    } catch (error) {
      console.error("Error fetching followers:", error)
      setFetchError("Failed to fetch followers. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort followers
  const filteredAndSortedFollowers = followers
    .filter((follower) => {
      const matchesSearch = 
        follower.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.role.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = filterRole === "all" || follower.role.toLowerCase() === filterRole.toLowerCase()
      
      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "username":
          return a.username.localeCompare(b.username)
        case "followers_count":
          return b.followers_count - a.followers_count
        case "following_count":
          return b.following_count - a.following_count
        default:
          return a.username.localeCompare(b.username)
      }
    })

  // Get unique roles for filter
  const roles = ["all", ...Array.from(new Set(followers.map(follower => follower.role)))]

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">My Followers</h1>
              <p className="text-slate-600 text-lg">
                Manage and view your followers
                {followersCount > 0 && (
                  <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 flex-1">{fetchError}</p>
              <button
                onClick={fetchFollowers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search followers by username, email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div className="flex gap-3">
            
        

              <button
                onClick={fetchFollowers}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCwIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Loading..." : "Refresh"}</span>
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          {followers.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UsersIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Followers</p>
                      <p className="text-2xl font-bold text-slate-800">{followersCount}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Active Followers</p>
                      <p className="text-2xl font-bold text-slate-800">{followers.filter(f => f.following_count > 0).length}</p>
                    </div>
                  </div>
                </div>
           
              </div>
            </div>
          )}

        </div>

        {/* Followers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedFollowers.length > 0 ? (
            filteredAndSortedFollowers.map((follower) => (
              <div
                key={follower.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
              >
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative mb-4">
                    {follower.profile_picture ? (
                      <Image
                        src={follower.profile_picture || "/placeholder.svg"}
                        alt={follower.username}
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-4 border-slate-100 min-w-[80px] min-h-[80px]"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-slate-100">
                        <UserIcon className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                    {/* Role Badge */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        follower.role === 'Creator' 
                          ? 'bg-purple-100 text-purple-800' 
                          : follower.role === 'Admin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {follower.role}
                      </span>
                    </div>
                  </div>

                  {/* User Info */}
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{follower.username}</h3>
                  <p className="text-slate-500 text-sm mb-4 break-all">{follower.email}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-center space-x-6 w-full">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-800">{formatCount(follower.followers_count)}</p>
                      <p className="text-xs text-slate-500">Followers</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-800">{formatCount(follower.following_count)}</p>
                      <p className="text-xs text-slate-500">Following</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {followers.length === 0 ? "No followers yet" : "No followers found"}
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {followers.length === 0 
                  ? "Start creating content to attract followers to your profile."
                  : searchTerm || filterRole !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "No followers match your current filters."
                }
              </p>
              {(searchTerm || filterRole !== "all") && followers.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterRole("all")
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
