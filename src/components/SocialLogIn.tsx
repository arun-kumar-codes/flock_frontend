"use client"

import { useState } from "react"
import { signInWithPopup, GoogleAuthProvider, 
  FacebookAuthProvider,
  //  TwitterAuthProvider,
    signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import google from "@/assets/google.svg"
import facebook from "@/assets/facebook.svg"
// import x from "@/assets/x.svg"
import Image from "next/image"
// import { LogOutIcon, Router } from "lucide-react"
import { useRouter } from "next/navigation"
import { logInWithSocial } from "@/api/auth"
// import { log } from "console"
import { toast } from "react-hot-toast"

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
      console.log("Firebase ID Token:", fireBaseIdtoken);
     const response= await logInWithSocial({
        idToken: fireBaseIdtoken});

        if(response.status === 200) {
          // Handle successful login, e.g., redirect or update state
          //console.log("Login successful:", response.data);
          const access_token = response.data.access_token;
          const refresh_token = response.data.refresh_token;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          const userData = response.data;
          console.log("User Data:", userData);

          if(userData.is_new_user){
          router.push("dashboard/profile");
           }else{
            router.push("/dashboard");
           }
        }else{
          // Handle login error
          console.error("Login failed:", response.data);
          toast.error("Login failed. Please try again.");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => loginWithProvider(new GoogleAuthProvider(), "google")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-1 py-3 px-2 cursor-pointer rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "google" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <Image src={google || "/placeholder.svg"} alt="Google" className="w-5 h-5" />
            )}
            <span className="font-medium text-sm sm:text-base">{isLoading === "google" ? "Connecting..." : "Continue with Google"}</span>
          </button>

          <button
            onClick={() => loginWithProvider(new FacebookAuthProvider(), "facebook")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-1 py-3 px-2 cursor-pointer rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "facebook" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <Image src={facebook || "/placeholder.svg"} alt="Facebook" className="w-5 h-5" />
            )}
            <span className="font-medium text-sm sm:text-base">{isLoading === "facebook" ? "Connecting..." : "Continue with Facebook"}</span>
          </button>
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
