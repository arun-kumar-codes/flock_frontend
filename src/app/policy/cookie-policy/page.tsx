"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <Image src={loginBg} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
      </div>

      {/* Header */}
      <header className="relative z-30 w-full px-4 md:px-6 lg:px-10 py-3 md:py-4">
        <div className="w-full flex items-center justify-between mb-3">
          {/* Logo - Left Most */}
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Image
                src={flockLogo}
                alt="Flock Together Logo"
                width={120}
                height={35}
                className="drop-shadow-2xl"
                priority
              />
            </Link>
          </div>

          {/* Login/Signup Buttons - Right Most */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/login"
              className="flex items-center rounded-xl px-4 md:px-6 py-2 bg-white/95 backdrop-blur-sm text-black text-sm md:text-base underline font-semibold hover:bg-white hover:text-purple-900 transition-all shadow-lg"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-[#2D9CB8] text-sm md:text-base text-white font-semibold px-4 md:px-6 py-2 rounded-xl hover:bg-[#2388A3] transition-all shadow-lg hover:scale-105"
            >
              Join Flock
            </Link>
          </div>
        </div>

        {/* Hyperlinks Row */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 text-xs md:text-sm pt-3 pb-3 border-4 border-white/50">
          <Link href="/contact" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Contact Us
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/privacy-policy" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Privacy Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/terms-of-service" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Terms of Service
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/community-guidelines" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Community Guidelines
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/acceptable-use-policy" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Acceptable Use Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/safety-policy" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Safety Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/about-us" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            About Us
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto py-4 md:py-6 px-6">

        <pre className="whitespace-pre-wrap font-sans text-base">
{String.raw`:contentReference[oaicite:4]{index=4}
COOKIE & TRACKING POLICY - FLOCKTOGETHER.XYZ

Last Updated: December 1, 2025

This Cookie & Tracking Policy (“Policy”) explains how Flock Together Global LLC...`}
        </pre>

      </div>
    </div>
  );
}
