"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | "ADMIN" | null;

export default function MonetizationPolicyPage() {
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
              EARNINGS &amp; MONETIZATION POLICY - FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 9, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">
            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Earnings &amp; Monetization Policy (&quot;Policy&quot;) explains how creators earn money through the
                Flock Together Global LLC platform (&quot;Flock,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By using Flock&apos;s
                monetization features, you agree that this Policy forms a binding part of the Creator
                Agreement.
              </p>
              <p>
                This Policy applies to all creators and governs eligibility, revenue calculation, allocation, payout
                processes, responsibilities, and requirements related to monetization.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. DEFINITIONS</h2>
              <p className="font-semibold">1.1 Creator</p>
              <p>Any individual or entity that posts or distributes content on Flock.</p>

              <p className="font-semibold">1.2 Creator Account</p>
              <p>
                An account registered for uploading content or receiving earnings. Creators may operate
                multiple accounts provided they comply with all verification, enforcement, and platform rules.
              </p>

              <p className="font-semibold">1.3 Content</p>
              <p>
                Written posts, videos, images, audio, or other media uploaded by creators, including recycled
                content for which the creator holds valid monetization rights.
              </p>

              <p className="font-semibold">1.4 Monetizable Content</p>
              <p>
                Content that is eligible to generate revenue under Flock&apos;s monetization systems.
              </p>

              <p className="font-semibold">1.5 Earnings</p>
              <p>
                Revenue generated through monetization features, including advertising, tips, bonuses, or
                incentives.
              </p>

              <p className="font-semibold">1.6 Gross Revenue</p>
              <p>Total revenue generated before deductions.</p>

              <p className="font-semibold">1.7 Net Revenue</p>
              <p>
                Gross Revenue minus applicable fees, adjustments, taxes, refunds, or chargebacks.
              </p>

              <p className="font-semibold">1.8 Payment Provider</p>
              <p>Stripe, PayPal, Payoneer, or any other approved third-party payout processor.</p>

              <p className="font-semibold">1.9 Engagement Metrics</p>
              <p>Metrics including views, likes, clicks, watch time, comments, or other user interactions.</p>

              <p className="font-semibold">1.10 Ineligible Earnings</p>
              <p>Revenue derived from invalid traffic, fraud, policy violations, or non-compliant content.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. ELIGIBILITY FOR MONETIZATION</h2>
              <p className="font-semibold">2.1</p>
              <p>Creators must comply with all Flock policies and applicable laws.</p>
              <p className="font-semibold">2.2</p>
              <p>
                Creators may operate multiple accounts but may not use them to evade penalties, verification
                requirements, or restrictions.
              </p>
              <p className="font-semibold">2.3</p>
              <p>Identity verification may be required before payouts or continued monetization access.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. PAYMENT PROVIDERS</h2>
              <p className="font-semibold">3.1</p>
              <p>Payouts are issued through approved payment providers such as Stripe, PayPal, or Payoneer.</p>
              <p className="font-semibold">3.2</p>
              <p>Creators are responsible for ensuring payout information is accurate and current.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. TAXES AND REPORTING</h2>
              <p className="font-semibold">4.1</p>
              <p>Creators are solely responsible for reporting earnings to relevant tax authorities.</p>
              <p className="font-semibold">4.2</p>
              <p>Flock may request tax documentation, including but not limited to W-9 or W-8BEN forms.</p>
              <p className="font-semibold">4.3</p>
              <p>Earnings may be withheld until required tax documentation is completed and approved.</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. CONTENT ELIGIBLE FOR EARNINGS</h2>
              <p className="font-semibold">5.1</p>
              <p>All content must comply with Flock policies and applicable laws.</p>
              <p className="font-semibold">5.2</p>
              <p>Recycled content is permitted only where the creator owns or has lawful rights to monetize it.</p>
              <p className="font-semibold">5.3</p>
              <p>
                Content that violates copyright law, DMCA requirements, or Community Guidelines is not
                eligible for earnings.
              </p>
              <p className="font-semibold">5.4</p>
              <p>Earnings associated with deleted or removed content may be reversed.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. START OF EARNINGS</h2>
              <p className="font-semibold">6.1</p>
              <p>
                Creators earn from Day One following the Beta phase. There are no follower, view count, or
                watch-time thresholds.
              </p>
              <p className="font-semibold">6.2</p>
              <p>Monetizable Content may begin generating earnings once posted and approved.</p>
              <p className="font-semibold">6.3</p>
              <p>
                Actual earnings vary based on engagement levels, advertiser demand, and overall platform
                performance.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. EARNINGS ALLOCATION &amp; TIMING</h2>
              <p className="font-semibold">7.1 Earnings Accrual</p>
              <p>
                Earnings accrue only from Monetizable Content and only after all eligibility requirements are
                met.
              </p>

              <p className="font-semibold">7.2 Verification Period</p>
              <p>All earnings are subject to internal security, risk, and fraud reviews.</p>
              <p>Flock may delay or hold earnings for 14–90 days if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The account is new or classified as high-risk</li>
                <li>Traffic or engagement appears abnormal</li>
                <li>Content is flagged or under review</li>
                <li>Identity verification is incomplete</li>
                <li>Disputes or chargebacks exist</li>
                <li>Compliance checks are pending</li>
              </ul>

              <p className="font-semibold">7.3 Conditional Release of Earnings</p>
              <p>Earnings may be:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Delayed</li>
                <li>Adjusted</li>
                <li>Frozen</li>
                <li>Reversed</li>
                <li>Forfeited in cases of serious policy violations</li>
              </ul>

              <p className="font-semibold">7.4 No Guaranteed Timing</p>
              <p>Payout timing depends on verification status, risk assessment, and third-party payment
                providers.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. NO GUARANTEE OF EARNINGS</h2>
              <p className="font-semibold">8.1</p>
              <p>Flock does not guarantee minimum earnings or performance.</p>
              <p className="font-semibold">8.2</p>
              <p>
                Revenue depends on factors outside Flock&apos;s control, including advertiser demand, market
                conditions, and audience behavior.
              </p>
              <p className="font-semibold">8.3</p>
              <p>Flock is not responsible for financial losses related to content performance.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. INELIGIBLE OR REVERSED EARNINGS</h2>
              <p className="font-semibold">9.1</p>
              <p>Earnings may be reversed if generated from:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Invalid or purchased traffic</li>
                <li>Automated or artificial engagement</li>
                <li>Copyright or IP violations</li>
                <li>Fraudulent or deceptive behavior</li>
                <li>Policy-violating content</li>
                <li>Suspended or terminated accounts</li>
              </ul>
              <p className="font-semibold">9.2</p>
              <p>Ineligible earnings will not be paid out.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. EARNINGS PAYOUT SCHEDULE</h2>
              <p className="font-semibold">10.1 Standard Payout Cycle (Net 30)</p>
              <p>
                Eligible earnings are generally processed within 30 days after the end of each month, subject
                to verification, risk review, or payment provider delays.
              </p>
              <p className="font-semibold">10.2 Minimum Payout Thresholds</p>
              <p>Minimum payout thresholds vary by payment provider and currency.</p>
              <p className="font-semibold">10.3 Reasons for Payout Delays</p>
              <p>Payouts may be delayed due to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pending verification</li>
                <li>Fraud or risk reviews</li>
                <li>Abnormal traffic patterns</li>
                <li>Payment provider processing delays</li>
                <li>Compliance checks</li>
                <li>System maintenance</li>
              </ul>
              <p className="font-semibold">10.4 Payment Provider Dependency</p>
              <p>Processing times vary by provider and region.</p>
              <p className="font-semibold">10.5 No Guaranteed Delivery Date</p>
              <p>While Flock aims for Net 30 payouts, specific payout dates are not guaranteed.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. VERIFICATION REQUIREMENTS (KYC / AML)</h2>
              <p className="font-semibold">11.1</p>
              <p>Creators may be required to verify their identity at any time.</p>
              <p className="font-semibold">11.2</p>
              <p>
                Verification may require government-issued ID, proof of address, tax documentation, or
                payment method confirmation.
              </p>
              <p className="font-semibold">11.3</p>
              <p>Failure to complete verification may result in suspended monetization and frozen earnings.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. ACCOUNT TERMINATION &amp; FORFEITURE</h2>
              <p className="font-semibold">12.1</p>
              <p>Earnings may be withheld or forfeited if a creator:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Violates platform policies</li>
                <li>Engages in fraud or manipulation</li>
                <li>Uses multiple accounts to bypass rules</li>
                <li>Refuses verification</li>
                <li>Poses a security, legal, or compliance risk</li>
              </ul>
              <p className="font-semibold">12.2</p>
              <p>Terminated accounts may permanently lose access to unpaid earnings.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. DISPUTES OVER EARNINGS</h2>
              <p className="font-semibold">13.1</p>
              <p>Creators may dispute earnings by contacting support@flocktogether.xyz.</p>
              <p className="font-semibold">13.2</p>
              <p>Disputes must include relevant supporting evidence.</p>
              <p className="font-semibold">13.3</p>
              <p>Flock may confirm, adjust, or deny claims following review.</p>
              <p className="font-semibold">13.4</p>
              <p>Flock is not obligated to pay disputed earnings without sufficient evidence.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. PLATFORM BONUSES &amp; INCENTIVE PROGRAMS</h2>
              <p className="font-semibold">14.1</p>
              <p>Flock may offer bonuses, rewards, or incentive programs at its discretion.</p>
              <p className="font-semibold">14.2</p>
              <p>Such programs may be modified, paused, or terminated at any time.</p>
              <p className="font-semibold">14.3</p>
              <p>Fraudulent participation voids bonuses and may result in account termination.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. CREATOR RESPONSIBILITY</h2>
              <p className="font-semibold">15.1</p>
              <p>Creators are responsible for ensuring their content is lawful and compliant.</p>
              <p className="font-semibold">15.2</p>
              <p>Sponsored or paid content must comply with applicable disclosure laws.</p>
              <p className="font-semibold">15.3</p>
              <p>Creators are responsible for claims, representations, and endorsements made in their content.</p>
              <p className="font-semibold">15.4</p>
              <p>Creators must cooperate with audits, investigations, or compliance reviews.</p>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">16. OUR RIGHT TO AUDIT</h2>
              <p className="font-semibold">16.1</p>
              <p>Flock may audit creator activity, including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Traffic sources</li>
                <li>Earnings validity</li>
                <li>Payout activity</li>
                <li>Complaints or disputes</li>
                <li>Verification documentation</li>
              </ul>
              <p className="font-semibold">16.2</p>
              <p>Failure to cooperate may result in suspension or forfeiture of earnings.</p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">17. APPEALS</h2>
              <p className="font-semibold">17.1</p>
              <p>Creators may appeal monetization decisions by contacting support@flocktogether.xyz.</p>
              <p className="font-semibold">17.2</p>
              <p>Appeals must include relevant evidence.</p>
              <p className="font-semibold">17.3</p>
              <p>Certain decisions may be final, particularly in cases involving fraud or repeated violations.</p>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">18. BRAND SPONSORSHIPS &amp; EXTERNAL DEALS</h2>
              <p className="font-semibold">18.1</p>
              <p>Creators may enter into external sponsorships or partnerships.</p>
              <p className="font-semibold">18.2</p>
              <p>Sponsored content must include all legally required disclosures.</p>
              <p className="font-semibold">18.3</p>
              <p>Flock may remove sponsored content that is misleading or violates platform policies.</p>
              <p className="font-semibold">18.4</p>
              <p>Creators are solely responsible for obligations arising from external agreements.</p>
            </section>

            {/* Section 19 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">19. NO EMPLOYMENT RELATIONSHIP</h2>
              <p className="font-semibold">19.1</p>
              <p>Participation in monetization does not create an employment, contractor, or partnership
                relationship.</p>
              <p className="font-semibold">19.2</p>
              <p>Creators are responsible for their own taxes, insurance, and financial obligations.</p>
            </section>

            {/* Section 20 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">20. CHANGES TO THIS POLICY</h2>
              <p className="font-semibold">20.1</p>
              <p>Flock may update this Policy at any time.</p>
              <p className="font-semibold">20.2</p>
              <p>Notice may be provided via email, dashboard notifications, or updated policy pages.</p>
              <p className="font-semibold">20.3</p>
              <p>Continued use of monetization features constitutes acceptance of the updated Policy.</p>
            </section>

            {/* Section 21 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">21. CONTACT INFORMATION</h2>
              <p>Flock Together Global LLC</p>
              <p>Email: support@flocktogether.xyz</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
