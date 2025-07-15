"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  LogOutIcon,
  SearchIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  FileTextIcon,
  UsersIcon,
  XIcon,
  CheckIcon,
  AlertCircleIcon,
  SendIcon,
  ShieldIcon,
  TrendingUpIcon,
} from "lucide-react"
import Image from "next/image"
import profileImg from "@/assets/profile.png";
interface AdminData {
  email: string
  username: string
  id: string
  imageUrl?: string
}

interface User {
  id: string
  username: string
  email: string
  status: "active" | "pending" | "suspended"
  joinedAt: string
  lastActive: string
  contentCount: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData>({
    email: "admin@example.com",
    username: "Admin",
    id: "admin-1",
    imageUrl: "",
  })
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "john_doe",
      email: "john@example.com",
      status: "active",
      joinedAt: "2024-01-15",
      lastActive: "2024-01-20",
      contentCount: 12,
    },
    {
      id: "2",
      username: "jane_smith",
      email: "jane@example.com",
      status: "pending",
      joinedAt: "2024-01-18",
      lastActive: "2024-01-19",
      contentCount: 5,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDetails(false)
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && showInviteModal) {
        setShowInviteModal(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showInviteModal])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")

    if (!inviteEmail.trim()) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsInviting(true)

    try {
      // Placeholder API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate API call success
      console.log("Sending invite to:", inviteEmail)
      console.log("Message:", inviteMessage)

      // Reset form
      setInviteEmail("")
      setInviteMessage("")
      setShowInviteModal(false)

      // Show success message (you can replace with toast notification)
      alert(`Invitation sent successfully to ${inviteEmail}!`)
    } catch (error) {
      console.error("Error sending invite:", error)
      alert("Failed to send invitation. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length
  const pendingUsers = users.filter((user) => user.status === "pending").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <ShieldIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 bg-white rounded-full p-1 pr-4 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
                onClick={() => setShowUserDetails(!showUserDetails)}
              >
                <Image
                  src={profileImg}
                  alt="Profile"
                  width={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-slate-700">{adminData.username}</span>
              </button>

              {showUserDetails && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-0 z-50 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={profileImg}
                          alt="Profile"
                          width={56}
                          height={56}
                          className="rounded-full border-3 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="text-white">
                        <h3 className="font-semibold text-lg">{adminData.username}</h3>
                        <p className="text-purple-100 text-sm opacity-90">{adminData.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
                            <ShieldIcon className="w-3 h-3 mr-1" />
                            Administrator
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Stats */}
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-slate-800">{totalUsers}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <UsersIcon className="w-3 h-3" />
                          <span>Users</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">{activeUsers}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <CheckIcon className="w-3 h-3" />
                          <span>Active</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">{pendingUsers}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                          <AlertCircleIcon className="w-3 h-3" />
                          <span>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Menu */}
                  <div className="py-2">
                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <ShieldIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Admin Settings</div>
                        <div className="text-xs text-slate-500">Configure platform settings</div>
                      </div>
                    </button>

                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <UsersIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">User Management</div>
                        <div className="text-xs text-slate-500">Manage user accounts</div>
                      </div>
                    </button>

                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Analytics</div>
                        <div className="text-xs text-slate-500">View platform analytics</div>
                      </div>
                    </button>

                    <button className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <SendIcon className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Send Invitations</div>
                        <div className="text-xs text-slate-500">Invite new users to platform</div>
                      </div>
                    </button>

                    <div className="my-2 h-px bg-slate-200 mx-6"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-6 py-3 text-left hover:bg-red-50 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <LogOutIcon className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-red-600">Sign Out</div>
                        <div className="text-xs text-red-400">End your admin session</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard 🛡️</h2>
          <p className="text-slate-600">Manage users and oversee platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-slate-800">{activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Invites</p>
                <p className="text-2xl font-bold text-slate-800">{pendingUsers}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircleIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-800">User Management</h3>
              <button
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setShowInviteModal(true)}
              >
                <SendIcon className="w-4 h-4 mr-2" />
                Send Invitation
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="p-6">
            {filteredUsers.length > 0 ? (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={profileImg}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-semibold text-slate-800">{user.username}</h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}
                          >
                            {user.status}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">{user.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FileTextIcon className="w-3 h-3" />
                            <span>{user.contentCount} content</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative" ref={actionMenuRef}>
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                      </button>

                      {showActionMenu === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                            <EyeIcon className="w-4 h-4" />
                            <span>View Profile</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                            <EditIcon className="w-4 h-4" />
                            <span>Edit User</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                            <TrashIcon className="w-4 h-4" />
                            <span>Suspend User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No users found</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start by inviting users to join the platform"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Send Invitation</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setEmailError("")
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    emailError ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="user@example.com"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  id="message"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Add a personal message to the invitation..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isInviting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-4 h-4 mr-2" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
