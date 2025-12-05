"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function RefundPolicyPage() {
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
              REFUNDS, CHARGEBACKS & PURCHASES POLICY — FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Refunds, Chargebacks & Purchases Policy ("Policy") governs how payments, fees, digital purchases, creator earnings, and disputes are handled on Flocktogether.xyz (the "Platform") operated by Flock Together Global LLC ("Flock," "we," "our," "us").
              </p>
              <p>This Policy is incorporated into our:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Terms of Service</li>
                <li>Earnings & Monetization Policy</li>
                <li>Acceptable Use Policy</li>
                <li>Community Guidelines</li>
                <li>Privacy Policy</li>
              </ul>
              <p>By using any paid or monetized features of the Platform, you agree to the terms below.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. DIGITAL PLATFORM - NO REFUNDS ON SERVICES ALREADY RENDERED</h2>
              <p>Flock provides access to digital content, digital publishing tools, and ad-based monetization services.</p>
              <p>Because these services are consumed in real time as delivered:</p>
              <p>All earnings, advertising, and platform usage fees are final and non-refundable once services have been rendered.</p>
              <p>This includes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Advertising impressions already delivered</li>
                <li>Content distribution already performed</li>
                <li>Hosting already provided</li>
                <li>Traffic already served</li>
                <li>Bonus programs already executed</li>
                <li>Creator payouts already processed and settled</li>
              </ul>
              <p>Digital services cannot be returned, and Flock does not reverse services consumed.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. CREATOR EARNINGS ARE NOT "PAYMENTS MADE TO FLOCK"</h2>
              <p>Creators earn revenue generated from:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Advertising activity</li>
                <li>Platform automation</li>
                <li>Brand integrations</li>
                <li>Revenue-share frameworks</li>
              </ul>
              <p>This is performance-based digital monetization, not a product "purchase."</p>
              <p>Creators cannot request:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Refunds of their own earnings</li>
                <li>Retroactive adjustments based on market performance</li>
                <li>Credit based on expectations or projections</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. VIEWER PAYMENTS (IF APPLICABLE IN FUTURE)</h2>
              <p>If Flock introduces features such as:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Premium subscriptions</li>
                <li>Pay-per-view content</li>
                <li>Tipping</li>
                <li>Membership tiers</li>
                <li>Creator bundles</li>
              </ul>
              <p>These transactions will be:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Final at the time of purchase</li>
                <li>Non-refundable</li>
                <li>Non-transferable</li>
                <li>Not subject to reversal once content is accessed</li>
              </ul>
              <p>Creators may independently handle disputes with their audiences, but this does not impose obligations on Flock.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. CHARGEBACKS & PAYMENT DISPUTES</h2>
              <p>Chargebacks create financial risk and platform instability.</p>
              <p>Users agree not to initiate chargebacks through banks or payment processors as a substitute for support or appeals.</p>
              <p>If a user or creator initiates a chargeback:</p>

              <h3 className="font-semibold">4.1 Immediate Consequences</h3>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Suspend the account</li>
                <li>Freeze balance payouts</li>
                <li>Reverse associated earnings</li>
                <li>Disable monetization</li>
                <li>Lock access to payout methods</li>
              </ul>

              <h3 className="font-semibold">4.2 Investigation Window</h3>
              <p>Chargeback investigations may take 14–120 days, depending on the processor.</p>

              <h3 className="font-semibold">4.3 Non-Cooperation</h3>
              <p>Failure to respond or provide evidence may result in:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Permanent forfeiture of funds</li>
                <li>Account termination</li>
                <li>Reporting to payment processors</li>
                <li>Legal action</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. INVALID OR FRAUDULENT PAYMENTS</h2>
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stolen cards</li>
                <li>Unauthorized PayPal / Payoneer accounts</li>
                <li>Fake US or offshore bank accounts</li>
                <li>Black-market digital wallets</li>
                <li>Gift card laundering</li>
                <li>Account takeover</li>
              </ul>
              <p>We reserve the right to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reverse payments</li>
                <li>Recover processed funds</li>
                <li>Suspend monetization</li>
                <li>Permanently terminate accounts</li>
                <li>Involve law enforcement</li>
              </ul>
              <p>Creators found participating in fraud lose all earnings and account privileges.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. PLATFORM FEES</h2>
              <p>Where applicable:</p>
              <p>Platform fees, processing fees, hosting surcharges, or ad-network deductions are non-refundable.</p>
              <p>These fees are cost-basis operations (cloud services, moderation, fraud prevention, payout routing).</p>
              <p>Creators agree that fees may change at any time to reflect:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Infrastructure expansion</li>
                <li>Regional risk</li>
                <li>Ad-network shifts</li>
                <li>Payment provider pricing</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. PROCESSOR ERRORS</h2>
              <p>If payments fail due to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stripe outage</li>
                <li>Payoneer flags</li>
                <li>PayPal AML requirements</li>
                <li>Regional banking limitations</li>
                <li>Sanction restrictions</li>
              </ul>
              <p>Flock is not liable for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Delays</li>
                <li>Lost opportunities</li>
                <li>Foreign exchange loss</li>
                <li>Processing suspension</li>
              </ul>
              <p>We will assist, but:</p>
              <p>The payment provider is the sole party responsible for resolving processor-level errors.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. CONTENT REMOVED FOR VIOLATIONS</h2>
              <p>If content is removed for violating:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Community Guidelines</li>
                <li>DMCA Policy</li>
                <li>Acceptable Use Policy</li>
                <li>Monetization Policy</li>
              </ul>
              <p>→ Earnings tied to that content may be forfeited.</p>
              <p>We are not obligated to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pay creators for rule-breaking content</li>
                <li>Pay creators whose traffic was invalidated</li>
                <li>Restore earnings post-account suspension</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. PLATFORM BONUSES & INCENTIVE PROGRAMS</h2>
              <p>Bonuses are discretionary and subject to change.</p>
              <p>They may be:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Modified</li>
                <li>Paused</li>
                <li>Cancelled</li>
                <li>Regionally limited</li>
              </ul>
              <p>Creators acknowledge:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bonuses are not wages</li>
                <li>They are not guaranteed</li>
                <li>They may be revoked due to abuse</li>
                <li>No retroactive claims are honored for expired incentive programs</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. ADVERTISING ADJUSTMENTS & RETROACTIVE RECONCILIATION</h2>
              <p>Ad networks (e.g., Ezoic, Google AdSense) may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reverse invalid traffic</li>
                <li>Adjust ad bids</li>
                <li>Withhold advertiser disputes</li>
                <li>Delay revenue posting</li>
              </ul>
              <p>Creators agree that:</p>
              <p>Post-payment corrections by ad networks may reverse or reduce earnings.</p>
              <p>This includes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Invalid clicks</li>
                <li>Suspicious view patterns</li>
                <li>Programmatic traffic</li>
                <li>Extreme bounce metrics</li>
                <li>Bot anomalies</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. BANS, INVESTIGATIONS, AND WITHHELD BALANCES</h2>
              <p>If your account is banned or under review:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Monetization may be paused</li>
                <li>Existing earnings may be frozen</li>
                <li>Future payouts may be denied</li>
              </ul>
              <p>We may withhold balance for up to:</p>
              <p>180 days, depending on risk severity.</p>
              <p>This aligns with industry merchant standards and AML regulations.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. NO REFUNDS ON TESTING, UI, OR DEVELOPMENT SERVICE PHASES</h2>
              <p>Flock is a live platform.</p>
              <p>Testing, UI rollout, and onboarding constitute completed service delivery.</p>
              <p>Claims such as:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>"I'm still testing"</li>
                <li>"We will sign off later"</li>
                <li>"I need more changes first"</li>
                <li>"The UI isn't emotional enough"</li>
                <li>"I need another dev phase before approval"</li>
              </ul>
              <p>→ Do not constitute grounds for payment delay or refund.</p>
              <p>Once platform access and core deliverables have been provided, Phase 1 is considered complete.</p>
              <p>(This line directly protects you from your current client situation.)</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. MISUSE OF DISPUTE TOOLS</h2>
              <p>Users may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Weaponize refunds</li>
                <li>Use chargebacks as leverage</li>
                <li>Delay payment through "endless testing"</li>
                <li>Escalate on false grounds</li>
                <li>Negotiate post-delivery discounts</li>
              </ul>
              <p>This conduct is considered fraudulent behavior and may result in:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account suspension</li>
                <li>Removal from monetization programs</li>
                <li>Legal recovery of funds</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. APPEALS</h2>
              <p>Creators may appeal financial enforcement decisions once.</p>
              <p>They must provide:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Transaction IDs</li>
                <li>Proof of ownership</li>
                <li>Contextual evidence</li>
              </ul>
              <p>Appeals will be denied if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Evidence is insufficient</li>
                <li>User has prior violations</li>
                <li>Patterns of manipulation exist</li>
              </ul>
              <p>All decisions are final.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. AMENDMENTS</h2>
              <p>We may update this policy at any time.</p>
              <p>Changes become effective upon posting.</p>
            </section>

            {/* Section 16 */}
            <section className="-space-y-1">
              <h2 className="text-3xl font-bold mb-4">16. CONTACT</h2>
              <p>Refunds, disputes, chargeback, payment inquiries:</p>
              <p className="mb-2">admin@flocktogether.xyz</p>
              <p className="font-bold">Legal Entity:</p>
              <p>Flock Together Global LLC</p>
              <p>30 N Gould St #53789</p>
              <p>Sheridan, WY 82801, USA</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
