"use client"

import { useState } from "react"
import { signInWithPopup, GoogleAuthProvider, 
  // FacebookAuthProvider,
  //  TwitterAuthProvider,
    signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import google from "@/assets/google.svg"
// import facebook from "@/assets/facebook.svg"
// import x from "@/assets/x.svg"
import Image from "next/image"
// import { LogOutIcon, Router } from "lucide-react"
import { useRouter } from "next/navigation"
import { logInWithSocial } from "@/api/auth"
// import { log } from "console"

const SocialLogin = () => {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const router = useRouter()
  // //console.log("Token from params:", token);

  const loginWithProvider = async (provider: any, providerName: string) => {
    setIsLoading(providerName)
    try {
      const result = await signInWithPopup(auth, provider)
      const loggedInUser = result.user
      setUser(loggedInUser)
      // Optional: get Firebase token for backend auth
      const fireBaseIdtoken = await loggedInUser.getIdToken()

     const response= await logInWithSocial({
        idToken: fireBaseIdtoken});

        if(response.status === 200) {
          // Handle successful login, e.g., redirect or update state
          //console.log("Login successful:", response.data);
          const access_token = response.data.access_token;
          const refresh_token = response.data.refresh_token;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
        router.push("dashboard/profile")
        }else{
          // Handle login error
          console.error("Login failed:", response.data);
          alert("Login failed. Please try again.");
        }

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

          {/* <button
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
          </button> */}
{/* 
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
          </button> */}
        </div>
    </div>
  )
}

export default SocialLogin
