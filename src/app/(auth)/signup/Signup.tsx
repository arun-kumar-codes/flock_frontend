"use client";

import { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeOffIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import SocialLogIn from "@/components/SocialLogIn";
import { signUp } from "@/api/auth";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";
import AutoScrollCarousel from "@/components/AutoScrollCarousel";
import Image from "next/image";
import { Poppins } from "next/font/google";
import loginBg from "@/assets/auth-bg.jpg";
import logo from "@/assets/logo.svg";
import img1 from "@/assets/Image1.png";
import img2 from "@/assets/Image2.png";
import img3 from "@/assets/Image3.png";
import img4 from "@/assets/Image4.png";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    recaptchaToken: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const platformFeatures = [
    {
      title: "CREATE & SHARE",
      description: "Upload and share amazing content",
      image: img1,
    },
    {
      title: "DISCOVER & ENGAGE",
      description: "Explore & Connect with Creators",
      image: img2,
    },
    {
      title: "ANALYTICS & INSIGHTS",
      description: "Track performance and Growth",
      image: img3,
    },
    {
      title: "MONETIZE & GROW",
      description: "Turn passion into profit",
      image: img4,
    },
  ];

  const handleChange = (name: string, value: string) => {
    if (name === "username") {
      const hasSpecialChars = /[^a-zA-Z0-9_]/.test(value);
      if (hasSpecialChars) {
        setErrors((prev) => ({ ...prev, username: "Username must not contain special characters" }));
        return; // prevent updating formData if invalid
      }
    }
    if (name === "email") {
      value = value.toLowerCase();
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.recaptchaToken) {
      newErrors.recaptcha = "Please complete the reCAPTCHA verification";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await signUp(formData);

      if (response.status === 201) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        setErrorMessage(
          response?.data?.error || "Error creating account. Please try again."
        );
      }
    } catch (error: any) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
  }
};

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setFormData((prev) => ({ ...prev, recaptchaToken: token || "" }));
    if (token && errors.recaptcha) {
      setErrors((prev) => ({ ...prev, recaptcha: "" }));
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src={loginBg} alt="bg" fill className="object-top" />
        </div>

      <div className="relative z-10 max-w-8xl mx-auto min-h-screen flex items-center justify-center px-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
          {/* Left translucent panel */}
          <div className="w-full lg:w-1/2 flex items-center justify-center mt-2 mb-2">
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-white/50 to-white/0 backdrop-blur-sm p-6 sm:p-8 md:p-10 shadow-xl flex items-center justify-center">
              <div className="w-full max-w-xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <Image src={logo} alt="logo" className="h-20 w-20" />
                </div>
                  <div>
                    <h3 className="text-4xl font-bold text-[#2C50A2]">FLOCK</h3>
        </div>
      </div>

                <h2
                  className="text-2xl md:text-4xl font-medium text-[#C14C42] leading-[1] mb-4"
                  style={{ fontFamily: '"Cera Pro", sans-serif' }}
                >
                  Join Your Creative Journey Today
                </h2>
                <p
                  className={`${poppins.className} text-slate-700 font-normal text-sm md:text-lg leading-[1.5] tracking-normal mb-6`}
                >
                  Create your account and start sharing, discovering, & connecting with your
                  community. Your creative universe awaits.
                </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <input
                id="email"
                type="email"
                value={formData.email}
                      onChange={(e) =>
                        handleChange(
                          "email",
                          e.target.value.toLocaleLowerCase()
                        )
                      }
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email address"
                      className={`w-full rounded-full border-2 px-4 py-3 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center font-medium">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-1">
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                placeholder="Choose your unique username"
                      className={`w-full rounded-full border-2 px-4 py-3 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${errors.username
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200"
                }`}
              />
              {errors.username && (
                <p className="text-xs text-red-600 flex items-center font-medium">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                  {errors.username}
                </p>
              )}
            </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                        placeholder="Create your password"
                        className={`w-full rounded-full border-2 px-4 py-3 pr-10 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200"
                    }`}
                  />

                      {/* Show Eye Icon only if password field has value */}
                      {formData.password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-slate-800 hover:text-indigo-600 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                  </button>
                      )}
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
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                        placeholder="Confirm your password"
                        className={`w-full rounded-full border-2 px-4 py-3 pr-10 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${errors.confirmPassword
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : confirmPassword && formData.password === confirmPassword
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                          : "border-slate-200"
                    }`}
                  />

                      {/* Show Eye Icon only if confirm password field has value */}
                      {confirmPassword.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-slate-800 hover:text-indigo-600 transition-colors duration-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                  </button>
                      )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center font-medium">
                    <div className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></div>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

            {/* Password Match Indicator */}
            {confirmPassword && formData.password === confirmPassword && !errors.confirmPassword && (
              <p className="text-xs text-emerald-600 flex items-center font-medium">
                      <span className="w-1 h-1 bg-emerald-600 rounded-full mr-1.5"></span>
                Passwords match perfectly
              </p>
            )}

                  {/* Sign Up Button and reCAPTCHA */}
                  <div className="flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-1 xl:gap-2">
                    {/* Sign Up Button */}
                    <div className="flex justify-center w-full xl:w-auto">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full cursor-pointer bg-[#C14C42] px-6  md:px-10 lg:px-14 xl:px-18 py-2 sm:py-2.5 md:py-3 font-bold text-xs sm:text-sm md:text-base text-white uppercase tracking-wide transition-all duration-200 hover:bg-[#A63E36] focus:outline-none focus:ring-2 focus:ring-[#C14C42] focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap w-full sm:w-auto max-w-xs sm:max-w-none"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span className="text-xs sm:text-sm md:text-base">
                              Creating Account...
                            </span>
                          </div>
                        ) : (
                          <span
                            className={`${poppins.className} text-xs sm:text-sm md:text-base font-light text-white`}
                          >
                            Create Account
                          </span>
                        )}
                      </button>
                    </div>

            {/* reCAPTCHA */}
                    <div className="flex justify-center w-full xl:w-auto">
                      <div
                        className="transform transition-transform duration-200"
                        style={{
                          transform: "scale(0.6)",
                          transformOrigin: "center",
                        }}
                      >
                        <div
                          className="sm:scale-100 md:scale-110 lg:scale-120 xl:scale-150"
                          style={{ transformOrigin: "center" }}
                        >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY || ""}
                  onChange={handleRecaptchaChange}
                  theme="light"
                  size="normal"
                />
              </div>
                      </div>
                    </div>
                  </div>




                  {/* reCAPTCHA Error */}
              {errors.recaptcha && (
                    <p className="text-xs text-red-600 flex items-center justify-center font-medium mt-2">
                  <div className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></div>
                  {errors.recaptcha}
                </p>
              )}

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg mb-4">
                      <div className="text-sm text-red-700 flex items-center font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {errorMessage}
                  </div>
                  </div>
                )}

                  {/* Social Login Buttons */}
                  <SocialLogIn />
          </form>

                <div className="mt-4 text-start">
                  <p className="text-slate-700 font-medium text-sm">
              Already have an account?{" "}
                    <Link
                href="/login"
                      className="font-bold text-[#b84238] hover:underline"
              >
                      Sign In
                    </Link>
            </p>
          </div>
        </div>
      </div>
            </div>

          {/* Right panel - Feature showcase */}
          <div className="w-full lg:w-1/2 hidden lg:flex flex-col">
            <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0">
                <div className="relative z-10 h-full flex flex-col justify-between items-center px-4 pb-9 pt-24">
                  {/* Logo and title */}
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div className="w-40 h-40 flex items-center justify-center mt-12">
                      <Image src={logo} alt="logo" className="h-40 w-40" />
                      <h3 className="text-6xl font-bold text-[#2C50A2] tracking-wider">
                        FLOCK
                      </h3>
                    </div>
                  </div>

                  {/* Create & Share section */}
                  <div
                    className="w-full text-left relative z-20 mt-14"
                    style={{ fontFamily: '"Cera Pro", sans-serif' }}
                  >
                    <h2 className="text-xl font-bold text-white">
                      Create & Share
                    </h2>
                    <p className="text-white text-md">
                      Upload and share amazing content
                    </p>
      </div>

                  {/* Auto Scroll Carousel */}
                  <AutoScrollCarousel platformFeatures={platformFeatures} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
