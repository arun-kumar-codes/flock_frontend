"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function MonetizationPolicyPage() {
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
EARNINGS & MONETIZATION POLICY — FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Earnings & Monetization Policy ("Policy") governs how creators earn revenue on Flocktogether.xyz (the "Platform") operated by Flock Together Global LLC ("Flock," "we," "our," "us").
              </p>
              <p>This Policy is part of our:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Terms of Service</li>
                <li>Acceptable Use Policy</li>
                <li>DMCA Policy</li>
                <li>Community Guidelines</li>
                <li>Privacy Policy</li>
              </ul>
              <p>By using monetization features, you agree to all of the above documents.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. DEFINITIONS</h2>
              <p className="font-bold">Creator</p>
              <p>- A Platform user who uploads content and is eligible to earn revenue.</p>
              <p className="font-bold">Monetized Content</p>
              <p>- Content that meets eligibility criteria and displays ads or revenue-generating functions.</p>
              <p className="font-bold">Revenue</p>
              <p>- Earnings generated from ads, bonuses, sponsorship, or other monetization features.</p>
              <p className="font-bold">Payout</p>
              <p>- Transfer of available earnings to a creator via supported payment processors.</p>
              <p className="font-bold">Invalid Activity</p>
              <p>- Views, clicks, interactions, or earnings generated through fraudulent or non-human means.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. ELIGIBILITY REQUIREMENTS</h2>
              
              <h3 className="font-semibold">2.1 Age Requirements</h3>
              <p>To earn or withdraw revenue:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Creators must be 18 or older, OR</li>
                <li>Be a minor with a legally documented parent/guardian managing payouts.</li>
              </ul>
              <p>We may request:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Government ID</li>
                <li>Parent/guardian verification</li>
                <li>Tax documentation</li>
              </ul>

              <h3 className="font-semibold">2.2 One Legal Account Per Individual or Business</h3>
              <p>Creators may only hold one earning account.</p>
              <p>Operating multiple monetization accounts to circumvent restrictions is prohibited.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. SUPPORTED PAYMENT PROVIDERS</h2>
              <p>Flock may use third-party payment services such as:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stripe</li>
                <li>PayPal</li>
                <li>Payoneer</li>
                <li>Ezoic</li>
                <li>Regional payout providers where available</li>
              </ul>
              <p>Creators are bound by each provider's terms.</p>
              <p>Flock does not store full payment credentials.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. NO GUARANTEE OF EARNINGS</h2>
              <p>Revenue depends on:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Audience engagement</li>
                <li>Content quality</li>
                <li>Advertiser demand</li>
                <li>Geography</li>
                <li>Compliance history</li>
              </ul>
              <p>Flock makes no promise of minimum income.</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. HOW EARNINGS ARE CALCULATED</h2>
              <p>Revenue is generated through:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Advertising (display, video, mid-roll)</li>
                <li>Revenue-share programs</li>
                <li>Platform bonuses or incentives</li>
                <li>Brand program integrations</li>
                <li>Other features announced in the future</li>
              </ul>
              <p>All earnings are estimates until verified.</p>
              <p>Reported numbers may fluctuate due to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ad network reconciliation</li>
                <li>Invalid traffic filtering</li>
                <li>API delays</li>
                <li>Currency conversion</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. EARNINGS ALLOCATION & TIMING</h2>
              
              <h3 className="font-semibold">6.1 Earnings Accrual</h3>
              <p>Revenue accrues only on monetized content and after a creator meets eligibility requirements.</p>

              <h3 className="font-semibold">6.2 Verification Period</h3>
              <p>All revenue is subject to internal review and fraud screening.</p>
              <p>We may hold earnings for 14–90 days if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account risk is high</li>
                <li>Traffic is abnormal</li>
                <li>Content is flagged</li>
                <li>Identity is not verified</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. PAYOUT THRESHOLDS</h2>
              <p>Creators may request payouts once:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>They have met minimum payout threshold(s), AND</li>
                <li>Accounts are verified, AND</li>
                <li>No outstanding violations are under review.</li>
              </ul>
              <p>Thresholds may vary by:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Currency</li>
                <li>Payment provider</li>
                <li>Jurisdiction</li>
              </ul>
              <p>Thresholds can be adjusted at our sole discretion.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. PAYMENT SUSPENSION CONDITIONS</h2>
              <p>We may suspend payouts when:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content violates guidelines</li>
                <li>Account engages in manipulation or spam</li>
                <li>There is evidence of fraud or scraping</li>
                <li>Copyright complaints are unresolved</li>
                <li>Payment identity cannot be confirmed</li>
                <li>Chargebacks or disputes occur</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. INVALID TRAFFIC & FRAUD</h2>
              <p>Absolute grounds for revenue loss:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bot or automated engagement</li>
                <li>Purchased followers, likes, comments</li>
                <li>Recycled content reposted from other platforms</li>
                <li>Click farms</li>
                <li>Encouraging viewers to "click ads"</li>
                <li>VPN mass fake viewers</li>
                <li>AI "engagement loops"</li>
                <li>Fake giveaway funnels</li>
              </ul>
              <p>Flock may permanently void earnings resulting from invalid activity.</p>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Disable monetization permanently</li>
                <li>Freeze balances</li>
                <li>Terminate accounts</li>
                <li>Ban device, IP, or payment accounts</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. CONTENT & ADVERTISING ELIGIBILITY</h2>
              <p>Monetization may be restricted for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sexual or explicit content</li>
                <li>Drug and illegal product promotion</li>
                <li>Gambling or weapons</li>
                <li>Hate speech or extremism</li>
                <li>Health misinformation</li>
                <li>Violent or graphic content</li>
                <li>Reposted or stolen IP</li>
                <li>Defamation or cyber-harassment</li>
                <li>Scams, MLM, or fraudulent coaching schemes</li>
              </ul>
              <p>Content must meet:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Community Guidelines</li>
                <li>AUP</li>
                <li>DMCA Policy</li>
              </ul>
              <p>Violation = Immediate demonetization.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. COUNTRY & REGIONAL RESTRICTIONS</h2>
              <p>Some countries may not support:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Payment methods</li>
                <li>Advertising markets</li>
                <li>Identity verification</li>
                <li>Banking compliance</li>
              </ul>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Deny monetization in restricted regions</li>
                <li>Require additional verification</li>
                <li>Disallow payouts until compliance is met</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. TAXES</h2>
              <p>Creators are responsible for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reporting income</li>
                <li>Paying local taxes</li>
                <li>Filing legally required forms</li>
              </ul>
              <p>We may require:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>W-9 (US creators)</li>
                <li>W-8BEN / W-8BEN-E (non-US creators)</li>
                <li>National taxpayer ID</li>
                <li>VAT or GST numbers (where applicable)</li>
              </ul>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Withhold taxes</li>
                <li>Delay payouts until compliance is met</li>
                <li>Report earnings to tax authorities</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. PAYMENT METHODS & DATA</h2>
              <p>Creators understand:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Payment services are independent of Flock</li>
                <li>Fees apply</li>
                <li>Bank or account issues may delay payouts</li>
              </ul>
              <p>Flock is not liable for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provider outages</li>
                <li>Bank rejections</li>
                <li>Geo-locking</li>
                <li>Frozen accounts</li>
                <li>Foreign exchange loss</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. ACCOUNT TERMINATION & BALANCE FORFEITURE</h2>
              <p>We may withhold or permanently forfeit earnings if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account is terminated for violations</li>
                <li>Content fraud is detected</li>
                <li>You refuse identity verification</li>
                <li>You abuse monetization systems</li>
                <li>You attempt to circumvent bans</li>
              </ul>
              <p>We do not owe revenue on:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content removed for guideline violations</li>
                <li>Traffic invalidated by ad partners</li>
                <li>Earnings generated during suspension</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. BRAND SPONSORSHIPS & EXTERNAL DEALS</h2>
              <p>Creators may independently pursue:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sponsorships</li>
                <li>Merchandise</li>
                <li>Affiliate links</li>
                <li>Brand partnerships</li>
              </ul>
              <p>However:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The creator is fully liable for claims made</li>
                <li>Flock may remove misleading promotions</li>
                <li>Ads must be clearly disclosed</li>
              </ul>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">16. DISPUTES OVER EARNINGS</h2>
              <p>If a creator disputes revenue:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>They must provide proof</li>
                <li>They must allow compliance review</li>
                <li>They may be asked to submit analytics or documentation</li>
              </ul>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Recalculate revenue</li>
                <li>Cancel payouts</li>
                <li>Request additional evidence</li>
                <li>Reset earnings due to fraud or abuse</li>
              </ul>
              <p>Flock is not obligated to pay disputed earnings.</p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">17. PLATFORM BONUSES & INCENTIVE PROGRAMS</h2>
              <p>We may run promotional or performance-based incentives.</p>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Modify or end incentive programs</li>
                <li>Change eligibility criteria</li>
                <li>Adjust bonus calculations</li>
                <li>Void bonus payments due to fraud</li>
              </ul>
              <p>Bonuses are not guaranteed and not wages.</p>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">18. CREATOR RESPONSIBILITY</h2>
              <p>Creators must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Moderate their communities</li>
                <li>Ensure lawful content</li>
                <li>Comply with age and safety norms</li>
                <li>Respect other creators</li>
                <li>Respond truthfully during investigations</li>
              </ul>
              <p>Creators are legal publishers of their content.</p>
            </section>

            {/* Section 19 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">19. OUR RIGHT TO AUDIT</h2>
              <p>To protect the Platform, we may audit:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Engagement sources</li>
                <li>Traffic quality</li>
                <li>Payout history</li>
                <li>Identity documents</li>
                <li>Advertiser disputes</li>
                <li>Complaints</li>
              </ul>
              <p>Creators must cooperate.</p>
              <p>Refusal may result in suspension or monetization loss.</p>
            </section>

            {/* Section 20 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">20. APPEALS</h2>
              <p>You may appeal:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Monetization decisions</li>
                <li>Demonetization</li>
                <li>Earnings holds</li>
                <li>Payout suspensions</li>
              </ul>
              <p>You must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide accurate information</li>
                <li>Explain context</li>
                <li>Submit evidence</li>
              </ul>
              <p>Appeals may be denied if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Evidence is insufficient</li>
                <li>Violations are repeated</li>
                <li>Fraud indicators are present</li>
              </ul>
              <p>Appeal decisions are final.</p>
            </section>

            {/* Section 21 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">21. NO EMPLOYMENT RELATIONSHIP</h2>
              <p>Using Flock does not create:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Employment</li>
                <li>Partnership</li>
                <li>Joint venture</li>
                <li>Agency relationship</li>
                <li>Franchise relationship</li>
              </ul>
              <p>Creators are independent parties.</p>
            </section>

            {/* Section 22 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">22. CHANGES TO THIS POLICY</h2>
              <p>We may update this Policy at any time for operational, legal, or industry reasons.</p>
              <p>Material changes may be:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Posted via notice</li>
                <li>Sent by email</li>
                <li>Displayed in dashboards</li>
              </ul>
              <p>Continued use of monetization = acceptance.</p>
            </section>

            {/* Section 23 */}
            <section className="-space-y-1">
              <h2 className="text-3xl font-bold mb-4">23. CONTACT</h2>
              <p>Monetization and earnings inquiries:</p>
              <p>Email: admin@flocktogether.xyz</p>
              <p>Legal Entity:</p>
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
