"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | null;

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
              CREATOR LICENSING & OWNERSHIP AGREEMENT
            </h1>
            <p className="text-sm">Effective Date: Upon Account Creation</p>
            <p className="text-sm">Platform: Flock (flocktogether.xyz)</p>
            <p className="text-sm">Tagline: Create. Connect. Take Flight!</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">
            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Flock Creator Agreement ("Agreement") governs your use of
                the creator features and monetization tools on flocktogether.xyz
                (the "Platform") operated by Flock Together Global LLC ("Flock",
                "we", "us", "our").
              </p>
              <p>
                By creating a creator account, uploading content, or
                participating in the Flock Earnings Program, you ("Creator",
                "you", "your") agree to this Agreement, our Community
                Guidelines, Acceptable Use Policy, DMCA & Copyright Policy,
                Privacy Policy, and all applicable laws.
              </p>
              <p>
                Following the completion of the Beta phase, all eligible creators
                are able to earn from their first day on the Platform, subject to
                this Agreement and all Platform policies.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. DEFINITIONS</h2>
              <p className="font-semibold">1.1 Content</p>
              <p>
                "Content" means any media you upload or publish on the Platform,
                including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Video</li>
                <li>Audio</li>
                <li>Images</li>
                <li>Text, articles, blogs, posts</li>
                <li>AI-generated works</li>
                <li>Livestreams</li>
                <li>Thumbnails</li>
                <li>Titles, captions, descriptions</li>
                <li>Metadata and tags</li>
              </ul>
              <p className="font-semibold">1.2 Creator</p>
              <p>
                A "Creator" is any person or entity who uploads Content to the
                Platform or participates in any monetization or earnings program
                offered by Flock.
              </p>
              <p className="font-semibold">1.3 License</p>
              <p>
                "License" means the legal permission you grant Flock to host,
                store, distribute, display, promote, and monetize your Content so
                that the Platform can function.
              </p>
            </section>

             {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. ELIGIBILITY & ACCOUNT STATUS</h2>
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
              <p>Creators may operate more than one account on Flock, provided that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Each account complies with this Agreement and all policies</li>
                <li>Multiple accounts are not used to evade enforcement, inflate engagement, or
                  manipulate earnings</li>
              </ul>
              <p className="font-semibold">2.3 Account Standing & Monetization</p>
              <p>Flock monetizes posts, not entire accounts. As a general rule:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Individual posts may be demonetized for violations</li>
                <li>Flock does not "blanket demonetize" compliant creators; however,</li>
                <li>Flock may suspend or remove accounts entirely in serious or repeated violation cases
                  (see Section 11)</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. OWNERSHIP OF CONTENT</h2>
              <p className="font-semibold">3.1 You Own Your Original Work</p>
              <p>If you upload original Content, you retain ownership of that Content. Flock does not claim
                full ownership of your work.</p>
              <p className="font-semibold">3.2 Non-Original & Recycled Content</p>
              <p>You may upload "recycled" or previously published Content (e.g., from your own YouTube,
                TikTok, Instagram, etc.) only if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own the Content, and</li>
                <li>You have the rights to re-upload and monetize it on Flock (no exclusivity or platform
                  conflict), and</li>
                <li>It does not violate any third-party copyright, privacy, or platform terms elsewhere</li>
              </ul>
              <p>You are strictly responsible for ensuring you are not violating other platforms' contracts or
                copyrights.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. LICENSE YOU GRANT FLOCK</h2>
              <p className="font-semibold">4.1 License Grant</p>
              <p>Effective immediately upon upload, you grant Flock a:</p>
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
                <li>Host, store, cache, and transcode your Content</li>
                <li>Digitally distribute and publicly display your Content</li>
                <li>Create thumbnails, previews, and clips</li>
                <li>Surface Content in recommendations, feeds, search, and discovery tools</li>
                <li>Promote your Content inside the Platform (and in limited Flock marketing,
                  showcases, and examples)</li>
                <li>Monetize your Content via ads, performance tools, or other revenue systems</li>
                <li>Deliver Content through third-party networks and CDN partners</li>
              </ul>
              <p>This License exists so Flock can operate as a functioning creator platform.</p>
              <p className="font-semibold">4.2 Scope of Use</p>
              <p>You authorize Flock to display your Content:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Globally</li>
                <li>On any Flock product, interface, or future vertical</li>
                <li>Via search, recommendation, and feed algorithms</li>
                <li>Across different devices, regions, and languages as Flock optimizes the experience</li>
              </ul>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Resize, compress, or reformat Content for performance</li>
                <li>Generate automated thumbnails or preview clips</li>
                <li>Temporarily cache or mirror Content via third-party infrastructure</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. CONTENT REMOVAL & DATA</h2>
              <p className="font-semibold">5.1 Deleting Your Content</p>
              <p>You may delete your Content at any time. After deletion:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Earnings already accrued remain valid (subject to audit/fraud checks)</li>
                <li>Flock may retain copies as required for legal, financial, compliance, or investigative
                  reasons</li>
                <li>Aggregated analytics and platform data remain Flock's property</li>
              </ul>
              <p className="font-semibold">5.2 End of Account Relationship</p>
              <p>If you close your account:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You may request deletion of remaining Content (subject to legal and compliance
                  retention needs)</li>
                <li>Backup, archive, and log copies may remain</li>
                <li>Monetization disputes or liabilities (e.g., chargebacks, fraud) can still be enforced</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. NON-ORIGINAL, AI & HIGH-RISK CONTENT</h2>
              <p className="font-semibold">6.1 Non-Original Content — Strict Liability</p>
              <p>You agree that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own or are properly licensed to all Content you upload</li>
                <li>You have the right to grant Flock the License described in Section 4</li>
                <li>Your Content does not violate copyright, publicity, or trademark rights</li>
              </ul>
              <p>Flock is not required to validate licenses before displaying Content. You are solely
                responsible.</p>
              <p className="font-semibold">6.2 AI-Generated Content</p>
              <p>AI-generated Content is permitted only if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own the rights to the AI output</li>
                <li>It does not replicate identifiable individuals without consent</li>
                <li>It does not recreate copyrighted franchises or IP universes without permission</li>
                <li>It is not used for deepfake harassment, fake endorsements, or explicit material
                  involving real people</li>
              </ul>
              <p>Flock may request:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Source files or prompts</li>
                <li>Training/model information</li>
                <li>Proof of rights</li>
              </ul>
              <p>Failure to reasonably demonstrate rights may lead to removal or demonetization.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. COMMUNITY GUIDELINES & PROHIBITED CONTENT</h2>
              <p>Flock's standards are aligned with major global platforms (e.g., YouTube, TikTok) with
                additional emphasis on safety and monetization integrity.</p>
              <p>Creators must not post Content containing:</p>
              <p className="font-semibold">7.1 Safety & Harm</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Violence, threats, or glorification of harm</li>
                <li>Dangerous challenges or harmful acts</li>
                <li>Self-harm or suicide content without a clear, supportive, or educational context</li>
              </ul>
              <p className="font-semibold">7.2 Hate & Harassment</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Hate speech targeting protected groups</li>
                <li>Harassment, bullying, stalking, or doxxing</li>
                <li>Degrading or dehumanizing language</li>
              </ul>
              <p className="font-semibold">7.3 Illegal Activities</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Drugs, weapons, human trafficking</li>
                <li>Fraud, scams, or deceptive schemes</li>
                <li>Any content promoting unlawful acts</li>
              </ul>
              <p className="font-semibold">7.4 Adult Content</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Nudity or explicit sexual acts</li>
                <li>Pornographic material</li>
                <li>Sexual exploitation or minor-related sexual themes</li>
              </ul>
              <p className="font-semibold">7.5 Misinformation</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Harmful health misinformation</li>
                <li>Deliberate hoaxes or fake emergencies</li>
                <li>Manipulated content designed to mislead audiences</li>
              </ul>
              <p className="font-semibold">7.6 Copyright or IP Violations</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Unauthorized use of copyrighted music, videos, images, or text</li>
                <li>Reposts of others' content without permission</li>
                <li>AI or scraped content built on copyrighted assets without rights</li>
              </ul>
              <p>Violating content rules can result in demonetization, removal, and strikes (see Section 11).</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. COPYRIGHT POLICY & STRIKES</h2>
              <p className="font-semibold">8.1 Compliance</p>
              <p>Creators must comply with Flock's DMCA & Copyright Policy. Only upload Content you
                own or are licensed to use.</p>
              <p className="font-semibold">8.2 Copyright Strikes</p>
              <p>A copyright strike may be issued when:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Copyrighted media is used without permission</li>
                <li>Content is reuploaded from other creators or rights holders</li>
              </ul>
              <p>Possible outcomes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content is removed, muted, or partially blocked</li>
                <li>The Creator is notified of the violation</li>
                <li>No payment is made for that post</li>
                <li>In some cases, earnings may be redirected to the original rights holder, where
                  applicable</li>
              </ul>
              <p>Three (3) copyright strikes may result in account termination or monetization removal.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. MONETIZATION RULES & EARNINGS</h2>
              <p className="font-semibold">9.1 Content-Specific Monetization</p>
              <p>Flock monetizes posts, not entire accounts. A post may be demonetized if it:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Violates Community Guidelines or this Agreement</li>
                <li>Violates copyright or legal requirements</li>
                <li>Fails advertiser or brand-safety suitability checks</li>
              </ul>
              <p className="font-semibold">9.2 Revenue Share (Flexible)</p>
              <p>Creators are entitled to a share of revenue generated from eligible monetized Content
                (including ad revenue, membership revenue, brand deals, or other earning streams).</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Flock may set and update Creator revenue share rates over time</li>
                <li>Any publicly announced percentage or bonus for a phase or promotion is not a
                  permanent guarantee</li>
                <li>Revenue share structures may vary by format, region, or program</li>
              </ul>
              <p className="font-semibold">9.3 No Earnings Guarantee</p>
              <p>Flock does not guarantee:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Minimum views, impressions, or engagement</li>
                <li>Minimum earnings or profitability</li>
                <li>That any specific piece of Content will be monetized</li>
              </ul>
              <p>Earnings depend on factors such as traffic quality, advertiser demand, user behavior, and
                compliance review.</p>
              <p className="font-semibold">9.4 Notice & Corrective Action</p>
              <p>If a post violates guidelines or monetization standards:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The Creator will receive a notification where feasible</li>
                <li>Flock may identify the specific rule violated</li>
                <li>The post may be removed, age-restricted, or left up but demonetized</li>
                <li>That post will not qualify for payment in the relevant billing cycle</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. BONUSES & INCENTIVES (BETA PHASES)</h2>
              <p className="font-semibold">10.1 Phase-Based Bonuses</p>
              <p>During Phase 1 (invite-only beta), Flock may offer bonuses to select Creators, such as:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Performance bonuses</li>
                <li>Engagement bonuses</li>
                <li>Early Creator or founding bonuses</li>
                <li>Featured Content bonuses</li>
              </ul>
              <p>Written content may or may not qualify for bonuses, depending on the active program.
                Details will be communicated separately and do not guarantee ongoing bonus programs.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. PAYMENT SCHEDULE, METHODS & TAXES</h2>
              <p className="font-semibold">11.1 Net 30 Payments</p>
              <p>Flock operates on a Net 30 payment model. For example:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Earnings generated in January → payable end of February</li>
                <li>Earnings generated in February → payable end of March</li>
              </ul>
              <p className="font-semibold">11.2 Payment Methods</p>
              <p>Creators may be paid via third-party processors such as:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stripe</li>
                <li>Payoneer</li>
                <li>PayPal</li>
                <li>Other approved payout partners</li>
              </ul>
              <p>All processing/transfer fees, currency conversion, or hold policies are controlled by the
                payment provider, not Flock.</p>
              <p className="font-semibold">11.3 Verification & Holds</p>
              <p>Flock may hold or delay payouts if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>There are potential fraud signals</li>
                <li>There is a copyright or ownership dispute</li>
                <li>Identity, tax, or KYC information is incomplete or inconsistent</li>
              </ul>
              <p className="font-semibold">11.4 Taxes</p>
              <p>Creators are responsible for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Providing accurate tax information</li>
                <li>Reporting income in their jurisdiction</li>
                <li>Complying with all applicable tax laws</li>
              </ul>
              <p>Flock may withhold taxes where required by law.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. BETA LAUNCH PHASES</h2>
              <p className="font-semibold">12.1 Phase 1 – Invite-Only Beta</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Limited group of creators</li>
                <li>Focus on testing systems, payments, and discovery</li>
                <li>Monetization and bonuses available only to invited Creators</li>
              </ul>
              <p className="font-semibold">12.2 Phase 2 – Limited Public Access</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Open to the public with limited admissions per month</li>
                <li>Monetization enabled for approved Creators</li>
                <li>Ongoing product and policy adjustments</li>
              </ul>
              <p className="font-semibold">12.3 Full Public Launch</p>
              <p>After a 6–12 month phased rollout, Flock may open to broader global participation. Terms
                and eligibility may change as the platform matures.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. VIOLATIONS, ENFORCEMENT & ACCOUNT REMOVAL</h2>
              <p className="font-semibold">13.1 Strike System</p>
              <p>Creators may receive strikes for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Serious guideline violations</li>
                <li>Repeated harmful behavior</li>
                <li>Copyright infringement</li>
              </ul>
              <p>After three (3) strikes, where:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The Creator has been notified, and</li>
                <li>Has had a reasonable chance to correct behavior, but</li>
                <li>Continues to violate policies</li>
              </ul>
              <p>Flock may remove the account, limit features, or terminate monetization.</p>
              <p className="font-semibold">13.2 No Full-Account Demonetization (General Rule)</p>
              <p>Flock's model is post-based monetization. As a general policy:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Individual posts are demonetized, not entire accounts</li>
                <li>In severe or systemic abuse cases, Flock may restrict monetization at the account level
                  where necessary to protect the Platform</li>
              </ul>
              <p className="font-semibold">13.3 Appeals</p>
              <p>Creators may appeal:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Guideline enforcements</li>
                <li>Copyright removals (in addition to DMCA Counter-Notice processes)</li>
                <li>Monetization decisions</li>
              </ul>
              <p>Appeals must typically be submitted within 7 days of notice. Flock's decisions on appeals are
                final.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. RELATIONSHIP & BRAND USE</h2>
              <p className="font-semibold">14.1 No Employment or Partnership</p>
              <p>This Agreement does not create:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Employment</li>
                <li>Agency</li>
                <li>Partnership</li>
                <li>Franchise</li>
                <li>Joint venture</li>
              </ul>
              <p>You remain an independent digital publisher.</p>
              <p className="font-semibold">14.2 Flock's Use of Your Brand Elements</p>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Display your username, display name, or profile image</li>
                <li>Show previews of your Content in recommendations and marketing showcases</li>
                <li>Use anonymized data and statistics for internal or external reporting</li>
              </ul>
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use Flock's name, logo, or marks in a misleading way</li>
                <li>Claim official partnership or endorsement unless formally contracted</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. INDEMNIFICATION & LIABILITY</h2>
              <p className="font-semibold">15.1 Your Indemnification</p>
              <p>You agree to indemnify and hold Flock harmless from claims, damages, or expenses arising
                from:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Copyright or IP disputes</li>
                <li>Privacy and publicity rights violations</li>
                <li>Misleading or unlawful Content</li>
                <li>Government inquiries or fines related to your activities</li>
                <li>Breach of this Agreement or Platform policies</li>
              </ul>
              <p>This indemnity survives account closure and Content deletion.</p>
              <p className="font-semibold">15.2 Limitation of Liability</p>
              <p>To the maximum extent permitted by law:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Flock is not liable for lost profits, data, or indirect damages</li>
                <li>Flock is not responsible for disputes between Creators, rights holders, brands, or
                  viewers</li>
              </ul>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">16. UPDATES TO THIS AGREEMENT</h2>
              <p>We may update this Agreement from time to time as the Platform evolves, including when
                laws or safety standards change.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Material changes will be posted on the Platform and may be communicated by notice
                  or email</li>
                <li>Continued use of the Platform or upload of Content after updates constitutes your
                  acceptance of the revised Agreement</li>
              </ul>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">17. ACCEPTANCE</h2>
              <p>By creating a Flock account, uploading Content, or participating in monetization, you:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Confirm you have read and understood this Agreement</li>
                <li>Agree to comply with all Flock policies</li>
                <li>Acknowledge that monetization is conditional on ongoing compliance</li>
              </ul>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">18. CONTACT</h2>
              <p>For Creator program, licensing, or agreement questions, contact:</p>
              <p className="font-semibold">Support:</p>
              <p>support@flocktogether.xyz</p>
              <p className="font-semibold">Legal & Licensing Inquiries:</p>
              <p>support@flocktogether.xyz</p>
              <p className="font-semibold">Legal Address:</p>
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
