"use client";
import { useState, useEffect } from "react";
import { forgotPassword } from "@/api/user";
import Image from "next/image";
import Bg from "@/assets/LSbg.jpg";
import { motion } from "framer-motion";
import Logo from "@/assets/FlockLogo.png"; 

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);


const handleSubmit = async () => {
  setMessage("");
  setError("");
  setLoading(true);

  const res = await forgotPassword({ email });

  if (res.status === 200) {
    setMessage("Password reset link sent to your email.");
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 6000);
  } else {
    setError(res.data.error || "Something went wrong.");
  }

  setLoading(false);

  setTimeout(() => {
    setMessage("");
    setError("");
  }, 4000);
};

  return (
    <div className={`relative min-h-screen flex items-center justify-center px-4 overflow-hidden ${showBanner ? "pt-20" : ""}`}>

{/* TOP RIGHT BUTTONS */}
<div className="absolute top-10 right-10 z-30 flex items-center gap-5">

  {/* SIGN IN (ICON + TEXT) */}
  <button
    onClick={() => window.location.href = "/login"}
    className="flex items-center rounded-xl px-6 py-2 bg-white text-black text-xl underline font-semibold hover:text-purple-900 transition"
  >
    Log In
  </button>

  {/* JOIN THE FLOCK BUTTON */}
  <button
    onClick={() => window.location.href = "/signup"}
    className="bg-[#2D9CB8] text-xl text-white font-semibold px-6 py-2 rounded-xl hover:bg-[#2388A3] transition-all shadow-md"
  >
    Join Flock
  </button>
</div>

      {/* Background */}
      <Image
        src={Bg}
        alt="background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

      {/* Success Banner */}
      {showBanner && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute z-50 top-5 w-[90%] md:w-[450px] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm"
        >
          <p className="font-medium">
            An email has been sent to your account.  
            If this email belongs to you, click the link to reset your password.  
            Do not share the reset link with anyone.
          </p>
        </motion.div>
      )}

{/* LEFT SIDE LOGO (Desktop only) */}
<div className="hidden md:flex absolute left-10 top-10 z-20">
  <Image 
    src={Logo} 
    alt="Flock Logo" 
    className="w-32 h-auto drop-shadow-2xl"
    priority
  />
</div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30"
      >

         <div className="flex justify-center mb-4">
          <div className="w-20 h-20 border-2 border-blue-500 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-4xl font-bold">!</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#684098] mb-4 text-center">
          Forgot Your Password?
        </h1>

         <p className="text-black text-lg mb-6 text-center">
          Enter your registered email and we’ll send you a link there to your reset your password.
        </p>

        <input
          type="email"
          className="w-full border-2 border-slate-200 rounded-full px-4 py-2 text-black 
                    placeholder-gray-400 bg-white focus:border-purple-500 focus:outline-none"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

       <button
  onClick={handleSubmit}
  disabled={loading}
  className={`w-full mt-4 py-3 rounded-full text-white font-semibold transition
    ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-[#684098] hover:bg-[#6d0ee3]"}`}
>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Sending...
    </div>
  ) : (
    "Send Reset Link"
  )}
</button>

<div className="mt-2 mb-2 flex flex-col items-center">
  <span className="text-gray-500 text-lg">OR</span>
  <a
    href="/signup"
    className="text-purple-800 font-bold text-lg hover:underline mt-1"
  >
    Create New Account
  </a>
</div>

        <div className="mt-2 mb-2 flex flex-col items-center">
          <a
            href="/login"
            className="text-gray-700 text-lg hover:underline mt-1"
          >
            Back to Login
          </a>
        </div>

        {/* Inline Alert Messages */}
        {message && (
          <p className="text-green-700 mt-3 text-sm font-medium bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-700 mt-3 text-sm font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
      </motion.div>
    </div>
  );
}
