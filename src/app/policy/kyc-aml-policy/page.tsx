"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function KycAmlPolicyPage() {
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
              Join the Flock
            </Link>
          </div>
        </div>
      </header>

      {/* Centered White Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto py-4 md:py-6 px-6">
        <div className="bg-white/95 rounded-3xl shadow-xl px-6 py-8 md:px-10 md:py-10 theme-text-primary">
          
          {/* Header */}
          <header className="space-y-3 mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              KYC / AML / PAYMENT INTEGRITY POLICY — FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                This KYC / AML / Payment Integrity Policy ("Policy") governs how Flock Together Global LLC ("Flock," "we," "us," "our") verifies identity, prevents fraud, combats money laundering, and ensures payment legitimacy on 
                <a
                  href="https://flocktogether.xyz"
                  className="text-blue-600 underline ml-1"
                >
                  https://flocktogether.xyz
                </a> (the "Platform").
              </p>
              <p>This Policy is incorporated into:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Terms of Service</li>
                <li>Monetization Policy</li>
                <li>Privacy Policy</li>
                <li>Acceptable Use Policy</li>
                <li>Refunds & Chargebacks Policy</li>
              </ul>
              <p>By using our monetization features, payouts, or digital earnings tools, you agree to comply with this Policy.</p>
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
              <p>We follow FATF, FinCEN, KYC, and AML best practices.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. KYC REQUIREMENTS</h2>
              <h3 className="font-semibold">2.1 Creators must verify their identity before withdrawing funds.</h3>
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
              <p>Failure to comply may result in withholding or forfeiture of earnings.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. MINIMUM AGE</h2>
              <p>To monetize:</p>
              <p>Creators must be 18+.</p>
              <p>Minors may upload content, but monetization requires:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Legally documented parent/guardian pathway</li>
                <li>Verified adult-controlled payout account</li>
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
              <p>Creators agree to comply with their terms.</p>
              <p>If a processor requests KYC:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Flock is not liable for delays</li>
                <li>Verification is between user and provider</li>
                <li>Refusal may lead to payout suspension</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. PROHIBITED COUNTRIES & SANCTIONS</h2>
              <p>We comply with:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>US OFAC Sanctions</li>
                <li>EU/UK sanctions lists</li>
                <li>FATF blacklists</li>
                <li>Canadian and Australian AML controls</li>
              </ul>
              <p>Users from restricted jurisdictions may be:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Denied monetization</li>
                <li>Payout locked</li>
                <li>Accounts suspended</li>
              </ul>
              <p>We may block:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Certain IP ranges</li>
                <li>Suspicious networks</li>
                <li>VPN-based masking</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. MULTIPLE ACCOUNTS</h2>
              <p>Creators may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Operate multiple earning accounts</li>
                <li>Split earnings between accounts</li>
                <li>Create "farm" networks</li>
              </ul>
              <p>We reserve the right to merge, close or ban accounts used to evade detection.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. FRAUD & ABUSE INDICATORS</h2>
              <p>We monitor:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Rapid earnings spikes</li>
                <li>Unusual traffic origins</li>
                <li>VPN activity</li>
                <li>Proxy server monetization</li>
                <li>Click fraud</li>
                <li>Purchased views or bots</li>
                <li>Coordinated artificial engagement</li>
              </ul>
              <p>If flagged:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Monetization may be paused</li>
                <li>Payouts frozen pending review</li>
                <li>Revenue voided</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. MONETIZATION LAUNDERING</h2>
              <p className="font-bold">Prohibited:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Using Flock to move money between individuals</li>
                <li>Using ads as a disguised payment mechanism</li>
                <li>Self-purchased traffic</li>
                <li>Content "washing" through private networks</li>
              </ul>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Suspend accounts</li>
                <li>Notify financial partners</li>
                <li>Notify law enforcement</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. PAYMENT REVERSALS & CHARGEBACKS</h2>
              <p>If a user or creator files chargebacks:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account may be frozen</li>
                <li>Revenue voided</li>
                <li>Monetization disabled</li>
                <li>Permanent ban enforced</li>
              </ul>
              <p>We treat chargebacks as high-risk fraud behavior.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. THIRD-PARTY OWNERSHIP</h2>
              <p>Creators may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Operate accounts for banned individuals</li>
                <li>Cash out earnings for others</li>
                <li>Use nominee or proxy accounts</li>
                <li>Sell or rent payout access</li>
              </ul>
              <p>This behavior is grounds for termination.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. CRYPTOCURRENCY</h2>
              <p>At this time:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Flock does not accept cryptocurrency payouts</li>
                <li>Flock does not facilitate wallet earnings</li>
              </ul>
              <p>This may be introduced in future phases under strict AML compliance.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">13. AI-ASSISTED FRAUD</h2>
              <p>We monitor:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>AI engagement bots</li>
                <li>Auto-comment spam</li>
                <li>Automated "watch farms"</li>
                <li>Mass AI-generated uploads to harvest ads</li>
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
              <p>If name mismatch occurs:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We may request additional documents</li>
                <li>We may refuse payout</li>
                <li>Monetization may be permanently disabled</li>
              </ul>
              <p>Examples triggering review:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Celebrity name ≠ legal ID</li>
                <li>Business account ≠ creator identity</li>
                <li>Rapid change of beneficiary name</li>
                <li>Offshore payments for local creators</li>
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
                <li>Source of funds explanation</li>
              </ul>
              <p>Non-cooperation may suspend monetization until resolved.</p>
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
              <p>Balances may be withheld up to 180 days.</p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">17. TERMINATION CONSEQUENCES</h2>
              <p>If policy is violated:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Earnings may be voided</li>
                <li>Monetization disabled</li>
                <li>Account permanently banned</li>
                <li>Authorities notified</li>
              </ul>
              <p>Creators whose earnings arise from fraudulent or illegal activity forfeit all balances.</p>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">18. AUDIT RIGHTS</h2>
              <p>Flock reserves the right to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Audit accounts</li>
                <li>Review monetization events</li>
                <li>Inspect traffic sources</li>
                <li>Verify payout identity</li>
              </ul>
              <p>Creators must cooperate or be removed.</p>
            </section>

            {/* Section 19 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">19. PRIVACY</h2>
              <p>Data collected under KYC/AML is:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stored securely</li>
                <li>Used only for verification and compliance</li>
                <li>Shared with processors when required</li>
              </ul>
              <p>We do not sell user identity data.</p>
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
                <li>Account IDs</li>
                <li>IP logs</li>
                <li>Traffic analysis</li>
                <li>Payout history</li>
                <li>Fraud records</li>
              </ul>
            </section>

            {/* Section 21 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">21. POLICY UPDATES</h2>
              <p>We may update this Policy at any time.</p>
              <p>Continued use of monetization = acceptance.</p>
            </section>

            {/* Section 22 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">22. CONTACT</h2>
              <p>For identity and payout verification:</p>
              <p>Email: admin@flocktogether.xyz</p>
              <p>Legal: admin@flocktogether.xyz</p>
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
