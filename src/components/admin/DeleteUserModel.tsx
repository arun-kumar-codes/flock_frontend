"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { XIcon, TrashIcon, AlertCircleIcon } from "lucide-react"
import profileImg from "@/assets/profile.png"

interface User {
  id: number
  username: string
  email: string
  role: "Creator" | "Viewer"
}

interface DeleteUserModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onDelete: (userId: number) => Promise<{ success: boolean; error?: string }>
}

export default function DeleteUserModal({ isOpen, user, onClose, onDelete }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

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

  const handleDelete = async () => {
    if (!user) return

    setIsDeleting(true)
    setDeleteError("")

    try {
      const result = await onDelete(user.id)
      if (result.success) {
        onClose()
      } else {
        setDeleteError(result.error || "Failed to delete user")
      }
    } catch (error) {
      setDeleteError("Failed to delete user. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-800">Confirm User Deletion</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
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
                alt={user.username}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-slate-800">{user.username}</p>
                <p className="text-sm text-slate-600">{user.email}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getRoleColor(user.role)}`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-sm mb-6">
            Are you sure you want to delete <strong>{user.username}</strong>? This will permanently remove their account
            and all associated data.
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
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
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
  )
}
