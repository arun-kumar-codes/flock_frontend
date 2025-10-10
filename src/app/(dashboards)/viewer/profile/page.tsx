"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Camera, User, Mail, Shield, Edit3, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { updateProfile, becomeCreator } from "@/api/user"
import Loader from "@/components/Loader"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { setUser } from "@/slice/userSlice"

// This is a mock of your Redux state and API calls for demonstration purposes.
// You can replace these with your actual Redux and API logic.
interface UserData {
  id: string
  username: string
  email: string
  role: string
  profileImage: string
  is_profile_completed: boolean
}

export default function ProfilePage() {
  const user = useSelector((state: any) => state.user)
  const dispatch = useDispatch();
  const isDark = user.theme === "dark"

  //console.log("User Data:", user)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [username, setUsername] = useState(user.username)
  const [profileImage, setProfileImage] = useState(user.profileImage)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreatorModal, setShowCreatorModal] = useState(false)
  const [isBecomingCreator, setIsBecomingCreator] = useState(false)

  // Store original values to compare against
  const [originalUsername, setOriginalUsername] = useState(user.username)
  const [originalProfileImage, setOriginalProfileImage] = useState(user.profileImage)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user.isLogin) {
      router.push("/login")
      return
    }
    setUsername(user.username)
    setProfileImage(user.profileImage)
    setOriginalUsername(user.username)
    setOriginalProfileImage(user.profileImage)
    setIsLoading(false)
  }, [user])

  // Function to check if there are any changes
  const hasChanges = () => {
    const usernameChanged = username !== originalUsername
    const imageChanged = imageFile !== null
    return usernameChanged || imageChanged
  }

  const handleAvatarClick = () => {
    // Programmatically click the hidden file input.
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a temporary URL for the selected image to show a preview.
      const tempUrl = URL.createObjectURL(file)
      setImageFile(file)
      setProfileImage(tempUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Don't submit if there are no changes
    if (!hasChanges()) {
      return
    }

    setIsSaving(true)
    try {
      // In a real app, you'd upload the file if it has changed and get back a URL.
      const updatedFields = { username, profileImage }
      const form = new FormData()
      if (imageFile) {
        form.append("profile_picture", imageFile)
      }
      form.append("username", username)
      const response = await updateProfile(form)
      

      if(response.status==200){
        toast.success("Profile updated successfully!")
        // Update original values after successful save
        setOriginalUsername(username)
        setOriginalProfileImage(profileImage)
        setImageFile(null) // Reset image file after successful upload
        dispatch(setUser(response?.data?.user)); // Update Redux store with new user data
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Unable to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset to original values
    setUsername(originalUsername)
    setProfileImage(originalProfileImage)
    setImageFile(null)
  }

  const handleBecomeCreator = async () => {
    setIsBecomingCreator(true)
    try {
      const response = await becomeCreator()
      toast.success("Congratulations! You are now a creator!")
      setShowCreatorModal(false)
      // router.push("/dashboard")
      // window.location.reload();
      window.location.href = "/dashboard"
      // For now, we'll just close the modal
    } catch (error) {
      console.error("Error becoming creator:", error)
      toast.error("Failed to become creator. Please try again.")
    } finally {
      setIsBecomingCreator(false)
    }
    }

  if (isLoading) {
    return <Loader></Loader>
  }

  return (
    <div className="min-h-screen theme-bg-primary transition-colors duration-300 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold theme-text-primary mb-2">Profile Settings</h1>
          <p className="text-sm md:text-lg theme-text-secondary">Manage your account information and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="theme-bg-card backdrop-blur-sm rounded-4xl shadow-2xl overflow-hidden theme-border">
          {/* Hero Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative md:px-8 lg:px-12 pb-12 -mt-24">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12 space-y-8 lg:space-y-0">
              {/* Left Side - Profile Display */}
              <div className="flex flex-col items-center lg:items-start space-y-6 lg:w-1/3">
                {/* Profile Picture */}
                <div className="relative group">
                  <div
                    className="relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={handleAvatarClick}
                    title="Change profile picture"
                  >
                    <div className="w-28 h-28 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-2xl">
                      <img
                        src={profileImage || "/placeholder.svg?height=160&width=160&query=profile"}
                        alt={username}
                        className="h-full w-full rounded-full object-cover theme-bg-card"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg">
                    <Edit3 className="h-4 w-4 text-white" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                />

                {/* User Info Cards */}
                <div className="w-full space-y-4">
                  <div className="text-center lg:text-left">
                    <h2 className="text-xl md:text-3xl font-bold theme-text-primary mb-2">{user.username}</h2>
                    <p className="theme-text-secondary text-base md:text-lg mb-2 md:mb-4">Welcome back!</p>
                  </div>

                  {/* Info Cards */}
                  <div className="space-y-3">
                    <div className="theme-bg-secondary rounded-xl p-4 theme-border">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 rounded-lg p-2">
                          <Mail className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium theme-text-muted">Email</p>
                          <p className="theme-text-primary font-semibold text-sm md:text-base">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="theme-bg-secondary rounded-xl p-4 theme-border">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-500 rounded-lg p-2">
                          <Shield className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium theme-text-muted">Role</p>
                          <p className="theme-text-primary font-semibold capitalize text-sm md:text-base">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {user.role !== "creator" && (
                      <div className="theme-bg-secondary rounded-xl p-4 theme-border">
                        <div className="flex flex-col gap-8 justify-between">
                          <div className="flex items-center space-x-3">
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Edit Form */}
              <div className="lg:w-2/3">
                <div className="theme-bg-secondary rounded-4xl p-4 md:p-8 shadow-lg theme-border">
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2">
                        <User className="w-5 h-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold theme-text-primary">Edit Profile</h3>
                    </div>
                    <p className="theme-text-secondary text-sm md:text-base">
                      Update your profile information. Your email address cannot be changed for security reasons.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="username" className="block text-sm font-semibold theme-text-primary mb-3">
                          Username
                        </label>
                        <div className="relative">
                          <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            className="w-full h-10 md:h-14 rounded-xl theme-input px-4 py-3 text-sm md:text-base theme-text-primary placeholder:theme-text-muted transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold theme-text-primary mb-3">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full h-10 md:h-14 rounded-xl theme-input px-4 py-3 text-sm md:text-base theme-text-muted cursor-not-allowed opacity-60"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="bg-gray-400 rounded-full p-1">
                              <Mail className="h-3 w-3 md:h-4 md:w-4 text-white" />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs md:text-sm theme-text-muted mt-2">
                          Email cannot be changed for security reasons
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 theme-border-t">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={!hasChanges()}
                        className="flex-1 sm:flex-none px-8 py-2 md:py-4 rounded-xl theme-button-secondary font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving || !hasChanges()}
                        className="flex-1 sm:flex-none px-8 py-2 md:py-4 rounded-xl theme-button-primary text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                      >
                        {isSaving ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCreatorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreatorModal(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 theme-bg-card theme-border">
              <button
                onClick={() => setShowCreatorModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full cursor-pointer dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 theme-text-secondary" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-bold theme-text-primary">Switch to Creator Account</h2>
                </div>

                <div className="theme-text-secondary text-sm">
                  Would you like to switch to a creator account? This will give you access to:
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Content creation access</li>
                    <li>• Basic analytics</li>
                    <li>• Publishing capabilities</li>
                    <li>• Community features</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <button
                    onClick={() => setShowCreatorModal(false)}
                    disabled={isBecomingCreator}
                    className="w-full sm:w-auto px-4 py-2 border-2 border-gray-300 dark:border-gray-600 theme-text-primary  dark:hover:bg-gray-700 focus:ring-gray-500 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBecomeCreator}
                    disabled={isBecomingCreator}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBecomingCreator ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        <span>Switch to Creator</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
