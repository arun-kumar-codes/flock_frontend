"use client"
import { useState, useEffect, useRef, use } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { getUserProfile, updateUserProfile, changePassword } from "@/api/user"
import { EyeIcon, EyeOffIcon, UserIcon, KeyIcon, ChevronDownIcon } from "lucide-react"
import Image from "next/image"
import { useSelector } from "react-redux";
import { setUser } from "@/slice/userSlice"
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader"


interface ProfileData {
  username: string
  email: string
  role: string
  imageUrl: string
  password: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false)

  const user=useSelector((state:any)=>state.user);

  console.log(user);
//   setUser(user);

  // Profile form data
  const [profileFormData, setProfileFormData] = useState<ProfileData>(user)

  // Password form data
  const [passwordFormData, setPasswordFormData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Error states
  const [profileErrors, setProfileErrors] = useState<any>({})
  const [passwordErrors, setPasswordErrors] = useState<any>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Password visibility
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })


  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await getUserProfile()
        if (response.status === 200) {
          const userData = response.data.user
          setProfileFormData({
            username: userData.username || "",
            email: userData.email || "",
            role: userData.role || "",
            imageUrl: userData.imageUrl || "/placeholder.svg?height=80&width=80",
            password: "",
          })

        } else {
          setErrorMessage("Failed to fetch profile data")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setErrorMessage("An error occurred while fetching your profile")
      } finally {
        setIsLoading(false)
      }
    }

    // fetchUserProfile()
  }, [router])


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
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
    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors((prev:any) => ({
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
          avatar: event.target?.result as string,
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

    if(!profileFormData.email.trim()){
      errors.email = "Email is required"
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

  if (isLoading) {
    return <><Loader/></>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile Settings</h1>
        <p className="text-slate-600">Manage your account settings and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "profile"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>Profile Information</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "password"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <KeyIcon className="w-4 h-4" />
                <span>Change Password</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Avatar */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100">
                    <Image
                      src={profileFormData.imageUrl || "/placeholder.svg?height=96&width=96"}
                      alt="Profile"
                      width={96}
                      height={96}
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
                    className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 rounded-full p-2 text-white shadow-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800">Profile Photo</h3>
                  <p className="text-sm text-slate-600">Upload a new profile photo</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1  gap-6">
                {/* Name Fields */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">User Name</label>
                  <input
                    type="text"
                    name="username"
                    value={profileFormData.username}
                    onChange={handleProfileChange}
                    placeholder="Enter first name"
                    className={`w-full px-3.5 py-2.5 bg-white rounded-lg border ${
                      profileErrors.username ? "border-red-300" : "border-slate-300"
                    } text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                  {profileErrors.username && <p className="text-red-500 text-sm mt-1">{profileErrors.username}</p>}
                </div>


                {/* Contact Fields */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileFormData.email}
                    onChange={handleProfileChange}
                    disabled={user.email?true:false}
                    className={`w-full px-3.5 py-2.5 ${user.email? "bg-slate-100" : "bg-white"} rounded-lg border border-slate-300 text-slate-500`}
                  />
                </div>


             

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={profileFormData.role}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 rounded-lg border border-slate-300 text-slate-500"
                  />
                </div>


                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={profileFormData.password}
                    onChange={handleProfileChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-500"
                  />
                </div>

              </div>

              {/* Messages */}
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-emerald-800">{successMessage}</p>
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{errorMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  disabled={updateLoading}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    updateLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white`}
                >
                  {updateLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Profile"
                  )}
                </button>
                {/* <button type="button" className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                  Delete Account
                </button> */}
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="space-y-6 max-w-md">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Change Password</h3>
                <p className="text-sm text-slate-600">Enter your current password to change your password</p>
              </div>

              {/* Password Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordFormData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full px-3.5 py-2.5 pr-10 bg-white rounded-lg border border-slate-300 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("currentPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.currentPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="w-full px-3.5 py-2.5 pr-10 bg-white rounded-lg border border-slate-300 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.newPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordFormData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-3.5 py-2.5 pr-10 bg-white rounded-lg border border-slate-300 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-emerald-800">{successMessage}</p>
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{errorMessage}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={updatePasswordLoading}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    updatePasswordLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white`}
                >
                  {updatePasswordLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

