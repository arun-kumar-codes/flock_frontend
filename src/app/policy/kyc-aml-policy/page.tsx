"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | "ADMIN" | null;

export default function KycAmlPolicyPage() {
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
              KYC / AML / PAYMENT INTEGRITY POLICY - FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 9, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">
            {/* Intro */}
            <section className="space-y-4">
              <p>
                This KYC / AML / Payment Integrity Policy ("Policy") governs how
                Flock Together Global LLC ("Flock," "we," "us," "our") verifies
                identity, prevents fraud, combats money laundering, and ensures
                payment legitimacy on{" "}
                <a
                  href="https://flocktogether.xyz"
                  className="text-blue-600 underline ml-1"
                >
                  https://flocktogether.xyz
                </a>{" "}
                (the "Platform").
              </p>
              <p>This Policy is incorporated into and forms part of:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Terms of Service</li>
                <li>Creator Agreement / Monetization Policy</li>
                <li>Privacy Policy</li>
                <li>Acceptable Use Policy</li>
                <li>Refunds & Chargebacks Policy</li>
              </ul>
              <p>
                By using our monetization features, payouts, or digital earnings
                tools, you agree to comply with this Policy.
              </p>
              <p>
                Following the completion of the Beta phase, all eligible creators
                are able to earn from their first day on the Platform, subject to
                successful identity verification, KYC/AML checks, and this Policy.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. PURPOSE</h2>
              <p>This Policy protects:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Creators</li>
                <li>Users</li>
                <li>Advertisers</li>
                <li>Payment processors</li>
                <li>The platform itself</li>
              </ul>
              <p>Our goals are to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Prevent fraudulent earnings</li>
                <li>Stop monetization laundering</li>
                <li>Verify payout identities</li>
                <li>Comply with international anti-money laundering laws</li>
                <li>Reduce regulatory exposure</li>
              </ul>
              <p>We follow FATF, FinCEN, KYC, and AML best practices where applicable.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. KYC REQUIREMENTS</h2>
              <h3 className="font-semibold">2.1 Identity Verification</h3>
              <p>Creators must verify their identity before withdrawing funds.</p>
              <p>Verification may include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Government-issued ID</li>
                <li>Passport or National ID</li>
                <li>Banking statement</li>
                <li>Phone verification</li>
                <li>Email verification</li>
                <li>Selfie or video match</li>
              </ul>
              <p>Flock reserves the right to request:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Additional documentation</li>
                <li>Proof of residency</li>
                <li>Tax documents</li>
                <li>Beneficial ownership information</li>
              </ul>
              <p>
                Failure to comply may result in withholding, delaying, or forfeiture
                of earnings, and/or suspension of monetization.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. MINIMUM AGE</h2>
              <p>To monetize:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Creators must be 18+ (or the age of majority in their jurisdiction).</li>
              </ul>
              <p>Minors may upload content, but monetization requires:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>A legally documented parent/guardian pathway</li>
                <li>A verified adult-controlled payout account</li>
              </ul>
              <p>We do not pay directly to underage individuals.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. ACCOUNT MATCHING</h2>
              <p>All payout accounts must match:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Legal name</li>
                <li>Government identity</li>
                <li>Banking profile</li>
              </ul>
              <p>We may deny payout if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Names do not match</li>
                <li>Accounts appear to be shared or rented</li>
                <li>Proxy ownership is detected</li>
              </ul>
              <p>Creators may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sell earnings pipelines</li>
                <li>Lease payout channels</li>
                <li>Operate monetization for banned users</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. PAYMENT PROCESSOR VERIFICATION</h2>
              <p>We partner with:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Payoneer</li>
                <li>PayPal</li>
                <li>Stripe</li>
                <li>Other approved regional financial services</li>
              </ul>
              <p>Creators agree to comply with each provider's terms.</p>
              <p>If a processor requests KYC:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Flock is not liable for delays</li>
                <li>Verification is between Creator and provider</li>
                <li>Refusal or failure may lead to payout suspension or account review</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. PROHIBITED COUNTRIES & SANCTIONS</h2>
              <p>We comply with:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>US OFAC sanctions</li>
                <li>EU/UK sanctions lists</li>
                <li>FATF blacklists</li>
                <li>Canadian and Australian AML controls</li>
              </ul>
              <p>Users from restricted jurisdictions may be:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Denied monetization</li>
                <li>Have payout locked</li>
                <li>Have accounts suspended</li>
              </ul>
              <p>We may block:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Certain IP ranges</li>
                <li>Suspicious networks</li>
                <li>VPN-based masking where it indicates risk</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. MULTIPLE ACCOUNTS</h2>
              <p>Flock allows Creators to maintain more than one content account, provided all accounts:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Are linked to the same verified identity</li>
                <li>Comply with this Policy and all Platform rules</li>
              </ul>
              <p>Creators may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Operate multiple earning accounts under different identities to hide ownership</li>
                <li>Split or route earnings between accounts to obscure who is getting paid</li>
                <li>Create "farm" networks for artificial engagement or monetization abuse</li>
              </ul>
              <p>
                We reserve the right to merge, restrict, close, or ban accounts used to evade detection,
                enforcement, or KYC/AML controls.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. FRAUD & ABUSE INDICATORS</h2>
              <p>We monitor, directly or via partners:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Rapid earnings spikes</li>
                <li>Unusual traffic origins</li>
                <li>VPN or proxy-heavy activity</li>
                <li>Click fraud</li>
                <li>Purchased views or bots</li>
                <li>Coordinated artificial engagement</li>
                <li>Suspicious referral or affiliate patterns</li>
              </ul>
              <p>If flagged:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Monetization may be paused</li>
                <li>Payouts may be frozen pending review</li>
                <li>Revenue may be voided where fraud is confirmed</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. MONETIZATION LAUNDERING</h2>
              <p>Prohibited:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Using Flock to move money between individuals</li>
                <li>Using ads as a disguised payment mechanism</li>
                <li>Self-purchased traffic</li>
                <li>"Content washing" through private or closed networks</li>
              </ul>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Suspend or permanently ban accounts</li>
                <li>Notify financial partners and payment processors</li>
                <li>Notify law enforcement or regulators where required</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. PAYMENT REVERSALS & CHARGEBACKS</h2>
              <p>If a user or creator files repeated or suspicious chargebacks or payment disputes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Accounts may be frozen</li>
                <li>Revenue may be voided</li>
                <li>Monetization may be disabled</li>
                <li>A permanent ban may be enforced in severe or persistent cases</li>
              </ul>
              <p>
                We treat chargebacks as a high-risk fraud signal, especially when patterns indicate abuse.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. THIRD-PARTY OWNERSHIP</h2>
              <p>Creators may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Operate accounts for banned individuals</li>
                <li>Cash out earnings on behalf of third parties as a "pass-through"</li>
                <li>Use nominee or proxy accounts</li>
                <li>Sell or rent payout access</li>
              </ul>
              <p>This behavior is grounds for immediate termination and forfeiture of earnings.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. CRYPTOCURRENCY</h2>
              <p>At this time:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Flock does not accept cryptocurrency payouts</li>
                <li>Flock does not facilitate wallet-based earnings</li>
              </ul>
              <p>
                Crypto-related features may be introduced in future phases subject to strict KYC/AML and
                regulatory compliance.
              </p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">13. AI-ASSISTED FRAUD</h2>
              <p>We monitor:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>AI engagement bots</li>
                <li>Auto-comment spam</li>
                <li>Automated "watch farms"</li>
                <li>Mass AI-generated uploads whose primary purpose is to harvest ad revenue</li>
              </ul>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Deny monetization</li>
                <li>Freeze earnings</li>
                <li>Close accounts</li>
                <li>Ban device identifiers</li>
              </ul>
              <p>Earnings derived from fraud are permanently forfeited.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">14. IDENTITY MISMATCHES</h2>
              <p>If name or identity mismatches occur:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We may request additional documents</li>
                <li>We may refuse payout</li>
                <li>Monetization may be temporarily or permanently disabled</li>
              </ul>
              <p>Examples triggering review:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Celebrity or fake names that do not match legal ID</li>
                <li>Business names that do not match the registered creator or owner</li>
                <li>Rapid or unexplained change of payout beneficiary</li>
                <li>Offshore payments for creators whose activity appears local only</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">15. REQUESTS FOR INFORMATION</h2>
              <p>We may ask for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Legal name</li>
                <li>Address</li>
                <li>Birth date</li>
                <li>Banking details</li>
                <li>Tax records</li>
                <li>Proof of residency</li>
                <li>Phone verification</li>
                <li>"Source of funds" or "source of traffic" explanation</li>
              </ul>
              <p>Non-cooperation may suspend monetization and payouts until the issue is resolved.</p>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">16. FUND FREEZES</h2>
              <p>We may freeze balances:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>During disputes</li>
                <li>When fraud is detected</li>
                <li>Pending copyright challenges</li>
                <li>For AML risk assessments</li>
                <li>If sanctions are suspected</li>
              </ul>
              <p>
                Balances may be withheld for up to 180 days, or longer if required by law, the payment
                provider, or law enforcement.
              </p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">17. TERMINATION CONSEQUENCES</h2>
              <p>If this Policy is violated:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Earnings may be voided</li>
                <li>Monetization may be disabled</li>
                <li>Account(s) may be permanently banned</li>
                <li>Relevant authorities or partners may be notified</li>
              </ul>
              <p>
                Creators whose earnings arise from fraudulent, abusive, or illegal activity forfeit all balances
                related to that activity.
              </p>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">18. AUDIT RIGHTS</h2>
              <p>Flock reserves the right to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Audit accounts</li>
                <li>Review monetization events</li>
                <li>Inspect traffic sources</li>
                <li>Verify payout identity and ownership</li>
              </ul>
              <p>Creators must cooperate in good faith or risk suspension or removal.</p>
            </section>

            {/* Section 19 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">19. PRIVACY</h2>
              <p>Data collected under KYC/AML is:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stored securely</li>
                <li>Used only for verification, compliance, and fraud prevention</li>
                <li>Shared with payment processors or partners when required for compliance</li>
              </ul>
              <p>We do not sell identity or KYC data.</p>
            </section>

            {/* Section 20 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">20. REGULATORY COOPERATION</h2>
              <p>We may cooperate with:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Tax authorities</li>
                <li>Police and cybercrime units</li>
                <li>Regulatory agencies</li>
                <li>Financial intelligence units</li>
              </ul>
              <p>We may disclose:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account IDs and basic profile data</li>
                <li>IP logs and device identifiers</li>
                <li>Traffic and monetization analysis</li>
                <li>Payout history</li>
                <li>Confirmed fraud records</li>
              </ul>
            </section>

            {/* Section 21 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">21. POLICY UPDATES</h2>
              <p>We may update this Policy at any time.</p>
              <p>
                Continued use of monetization features and payout tools constitutes acceptance of the updated
                Policy.
              </p>
            </section>

            {/* Section 22 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">22. CONTACT</h2>
              <p>For identity, verification, or payout-related questions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Support: support@flocktogether.xyz</li>
              </ul>
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
