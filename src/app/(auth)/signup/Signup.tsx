"use client";

import { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeOffIcon, CalendarIcon } from "lucide-react";
import SocialLogIn from "@/components/SocialLogIn";
import { signUp, verifyEmail, resendVerification } from "@/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";
import Image from "next/image";
import Lottie from "lottie-react";
import logoAnimation from "@/assets/logo-animation.json";
import bird from "@/assets/whiteflock.png";
import Link from "next/link";
import { motion } from "framer-motion";
import SignBg from "@/assets/LSbg.jpg";
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
      className={`relative overflow-hidden bg-white/80 backdrop-blur-[2px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] aspect-square ${cornerStyle}`}
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
  className={`absolute bottom-0 left-0 right-0 px-2 sm:px-3 py-2 sm:py-3 text-white font-extrabold ${badgeColor} min-h-[60px] sm:min-h-[70px] flex flex-col justify-center`}
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

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    dob: "", 
    recaptchaToken: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const handleChange = (name: string, value: string) => {
    if (name === "email") value = value.toLowerCase();
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
    setErrorMessage("");
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

  // VALIDATE REAL DATE (DD/MM/YYYY)
function isValidDOB(dobStr: string) {
  const [dd, mm, yyyy] = dobStr.split("/").map(Number);

  // Required parts
  if (!dd || !mm || !yyyy) return false;

  // Logical ranges
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  if (yyyy < 1900 || yyyy > new Date().getFullYear()) return false;

  // Create real date
  const dateObj = new Date(yyyy, mm - 1, dd);

  // Verify JS didn’t auto-correct invalid date
  return (
    dateObj.getFullYear() === yyyy &&
    dateObj.getMonth() === mm - 1 &&
    dateObj.getDate() === dd
  );
}

const params = useSearchParams();
useEffect(() => {
  const verifyEmail = params.get("verify");

  if (verifyEmail) {
    setUserEmail(verifyEmail);
    setShowVerification(true);  // OPEN OTP SCREEN ONLY
  }
}, [params]);

// Auto-trigger resend OTP when coming from login
useEffect(() => {
  const emailFromLogin = params.get("verify");

  if (emailFromLogin) {
    setUserEmail(emailFromLogin);
    setShowVerification(true);

    // Automatically send a new OTP when opened via login
    resendVerification(emailFromLogin)
      .then(() => {
        toast.success("Verification code sent again!");
      })
      .catch(() => {
        toast.error("Failed to send verification code");
      });
  }
}, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.username) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!formData.password) {
  newErrors.password = "Password is required";
} else {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

  if (!passwordPattern.test(formData.password)) {
    newErrors.password =
      "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.";
    toast.error(newErrors.password, {
      duration: 5000,
      style: {
        border: "1px solid #E11D48",
        background: "#fff",
        color: "#E11D48",
        fontWeight: "600",
      },
      icon: "⚠️",
    });
  }
}

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.recaptchaToken)
      newErrors.recaptcha = "Please complete the reCAPTCHA verification";

    // VALIDATE DOB BEFORE SUBMIT
      if (formData.dob && !isValidDOB(formData.dob)) {
        newErrors.dob = "Please enter a valid date.";
      }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // FIX DOB FORMAT BEFORE SUBMIT
      if (formData.dob) {
        const parts = formData.dob.split("/");
        if (parts.length === 3) {
          const [dd, mm, yyyy] = parts;
          formData.dob = `${yyyy}-${mm}-${dd}`; // Convert to YYYY-MM-DD
        }
      }
      const response = await signUp(formData);
      if (response.status === 201) {
        setUserEmail(formData.email);     // store email
        setShowVerification(true);        // show OTP screen
      } else {
        setErrorMessage(
          response?.data?.error || "Error creating account. Please try again."
        );
      }
    } catch {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
      recaptchaRef.current?.reset();
    }
  };

  const handleVerify = async () => {
  if (!verificationCode) {
    setVerifyError("Please enter the 6-digit verification code");
    return;
  }

  const res = await verifyEmail(
    userEmail,
    verificationCode,
  );

  if (res?.status === 200) {
    toast.success("Email verified! Your account is now activated.");
    router.push("/login");
  } else {
    setVerifyError(res?.data?.error || "Invalid verification code");
  }
};


const handleResend = async () => {
  const res = await resendVerification(userEmail);
  if (res?.status === 200) {
    toast.success("Verification code resent!");
  } else {
    toast.error(res?.data?.error || "Failed to resend code");
  }
};


  if (isLoading) return <Loader />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, ease: "easeOut" as const },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.04, ease: "easeOut" as const },
    },
  };

  return (
    <div className={`${inter.className} min-h-screen relative overflow-hidden`}>
     {/* Background image */}
           <div className="absolute inset-0">
             <Image
               src={SignBg}
               alt="Background gradient"
               fill
               className="object-cover"
               priority
             />
             <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
           </div>

      <div className="relative z-10 max-w-8xl mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-10">
        {/* Left signup form */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-12 ml-6"
        >
          <div className="-mt-26 -ml-56 -mb-30">
            <div className="w-[550px] h-[350px]">
              <Lottie animationData={logoAnimation} loop autoplay />
            </div>
          </div>

          <h2
            className="text-[25px] font-bold text-[#684098] leading-[1.2] mb-4"
          >
            Join Your <br /> Creative Universe
          </h2>

          <p
            className={"text-black font-normal text-[13.5px] leading-[1.5] tracking-normal mb-6"}
          >
            Create your account and start sharing, discovering, & connecting
            with your community. Your creative universe awaits.
          </p>

        {!showVerification ? (
          <>
            {/* SIGNUP FORM */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email address"
              className={`w-full rounded-full border-2 px-2 py-1 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 text-xs ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}

            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Choose your username"
              className={`w-full rounded-full border-2 px-2 py-1 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 text-xs ${
                errors.username
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200"
              }`}
            />
            {errors.username && (
              <p className="text-xs text-red-600">{errors.username}</p>
            )}

{/* DOB FIELD */}
<div className="relative">

  {/* Visible custom DD/MM/YYYY typed input */}
  <input
    type="text"
    placeholder="Enter your Date of Birth (DD/MM/YYYY)"
    value={formData.dob}
    maxLength={10}
    onChange={(e) => {
      let input = e.target.value.replace(/[^\d]/g, "");

      if (input.length > 2 && input.length <= 4) {
        input = input.slice(0, 2) + "/" + input.slice(2);
      } else if (input.length > 4) {
        input = input.slice(0, 2) + "/" + input.slice(2, 4) + "/" + input.slice(4, 8);
      }

      setFormData({ ...formData, dob: input });
      setErrors({ ...errors, dob: "" });
    }}
    className={`w-full rounded-full border-2 px-2 py-1 pr-10 text-slate-900 bg-white
  focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 text-xs
  ${errors.dob ? "border-red-400 focus:border-red-500" : "border-slate-200"}`}
    required
  />

  {/* Hidden date input — NOT overlapping anything */}
  <input
    id="hiddenDOB"
    type="date"
    className="hidden"
    onChange={(e) => {
      if (!e.target.value) return;

      const [y, m, d] = e.target.value.split("-");
      const formatted = `${d}/${m}/${y}`;

      setFormData({ ...formData, dob: formatted });
      setErrors({ ...errors, dob: "" });
    }}
  />

  {/* Calendar icon triggers the hidden date picker */}
  <CalendarIcon
    onClick={() => {
      const picker = document.getElementById("hiddenDOB") as HTMLInputElement;
      picker?.showPicker?.();
    }}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 cursor-pointer"
  />
</div>

{errors.dob && (
  <p className="text-xs text-red-600">{errors.dob}</p>
)}


            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Create your password"
                className={`w-full rounded-full border-2 px-2 py-1 pr-10 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 text-xs ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200"
                }`}
              />
              {formData.password && (
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
            {/* Live password strength hint */}
{formData.password && !errors.password && (
  <p
    className={`text-[10px] mt-1 ${
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&]).{8,}$/.test(formData.password)
        ? "text-green-600"
        : formData.password.length >= 6
        ? "text-yellow-600"
        : "text-red-600"
    }`}
  >
    {formData.password.length < 6
      ? "Too short"
      : /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password)
      ? "Strong password"
      : "Must be alleast 8 digit, and uppercase, number & special character"}
  </p>
)}

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full rounded-full border-2 px-2 py-1 pr-10 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 text-xs ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200"
                }`}
              />
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-800"
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
              <p className="text-xs text-red-600">{errors.confirmPassword}</p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#684098] px-20 py-2 text-xs text-white uppercase tracking-wide hover:bg-[#58328a] transition"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
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
          </>
) : (
  <>
    {/* ⭐ EMAIL VERIFICATION VIEW ⭐ */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg w-full max-w-sm"
    >
      <h2 className="text-xl font-bold text-[#684098] mb-3">Verify Your Email</h2>

      <p className="text-sm text-gray-700 mb-4">
        A verification code has been sent to:
        <br />
        <span className="font-semibold">{userEmail}</span>
      </p>

      <input
        type="text"
        maxLength={6}
        value={verificationCode}
        onChange={(e) => {
          setVerificationCode(e.target.value);
          setVerifyError("");
        }}
        placeholder="Enter verification code"
        className="w-full rounded-full border-2 px-4 py-2 text-sm border-gray-300 focus:border-indigo-500 outline-none"
      />

      {verifyError && (
        <p className="text-xs text-red-600 mt-2">{verifyError}</p>
      )}

      <button
        onClick={handleVerify}
        className="w-full mt-4 bg-[#684098] text-white py-2 rounded-full text-sm font-semibold hover:bg-[#58328a] transition"
      >
        Verify Email
      </button>

      <button
        type="button"
        onClick={handleResend}
        className="w-full mt-3 text-xs text-[#684098] underline"
      >
        Resend Verification Code
      </button>
    </motion.div>
  </>
)}
          <p className="mt-4 text-black text-xs">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-white hover:text-purple-700"
            >
              Sign In
            </Link>
          </p>
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
