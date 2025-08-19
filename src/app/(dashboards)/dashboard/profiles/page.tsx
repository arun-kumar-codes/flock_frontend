"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Camera, User, Mail, Shield, Edit3 } from "lucide-react"
import { useSelector } from "react-redux"
import { updateProfile } from "@/api/user"
import Loader2 from "@/components/Loader2"


interface UserData {
  id: string
  username: string
  email: string
  role: string
  profileImage: string
  is_profile_completed: boolean
}

export default function ProfilePage() {
  // Simulate Redux state for initial user data.
  const initialUser = useSelector((state: any) => state.user)
  //console.log("Initial User Data:", initialUser)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [username, setUsername] = useState(initialUser.username)
  const [profileImage, setProfileImage] = useState(initialUser.profileImage)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading,setisLoading]=useState(true);

  // Store original values to compare against
  const [originalUsername, setOriginalUsername] = useState(initialUser.username)
  const [originalProfileImage, setOriginalProfileImage] = useState(initialUser.profileImage)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUsername(initialUser.username)
    setProfileImage(initialUser.profileImage)
    setOriginalUsername(initialUser.username)
    setOriginalProfileImage(initialUser.profileImage)
    setisLoading(false);
  }, [initialUser])

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

      // Update original values after successful save
      setOriginalUsername(username)
      setOriginalProfileImage(profileImage)
      setImageFile(null) // Reset image file after successful upload
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error: Failed to connect to the server. Please try again.")
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

  if(isLoading){
    return <Loader2></Loader2>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-lg text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative px-6 md:px-8 lg:px-12 pb-12 -mt-24">
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
                    <div className="h-40 w-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-2xl">
                      <img
                        src={profileImage || "/placeholder.svg?height=160&width=160&query=profile"}
                        alt={username}
                        className="h-full w-full rounded-full object-cover bg-white"
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{initialUser.username}</h2>
                    <p className="text-gray-600 text-lg mb-4">Welcome back!</p>
                  </div>

                  {/* Info Cards */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 rounded-lg p-2">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Email</p>
                          <p className="text-gray-900 font-semibold">{initialUser.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-500 rounded-lg p-2">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Role</p>
                          <p className="text-gray-900 font-semibold capitalize">{initialUser.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Edit Form */}
              <div className="lg:w-2/3">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                    </div>
                    <p className="text-gray-600">
                      Update your profile information. Your email address cannot be changed for security reasons.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
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
                            className="w-full h-14 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            value={initialUser.email}
                            disabled
                            className="w-full h-14 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-500 cursor-not-allowed"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="bg-gray-400 rounded-full p-1">
                              <Mail className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Email cannot be changed for security reasons</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={!hasChanges()}
                        className="flex-1 sm:flex-none px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving || !hasChanges()}
                        className="flex-1 sm:flex-none px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
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
      </div>
    </div>
  )
}
