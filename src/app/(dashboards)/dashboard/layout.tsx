"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  LogOutIcon,
  PenToolIcon,
  Building2Icon,
  FileChartColumnIncreasing,
  BadgeDollarSign,
  User,
  GroupIcon,
  Group,
  UsersRound,
  Menu,
  X
} from "lucide-react";
import profileImg from "@/assets/profile.png";
import { logOut } from "@/slice/userSlice";
import { Suspense } from "react";
import Loader2 from "@/components/Loader2";
import { toggleUserRole } from "@/api/content";
import Logo from "@/assets/Logo.png";
import Exit from "@/assets/logout-icon.png";
import HomeIcon from "@/assets/Home-icon.svg";
import BlogIcon from "@/assets/blog-icon.png"
import VideoIcon from "@/assets/video-icon.png"
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const navigationItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Blogs",
    href: "/dashboard/blogs",
    icon: BlogIcon,
  },
  {
    name: "Videos",
    href: "/dashboard/videos",
    icon: VideoIcon,
  },
  {
    name: "My Flock",
    href: "/dashboard/followers",
    icon: UsersRound,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: FileChartColumnIncreasing,
  },
  {
    name: "Payout",
    href: "/dashboard/payout",
    icon: BadgeDollarSign,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const logoutRef = useRef<HTMLDivElement>(null);

  //console.log(user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDetails(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target as Node)
      ) {
        setShowLogoutConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Auto-close sidebar when clicking outside on mobile
useEffect(() => {
  const handleOutsideClick = (event: MouseEvent) => {
    // Only trigger on mobile (lg:hidden visible)
    if (window.innerWidth < 1024) {
      const sidebar = document.querySelector(".mobile-sidebar");
      const menuButton = document.querySelector(".mobile-menu-btn");

      // if click is outside sidebar and menu button, collapse it
      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);
  return () => document.removeEventListener("mousedown", handleOutsideClick);
}, []);

// ✅ Auto-close sidebar when navigating to another route
const pathname = usePathname();
useEffect(() => {
  if (window.innerWidth < 1024) {
    setIsExpanded(false);
  }
}, [pathname]);

  const handleMouseEnter = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsExpanded(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    dispatch(logOut());
    router.push("/login");
    setShowLogoutConfirm(false);
  };

  const handleToggleRole = async () => {
    try {
      const res = await toggleUserRole();
      if (res?.status === 200) {
        const updatedUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        dispatch({ type: "user/updateUser", payload: updatedUser });

        // Redirect based on role
        if (updatedUser.role.toLowerCase() === "viewer") {
          router.push("/viewer");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error("Error switching role:", err);
    }
  };

  const currentPageName =
    navigationItems.find((item) => item.href === pathname)?.name || "Dashboard";

  if (user.loading || user.role.toLowerCase() !== "creator") return <Loader2 />;

  return (
    <div className={`flex h-screen bg-white ${inter.className}`}>
      {/* Sidebar */}
      {/* Sidebar */}
<div
  className={`hidden lg:flex flex-col bg-[#E5F6FA] mx-2 my-2 rounded-4xl transition-all duration-300 ease-in-out ${
    isExpanded ? "w-64" : "w-18"
  } border-r border-gray-200 overflow-hidden`}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  {/* Sidebar Header / Logo */}
  <div className="flex items-center justify-center py-2 mt-3">
    <div className="flex items-center space-x-1">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl">
        <Image
          src={Logo}
          alt="Flock Logo"
          width={48}
          height={48}
          className="object-contain drop-shadow-md"
          priority
        />
      </div>
      {isExpanded && (
        <span className="text-2xl font-bold text-[#2C50A2] tracking-tight transition-all duration-300">
          Flock
        </span>
      )}
    </div>
  </div>

  {/* Navigation */}
  <nav className="flex-1 px-2 py-4 space-y-2 overflow-hidden">
    {navigationItems.map((item) => {
      const isActive = pathname === item.href
      const Icon = item.icon
      return (
        <div key={item.name} className="relative">
          <Link
            href={item.href}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
              isActive
                ? "bg-[#684098] text-white"
                : "text-black hover:text-black hover:bg-[#684098]"
            }`}
          >
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
              {item.name === "Home" || item.name === "Blogs" || item.name === "Videos" ? (
                <Image
                  src={Icon}
                  alt={item.name}
                  width={20}
                  height={20}
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? "filter brightness-0 invert" : "filter brightness-0"
                  }`}
                />
              ) : (
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-white" : "text-black"}`} />
              )}
            </div>
            {isExpanded && (
              <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>
            )}
          </Link>
          {!isExpanded && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
              {item.name}
            </div>
          )}
        </div>
      )
    })}
  </nav>

  {/* Logout Button (unchanged except label condition) */}
  <div className="p-3 border-t border-gray-200 relative" ref={logoutRef}>
    <button
      onClick={() => setShowLogoutConfirm(true)}
      className="w-full flex items-center px-3 py-2 text-black hover:text-gray-900 cursor-pointer hover:bg-gray-300 rounded-lg transition-colors duration-200 group min-w-0"
    >
      <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
        <Image src={Exit} alt="Logout" className="w-5 h-5 text-gray-500 group-hover:text-gray-300" />
      </div>
      {isExpanded && (
        <span className="ml-3 font-medium whitespace-nowrap">Logout</span>
      )}
    </button>
    {!isExpanded && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 bottom-3">
        Logout
      </div>
    )}
  </div>
</div>
{/* Mobile slide-in sidebar */}
<div
  className={`mobile-sidebar lg:hidden fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300
              theme-bg-primary theme-text-primary
              ${isExpanded ? "translate-x-0" : "-translate-x-full"}`}
>
  <div className="flex flex-col bg-[#E5F6FA] h-full mx-2 my-2 rounded-4xl">
    {/* Reuse header + nav markup */}
    <div className="flex items-center justify-center py-2 mt-3">
      <div className="flex items-center space-x-1">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl">
          <Image src={Logo} alt="Flock Logo" width={48} height={48} className="object-contain drop-shadow-md" />
        </div>
        <span className="text-2xl font-bold text-[#2C50A2] tracking-tight transition-all duration-300">
          Flock
        </span>
      </div>
    </div>
    <nav className="flex-1 px-2 py-4 space-y-2">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
              isActive ? "bg-[#684098] text-white" : "text-black hover:text-black hover:bg-[#684098]"
            }`}
          >
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
              {item.name === "Home" || item.name === "Blogs" || item.name === "Videos" ? (
                <Image
                  src={Icon}
                  alt={item.name}
                  width={20}
                  height={20}
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? "filter brightness-0 invert" : "filter brightness-0"
                  }`}
                />
              ) : (
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-white" : "text-black"}`} />
              )}
            </div>
            <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>
          </Link>
        )
      })}
    </nav>
    {/* Logout Button for Mobile */}
<div className="p-3 border-t border-gray-300 mt-auto">
  <button
    onClick={() => {
      setShowLogoutConfirm(true);
      setIsExpanded(false);
    }}
    className="w-full flex items-center px-3 py-2 text-black hover:text-gray-900 cursor-pointer hover:bg-gray-300 rounded-lg transition-colors duration-200 group min-w-0"
  >
    <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
      <Image src={Exit} alt="Logout" className="w-5 h-5 text-gray-500 group-hover:text-gray-300" />
    </div>
    <span className="ml-3 font-medium whitespace-nowrap">Logout</span>
  </button>
</div>
  </div>
</div>

      {/* Main Content */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Mobile menu button */}
        <button
          type="button"
          className="mobile-menu-btn lg:hidden fixed top-4 left-2 z-50 inline-flex h-9 w-9 items-center justify-center rounded-lg
             bg-white text-black shadow-md active:scale-95 transition"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label={isExpanded ? "Close menu" : "Open menu"}
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
  <div className="px-6 py-2 flex items-center justify-between">
    {/* Left Section */}
    <div className="flex items-center space-x-4"></div>
    {/* Right Section - Actions */}
    <div className="flex items-center space-x-3">
      {/* Switch Role Button */}
      <button
        onClick={handleToggleRole}
        className="flex items-center space-x-1 px-2 py-1.5 bg-[#34A0B8] hover:bg-blue-50 text-white rounded-2xl text-sm font-medium cursor-pointer transition-colors"
        title="Switch To Viewer"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Switch to Viewer</span>
      </button>

      {/* Creator Badge */}
      <div
        className="flex items-center space-x-1 px-2 py-1.5 bg-purple-700 text-white rounded-2xl text-sm font-medium"
        title="Creator"
      >
        <PenToolIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Creator</span>
      </div>

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowUserDetails(!showUserDetails)}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          title="User Menu"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              src={user.profileImage || profileImg}
              alt="User Avatar"
              width={40}
              height={40}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </button>

        {/* User Details Dropdown */}
        {showUserDetails && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src={user.profileImage || profileImg}
                    alt="User Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="truncate">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.username || user?.name || "Creator"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || "creator@flock.com"}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={() => {
                  router.push("/dashboard/profiles");
                  setShowUserDetails(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  setShowUserDetails(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </Suspense>
    </div>
  );
}
