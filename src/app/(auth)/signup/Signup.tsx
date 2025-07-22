'use client'
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { signUp } from "@/api/auth"
import { useRouter } from "next/navigation"
import SocialLogin from "@/components/SocialLogIn"
import ReCAPTCHA from "react-google-recaptcha"
import { UserPlusIcon, MailIcon, LockIcon, UserIcon, CheckCircleIcon, ShieldCheckIcon } from "lucide-react"

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    recaptchaToken: "", // Add reCAPTCHA token field
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
//   const searchParams = useSearchParams()
//   const token = searchParams.get("token")
  // reCAPTCHA site key - you should set this in your environment variables
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ;

//   useEffect(() => {
//     if (token) {
//       setFormData((prev) => ({ ...prev, token }))
//     }
//   }, [searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.username) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.recaptchaToken) {
      newErrors.recaptcha = "Please complete the reCAPTCHA verification"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await signUp(formData)
      if (response.status === 201) {
        alert("Account created successfully!")
        router.push("/login")
      } else {
        alert("Error creating account. Please try again.")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      alert("An error occurred while creating your account. Please try again later.")
    } finally {
      setIsSubmitting(false)
      // Reset reCAPTCHA after submission
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
        setFormData((prev) => ({ ...prev, recaptchaToken: "" }))
      }
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }))
    }
  }

  const handleRecaptchaChange = (token: string | null) => {
    setFormData((prev) => ({ ...prev, recaptchaToken: token || "" }))
    if (token && errors.recaptcha) {
      setErrors((prev) => ({ ...prev, recaptcha: "" }))
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" }
    if (password.length < 6) return { strength: 1, text: "Weak", color: "text-red-500" }
    if (password.length < 8) return { strength: 2, text: "Fair", color: "text-yellow-500" }
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, text: "Strong", color: "text-green-500" }
    }
    return { strength: 3, text: "Good", color: "text-blue-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Signup Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlusIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-slate-800">Create Account</h1>
            <p className="text-slate-600">Create your account to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center mr-2">
                  <MailIcon className="h-3 w-3 text-blue-600" />
                </div>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                className={`w-full rounded-xl border px-4 py-3 text-slate-800 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white ${
                  errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-300"
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center mr-2">
                  <UserIcon className="h-3 w-3 text-green-600" />
                </div>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Choose a unique username"
                className={`w-full rounded-xl border px-4 py-3 text-slate-800 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white ${
                  errors.username ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-300"
                }`}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span>{errors.username}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <div className="w-5 h-5 bg-orange-100 rounded-md flex items-center justify-center mr-2">
                  <LockIcon className="h-3 w-3 text-orange-600" />
                </div>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Create a strong password"
                className={`w-full rounded-xl border px-4 py-3 text-slate-800 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white ${
                  errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-300"
                }`}
              />
              {formData.password && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 1
                          ? "w-1/4 bg-red-500"
                          : passwordStrength.strength === 2
                            ? "w-2/4 bg-yellow-500"
                            : passwordStrength.strength === 3
                              ? "w-3/4 bg-blue-500"
                              : passwordStrength.strength === 4
                                ? "w-full bg-green-500"
                                : "w-0"
                      }`}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.text}</span>
                </div>
              )}
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <div className="w-5 h-5 bg-teal-100 rounded-md flex items-center justify-center mr-2">
                  <CheckCircleIcon className="h-3 w-3 text-teal-600" />
                </div>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full rounded-xl border px-4 py-3 text-slate-800 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : confirmPassword && formData.password === confirmPassword
                      ? "border-green-400 focus:border-green-500 focus:ring-green-200"
                      : "border-slate-300"
                }`}
              />
              {confirmPassword && formData.password === confirmPassword && !errors.confirmPassword && (
                <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Passwords match</span>
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* reCAPTCHA */}
            <div>
              <label className="mb-3 flex items-center text-sm font-medium text-slate-700">
                <div className="w-5 h-5 bg-red-100 rounded-md flex items-center justify-center mr-2">
                  <ShieldCheckIcon className="h-3 w-3 text-red-600" />
                </div>
                Security Verification
              </label>
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY || ""}
                  onChange={handleRecaptchaChange}
                  theme="light"
                  size="normal"
                />
              </div>
              {errors.recaptcha && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span>{errors.recaptcha}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlusIcon className="h-4 w-4" />
                  <span>Create Account</span>
                </div>
              )}
            </button>

            <SocialLogin />
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
