"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  User,
  LogIn,
  UserPlus,
  Sparkles,
  Bell,
  LogInIcon,
  ToggleLeft,
  CirclePower,
  UserRoundPen,
  PenToolIcon,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { toggleThemeMode } from "@/slice/userSlice";
import { clearFilter } from "@/slice/dashbaordSlice";
import { toast } from "react-hot-toast";
import { toggleUserRole } from "@/api/content";
import { Inter } from "next/font/google";

interface HeaderNavbarProps {
  isSidebarExpanded: boolean;
}

const inter = Inter({ subsets: ["latin"] });

export function HeaderNavbar({ isSidebarExpanded }: HeaderNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [isDark, setIsDark] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const detectTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const shouldBeDark =
        savedTheme === "dark" || (!savedTheme && systemPrefersDark);

      setIsDark(shouldBeDark);
      document.documentElement.setAttribute(
        "data-theme",
        shouldBeDark ? "dark" : "light"
      );
    };

    detectTheme();
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const themeValue = newTheme ? "dark" : "light";
    localStorage.setItem("theme", themeValue);
    document.documentElement.setAttribute("data-theme", themeValue);
    dispatch(toggleThemeMode());
  };

  // Handle dashboard reset
  const handleDashboardChange = () => {
    dispatch(clearFilter());
  };

  // Switch role (viewer <-> creator)
  const handleSwitchRole = async () => {
    try {
      const res = await toggleUserRole();
      toast.success(res.data.message);
      window.location.reload();
    } catch (err: any) {
      const msg = err.response?.data?.error || "Unable to switch role";
      toast.error(msg);
    }
  };

  // Get page title based on pathname
  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    switch (lastSegment) {
      case "blogs":
        return "Blog Posts";
      case "videos":
        return "Videos";
      case "profile":
        return "Profile";
      case "settings":
        return "Settings";
      case "favorites":
        return "Favorites";
      case "history":
        return "History";
      default:
        return "";
    }
  };

  return (
    <header
        className={`${inter.className} fixed top-0 right-0 z-30 h-16 transition-all duration-300 theme-bg-primary mb-0 ${
          isSidebarExpanded ? "lg:left-64" : "lg:left-16"
        } left-0`}
      >
      <div className="flex items-center justify-between h-full px-4 mt-2 md:px-8 ">
        <div className="flex items-center space-x-4 mb-4">
          <div
            className={`flex flex-col justify-end ml-10 ${
              getPageTitle().includes("Hello") && "cursor-pointer"
            }`}
          >
          </div>
        </div>

        <div className="flex items-center ml-2 space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full mb-2 theme-bg-hover transition-all  duration-300 group cursor-pointer flex items-center justify-center"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 theme-text-primary group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="w-5 h-5 theme-text-primary group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>

          {user.isLogin ? (
            <div className="flex items-center space-x-3 mb-2">

  {/* Switch Role Button */}
<button
  onClick={handleSwitchRole}
  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer bg-[#34A0B8] hover:bg-blue-50"
  title="Switch To Creator Mode"
>
  <UserRoundPen className="w-5 h-5 text-white transition-transform duration-300" />
  <span className="hidden sm:inline text-sm text-white font-medium">Switch to Creator</span>
</button>



  {/* Profile Picture */}
  <button
    onClick={() => router.push("/viewer/profile")}
    className="relative cursor-pointer"
    title="View Profile"
  >
    <div className="w-10 h-10 rounded-full overflow-hidden border-2 theme-border theme-bg-secondary transition-all duration-300">
      {user.profileImage ? (
        <Image
          src={user.profileImage}
          alt="Profile"
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-white">
          <User className="w-5 h-5 text-gray-400" />
        </div>
      )}
    </div>
  </button>

</div>

          ) : (
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => router.push("/login")}
                className="flex items-center space-x-1 px-2 py-2 cursor-pointer rounded-xl theme-border transition-all duration-300 group"
                title="Sign In"
              >
                <LogInIcon className="w-6 h-6 theme-text-primary group-hover:translate-x-1 transition-transform duration-300" />
                <span className="text-sm theme-text-primary hidden sm:block">
                  Sign In
                </span>
              </button>

             <button
              onClick={() => router.push("/signup")}
              className="flex items-center justify-center gap-1 px-3 py-3 rounded-sm cursor-pointer bg-[#34A0B8] hover:bg-[#2c8ca2] transition-all duration-300 group"
              title="Join the Flock"
            >
              {/* Mobile: Icon only */}
              <UserPlus className="w-5 h-5 text-white sm:hidden" />

              {/* Desktop: Text */}
              <span className="text-[12px] text-white hidden sm:block font-medium">
                Join the Flock
              </span>
            </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
