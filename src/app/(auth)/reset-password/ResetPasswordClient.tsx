"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/api/user";
import Image from "next/image";
import Bg from "@/assets/LSbg.jpg";
import Logo from "@/assets/Flock-LOGO.png";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successMode, setSuccessMode] = useState(false);

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const handleReset = async () => {
  setError("");
  setMessage("");

  if (!newPassword || !confirmPassword) {
    setError("All fields are required.");
    return;
  }

  // Password rules validation (ADD THIS HERE)
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  if (!passwordPattern.test(newPassword)) {
    setError(
      "Password must be 8+ characters and include uppercase, lowercase, number, and special character."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  const res = await resetPassword({ token, new_password: newPassword });

  if (res?.status === 200) {
    setSuccessMode(true);
    setTimeout(() => router.push("/login"), 3000);
  } else {
    setError(res?.data?.error || "Something went wrong.");
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <Image
        src={Bg}
        alt="background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

      {/* Logo (same as forgot page) */}
      <div className="hidden md:flex absolute left-10 top-10 z-20">
        <Image
          src={Logo}
          alt="Flock Logo"
          className="w-32 h-auto drop-shadow-2xl"
        />
      </div>

      {/* Success Screen */}
      {successMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl 
                     p-10 rounded-2xl shadow-2xl border border-white/30 text-center"
        >
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-20 h-20 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-green-700 mb-3">
            Password Reset Successful
          </h1>

          <p className="text-gray-700 text-lg mb-2">
            Redirecting you to login...
          </p>

          <p className="text-gray-500 text-sm">
            Please log in using your new password.
          </p>
        </motion.div>
      )}

      {/* Reset Password Form */}
      {!successMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-xl 
                     p-8 rounded-2xl shadow-2xl border border-white/30"
        >
          {/* Icon (same style as forgot password page) */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 border-2 border-blue-500 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-4xl font-bold">!</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#684098] mb-4 text-center">
            Reset Your Password
          </h1>

          <p className="text-black text-lg mb-6 text-center">
            Choose a strong password to secure your account.
          </p>

          {/* New Password */}
          <div className="relative mb-4">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full border-2 border-slate-200 rounded-full px-4 py-2 pr-12
                         text-slate-800 placeholder-gray-400 bg-white 
                         focus:border-purple-500 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password Requirements (live feedback) */}
{newPassword && (
  <ul className="text-xs mb-2 space-y-1">
    <li className={passwordPattern.test(newPassword) ? "text-green-600" : "text-red-500"}>
      Must be atleast 8 characters, one uppercase, one lowercase, a number and a special character
    </li>
  </ul>
)}

          {/* Confirm Password */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full border-2 border-slate-200 rounded-full px-4 py-2 pr-12
                         text-slate-800 placeholder-gray-400 bg-white 
                         focus:border-purple-500 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleReset}
            className="w-full mt-4 py-3 rounded-full bg-[#684098] text-white
                       font-semibold hover:bg-[#6d0ee3] transition"
          >
            Reset Password
          </button>

          {/* Alerts */}
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
      )}
    </div>
  );
}
