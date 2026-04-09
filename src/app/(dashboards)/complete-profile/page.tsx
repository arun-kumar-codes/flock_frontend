"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, getUserProfile } from "@/api/user";
import { setUser } from "@/slice/userSlice";
import { toast } from "react-hot-toast";
import Loader2 from "@/components/Loader2";
import { CalendarIcon, UserIcon, LockIcon, EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/Flock-LOGO.png";

export default function CompleteProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    dob: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const normalizeDobInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const toDobDisplay = (raw: string) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [yyyy, mm, dd] = trimmed.split("-");
      return `${dd}/${mm}/${yyyy}`;
    }
    return normalizeDobInput(trimmed);
  };

  const parseDob = (dob: string) => {
    const display = toDobDisplay(dob);
    const [dd, mm, yyyy] = display.split("/").map(Number);
    if (!dd || !mm || !yyyy) return null;
    if (mm < 1 || mm > 12) return null;
    if (dd < 1 || dd > 31) return null;

    const parsed = new Date(yyyy, mm - 1, dd);
    if (
      parsed.getFullYear() !== yyyy ||
      parsed.getMonth() !== mm - 1 ||
      parsed.getDate() !== dd
    ) {
      return null;
    }

    return parsed;
  };

  const toIsoDob = (dob: string) => {
    const [dd, mm, yyyy] = toDobDisplay(dob).split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
    { label: "An uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: "A lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: "A number", test: (pwd: string) => /\d/.test(pwd) },
    { label: "A special character", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.test(formData.password));

  useEffect(() => {
    if (user && user.is_profile_completed === true) {
      const role = (user.role || "").toLowerCase();
      if (role === "admin") router.replace("/admin");
      else if (role === "viewer") router.replace("/viewer");
      else router.replace("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "dob") {
      setFormData({ ...formData, dob: normalizeDobInput(value) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const birthDate = parseDob(formData.dob);
    if (!birthDate) {
      toast.error("Please enter your date of birth as DD/MM/YYYY.");
      return;
    }

    // Simple 13+ check
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      toast.error("You must be at least 13 years old.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Please meet all password requirements.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateUserProfile({
        ...formData,
        dob: toIsoDob(formData.dob),
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Profile completed successfully!");
        
        // Refresh user data
        const profileRes = await getUserProfile();
        if (profileRes.status === 200) {
          const updatedUser = profileRes.data.user;
          dispatch(setUser({
            ...updatedUser,
            is_profile_completed: true
          }));
          
          const role = (updatedUser.role || "").toLowerCase();
          if (role === "admin") router.replace("/admin");
          else if (role === "viewer") router.replace("/viewer");
          else router.replace("/dashboard");
        }
      } else {
        toast.error(response.data?.error || "Failed to complete profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader2 />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Image src={logo} alt="Flock Logo" width={80} height={80} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-500">Just a few more details to get you started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Choose a unique username"
                />
              </div>
            </div>

            {/* Password - Needed for Google users to have a local account password */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Set a local password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements Checklist */}
              <div className="mt-3 grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Password Requirements:</p>
                {passwordRequirements.map((req, index) => {
                  const met = req.test(formData.password);
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      {met ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-300" />
                      )}
                      <span className={`text-xs ${met ? "text-green-600 font-medium" : "text-gray-500"}`}>
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-2 ml-1">Required for secure login options</p>
            </div>

            {/* DOB */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="dob"
                  type="text"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={() =>
                    setFormData((prev) => ({ ...prev, dob: toDobDisplay(prev.dob) }))
                  }
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="off"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <p className="text-[10px] text-gray-400 ml-1">Must be at least 13 years old</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Let's Go!"}
          </button>
        </form>
      </div>
    </div>
  );
}
