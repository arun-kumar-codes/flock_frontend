"use client"

import { useState } from "react"
import { LogInIcon, MailIcon, LockIcon } from "lucide-react"
import SocialLogIn from "@/components/SocialLogIn"

export default function Login() {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: "",
    })
    setErrorMessage("")
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic client-side validation
    const newErrors: any = {}
    if (!formData.username_or_email) {
      newErrors.username_or_email = "Email or Username is required"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      if (formData.username_or_email === "test" && formData.password === "password") {
        window.location.href = "/" // Redirect to home page
      } else {
        setErrorMessage("Invalid credentials")
      }
    } catch (error: any) {
      setErrorMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LogInIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-slate-800">Welcome Back!</h1>
            <p className="text-slate-600">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username_or_email" className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center mr-2">
                  <MailIcon className="h-3 w-3 text-blue-600" />
                </div>
                Email or Username
              </label>
              <input
                id="username_or_email"
                type="text"
                value={formData.username_or_email}
                onChange={(e) => handleChange("username_or_email", e.target.value)}
                placeholder="Enter your email or username"
                className={`w-full rounded-xl border px-4 py-3 text-slate-800 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white ${
                  errors.username_or_email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300"
                }`}
              />
              {errors.username_or_email && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span>{errors.username_or_email}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center mr-2">
                  <LockIcon className="h-3 w-3 text-purple-600" />
                </div>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter your password"
                className={`w-full rounded-xl border px-4 py-3 text-slate-800 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white ${
                  errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-300"
                }`}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{errorMessage}</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LogInIcon className="h-4 w-4" />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <span className="px-4 text-sm text-slate-500 bg-white/50 rounded-full">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Social Login */}
          <SocialLogIn />

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline"
              >
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
