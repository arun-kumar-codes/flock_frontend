"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { XIcon, SendIcon, AlertCircleIcon } from "lucide-react"

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (email: string) => Promise<{ success: boolean; error?: string }>
}

export default function InviteUserModal({ isOpen, onClose, onInvite }: InviteUserModalProps) {
  const [inviteEmail, setInviteEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isInviting, setIsInviting] = useState(false)
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      const result = await onInvite(inviteEmail)
      if (result.success) {
        setInviteEmail("")
        onClose()
      } else {
        setEmailError(result.error || "Failed to send invitation")
      }
    } catch (error) {
      setEmailError("Failed to send invitation. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-800">Send Invitation</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <XIcon className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
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
              onClick={onClose}
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
  )
}
