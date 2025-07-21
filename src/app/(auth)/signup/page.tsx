"use client"

import type React from "react"
import { useState, useEffect } from "react" // Import useEffect
import { signUp } from "@/api/auth"
import { useRouter } from "next/navigation"
import SocialLogin from "@/components/SocialLogIn"
import {
  UserPlusIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "lucide-react"

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    username: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStepVisible, setIsStepVisible] = useState(false) // New state for step visibility

  const totalSteps = 3

  // Effect to control step visibility for transitions
  useEffect(() => {
    setIsStepVisible(false) // Hide current step immediately
    const timer = setTimeout(() => {
      setIsStepVisible(true) // Show new step after a short delay to allow opacity-0 to apply
    }, 50) // Small delay to ensure initial opacity-0 is applied before transition

    return () => clearTimeout(timer)
  }, [currentStep]) // Re-run effect when step changes

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
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
    }

    if (step === 2) {
      if (!formData.role) {
        newErrors.role = "Please select a role"
      }
    }

    if (step === 3) {
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
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

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

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Basic Information"
      case 2:
        return "Choose Your Role"
      case 3:
        return "Secure Your Account"
      default:
        return ""
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "Let's start with your basic details"
      case 2:
        return "Tell us how you plan to use our platform"
      case 3:
        return "Create a strong password to protect your account"
      default:
        return ""
    }
  }

  const isStepCompleted = (step: number) => {
    if (step === 1) return formData.email && formData.username && !errors.email && !errors.username
    if (step === 2) return formData.role && !errors.role
    if (step === 3)
      return (
        formData.password &&
        confirmPassword &&
        formData.password === confirmPassword &&
        !errors.password &&
        !errors.confirmPassword
      )
    return false
  }

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
            <p className="text-slate-600">{getStepDescription(currentStep)}</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      step < currentStep
                        ? "bg-green-500 text-white"
                        : step === currentStep
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step < currentStep ? <CheckIcon className="w-3 h-3" /> : step}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`w-32 h-1 mx-2 transition-all duration-300 ${
                        step < currentStep ? "bg-green-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-slate-800">{getStepTitle(currentStep)}</h2>
              <p className="text-sm text-slate-500">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>

          {/* Form Steps */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div
                className={`space-y-5 transition-opacity duration-300 ${isStepVisible ? "opacity-100" : "opacity-0"}`}
              >
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
              </div>
            )}

            {/* Step 2: Role Selection */}
            {currentStep === 2 && (
              <div
                className={`space-y-5 transition-opacity duration-300 ${isStepVisible ? "opacity-100" : "opacity-0"}`}
              >
                <div>
                  <label className="mb-4 flex items-center text-sm font-medium text-slate-700">
                    <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center mr-2">
                      <BriefcaseIcon className="h-3 w-3 text-purple-600" />
                    </div>
                    Choose Your Role
                  </label>
                  <div className="space-y-3">
                    <div
                      onClick={() => handleChange("role", "Creator")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.role === "Creator"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white/50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.role === "Creator" ? "border-indigo-500 bg-indigo-500" : "border-slate-300"
                          }`}
                        >
                          {formData.role === "Creator" && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">Content Creator</h3>
                          <p className="text-sm text-slate-600">Create, publish, and manage your own content</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => handleChange("role", "Viewer")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.role === "Viewer"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white/50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.role === "Viewer" ? "border-indigo-500 bg-indigo-500" : "border-slate-300"
                          }`}
                        >
                          {formData.role === "Viewer" && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">Content Viewer</h3>
                          <p className="text-sm text-slate-600">Discover, view, and interact with content</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                      <span>{errors.role}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Password Setup */}
            {currentStep === 3 && (
              <div
                className={`space-y-5 transition-opacity duration-300 ${isStepVisible ? "opacity-100" : "opacity-0"}`}
              >
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 flex items-center text-sm font-medium text-slate-700"
                  >
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
              </div>
            )}

              

            {/* Navigation Buttons */}
            <div className="flex space-x-3 pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 flex items-center justify-center space-x-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepCompleted(currentStep)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !isStepCompleted(currentStep)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
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
              )}
            </div>

              <SocialLogin></SocialLogin>
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

        {/* Progress Info Card */}
        {/* <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-semibold text-slate-800">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="mt-2 bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
