"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useDispatch } from "react-redux" // Import useDispatch

import { useRouter } from "next/navigation"
import { updateUserProfile, changePassword } from "@/api/user"
import { Camera, User, Mail, Shield, Eye, EyeOff, Key } from "lucide-react"
import Image from "next/image"
import { useSelector } from "react-redux"
import { setUser } from "@/slice/userSlice"
import Loader from "@/components/Loader"

interface ProfileData {
  username: string
  email: string
  role: string
  imageUrl: string
  password: string
  confirmPassword: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false)

  const user = useSelector((state: any) => state.user)

  const dispatch = useDispatch() // Declare useDispatch

  const [profileFormData, setProfileFormData] = useState<ProfileData>({
    username: user.username || "",
    email: user.email || "",
    role: user.role || "",
    imageUrl: user.imageUrl || "/placeholder.svg?height=80&width=80",
    password: "",
    confirmPassword: "",
  })

  const [passwordFormData, setPasswordFormData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profileErrors, setProfileErrors] = useState<any>({})
  const [passwordErrors, setPasswordErrors] = useState<any>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    profilePassword: false,
    profileConfirmPassword: false,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (profileErrors[name]) {
      setProfileErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (passwordErrors[name]) {
      setPasswordErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileFormData((prev) => ({
          ...prev,
          imageUrl: event.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validateProfileForm = () => {
    const errors: any = {}

    if (!profileFormData.username.trim()) {
      errors.username = "First name is required"
    }

    if (!profileFormData.email.trim()) {
      errors.email = "Email is required"
    }

    if (profileFormData.password && profileFormData.password !== profileFormData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (profileFormData.password && profileFormData.password.length > 0 && profileFormData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePasswordForm = () => {
    const errors: any = {}

    if (!passwordFormData.currentPassword) {
      errors.currentPassword = "Current password is required"
    }
    if (!passwordFormData.newPassword) {
      errors.newPassword = "New password is required"
    } else if (passwordFormData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters"
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProfileSubmit = async () => {
    if (!validateProfileForm()) return

    setUpdateLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await updateUserProfile(profileFormData)
      if (response.status === 200) {
        setSuccessMessage("Profile updated successfully!")
        dispatch(setUser(response.data.user))
      } else {
        setErrorMessage("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorMessage("An error occurred while updating your profile")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) return

    setUpdatePasswordLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await changePassword({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
      })
      if (response.status === 200) {
        setSuccessMessage("Password updated successfully!")
        setPasswordFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setErrorMessage("Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      setErrorMessage("An error occurred while updating your password")
    } finally {
      setUpdatePasswordLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <>
        <Loader />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Profile Settings</h1>
          <p className="text-gray-600 text-base md:text-lg">Manage your account information and security</p>
        </div>

        {/* Combined Profile and Password Sections */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="space-y-8">
              {/* Profile Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white shadow-lg ring-4 ring-white/20">
                    <Image
                      src={profileFormData.imageUrl || "/placeholder.svg?height=112&width=112"}
                      alt="Profile"
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="profileImageInput"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("profileImageInput")?.click()}
                    className="absolute -bottom-2 -right-2 bg-white hover:bg-gray-50 rounded-full p-3 text-blue-600 shadow-lg transition-all duration-200 border-2 border-blue-600 hover:scale-105"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-white mb-1">Profile Photo</h3>
                  <p className="text-blue-100">Click the camera icon to upload a new photo</p>
                </div>
              </div>

              {/* Combined Profile Information and Password Change Sections */}
              <div className="grid grid-cols-1 gap-8">
                {/* Profile Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={profileFormData.username}
                        onChange={handleProfileChange}
                        placeholder="Enter username"
                        className={`w-full px-4 py-3 bg-white rounded-lg border-2 transition-all duration-200 ${
                          profileErrors.username
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                        } text-gray-900 focus:outline-none focus:ring-4`}
                      />
                      {profileErrors.username && <p className="text-red-500 text-sm mt-2">{profileErrors.username}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={profileFormData.email}
                          onChange={handleProfileChange}
                          disabled={user.email ? true : false}
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                            user.email
                              ? "bg-gray-50 text-gray-500 border-gray-200"
                              : "bg-white text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                          } focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="role"
                          value={profileFormData.role}
                          disabled
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200 text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password (Optional)</label>
                      <div className="relative">
                        <input
                          type={showPasswords.profilePassword ? "text" : "password"}
                          name="password"
                          value={profileFormData.password}
                          onChange={handleProfileChange}
                          placeholder="Enter new password"
                          className={`w-full px-4 py-3 pr-12 bg-white rounded-lg border-2 transition-all duration-200 ${
                            profileErrors.password
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                          } text-gray-900 focus:outline-none focus:ring-4`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("profilePassword")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.profilePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {profileErrors.password && <p className="text-red-500 text-sm mt-2">{profileErrors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.profileConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={profileFormData.confirmPassword}
                          onChange={handleProfileChange}
                          placeholder="Confirm your password"
                          className={`w-full px-4 py-3 pr-12 bg-white rounded-lg border-2 transition-all duration-200 ${
                            profileErrors.confirmPassword
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                          } text-gray-900 focus:outline-none focus:ring-4`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("profileConfirmPassword")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.profileConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {profileErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-2">{profileErrors.confirmPassword}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleProfileSubmit}
                      disabled={updateLoading}
                      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        updateLoading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]"
                      } text-white`}
                    >
                      {updateLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Updating Profile...</span>
                        </div>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {(successMessage || errorMessage) && (
                <div className="space-y-4">
                  {successMessage && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-lg p-4">
                      <p className="text-emerald-800 font-medium">{successMessage}</p>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                      <p className="text-red-800 font-medium">{errorMessage}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
