"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MoreVerticalIcon, EyeIcon, TrashIcon, UsersIcon } from "lucide-react"
import profileImg from "@/assets/profile.png"

interface User {
  id: number
  username: string
  email: string
  role: "Creator" | "Viewer"
}

interface UserListProps {
  users: User[]
  isLoading: boolean
  onDeleteClick: (user: User) => void
}

export default function UserList({ users, isLoading, onDeleteClick }: UserListProps) {
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No users found</h3>
          <p className="text-slate-600 mb-4">
            Try adjusting your search or filter criteria, or start by inviting users to join the platform
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {users.map((user) => (
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
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
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
            <div className="relative" ref={actionMenuRef}>
              <button
                onClick={() => setShowActionMenu(showActionMenu === user.id.toString() ? null : user.id.toString())}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
              </button>
              {showActionMenu === user.id.toString() && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                    <EyeIcon className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onDeleteClick(user)
                      setShowActionMenu(null)
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
    </div>
  )
}
