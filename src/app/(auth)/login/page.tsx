"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import SocialLogIn from "@/components/SocialLogIn";
import { logIn } from "@/api/auth";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from "@/components/Loader";
import Image from "next/image";
import Lottie from "lottie-react";
import logoAnimation from "@/assets/logo-animation.json";
import bird from "@/assets/whiteflock.png";
import { motion } from "framer-motion";
import loginBg from "@/assets/LSbg.jpg";
import { Inter } from "next/font/google";
import { ResponsiveCaptcha } from "@/components/ResponsiveCaptcha";


const inter = Inter({ subsets: ["latin"] });

function GridTile({
  image,
  badgeText,
  badgeSubText,
  badgeColor,
  cornerType,
  tileDelay = 0,
  badgeDelay = 0,
}: {
  image: any;
  badgeText?: string;
  badgeSubText?: { sub1?: string; sub2?: string };
  badgeColor?: string;
  cornerType?: string; // "corner" or "rounded"
  tileDelay?: number;
  badgeDelay?: number;
}) {
  const cornerStyle = "rounded-[14px]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: tileDelay }}
      className={`relative overflow-hidden bg-gray-200 backdrop-blur-[2px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] aspect-square ${cornerStyle}`}
    >
      <video
        src={image}
        className="object-cover opacity-90 w-full h-full"
        autoPlay
        loop
        muted
        playsInline
      />

      {badgeText ? (
 <motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{
    duration: 0.25,
    ease: "easeOut",
    delay: badgeDelay,
  }}
  className={`absolute bottom-0 left-0 right-0 px-5 sm:px-3  py-2 sm:py-3 text-white font-extrabold ${badgeColor} min-h-[60px] sm:min-h-[70px] flex flex-col justify-center`}
>
  <div className="text-[11px] sm:text-[12px] leading-tight mb-1">
    {badgeText}
  </div>

  <div className="space-y-[2px]">
    <div className="text-[8px] sm:text-[10px] font-normal opacity-90 leading-tight">
      {badgeSubText?.sub1 || "\u00A0" /* non-breaking space placeholder */}
    </div>
    <div className="text-[8px] sm:text-[10px] font-normal opacity-90 leading-tight">
      {badgeSubText?.sub2 || "\u00A0"}
    </div>
  </div>
</motion.div>
) : null}
    </motion.div>
  );
}

export default function Login() {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
    recaptchaToken: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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
      const response = await logIn({
        ...formData,
        rememberMe: formData.rememberMe,   
      });
      if (response.data?.email_not_verified) {
        router.push(`/signup?verify=${response.data.email}`);
        return;
      }
      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
        } else {
          // ensure no refresh token stored from earlier sessions
          localStorage.removeItem("refresh_token");
        }
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

  const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      ease: "easeOut" as const,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.04,
      ease: "easeOut" as const,
    },
  },
};

  return (
    <div className={`${inter.className} min-h-screen relative overflow-hidden`}>
     
     {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={loginBg}
          alt="Background gradient"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-10">
        {/* Left login form */}
        <motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-10 ml-6"
>
          <div className="-mt-26 -ml-56 -mb-30">
            <div className="w-[550px] h-[350px]">
              <Lottie animationData={logoAnimation} loop autoplay />
            </div>
          </div>

          <h2 className="text-[25px] font-bold text-[#684098] leading-[1.2] mb-4">
            Welcome Back to Your <br /> Creative Journey
          </h2>

          <p
            className={"text-black font-normal text-[13.5px] leading-[1.5] tracking-normal mb-6"}
          >
            Continue creating, discovering, & connecting with your community. <br />
            Your creative universe awaits.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              id="username_or_email"
              type="text"
              value={formData.username_or_email}
              onChange={(e) =>
                handleChange("username_or_email", e.target.value.toLocaleLowerCase())
              }
              placeholder="Enter your email or username"
              className={`w-full rounded-full border-2 px-2 py-1 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 text-2xs ${
                errors.username_or_email
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200"
              }`}
            />
            {errors.username_or_email && (
              <p className="text-xs text-red-600">{errors.username_or_email}</p>
            )}

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter your password"
                className={`w-full rounded-full border-2 px-2 py-1 pr-10 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 text-2xs ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200"
                }`}
              />
              {formData.password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-800"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mt-1 mb-1">
              <input
                type="checkbox"
                id="remember_me"
                checked={formData.rememberMe}
                className="bg-white"
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              <label
                htmlFor="remember_me"
                className="text-xs text-black cursor-pointer"
              >
                Remember Me
              </label>
            </div>

<div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
  {/* Sign In button */}
  <button
    type="submit"
    disabled={isSubmitting}
    className="rounded-full bg-[#684098] px-10 py-3 text-xs text-white uppercase tracking-wide hover:bg-[#58328a] transition w-full sm:w-[40%]"
  >
    {isSubmitting ? "Signing in.." : "Sign In"}
  </button>

  {/* Captcha */}
  <div className="w-full sm:w-[60%] flex justify-end sm:justify-center">
    <ResponsiveCaptcha
      onChange={handleRecaptchaChange}
      recaptchaRef={recaptchaRef}
      siteKey={RECAPTCHA_SITE_KEY || ""}
    />
  </div>
</div>


            {errors.recaptcha && (
              <p className="text-xs text-red-600 mt-1">{errors.recaptcha}</p>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg mb-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <SocialLogIn />
          </form>

         <div className="flex justify-between items-center w-full mt-4 text-xs px-1">
  <span className="text-black">
    Don't have an account?{" "}
    <Link href="/signup" className="font-bold text-white hover:text-purple-700">
      Create Account
    </Link>
  </span>
</div>
         <Link
    href="/forgot-password"
    className="ml-1 mt-2 text-xs font-bold text-purple-700 underline hover:text-white"
  >
    Forgot Your Password?
  </Link> 

        </motion.div>

        {/* Right side grid */}
<div className="w-full lg:w-2/3 flex justify-start mt-12 lg:mt-4">
  {(() => {
    const tiles = [
      {
        src: "01.mp4",
        badge: {
          text: "CREATE & SHARE",
          sub1: "Upload and share",
          sub2: "amazing content",
          color: "bg-[#EA4E2B]",
        },
      },
      { src: "02.mp4" }, // hidden on mobile
      {
        src: "03.mp4",
        badge: {
          text: "DISCOVER & ENGAGE",
          sub1: "Explore & Connect",
          sub2: "with Creators",
          color: "bg-[#623E97]",
        },
      },
      { src: "05.mp4" }, // hidden on mobile
      { src: "010.mp4", masked: true }, // bird - spans 2 cols on mobile
      { src: "04.mp4" }, // hidden on mobile
      {
        src: "09.mp4",
        badge: {
          text: "MONETIZE & GROW",
          sub1: "Turn passion into profit",
          sub2: "",
          color: "bg-[#2B6CB0]",
        },
      },
      { src: "08.mp4" }, // hidden on mobile
      {
        src: "06.mp4",
        badge: {
          text: "ANALYTICS & INSIGHTS",
          sub1: "Track performance",
          sub2: "and Growth",
          color: "bg-[#2AA0A9]",
        },
      },
    ];

    const SLOT = 0.20;
    let slot = 0;
    const timed = tiles.map((t, i) => {
      const tileDelay = slot * SLOT;
      slot += 1;
      const badgeDelay = t.badge ? slot * SLOT : 0;
      if (t.badge) slot += 1;
      return { ...t, tileDelay, badgeDelay, index: i };
    });

    // Indices to hide on mobile (tiles without badges, except bird)
    const hideOnMobile = [1, 3, 5, 7]; // indices 1,3,5,7 (02.mp4, 05.mp4, 04.mp4, 08.mp4)

    return (
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto px-2 sm:grid-cols-3 sm:max-w-2xl sm:px-4">
        {timed.map((t, i) => {
          // Hide specific tiles on mobile
          const hiddenClass = hideOnMobile.includes(i) ? "hidden sm:block" : "";
          
          // Bird tile - center on mobile (span 2 cols)
          if (t.masked) {
            return (
              <motion.div
                key={`tile-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: t.tileDelay }}
                className="relative aspect-square overflow-hidden rounded-[14px] col-span-2 sm:col-span-1 h-full w-[160px] sm:w-full mx-auto"
                style={{
                  maskImage: `url(${bird.src})`,
                  maskSize: "contain",
                  maskPosition: "center",
                  maskRepeat: "no-repeat",
                  WebkitMaskImage: `url(${bird.src})`,
                  WebkitMaskSize: "contain",
                  WebkitMaskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                }}
              >
                <video
                  src={t.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </motion.div>
            );
          }

          return (
            <div key={`tile-${i}`} className={hiddenClass}>
              <GridTile
                image={t.src}
                badgeText={t.badge?.text}
                badgeSubText={{ sub1: t.badge?.sub1, sub2: t.badge?.sub2 }}
                badgeColor={t.badge?.color}
                tileDelay={t.tileDelay}
                badgeDelay={t.badgeDelay}
              />
            </div>
          );
        })}
      </div>
    );
  })()}
</div>
      </div>
    </div>
  );
}
