"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import aboutInfographic from "@/assets/About Us.png"; 
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | null;

export default function AboutUsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setAuthChecked(false);

      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      if (!accessToken) {
        setIsLoggedIn(false);
        setRole(null);
        setAuthChecked(true);
        return;
      }

      try {
        const res = await getUserProfile();

        if (res?.status === 200) {
          setIsLoggedIn(true);

          const rawRole = res?.data?.user?.role ?? res?.data?.role ?? null;
          const normalized =
            typeof rawRole === "string" ? rawRole.trim().toUpperCase() : null;

          if (normalized === "CREATOR" || normalized === "VIEWER") {
            setRole(normalized);
          } else {
            setRole(null);
          }
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setRole(null);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const homeHref = useMemo(() => {
    if (role === "CREATOR") return "/dashboard";
    if (role === "VIEWER") return "/viewer";
    return null;
  }, [role]);

  const differentItems = [
    {
      n: "1",
      title: "Ownership Comes First",
      desc: "Creators own their content. We simply provide the tools, distribution, and monetization engine.",
      accent: "from-purple-600 to-indigo-600",
    },
    {
      n: "2",
      title: "Transparent Earnings",
      desc: "Monetization is based on performance, integrity, and fairness — not viral luck or invisible preference systems.",
      accent: "from-orange-500 to-pink-600",
    },
    {
      n: "3",
      title: "Community Without Exploitation",
      desc: "Your audience is your community — they belong to you. We never sell, rent, or exchange user identities for engagement farming.",
      accent: "from-teal-600 to-blue-600",
    },
    {
      n: "4",
      title: "Safety and Accountability",
      desc: "We enforce standards that protect creators and their audience from harassment, abuse, and exploitation — without silencing or punishing healthy expression.",
      accent: "from-fuchsia-600 to-purple-700",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={loginBg}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700/65 via-fuchsia-600/35 to-white/70 backdrop-blur-[1px]" />
      </div>

      {/* Header */}
      <header className="relative z-30 w-full px-4 md:px-6 lg:px-10 py-4 md:py-6">
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
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

          {/* Right Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            {!authChecked ? null : !isLoggedIn ? (
              <>
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
                  Join the Flock
                </Link>
              </>
            ) : homeHref ? (
              <Link
                href={homeHref}
                className="bg-white/95 text-black font-semibold px-4 md:px-6 py-2 rounded-xl hover:bg-white hover:text-purple-900 transition-all shadow-lg"
              >
                Home
              </Link>
            ) : (
              <button
                disabled
                className="bg-white/70 text-black font-semibold px-4 md:px-6 py-2 rounded-xl shadow-lg opacity-70 cursor-not-allowed"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10">
        {/* HERO / ABOVE THE FOLD */}
        <section className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-4 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md border border-white/50 shadow-xl">
              {/* subtle watermark logo */}
              <div className="absolute -right-10 -top-10 opacity-[0.06] pointer-events-none select-none">
                <Image
                  src={flockLogo}
                  alt=""
                  width={520}
                  height={180}
                  className="drop-shadow-none"
                />
              </div>

              <div className="px-6 md:px-10 lg:px-12 py-10 md:py-12">
                <p className="text-xs md:text-sm tracking-[0.22em] uppercase text-purple-700 font-semibold">
                  About Us
                </p>

                <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  FLOCK is more than a platform —{" "}
                  <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    it’s a movement.
                  </span>
                </h1>

                <p className="mt-5 text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
                  This is a new era for content creators worldwide and their
                  communities. Creators are monetized from their very first
                  content piece, with clear rules — no penalties, sudden
                  demonetization, or takedowns.
                </p>

                <p className="mt-3 text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
                  Communities can truly belong — a space to gather, connect, and
                  grow around what they care about, without manipulation, bias,
                  or being treated like a product.
                </p>
              </div>

              {/* bottom gradient strip */}
              <div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400" />
            </div>
          </div>
        </section>

        {/* WHO WE ARE + WHY CHOOSE */}
        <section className="px-6 md:px-12 lg:px-16 py-10 md:py-14">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-5xl md:text-4xl font-extrabold text-white">
                  Who We Are
                </h2>
                <p className="mt-4 text-black text-2xl font-bold leading-relaxed max-w-4xl">
                  Unlike traditional social media platforms that get rewarded
                  first and creators last, we’ve flipped that model. At FLOCK,
                  we will always give you transparency, ownership, revenue, and
                  the freedom to create without fear of shadowbans, silencing, or
                  unfair demonetization.
                </p>

                <p className="mt-4 text-black text-lg font-bold leading-relaxed max-w-4xl">
                  Everyone deserves their voice to be heard, to get paid for
                  their work, and to feel a sense of belonging without
                  censorship. FLOCK is a new kind of social ecosystem where
                  momentum belongs to everyone — not just a chosen few.
                </p>
              </div>

              <div className="border-t border-gray-200/80 pt-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Why choose FLOCK?
                </h3>

                <ul className="mt-5 grid md:grid-cols-2 gap-y-3 gap-x-10 text-gray-700 text-base md:text-lg">
                  {[
                    "Post videos, poetry, blogs — whatever you want!",
                    "Recycle your content from other platforms",
                    "Get monetized for every piece of content posted (post beta)",
                    "It is your work & your intellectual property, always",
                    "No restrictions on where creators are located — all welcome",
                    "No demonetization — we work with creators to make it right if there’s a breach",
                    "A safe space for communities to connect and grow together",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-purple-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

       {/* THE NAME + INFOGRAPHIC */}
<section className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-gradient-to-b from-white/70 to-white/95">
  {/* watermark effect */}
  <div className="absolute inset-0 pointer-events-none select-none">
    <div className="absolute left-1/2 top-10 -translate-x-1/2 opacity-[0.05]">
      <Image src={flockLogo} alt="" width={760} height={260} />
    </div>
  </div>

  <div className="relative max-w-6xl mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
      The Name “FLOCK”
    </h2>

    <p className="mt-4 text-gray-700 text-lg leading-relaxed max-w-4xl">
      A flock travels farther together than alone. Some lead, some follow — but
      every bird matters. That’s how we see creators and their community:
    </p>

    <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-10 text-gray-700 text-base md:text-lg">
      {[
        "Solo voices",
        "Collective force",
        "Shared momentum",
        "Individual trajectories",
        "Global impact",
      ].map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-orange-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>

    {/* ✅ Two card layout: Image left, Writing right */}
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
      {/* LEFT: Image Card */}
      <div className="relative rounded-2xl bg-white/75 backdrop-blur-md border border-gray-200/70 shadow-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400" />
        <div className="p-3 md:p-4">
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-200/70 bg-white/50 shadow-md">
            <Image
              src={aboutInfographic}
              alt="Flock Together values infographic"
              className="w-full h-auto object-cover"
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* RIGHT: Text Card */}
      <div className="relative rounded-2xl bg-white/75 backdrop-blur-md border border-gray-200/70 shadow-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600" />

        <div className="p-6 md:p-7">
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">
            What FLOCK Stands For
          </h3>

          <div className="mt-5 space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              The{" "}
              <span className="font-extrabold text-purple-900">FREEDOM</span>{" "}
              to express yourself authentically — whilst giving viewers the
              freedom to explore diverse content without algorithms silencing
              what matters most — is what sets us apart.
            </p>
            <p>
              No one gets buried, blocked, or boxed in at Flock because our{" "}
              <span className="font-extrabold text-purple-900">LOYALTY</span>{" "}
              means our people are always first; not our platform.
            </p>
            <p>
              Wherever you are located in the world, you have an{" "}
              <span className="font-extrabold text-purple-900">
                OPPORTUNITY
              </span>{" "}
              to earn from day one (post beta). This space lets everyone win.
            </p>
            <p>
              You can finally allow your{" "}
              <span className="font-extrabold text-purple-900">
                CREATIVITY
              </span>{" "}
              to thrive using all formats of expression to be heard, seen and
              acknowledged.
            </p>
            <p>
              This is the place to grow and upskill in wisdom and{" "}
              <span className="font-extrabold text-purple-900">KNOWLEDGE</span>{" "}
              together, through stories, guides, case studies and lived
              experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* WHAT WE BRING TOGETHER */}
        <section className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              A Creator Economy Operating System
            </h2>
            <p className="mt-4 text-gray-700 text-lg leading-relaxed max-w-4xl">
              FLOCK is built for the movement, not the moment — empowering
              creators to lead their community, publish their voice, and earn
              from their work in a fair and transparent ecosystem.
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-y-3 gap-x-10 text-gray-700 text-base md:text-lg">
              {[
                "Content publishing",
                "Community building",
                "Monetization systems",
                "Creator analytics",
                "Brand partnerships",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-teal-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-gray-700 text-lg leading-relaxed max-w-4xl">
              Our space unlocks freedom, ownership, and opportunity for every
              digital storyteller.
            </p>
          </div>
        </section>

        {/* ✅ UPDATED SECTION: 4 HOVER CARDS */}
        <section className="px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-gradient-to-b from-orange-50/60 via-pink-50/40 to-purple-50/40 border-y border-purple-200/40">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
              What Makes FLOCK Different
            </h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {differentItems.map((item) => (
                <div
                  key={item.n}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/70 via-white/40 to-white/70"
                >
                  {/* glow */}
                  <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-purple-500/40 via-pink-500/35 to-orange-400/35" />

                  <div
                    className="relative h-full rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-lg
                               transition-all duration-300 ease-out
                               group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:scale-[1.02]"
                  >
                    {/* top accent line */}
                    <div className={`h-1.5 w-full rounded-t-2xl bg-gradient-to-r ${item.accent}`} />

                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm
                                     flex items-center justify-center font-extrabold text-gray-900"
                        >
                          {item.n}
                        </div>

                        <div>
                          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 leading-snug">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-4 text-gray-700 leading-relaxed">
                        {item.desc}
                      </p>

                      {/* subtle arrow */}
                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-800">
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-gray-800 text-lg font-semibold">
              With FLOCK, you’re not fighting an algorithm — you’re fueling a movement.
            </p>
          </div>
        </section>

        {/* MISSION + BELIEF (simple two columns, no cards) */}
        <section className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Our Mission
              </h2>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                To provide creators around the world with a safe, scalable, and
                profitable digital home where their voice, originality, and
                community come first.
              </p>

              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                We are not building another entertainment app. We are building a
                creator ecosystem where:
              </p>

              <ul className="mt-4 space-y-2 text-gray-700 text-lg">
                {[
                  "Expression is celebrated",
                  "Ownership is protected",
                  "Growth is measurable",
                  "Revenue is real",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-orange-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Our Belief
              </h2>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                We believe social networks should:
              </p>

              <ul className="mt-4 space-y-2 text-gray-700 text-lg">
                {[
                  "Respect intellectual property",
                  "Protect their communities",
                  "Enable equitable revenue sharing",
                  "Elevate authentic creators — not algorithms",
                  "Encourage diverse voices from around the world",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-teal-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-purple-900 font-semibold text-lg">
                FLOCK exists to help creators rise and communities thrive.
              </p>
            </div>
          </div>
        </section>

        {/* WHO SERVES / BUILT FOR WORLD / COMMITMENT */}
        <section className="px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-white/70 border-t border-gray-200/70">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Who FLOCK Serves
              </h3>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                FLOCK is built for a wide spectrum of creators, including:
              </p>

              <ul className="mt-4 space-y-2 text-gray-700 text-base md:text-lg">
                {[
                  "Video creators",
                  "Bloggers and written storytellers",
                  "Community leaders",
                  "Personal brands",
                  "Coaches, educators, and experts",
                  "Artists and digital performers",
                  "Everyday people becoming powerful voices",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-purple-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 font-semibold text-gray-900">
                If you create, express, teach, lead, or inspire — you belong here.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Built For The World
              </h3>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                FLOCK is proudly global. We welcome creators from every culture,
                perspective, and walk of life — as long as they respect the rules
                that keep our flock safe.
              </p>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                We do not gatekeep. We do not discriminate. We do not model
                success around one country or one demographic.
              </p>
              <p className="mt-4 font-semibold text-gray-900 text-lg">
                We grow where creativity lives.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Our Commitment
              </h3>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                We promise to continuously evolve with:
              </p>

              <ul className="mt-4 space-y-2 text-gray-700 text-base md:text-lg">
                {[
                  "Honest policies",
                  "Transparent technology",
                  "Responsible monetization",
                  "Human-centered ethics",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-orange-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-gray-900 font-semibold text-lg">
                FLOCK will always work to put creators first — in design, economics, and dignity.
              </p>
            </div>
          </div>
        </section>

        {/* LEGAL ENTITY */}
        <section className="px-6 md:px-12 lg:px-16 py-12 md:py-14 bg-gradient-to-b from-purple-700/25 via-pink-500/10 to-white/80 border-t border-purple-200/40">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Legal Entity
            </h2>

            <div className="mt-5 text-gray-800 text-lg leading-relaxed">
              <p className="font-bold">Flock Together Global LLC</p>
              <p>30 N Gould St #53789</p>
              <p>Sheridan, WY 82801</p>
              <p>USA</p>
            </div>

            <div className="mt-8 text-sm text-gray-600">
              <p>
                Note: Content on this page is based on your provided “About Us”
                document and infographic.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
