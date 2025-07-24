"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getAllUser, deleteUser, inviteUser } from "@/api/user"
import {
  SearchIcon,
  SendIcon,
  AlertCircleIcon,
  MoreVerticalIcon,
  EyeIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"
import profileImg from "@/assets/profile.png"

interface User {
  id: number
  username: string
  email: string
  role: "Creator" | "Viewer"
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const inviteModalRef = useRef<HTMLDivElement>(null)
  const deleteModalRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    fetchUsers()
  }, [])

  // Consolidated Effect for all click outside listeners
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check Invite Modal
      if (showInviteModal && inviteModalRef.current && !inviteModalRef.current.contains(event.target as Node)) {
        setShowInviteModal(false)
      }
      // Check Delete Modal
      if (showDeleteModal && deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setShowDeleteModal(false)
        setUserToDelete(null)
        setDeleteError("")
      }
      // Check Action Menu
      if (showActionMenu && actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        console.log("ACTION MENU",actionMenuRef.current)
        console.log("EVENT",event.target)
        setShowActionMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showInviteModal, showDeleteModal, showActionMenu]) // Re-run when any of these states change

  const fetchUsers = async () => {
    setError("")
    setIsLoading(true)
    try {
      const response = await getAllUser()
      if (response?.data.users) {
        setUsers(response.data.users)
      } else {
        setError("Failed to fetch users data - unexpected response structure")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to fetch users. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    setIsDeleting(true)
    setDeleteError("")
    try {
      const response = await deleteUser(userId)
      if (response?.status === 200 || response?.status === 204 || response?.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
        setShowDeleteModal(false)
        setUserToDelete(null)
      } else {
        setDeleteError(`Failed to delete user. Server response: ${response?.status || "Unknown error"}`)
      }
    } catch (error: any) {
      setDeleteError(`Failed to delete user: ${error?.message || "Network error"}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    if (!inviteEmail.trim()) {
      setEmailError("Email is required")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }
    setIsInviting(true)
    try {
      const response = await inviteUser({ email: inviteEmail })
      if (response.status === 200 || response.status === 201) {
        setInviteEmail("")
        setShowInviteModal(false)
        fetchUsers()
      } else {
        setEmailError("Failed to send invitation. Please try again.")
      }
    } catch (error) {
      setEmailError("Failed to send invitation. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
    setShowActionMenu(null) // Close action menu when delete modal opens
    setDeleteError("")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Creator":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Viewer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesFilter
  })

  const totalUsers = users.length
  const creatorUsers = users.filter((user) => user.role === "Creator").length
  const viewerUsers = users.filter((user) => user.role === "Viewer").length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">User Management</h2>
        <p className="text-slate-600">Manage user accounts and send invitations</p>
      </div>

      {/* Stats */}
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
              <p className="text-sm font-medium text-slate-600">Creators</p>
              <p className="text-2xl font-bold text-slate-800">{creatorUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Viewers</p>
              <p className="text-2xl font-bold text-slate-800">{viewerUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircleIcon className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchUsers}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* User Management */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-800">Users</h3>
            <button
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={(e) => {
                e.stopPropagation() // Prevent click from bubbling to document
                setShowInviteModal(true)
              }}
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
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="Creator">Creator</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={profileImg || "/placeholder.svg"}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-semibold text-slate-800">{user.username}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-1">{user.email}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <span>ID: {user.id}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative" >
                    <button
                      onClick={(e) => {
                        e.stopPropagation() // Prevent click from bubbling to document
                        setShowActionMenu(showActionMenu === user.id.toString() ? null : user.id.toString())
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                    </button>
                    {showActionMenu === user.id.toString() && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20"  ref={actionMenuRef}>
                        <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                          <EyeIcon className="w-4 h-4" />
                          <span>View Profile</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation() // Prevent click from bubbling to document
                            handleDeleteClick(user)
                          }}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Remove User</span>
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
                {searchTerm || filterRole !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by inviting users to join the platform"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={inviteModalRef}
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
            <form onSubmit={handleInviteUser} className="p-6">
              <div className="mb-6">
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

      {/* Delete User Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Confirm User Deletion</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setUserToDelete(null)
                    setDeleteError("")
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">Delete User</h4>
                  <p className="text-slate-600 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Image
                    src={profileImg || "/placeholder.svg"}
                    alt={userToDelete.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-slate-800">{userToDelete.username}</p>
                    <p className="text-sm text-slate-600">{userToDelete.email}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getRoleColor(userToDelete.role)}`}
                    >
                      {userToDelete.role}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                Are you sure you want to delete <strong>{userToDelete.username}</strong>? This will permanently remove
                their account and all associated data.
              </p>
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircleIcon className="w-4 h-4 text-red-600" />
                    <p className="text-red-800 text-sm">{deleteError}</p>
                  </div>
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setUserToDelete(null)
                    setDeleteError("")
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(userToDelete.id)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
