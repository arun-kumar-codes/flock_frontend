"use client";

import Image from "next/image";
import flockLogo from "@/assets/Flock-LOGO.png";
import aboutInfographic from "@/assets/About Us.png"; 
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | "ADMIN" | null;

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

          if (normalized === "CREATOR" || normalized === "VIEWER" || normalized === "ADMIN") {
            setRole(normalized);
          } else {
            setRole(null);
          }
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      } catch {
        setIsLoggedIn(false);
        setRole(null);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const homeHref = useMemo(() => {
    if (role === "ADMIN") return "/admin";
    if (role === "CREATOR") return "/dashboard";
    if (role === "VIEWER") return "/viewer";
    return null;
  }, [role]);

  const differentItems = [
    {
      n: "1",
      title: "Paid From Day One",
      desc: "Creators get paid from the day they post their first piece of content, while owning their content, post beta. We simply provide the tools, distribution, and monetization engine.",
      accent: "from-purple-600 to-indigo-600",
    },
    {
      n: "2",
      title: "All Types Of Content Welcome",
      desc: "You can post and monetize different forms of content in one place, visuals and written; including recycling your content from other platforms.",
      accent: "from-orange-500 to-pink-600",
    },
    {
      n: "3",
      title: "Transparent Earnings",
      desc: "Monetization is based on performance, integrity, and fairness — not viral luck or invisible preference systems.",
      accent: "from-teal-600 to-blue-600",
    },
    {
      n: "4",
      title: "Policy Enforcement With Explanation— Not Confusion",
      desc: "We give full transparency, warning and an explanation for any content we need to flag or remove due to policy violation.",
      accent: "from-fuchsia-600 to-purple-700",
    },
  ];

  return (
    <div className="relative min-h-screen bg-white">
      {/* Fixed watermark: flock bird/logo, low opacity; sits behind content and disappears behind colored blocks */}
      <div
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <div className="absolute inset-0 bg-white" />
        <Image
          src={flockLogo}
          alt=""
          width={640}
          height={220}
          className="object-contain opacity-[0.1] drop-shadow-none max-w-[90vw] max-h-[80vh]"
        />
      </div>

      {/* Header */}
      <header className="relative z-30 w-full px-4 md:px-6 lg:px-10 py-4 md:py-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Image
                src={flockLogo}
                alt="Flock Together Logo"
                width={120}
                height={35}
                className="drop-shadow-sm"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {!authChecked ? null : !isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center rounded-xl px-4 md:px-6 py-2 bg-gray-100 text-black text-sm md:text-base font-semibold hover:bg-gray-200 transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#2D9CB8] text-sm md:text-base text-white font-semibold px-4 md:px-6 py-2 rounded-xl hover:bg-[#2388A3] transition-all shadow-md"
                >
                  Join the Flock
                </Link>
              </>
            ) : homeHref ? (
              <Link
                href={homeHref}
                className="bg-gray-100 text-black font-semibold px-4 md:px-6 py-2 rounded-xl hover:bg-gray-200 transition-all"
              >
                Home
              </Link>
            ) : (
              <button
                disabled
                className="bg-gray-100 text-black font-semibold px-4 md:px-6 py-2 rounded-xl opacity-70 cursor-not-allowed"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ABOVE THE FOLD — Who We Are */}
        <section className="relative z-10 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl tracking-[0.2em] text-center mb-2 uppercase text-gray-800 font-extrabold">
              About Us
            </p>
            <p className="text-xs tracking-[0.35em] text-center mb-6 uppercase text-gray-500 font-semibold">
              A B O V E &nbsp; T H E &nbsp; F O L D
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Who We Are
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-6">
              FLOCK is more than a platform — it&apos;s a movement.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
              This is a new era for content creators worldwide and their
              communities. Creators are monetized from their very first content
              piece, with clear rules; no penalties, sudden demonetization, or
              takedowns!
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
              Their communities can truly belong. Individuals will have a space
              to gather, connect, and grow around the things they care about,
              without manipulation, bias, or being treated like a product.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Why choose FLOCK?
            </h2>
            <ul className="space-y-2 text-gray-700 text-base md:text-lg mb-8">
              {[
                "Post videos, poetry, blogs, whatever you want!",
                "Recycle your content from other platforms",
                "Get monetized for every piece of content posted (post beta)",
                "It is your work & your intellectual property, always",
                "No restrictions on where creators are located - all welcome to share their voice",
                "No demonetization, we work with creators to make it right if there's a breach.",
                "A safe space for communities to connect and grow together",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
              Everyone deserves their voice to be heard, to get paid for their
              work and to feel a sense of belonging without censorship. FLOCK is
              a new kind of social ecosystem where momentum belongs to everyone,
              not just a chosen few.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
              Unlike traditional social media platforms that get rewarded first
              and creators last, we have flipped that model. At FLOCK, we will
              always give you transparency, ownership, revenue, and the freedom
              to create without fear of shadowbans, silencing, or unfair
              demonetization.
            </p>
            <p className="text-base md:text-lg text-gray-800 font-semibold leading-relaxed">
              We are redefining social media to finally respect, protect, and
              reward the creators and communities that power it!
            </p>
          </div>
        </section>

        {/* The Name… 'FLOCK /flɒk/ — colored block (watermark disappears behind) */}
        <section className="relative z-20 px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-y border-purple-100/80">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              The Name… &apos;FLOCK /flɒk/
            </h2>
            <p className="mt-4 text-gray-700 text-lg leading-relaxed max-w-4xl">
              A flock travels farther together than alone. Some lead, some
              follow, but every bird matters. That&apos;s how we see creators and
              their community:
            </p>
            <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-10 text-gray-700 text-base md:text-lg">
              {[
                "Solo voices",
                "Collective force",
                "Shared momentum",
                "Individual trajectories",
                "Global impact",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="relative rounded-2xl bg-white/90 border border-gray-200/80 shadow-lg overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400" />
                <div className="p-4">
                  <div className="relative w-full overflow-hidden rounded-xl border border-gray-200/70 bg-white">
                    <Image
                      src={aboutInfographic}
                      alt="Flock values infographic"
                      className="w-full h-auto object-cover"
                      priority={false}
                    />
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl bg-white/90 border border-gray-200/80 shadow-lg overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600" />
                <div className="p-6 md:p-7">
                  <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                    <p>
                      The{" "}
                      <span className="font-bold text-purple-900">FREEDOM</span>{" "}
                      to express yourself authentically, whilst giving viewers
                      the freedom to explore diverse content without algorithms
                      silencing what matters most is what sets us apart.
                    </p>
                    <p>
                      No one gets buried, blocked or boxed in at Flock because
                      our{" "}
                      <span className="font-bold text-purple-900">LOYALTY</span>{" "}
                      means our people are always first; not our platform.
                    </p>
                    <p>
                      Wherever you are located in the world, you have an{" "}
                      <span className="font-bold text-purple-900">
                        OPPORTUNITY
                      </span>{" "}
                      to earn from day one (post beta). This space lets everyone
                      win.
                    </p>
                    <p>
                      You can finally allow your{" "}
                      <span className="font-bold text-purple-900">
                        CREATIVITY
                      </span>{" "}
                      to thrive using all formats of expression to be heard, seen
                      and acknowledged.
                    </p>
                    <p>
                      This is the place to grow and upskill in wisdom and{" "}
                      <span className="font-bold text-purple-900">
                        KNOWLEDGE
                      </span>{" "}
                      together, through stories, guides, case studies and lived
                      experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-gray-700 text-lg leading-relaxed max-w-4xl">
              FLOCK is built for the movement, not the moment - empowering
              creators to lead their community, publish their voice, and earn
              from their work in a fair and transparent ecosystem.
            </p>
            <p className="mt-4 text-gray-800 font-semibold text-lg">
              We bring together:
            </p>
            <ul className="mt-2 grid sm:grid-cols-2 gap-y-1 gap-x-10 text-gray-700 text-base md:text-lg">
              {[
                "Content publishing",
                "Community building",
                "Monetization systems",
                "Creator analytics",
                "Brand partnerships",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-purple-600">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-700 text-lg leading-relaxed max-w-4xl">
              Our space is a Creator Economy Operating System — unlocking
              freedom, ownership, and opportunity for every digital storyteller.
            </p>
          </div>
        </section>

        {/* What Makes FLOCK Different — colored block */}
        <section className="relative z-20 px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-gradient-to-b from-orange-50/95 via-pink-50/90 to-purple-50/95 border-y border-orange-100/80">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700 bg-clip-text text-transparent mb-10">
              What Makes FLOCK Different
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {differentItems.map((item) => (
                <div
                  key={item.n}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/90 to-white/70 shadow-lg"
                >
                  <div
                    className={`relative h-full rounded-2xl bg-white/95 border border-gray-200/80 overflow-hidden`}
                  >
                    <div
                      className={`h-1.5 w-full bg-gradient-to-r ${item.accent}`}
                    />
                    <div className="p-6">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-800">
                          {item.n}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-4 text-gray-700 leading-relaxed text-sm md:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-gray-800 text-lg font-semibold">
              With FLOCK, you&apos;re not fighting an algorithm — you&apos;re
              fueling a movement.
            </p>
          </div>
        </section>

        {/* Our Mission — white section (watermark visible) */}
        <section className="relative z-10 px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mb-4">
              To provide creators around the world with a safe, scalable, and
              profitable digital home where their voice, originality, and
              community come first.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mb-4">
              We are not building another entertainment app. We are building a
              creator ecosystem where:
            </p>
            <ul className="space-y-2 text-gray-700 text-lg mb-6">
              {[
                "Expression is celebrated",
                "Ownership is protected",
                "Growth is measurable",
                "Revenue is real",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-800 font-semibold text-lg">
              With FLOCK, you&apos;re not fighting an algorithm — you&apos;re
              fueling a movement.
            </p>
          </div>
        </section>

        {/* Our Belief — colored block */}
        <section className="relative z-20 px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-gradient-to-br from-teal-50/95 via-white to-blue-50/90 border-y border-teal-100/80">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Belief
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              We believe social networks should:
            </p>
            <ul className="space-y-2 text-gray-700 text-lg mb-6">
              {[
                "Respect intellectual property",
                "Protect their communities",
                "Enable equitable revenue sharing",
                "Elevate authentic creators — not algorithms",
                "Encourage diverse voices from around the world",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-900 font-semibold text-lg">
              FLOCK exists to help creators rise and communities thrive.
            </p>
          </div>
        </section>

        {/* Who FLOCK Serves — white section */}
        <section className="relative z-10 px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Who FLOCK Serves
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mb-4">
              FLOCK is built for a wide spectrum of creators, including:
            </p>
            <ul className="space-y-2 text-gray-700 text-base md:text-lg mb-6">
              {[
                "Video creators",
                "Bloggers and written storytellers",
                "Community leaders",
                "Personal brands",
                "Coaches, educators, and experts",
                "Artists and digital performers",
                "Everyday people becoming powerful voices",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-900 font-semibold text-lg">
              If you create, express, teach, lead, or inspire — you belong here!
            </p>
          </div>
        </section>

        {/* Built For The World — colored block */}
        <section className="relative z-20 px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-gradient-to-br from-amber-50/95 via-white to-orange-50/90 border-y border-amber-100/80">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Built For The World
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mb-4">
              FLOCK is proudly global. We welcome creators from every culture,
              perspective, and walk of life — as long as they respect the rules
              that keep our flock safe.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mb-4">
              We do not gatekeep. We do not discriminate. We do not model
              success around one country or one demographic.
            </p>
            <p className="text-gray-900 font-semibold text-lg">
              We grow where creativity lives.
            </p>
          </div>
        </section>

        {/* Our Commitment — white section */}
        <section className="relative z-10 px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mb-4">
              We promise to continuously evolve with:
            </p>
            <ul className="space-y-2 text-gray-700 text-base md:text-lg mb-6">
              {[
                "Honest policies",
                "Transparent technology",
                "Responsible monetization",
                "Human-centered ethics",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-900 font-semibold text-lg">
              FLOCK will always work to put creators first — in design,
              economics, and dignity.
            </p>
          </div>
        </section>

        {/* Legal Entity — light colored block */}
        <section className="relative z-20 px-6 md:px-12 lg:px-16 py-10 md:py-12 bg-gray-50/95 border-t border-gray-200/80">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Legal Entity
            </h2>
            <div className="text-gray-800 text-base md:text-lg leading-relaxed">
              <p className="font-semibold">Flock Together Global LLC</p>
              <p>30 N Gould St #53789</p>
              <p>Sheridan, WY 82801</p>
              <p>USA</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
