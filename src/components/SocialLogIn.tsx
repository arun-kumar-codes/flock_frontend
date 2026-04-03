"use client";

import { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  //  TwitterAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "@/slice/userSlice";
import google from "@/assets/google.svg";
import facebook from "@/assets/facebook.svg";
// import x from "@/assets/x.svg"
import Image from "next/image";
// import { LogOutIcon, Router } from "lucide-react"
import { useRouter } from "next/navigation";
import { logInWithSocial } from "@/api/auth";
// import { log } from "console"
import { toast } from "react-hot-toast";

const SocialLogin = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const loginWithProvider = async (provider: any, providerName: string) => {
    setIsLoading(providerName);
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      setUser(loggedInUser);
      console.log(loggedInUser.email);
      const idTokenResult = await loggedInUser.getIdTokenResult(true);
      console.log(idTokenResult.claims.email);
      const fireBaseIdtoken = await loggedInUser.getIdToken(true);
      const response = await logInWithSocial({
        idToken: fireBaseIdtoken,
      });

      if (response.status === 200) {
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        const userData = response.data;
        const user = userData.user;

        // Dispatch user data so Authguard can see it immediately
        dispatch(setReduxUser({
          ...user,
          is_profile_completed: userData.profile_complete
        }));

        if (userData.profile_complete === false) {
          router.push("/complete-profile");
        } else {
          const role = (user.role || "").toLowerCase();
          if (role === "admin") {
            router.push("/admin");
          } else if (role === "viewer") {
            router.push("/viewer");
          } else {
            router.push("/dashboard");
          }
        }
      } else {
        // Handle login error
        console.error("Login failed:", response.data);
        toast.error("Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // If the email is already registered with another provider (like Google)
      if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error("An account already exists with the same email. Try logging in with Google instead.");
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(null);
    }
  };

  const logout = async () => {
    setIsLoading("logout");
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row flex-wrap items-center justify-center gap-3 w-full">
        {/* Google Login */}
        <button
          onClick={() => loginWithProvider(new GoogleAuthProvider(), "google")}
          disabled={isLoading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 cursor-pointer rounded-full border border-gray-300 bg-white text-black shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoading === "google" ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
          ) : (
            <Image
              src={google || "/placeholder.svg"}
              alt="Google"
              className="w-4 h-4"
            />
          )}
          <span className="text-xs xs:text-base">
            {isLoading === "google" ? "Connecting..." : "Continue with Google"}
          </span>
        </button>

        {/* Facebook Login */}
        <button
          onClick={() => {
            const provider = new FacebookAuthProvider();
            provider.addScope("email");
            loginWithProvider(provider, "facebook");
          }}
          disabled={isLoading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 cursor-pointer rounded-full border border-gray-300 bg-white text-black shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoading === "facebook" ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
          ) : (
            <Image
              src={facebook || "/placeholder.svg"}
              alt="Facebook"
              className="w-4 h-4"
            />
          )}
          <span className="text-xs xs:text-base">
            {isLoading === "facebook"
              ? "Connecting..."
              : "Continue with Facebook"}
          </span>
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
  );
};

export default SocialLogin;
