"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | "ADMIN" | null;

export default function CreatorLicensingPage() {
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

          // role might be in res.data.user.role OR res.data.role depending on your API
          const rawRole = res?.data?.user?.role ?? res?.data?.role ?? null;

          // Normalize to avoid "creator"/"CREATOR"/" Creator "
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
    if (role === "ADMIN") return "/admin";
    if (role === "CREATOR") return "/dashboard";
    if (role === "VIEWER") return "/viewer";
    return null;
  }, [role]);
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

      {/* Centered White Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto py-4 md:py-6 px-6">
        <div className="bg-white/95 rounded-3xl shadow-xl px-6 py-8 md:px-10 md:py-10 theme-text-primary">
          {/* Header */}
          <header className="space-y-3 mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              FLOCK CREATOR AGREEMENT
            </h1>
            <p className="text-sm">Last Updated: December 9, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">
            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Flock Creator Agreement (&quot;Agreement&quot;) governs your use of the creator features and
                monetization tools on https://flocktogether.xyz (the &quot;Platform&quot;), operated by Flock Together
                Global LLC (&quot;Flock,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;).
              </p>
              <p>
                By creating a creator account, uploading content, or participating in the Flock Earnings
                Program, you (&quot;Creator,&quot; &quot;you,&quot; &quot;your&quot;) agree to be bound by this Agreement, our Community
                Guidelines, Acceptable Use Policy, DMCA &amp; Copyright Policy, Privacy Policy, and all
                applicable laws.
              </p>
              <p>
                Following completion of the Beta phase, all eligible Creators may earn from their first day on the
                Platform, subject to this Agreement and all Platform policies.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. DEFINITIONS</h2>
              <p className="font-semibold">1.1 Content</p>
              <p>
                &quot;Content&quot; means any media you upload or publish on the Platform, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Video</li>
                <li>Audio</li>
                <li>Images</li>
                <li>Text, articles, blogs, or posts</li>
                <li>AI-generated works</li>
                <li>Livestreams</li>
                <li>Thumbnails</li>
                <li>Titles, captions, and descriptions</li>
                <li>Metadata and tags</li>
              </ul>
              <p className="font-semibold">1.2 Creator</p>
              <p>
                A &quot;Creator&quot; is any individual or entity that uploads Content to the Platform or participates in any
                monetization or earnings program offered by Flock.
              </p>
              <p className="font-semibold">1.3 License</p>
              <p>
                &quot;License&quot; means the legal permission you grant Flock to host, store, distribute, display,
                promote, and monetize your Content so the Platform can function.
              </p>
            </section>

             {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. ELIGIBILITY &amp; ACCOUNT STATUS</h2>
              <p className="font-semibold">2.1 Creator Eligibility</p>
              <p>To participate in the Flock Earnings Program, Creators must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be at least 18 years old or the age of majority in their jurisdiction</li>
                <li>Have a verified Flock account</li>
                <li>Submit accurate payout and tax information (via Stripe, Payoneer, PayPal, or another
                  approved provider, as applicable)</li>
                <li>Agree to and comply with this Agreement and all Platform policies</li>
              </ul>
              <p className="font-semibold">2.2 Multiple Accounts</p>
              <p>Creators may operate more than one account, provided that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Each account complies with this Agreement and all policies</li>
                <li>Multiple accounts are not used to evade enforcement, inflate engagement, or manipulate
                  earnings</li>
              </ul>
              <p className="font-semibold">2.3 Account Standing &amp; Monetization</p>
              <p>Flock monetizes individual posts, not entire accounts. As a general rule:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Individual posts may be demonetized for violations</li>
                <li>Flock does not &quot;blanket demonetize&quot; compliant Creators</li>
                <li>Flock may suspend or remove accounts in cases of serious or repeated violations (see
                  Section 13)</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. OWNERSHIP OF CONTENT</h2>
              <p className="font-semibold">3.1 You Own Your Original Work</p>
              <p>You retain ownership of any original Content you upload. Flock does not claim ownership of
                your work.</p>
              <p className="font-semibold">3.2 Non-Original &amp; Recycled Content</p>
              <p>You may upload previously published or &quot;recycled&quot; Content (e.g., from YouTube, TikTok,
                Instagram) only if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own the Content</li>
                <li>You have the right to re-upload and monetize it on Flock</li>
                <li>No exclusivity, copyright, or platform conflicts exist</li>
              </ul>
              <p>You are solely responsible for ensuring compliance with third-party platform contracts and
                copyrights.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. LICENSE YOU GRANT FLOCK</h2>
              <p className="font-semibold">4.1 License Grant</p>
              <p>Upon upload, you grant Flock a:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Worldwide</li>
                <li>Non-exclusive</li>
                <li>Royalty-free</li>
                <li>Transferable</li>
                <li>Sublicensable</li>
                <li>Revocable only as described in this Agreement</li>
              </ul>
              <p>license to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Host, store, cache, transcode, distribute, and display your Content</li>
                <li>Create thumbnails, previews, and clips</li>
                <li>Surface Content in feeds, recommendations, search, and discovery tools</li>
                <li>Promote Content within the Platform and limited Flock marketing materials</li>
                <li>Monetize Content through ads, performance tools, or other revenue systems</li>
                <li>Deliver Content via third-party networks and CDNs</li>
              </ul>
              <p>This License exists solely to enable Platform functionality.</p>
              <p className="font-semibold">4.2 Scope of Use</p>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Display Content globally across devices, regions, and languages</li>
                <li>Resize, compress, or reformat Content for performance</li>
                <li>Generate automated previews or thumbnails</li>
                <li>Cache or mirror Content via third-party infrastructure</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. CONTENT REMOVAL &amp; DATA</h2>
              <p className="font-semibold">5.1 Deleting Your Content</p>
              <p>You may delete Content at any time. After deletion:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Accrued earnings remain valid, subject to audit or fraud review</li>
                <li>Flock may retain copies for legal, financial, or compliance purposes</li>
                <li>Aggregated analytics remain Flock&apos;s property</li>
              </ul>
              <p className="font-semibold">5.2 End of Account Relationship</p>
              <p>If you close your account:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You may request deletion of remaining Content, subject to retention requirements</li>
                <li>Backup and log copies may remain</li>
                <li>Monetization disputes, chargebacks, or fraud claims may still be enforced</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. NON-ORIGINAL, AI &amp; HIGH-RISK CONTENT</h2>
              <p className="font-semibold">6.1 Non-Original Content — Strict Liability</p>
              <p>You represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own or are licensed to all uploaded Content</li>
                <li>You have the authority to grant the License in Section 4</li>
                <li>Your Content does not violate copyright, trademark, or publicity rights</li>
              </ul>
              <p>Flock does not verify licenses. Responsibility rests entirely with you.</p>
              <p className="font-semibold">6.2 AI-Generated Content</p>
              <p>AI-generated Content is permitted only if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own rights to the output</li>
                <li>It does not replicate identifiable individuals without consent</li>
                <li>It does not recreate copyrighted franchises or IP without permission</li>
                <li>It is not used for deepfakes, harassment, fake endorsements, or explicit material
                  involving real people</li>
              </ul>
              <p>Flock may request proof of rights, prompts, or training data.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. COMMUNITY GUIDELINES &amp; PROHIBITED CONTENT</h2>
              <p>Creators may not upload Content involving:</p>
              <p className="font-semibold">7.1 Safety &amp; Harm</p>
              <p>Violence, threats, dangerous challenges, or self-harm without educational or supportive context.</p>
              <p className="font-semibold">7.2 Hate &amp; Harassment</p>
              <p>Hate speech, harassment, stalking, doxxing, or dehumanizing language.</p>
              <p className="font-semibold">7.3 Illegal Activities</p>
              <p>Drugs, weapons, fraud, scams, trafficking, or unlawful conduct.</p>
              <p className="font-semibold">7.4 Adult Content</p>
              <p>Pornography, explicit sexual acts, nudity, or sexual content involving minors.</p>
              <p className="font-semibold">7.5 Misinformation</p>
              <p>Harmful health misinformation, hoaxes, or manipulated content intended to mislead.</p>
              <p className="font-semibold">7.6 Copyright &amp; IP Violations</p>
              <p>Unauthorized copyrighted material, reposts without permission, or scraped AI content trained on
                protected works.</p>
              <p>Violations may result in removal, demonetization, or strikes.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. COPYRIGHT POLICY &amp; STRIKES</h2>
              <p>Creators must comply with Flock&apos;s DMCA &amp; Copyright Policy.</p>
              <p>Three (3) copyright strikes may result in monetization removal or account termination.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. MONETIZATION &amp; EARNINGS</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Monetization is post-based, not account-wide</li>
                <li>Revenue share rates may change and are not guaranteed</li>
                <li>No minimum earnings, views, or monetization are promised</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. BONUSES &amp; INCENTIVES (BETA PHASES)</h2>
              <p>Bonuses during beta phases are discretionary, temporary, and not guaranteed to continue.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. PAYMENTS &amp; TAXES</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Net 30 payout schedule</li>
                <li>Payments via approved third-party processors</li>
                <li>Holds may occur for fraud, disputes, or verification</li>
                <li>Creators are responsible for taxes</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. BETA PHASES</h2>
              <p>Flock may operate in phased rollouts with evolving eligibility and monetization rules.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. ENFORCEMENT &amp; TERMINATION</h2>
              <p>Flock may issue strikes, restrict monetization, or remove accounts for violations. Appeals may
                be submitted where available.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. RELATIONSHIP &amp; BRAND USE</h2>
              <p>This Agreement does not create employment, partnership, or agency.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. INDEMNIFICATION &amp; LIABILITY</h2>
              <p>Creators agree to indemnify Flock against claims arising from Content, violations, or unlawful
                activity.</p>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">16. UPDATES</h2>
              <p>We may update this Agreement at any time. Continued use constitutes acceptance.</p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">17. ACCEPTANCE</h2>
              <p>By using the Platform, you confirm you have read, understood, and agreed to this Agreement.</p>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">18. CONTACT</h2>
              <p>Support &amp; Legal Inquiries:</p>
              <p>support@flocktogether.xyz</p>
              <p>Legal Entity:</p>
              <p>Flock Together Global LLC</p>
              <p>30 N Gould St #53789</p>
              <p>Sheridan, WY 82801</p>
              <p>USA</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
