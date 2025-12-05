"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Enhanced Gradient */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={loginBg}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700/60 via-purple-600/50 via-pink-500/40 to-white/60 backdrop-blur-[1px]" />
      </div>

      {/* Header */}
      <header className="relative z-30 w-full px-4 md:px-6 lg:px-10 py-4 md:py-6">
        <div className="w-full flex items-center justify-between">
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
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
            <Link
              href="/login"
              className="flex items-center rounded-xl px-4 md:px-6 py-2 bg-white/95 backdrop-blur-sm text-black text-sm md:text-base lg:text-lg underline font-semibold hover:bg-white hover:text-purple-900 transition-all shadow-lg hover:shadow-xl"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-[#2D9CB8] text-sm md:text-base lg:text-lg text-white font-semibold px-4 md:px-6 py-2 rounded-xl hover:bg-[#2388A3] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Join The Flock
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width Sections */}
      <div className="relative z-10">
        {/* Who We Are - Featured Section */}
        <section className="bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-50 px-6 md:px-12 lg:px-16 py-12 md:py-16 border-t border-purple-200/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-900 text-center mb-4 -mt-4">About Us</h2>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-6">
              Who We Are
            </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  FLOCK is a next-generation digital creator platform built for
                  one purpose:{" "}
                  <span className="font-bold text-purple-900">
                    to empower creators to own their audience, publish their
                    voice, and earn from their work in a fair and transparent
                    ecosystem.
                  </span>
                </p>
                <p>
                  Unlike traditional social media platforms that reward the
                  platform itself first and the creator second,{" "}
                  <span className="font-bold text-purple-900">FLOCK flips the model.</span> We
                  believe creators should be at the center — not the product.
                </p>
                <p>FLOCK brings together:</p>
                <ul className="grid md:grid-cols-2 gap-3 my-4">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    Content publishing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    Community building
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    Monetization systems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    Creator analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    Brand partnerships
                  </li>
                </ul>
                <p>
                  All in one space.{" "}
                  <span>
                    We call it a{" "}
                    <strong className="text-purple-900">Creator Economy Operating System</strong> — designed
                    to unlock freedom, ownership, and opportunity for every
                    digital storyteller.
                  </span>
                </p>
              </div>
            </div>
          </section>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-px bg-gradient-to-r from-purple-200 to-pink-200">
          {/* Mission */}
          <section className="bg-gradient-to-br from-white to-purple-50/30 px-6 md:px-12 lg:px-16 py-10 md:py-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-orange-500 bg-clip-text text-transparent mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  To provide creators around the world with a safe, scalable, and
                  profitable digital home where their voice, originality, and
                  community come first.
                </p>
                <p>
                  We are not building another entertainment app. We are building a
                  creator ecosystem where:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Expression is celebrated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Ownership is protected</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Growth is measurable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Revenue is real</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Belief */}
          <section className="bg-gradient-to-br from-white to-teal-50/30 px-6 md:px-12 lg:px-16 py-10 md:py-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Our Belief
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>We believe social networks should:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>Respect intellectual property</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>Protect their communities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>Enable equitable revenue sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>Elevate authentic creators — not algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>Encourage diverse voices from around the world</span>
                  </li>
                </ul>
                <p className="font-semibold text-purple-900 pt-2">We exist to help creators rise.</p>
              </div>
            </div>
          </section>
        </div>

        {/* What Makes FLOCK Different */}
        <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 px-6 md:px-12 lg:px-16 py-12 md:py-16 border-y border-purple-200/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700 bg-clip-text text-transparent mb-8 text-center">
              What Makes FLOCK Different
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">Ownership Comes First</h3>
                <p className="text-gray-700 leading-relaxed">
                  Creators own their content. We simply provide the tools,
                  distribution, and monetization engine.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-orange-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">Transparent Earnings</h3>
                <p className="text-gray-700 leading-relaxed">
                  Monetization is based on performance, integrity, and
                  fairness — not viral luck or invisible preference systems.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-teal-100">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">Community Without Exploitation</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your audience belongs to you. We never sell, rent, or
                  exchange user identities for engagement farming.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-purple-200">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <span className="text-white text-2xl font-bold">4</span>
                </div>
                <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent">Safety and Accountability</h3>
                <p className="text-gray-700 leading-relaxed">
                  We enforce standards that protect creators from harassment,
                  abuse, and exploitation — without silencing communities or
                  punishing healthy expression.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Name FLOCK */}
        <section className="bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6">
              The Name "FLOCK"
            </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  A flock travels farther together than alone. Some lead, some
                  follow, but every bird matters.
                </p>
                <p>That's how we see creators:</p>
                <ul className="grid md:grid-cols-2 gap-3 my-4">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Solo voices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                    Collective force
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    Shared momentum
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Individual trajectories
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                    Global impact
                  </li>
                </ul>
                <p className="font-semibold text-purple-900">FLOCK is built for the movement, not the moment.</p>
              </div>
            </div>
          </section>

        {/* Three Column Grid */}
        <div className="grid md:grid-cols-3 gap-px bg-gradient-to-r from-purple-200 via-pink-200 to-teal-200">
          {/* Who FLOCK Serves */}
          <section className="bg-gradient-to-br from-purple-50 via-pink-50/30 to-white px-6 md:px-10 lg:px-12 py-10 md:py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-6">
                Who FLOCK Serves
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>FLOCK is built for a wide spectrum of creators, including:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Video creators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Bloggers and written storytellers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Community leaders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Personal brands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Coaches, educators, and experts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Artists and digital performers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Everyday people becoming powerful voices</span>
                  </li>
                </ul>
                <p className="font-semibold pt-2">
                  If you create, express, teach, lead, or inspire — you belong
                  here.
                </p>
              </div>
            </div>
          </section>

          {/* Built for the World */}
          <section className="bg-gradient-to-br from-teal-50 via-blue-50/30 to-white px-6 md:px-10 lg:px-12 py-10 md:py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
                Built for the World
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  FLOCK is proudly global. We welcome creators from every culture,
                  perspective, and walk of life — as long as they respect the
                  rules that keep our flock safe.
                </p>
                <p>
                  We do not gatekeep. We do not discriminate. We do not model
                  success around one country or one demographic.
                </p>
                <p className="font-semibold">We scale where creativity lives.</p>
              </div>
            </div>
          </section>

          {/* Our Commitment */}
          <section className="bg-gradient-to-br from-orange-50 via-amber-50/30 to-white px-6 md:px-10 lg:px-12 py-10 md:py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                Our Commitment
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>We promise to continuously evolve with:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Honest policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Transparent technology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Responsible monetization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Human-centered ethics</span>
                  </li>
                </ul>
                <p className="pt-2">
                  FLOCK will always work to put creators first — in design, in
                  economics, and in dignity.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Legal Entity - Footer */}
        <section className="bg-gradient-to-b from-purple-700/60 via-purple-600/50 via-pink-500/40 to-white/60 px-2 md:px-8 lg:px-12 py-10 md:py-12 text-white shadow-2xl">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4 text-black">Legal Entity</h2>
            <div className="space-y-1 text-black">
              <p className="font-bold text-lg text-black">Flock Together Global LLC</p>
              <p>30 N Gould St #53789</p>
              <p>Sheridan, WY 82801</p>
              <p>USA</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}