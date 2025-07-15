"use client"

import { useState } from "react"
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import google from "@/assets/google.svg"
import facebook from "@/assets/facebook.svg"
import x from "@/assets/x.svg"
import Image from "next/image"
import { LogOutIcon } from "lucide-react"

const SocialLogin = () => {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const loginWithProvider = async (provider: any, providerName: string) => {
    setIsLoading(providerName)
    try {
      const result = await signInWithPopup(auth, provider)
      const loggedInUser = result.user
      setUser(loggedInUser)
      // Optional: get Firebase token for backend auth
      const token = await loggedInUser.getIdToken()
      console.log("Firebase ID Token:", token)
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const logout = async () => {
    setIsLoading("logout")
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="w-full">
      {!user ? (
        <div className="space-y-3">
          <button
            onClick={() => loginWithProvider(new GoogleAuthProvider(), "google")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm text-slate-700 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "google" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
            ) : (
              <Image src={google || "/placeholder.svg"} alt="Google" className="w-5 h-5" />
            )}
            <span className="font-medium">{isLoading === "google" ? "Connecting..." : "Continue with Google"}</span>
          </button>

          <button
            onClick={() => loginWithProvider(new FacebookAuthProvider(), "facebook")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-blue-600 text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "facebook" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Image src={facebook || "/placeholder.svg"} alt="Facebook" className="w-5 h-5" />
            )}
            <span className="font-medium">{isLoading === "facebook" ? "Connecting..." : "Continue with Facebook"}</span>
          </button>

          <button
            onClick={() => loginWithProvider(new TwitterAuthProvider(), "twitter")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900 text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "twitter" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Image src={x || "/placeholder.svg"} alt="Twitter" className="w-5 h-5" />
            )}
            <span className="font-medium">{isLoading === "twitter" ? "Connecting..." : "Continue with Twitter"}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={user.photoURL || "/placeholder.svg"}
                alt={user.displayName}
                className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></div>
            </div>

            <div>
              <p className="font-semibold text-slate-800 text-lg">{user.displayName}</p>
              <p className="text-sm text-slate-600">{user.email}</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-slate-500">Connected</span>
              </div>
            </div>

            <button
              onClick={logout}
              disabled={isLoading === "logout"}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading === "logout" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOutIcon className="w-4 h-4" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocialLogin
