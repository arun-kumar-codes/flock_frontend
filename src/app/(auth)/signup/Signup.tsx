"use client"

import type React from "react"
import { useState, useRef } from "react"
import { signUp } from "@/api/auth"
import { useRouter } from "next/navigation"
import SocialLogin from "@/components/SocialLogIn"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "react-hot-toast"
import {
  UserPlusIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
  StarIcon,
  VideoIcon,
  BarChart3Icon,
  HeartIcon,
  ZapIcon,
} from "lucide-react"

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    recaptchaToken: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

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
        toast.success("Account created successfully!")
        router.push("/login")
      } else {
        toast.error(response?.data?.error||"Error creating account. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error)
      toast.error("An error occurred while creating your account. Please try again later.")
    } finally {
      setIsSubmitting(false)
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
        setFormData((prev) => ({ ...prev, recaptchaToken: "" }))
      }
    }
  }

const handleChange = (field: string, value: string) => {
  if (field === "username") {
    const hasSpecialChars = /[^a-zA-Z0-9_]/.test(value);
    if (hasSpecialChars) {
      setErrors((prev) => ({ ...prev, username: "Username must not contain special characters" }));
      return; // prevent updating formData if invalid
    }
  }

  setFormData((prev) => ({ ...prev, [field]: value }));

  if (errors[field]) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }
};

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
    if (password.length < 8) return { strength: 2, text: "Fair", color: "text-amber-500" }
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, text: "Strong", color: "text-emerald-500" }
    }
    return { strength: 3, text: "Good", color: "text-blue-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const platformFeatures = [
    {
      icon: VideoIcon,
      title: "Create & Share",
      description: "Upload and share amazing content",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: HeartIcon,
      title: "Discover & Engage",
      description: "Explore and connect with creators",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: BarChart3Icon,
      title: "Analytics & Insights",
      description: "Track performance and growth",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: ZapIcon,
      title: "Monetize & Grow",
      description: "Turn passion into profit",
      gradient: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Left Side - Platform Showcase */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden ">
        {/* Background with mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-8 text-white h-full mx-auto">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-xl">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-white">Flock</h1>
                  <p className="text-white/70 text-xs">Your Creative Universe</p>
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Where Stories Come to Life
              </h2>
              <p className="text-lg text-white/90 leading-relaxed font-light">
                Join millions of creators, viewers, and innovators in the ultimate digital experience.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {platformFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-sm">{feature.title}</h3>
                  <p className="text-xs text-white/80 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            {/* <div className="flex justify-between items-center p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">50M+</div>
                <div className="text-xs text-white/80 uppercase tracking-wide">Users</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">$100M+</div>
                <div className="text-xs text-white/80 uppercase tracking-wide">Earnings</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">4.9</div>
                <div className="flex items-center justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-3 w-3 text-amber-300 fill-current" />
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form (Full Section) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-4 lg:py-8 bg-white">
        <div className="w-full max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
              <UserPlusIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Join Flock</h1>
            <p className="text-slate-600 font-medium text-sm">Create your account and start your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="flex items-center text-sm font-semibold text-slate-700">
                <div
                  className={`w-4 h-4 rounded-lg flex items-center justify-center mr-2 transition-all duration-200 ${
                    focusedField === "email" ? "bg-indigo-100 shadow-sm" : "bg-slate-100"
                  }`}
                >
                  <MailIcon
                    className={`h-2.5 w-2.5 transition-colors duration-200 ${
                      focusedField === "email" ? "text-indigo-600" : "text-slate-500"
                    }`}
                  />
                </div>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value.toLocaleLowerCase())}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email address"
                className={`w-full rounded-lg border-2 px-3 py-2.5 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${
                  errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center font-medium">
                  <div className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></div>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-1">
              <label htmlFor="username" className="flex items-center text-sm font-semibold text-slate-700">
                <div
                  className={`w-4 h-4 rounded-lg flex items-center justify-center mr-2 transition-all duration-200 ${
                    focusedField === "username" ? "bg-indigo-100 shadow-sm" : "bg-slate-100"
                  }`}
                >
                  <UserIcon
                    className={`h-2.5 w-2.5 transition-colors duration-200 ${
                      focusedField === "username" ? "text-indigo-600" : "text-slate-500"
                    }`}
                  />
                </div>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                placeholder="Choose your unique username"
                className={`w-full rounded-lg border-2 px-3 py-2.5 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${
                  errors.username ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200"
                }`}
              />
              {errors.username && (
                <p className="text-xs text-red-600 flex items-center font-medium">
                  <div className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></div>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Field */}
              <div className="space-y-1">
                <label htmlFor="password" className="flex items-center text-sm font-semibold text-slate-700">
                  <div
                    className={`w-4 h-4 rounded-lg flex items-center justify-center mr-2 transition-all duration-200 ${
                      focusedField === "password" ? "bg-indigo-100 shadow-sm" : "bg-slate-100"
                    }`}
                  >
                    <LockIcon
                      className={`h-2.5 w-2.5 transition-colors duration-200 ${
                        focusedField === "password" ? "text-indigo-600" : "text-slate-500"
                      }`}
                    />
                  </div>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create password"
                    className={`w-full rounded-lg border-2 px-3 py-2.5 pr-10 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${
                      errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 flex items-center font-medium">
                    <div className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></div>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="flex items-center text-sm font-semibold text-slate-700">
                  <div
                    className={`w-4 h-4 rounded-lg flex items-center justify-center mr-2 transition-all duration-200 ${
                      focusedField === "confirmPassword" ? "bg-indigo-100 shadow-sm" : "bg-slate-100"
                    }`}
                  >
                    <CheckCircleIcon
                      className={`h-2.5 w-2.5 transition-colors duration-200 ${
                        focusedField === "confirmPassword" ? "text-indigo-600" : "text-slate-500"
                      }`}
                    />
                  </div>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm password"
                    className={`w-full rounded-lg border-2 px-3 py-2.5 pr-10 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : confirmPassword && formData.password === confirmPassword
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                          : "border-slate-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center font-medium">
                    <div className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></div>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      passwordStrength.strength === 1
                        ? "w-1/4 bg-red-500"
                        : passwordStrength.strength === 2
                          ? "w-2/4 bg-amber-500"
                          : passwordStrength.strength === 3
                            ? "w-3/4 bg-blue-500"
                            : passwordStrength.strength === 4
                              ? "w-full bg-emerald-500"
                              : "w-0"
                    }`}
                  ></div>
                </div>
                <span className={`text-xs font-semibold ${passwordStrength.color}`}>{passwordStrength.text}</span>
              </div>
            )}

            {/* Password Match Indicator */}
            {confirmPassword && formData.password === confirmPassword && !errors.confirmPassword && (
              <p className="text-xs text-emerald-600 flex items-center font-medium">
                <CheckCircleIcon className="w-3 h-3 mr-1.5" />
                Passwords match perfectly
              </p>
            )}

            {/* reCAPTCHA */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <div className="w-4 h-4 bg-slate-100 rounded-lg flex items-center justify-center mr-2">
                  <ShieldCheckIcon className="h-2.5 w-2.5 text-slate-500" />
                </div>
                Security Verification
              </label>
              <div className="flex justify-center p-3">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY || ""}
                  onChange={handleRecaptchaChange}
                  theme="light"
                  size="normal"
                />
              </div>
              {errors.recaptcha && (
                <p className="text-xs text-red-600 flex items-center justify-center font-medium">
                  <div className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></div>
                  {errors.recaptcha}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-bold text-white shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">Creating Your Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlusIcon className="h-4 w-4" />
                    <span className="text-sm">Create Account</span>
                  </div>
                )}
              </button>
            </div>

            <div className="pt-1">
              <SocialLogin />
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-slate-600 font-medium text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline"
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
