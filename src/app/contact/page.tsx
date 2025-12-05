"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={loginBg}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
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
          <Link href="/contact" className="text-white hover:text-white font-medium hover:underline transition-all">
            Contact Us
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/privacy-policy" className="text-white hover:text-white font-medium hover:underline transition-all">
            Privacy Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/terms-of-service" className="text-white hover:text-white font-medium hover:underline transition-all">
            Terms of Service
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/community-guidelines" className="text-white hover:text-white font-medium hover:underline transition-all">
            Community Guidelines
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/acceptable-use-policy" className="text-white hover:text-white font-medium hover:underline transition-all">
            Acceptable Use Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/safety-policy" className="text-white hover:text-white font-medium hover:underline transition-all">
            Safety Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/about-us" className="text-white hover:text-white font-medium hover:underline transition-all">
            About Us
          </Link>
        </div>
      </header>

      {/* Centered Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto py-4 md:py-6 px-6">
        <div className="bg-white/95 rounded-3xl shadow-xl px-6 py-8 md:px-10 md:py-12 theme-text-primary">
          
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              We're here to support your journey as a creator or viewer on the FLOCK platform. If you have questions, feedback, or need assistance, please use the information below to reach out to the appropriate team.
            </p>
          </header>

          {/* Contact Sections */}
          <div className="space-y-6">
            
            {/* General Support */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">General Support</h2>
              <p className="text-base md:text-lg text-gray-700 mb-4">
                For general inquiries, technical questions, or account-related assistance:
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📩</span>
                <a 
                  href="mailto:admin@flocktogether.xyz"
                  className="text-lg md:text-xl font-semibold text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  admin@flocktogether.xyz
                </a>
              </div>
            </div>

            {/* Partnerships & Business */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Partnerships & Business Inquiries</h2>
              <p className="text-base md:text-lg text-gray-700 mb-4">
                For media, collaborations, or strategic partnership discussions:
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📩</span>
                <a 
                  href="mailto:admin@flocktogether.xyz"
                  className="text-lg md:text-xl font-semibold text-purple-600 hover:text-purple-800 underline transition-colors"
                >
                  admin@flocktogether.xyz
                </a>
              </div>
            </div>

            {/* Safety & Reporting */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Safety & Reporting</h2>
              <p className="text-base md:text-lg text-gray-700 mb-4">
                If you believe a user, content, or interaction violates our guidelines or presents a safety concern, please report it using platform tools whenever possible.
              </p>
              <p className="text-base md:text-lg text-gray-700 mb-4 font-semibold">
                For urgent matters that require direct review:
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📩</span>
                <a 
                  href="mailto:admin@flocktogether.xyz"
                  className="text-lg md:text-xl font-semibold text-red-600 hover:text-red-800 underline transition-colors"
                >
                  admin@flocktogether.xyz
                </a>
              </div>
            </div>

            {/* Creator Monetization Support */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Creator Monetization Support</h2>
              <p className="text-base md:text-lg text-gray-700 mb-4">
                For payment-related inquiries, withdrawals, earnings, or payout configuration:
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📩</span>
                <a 
                  href="mailto:admin@flocktogether.xyz"
                  className="text-lg md:text-xl font-semibold text-green-600 hover:text-green-800 underline transition-colors"
                >
                  admin@flocktogether.xyz
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Response Time</h2>
              <p className="text-base md:text-lg text-gray-700">
                We aim to respond within 2–4 business days, depending on the nature and volume of requests.
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Important</h2>
              <ul className="space-y-2 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">•</span>
                  <span>Do not send passwords, banking PINs, or sensitive financial information in emails.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">•</span>
                  <span>We will never ask you for passwords or verification codes.</span>
                </li>
              </ul>
            </div>

            {/* Footer Message */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-lg md:text-xl text-gray-700 font-medium">
                Thank you for being part of the FLOCK community.
              </p>
              <p className="text-xl md:text-2xl text-gray-800 font-bold mt-2">
                Together, we empower creators to take flight.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
