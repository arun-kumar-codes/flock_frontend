"use client";

import { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeOffIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import SocialLogIn from "@/components/SocialLogIn";
import { logIn } from "@/api/auth";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
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

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export default function Login() {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
    recaptchaToken: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleRecaptchaChange = (token: string | null) => {
    setFormData((prev) => ({ ...prev, recaptchaToken: token || "" }));
    if (token && errors.recaptcha) {
      setErrors((prev) => ({ ...prev, recaptcha: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: Record<string, string> = {};

    if (!formData.username_or_email) {
      newErrors.username_or_email = "Email or Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const response = await logIn(formData);

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        const user = response.data.user;
        if (user.role.toLowerCase() === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMessage(
          response.data.error || "Login failed. Please try again."
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
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-white/50 to-white/0 backdrop-blur-md p-6 sm:p-8 md:p-10 shadow-xl flex items-center justify-center">
              <div className="w-full max-w-md mx-auto">
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
                  Welcome Back to Your <br /> Creative Journey
                </h2>
                <p
                  className={`${poppins.className} text-slate-700 font-normal text-sm md:text-lg  leading-[1.5] tracking-normal mb-6`}
                >
                  Continue creating, discovering, & connecting with your
                  community. Your creative universe awaits.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email/Username Field */}
                  <div className="space-y-1">
                    {/*  */}
                    <input
                      id="username_or_email"
                      type="text"
                      value={formData.username_or_email}
                      onChange={(e) =>
                        handleChange(
                          "username_or_email",
                          e.target.value.toLocaleLowerCase()
                        )
                      }
                      onFocus={() => setFocusedField("username_or_email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your email or username"
                      className={`w-full rounded-full border-2 px-4 py-3 text-slate-900 bg-white transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 placeholder:text-slate-400 text-sm ${errors.username_or_email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200"
                        }`}
                    />
                    {errors.username_or_email && (
                      <p className="text-xs text-red-600 flex items-center font-medium">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                        {errors.username_or_email}
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
                        placeholder="Enter your password"
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

                  {/* Forgot Password Link */}
                  {/* <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline"
              >
                Forgot your password?
              </a>
            </div> */}

                  {/* Sign In Button and reCAPTCHA in same line */}
                  <div className="flex flex-row items-center justify-left gap-4">
                    {/* Sign In Button */}
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full cursor-pointer bg-[#C14C42] px-14 py-3 font-bold text-sm sm:text-base text-white uppercase tracking-wide transition-all duration-200 hover:bg-[#A63E36] focus:outline-none focus:ring-2 focus:ring-[#C14C42] focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span className="text-sm sm:text-base">Signing In...</span>
                          </div>
                        ) : (
                          <span className={`${poppins.className} text-base font-light text-white`}>
                            Sign In
                          </span>
                        )}
                      </button>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="flex justify-center" style={{ transform: "scale(0.8)", transformOrigin: "0 0" }}>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY || ""}
                        onChange={handleRecaptchaChange}
                        theme="light"
                        size="normal"
                      />
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
                    Don't have an account?{" "}
                    <a
                      href="/signup"
                      className="font-bold text-[#b84238] hover:underline"
                    >
                      Create Account
                    </a>
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
                <div className="relative z-10 h-full flex flex-col justify-between items-center px-4 pb-4 pt-24">
                  {/* Logo and title */}
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div className="w-40 h-40 flex items-center justify-center mt-4">
                      <Image src={logo} alt="logo" className="h-40 w-40" />
                      <h3 className="text-6xl font-bold text-[#2C50A2] tracking-wider">
                        FLOCK
                      </h3>
                    </div>
                  </div>

                  {/* Create & Share section */}
                  <div
                    className="w-full text-left relative z-20 mt-4"
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
