"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function AcceptableUsePolicyPage() {
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
              FLOCK ACCEPTABLE USE POLICY (AUP)
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Acceptable Use Policy ("AUP") governs how users may access and use the Flock platform and associated services at 
                <a
                  href="https://flocktogether.xyz"
                  className="text-blue-600 underline ml-1"
                >
                  https://flocktogether.xyz
                </a> (the "Platform") operated by <p className="font-bold">Flock Together Global LLC ("Flock," "we," "our," "us").</p>
              </p>

              <p>This AUP applies to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Creators</li>
                <li>Viewers</li>
                <li>Advertisers</li>
                <li>Affiliates</li>
                <li>Developers</li>
                <li>Third-party partners</li>
              </ul>

              <p>By using the Platform, you agree to comply with this AUP.</p>
              <p>Violating this policy may result in monetization loss, content removal, account suspension, or permanent ban.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. GENERAL PRINCIPLE</h2>
              <p>You may not use Flock in a way that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Harms the Platform, its users, or its business interests</li>
                <li>Violates any applicable law</li>
                <li>Allows unauthorized access to accounts, systems, or data</li>
                <li>Exploits minors or vulnerable persons</li>
                <li>Spreads dangerous or illicit activity</li>
                <li>Enables fraud, spam, or monetization abuse</li>
              </ul>
              <p>Flock reserves the unilateral right to determine what constitutes abuse.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. PROHIBITED CONTENT</h2>
              <p>The following is not allowed under any circumstances:</p>

              <h3 className="font-semibold">2.1 Child Exploitation</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Sexual or suggestive content involving minors</li>
                <li>Grooming or solicitation</li>
                <li>Underage nudity or fetishization</li>
                <li>Child endangerment, emotional harm, or abuse</li>
              </ul>
              <p>We will report violations to law enforcement.</p>

              <h3 className="font-semibold">2.2 Pornographic or Sexually Explicit Content</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Explicit sexual acts</li>
                <li>Fetish content</li>
                <li>Genital exposure</li>
                <li>Pornographic materials</li>
              </ul>
              <p>Flock is not an adult services platform.</p>

              <h3 className="font-semibold">2.3 Illegal Activities</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Drug sales or distribution</li>
                <li>Human trafficking</li>
                <li>Weapons manufacturing</li>
                <li>Unauthorized financial services</li>
                <li>Criminal facilitation</li>
              </ul>

              <h3 className="font-semibold">2.4 Hate or Extremism</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Advocating for violence against individuals or groups</li>
                <li>Terrorist propaganda</li>
                <li>Organized hate groups</li>
              </ul>

              <h3 className="font-semibold">2.5 Self-harm & Suicide Promotion</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Encouraging self-injury</li>
                <li>Dangerous health challenges</li>
                <li>Instructions on self-harm</li>
              </ul>

              <h3 className="font-semibold">2.6 Copyright Violation</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Uploading copyrighted material without permission</li>
                <li>Reposting content from other platforms</li>
                <li>Circumventing copyright filters</li>
              </ul>
              <p>See DMCA Policy for procedures and penalties.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. PROHIBITED BEHAVIORS</h2>
              <p>You may not:</p>

              <h3 className="font-semibold">3.1 Attack the Platform</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Attempt to hack, overload, or breach systems</li>
                <li>Reverse-engineer or exploit vulnerabilities</li>
                <li>Interfere with platform performance</li>
              </ul>

              <h3 className="font-semibold">3.2 Manipulate Engagement</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Bot traffic</li>
                <li>Fake followers</li>
                <li>View farms</li>
                <li>Comment automation</li>
                <li>Click fraud</li>
                <li>Paid "engagement boosting" schemes</li>
              </ul>
              <p>Monetization derived from artificial traffic is voided.</p>

              <h3 className="font-semibold">3.3 Impersonation or Deception</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Pretend to be other people</li>
                <li>Misrepresent identity or credentials</li>
                <li>Create misleading business endorsements</li>
              </ul>

              <h3 className="font-semibold">3.4 Spam</h3>
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Repetitive posting</li>
                <li>Mass unsolicited promotions</li>
                <li>Affiliate farming without disclosure</li>
              </ul>

              <h3 className="font-semibold">3.5 Exploiting Monetization</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Fabricating revenue signals</li>
                <li>Wrongful reporting to manipulate payouts</li>
                <li>Abusing referral or bonus programs</li>
                <li>Earnings laundering via third-party accounts</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. AI-RELATED RESTRICTIONS</h2>
              <p>AI-generated or AI-assisted content must not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Replicate copyrighted works</li>
                <li>Use likenesses of real individuals without consent</li>
                <li>False portray public figures in a defamatory manner</li>
                <li>Generate sexual, violent, extremist, or misleading material</li>
              </ul>
              <p>We may request source files or proof of authorship.</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. HARASSMENT & TARGETED ABUSE</h2>
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stalk</li>
                <li>Intimidate</li>
                <li>Threaten violence</li>
                <li>Encourage harassment campaigns</li>
                <li>Doxx (share private addresses, phone numbers, etc.)</li>
              </ul>
              <p>This includes creator vs creator conflict.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. MISINFORMATION & FRAUD</h2>
              <p className="font-bold">Prohibited:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fake giveaways</li>
                <li>Pyramid schemes</li>
                <li>Health misinformation</li>
                <li>Investment scams ("pump and dump")</li>
                <li>"Get rich quick" coaching</li>
              </ul>
              <p className="font-bold">Creators must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide truthful claims</li>
                <li>Use proper disclaimers</li>
                <li>Avoid exploiting vulnerable users</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. COMMERCIAL ACTIVITIES</h2>
              <p className="font-bold">Acceptable:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Normal brand deals</li>
                <li>Sponsorships</li>
                <li>Creator-owned services</li>
                <li>Merch sales</li>
              </ul>
              <p className="font-bold">Prohibited:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Illegal goods/services</li>
                <li>Counterfeit products</li>
                <li>Exploitative MLM schemes</li>
                <li>Unregistered financial offerings</li>
                <li>Selling personal user data</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. PLATFORM RESOURCE ABUSE</h2>
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use automated scripts to upload or harvest data</li>
                <li>Circumvent upload limitations</li>
                <li>Create multi-account networks to exploit payouts</li>
                <li>Resell or lease accounts</li>
                <li>Share login credentials to bypass restrictions</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. ACCOUNT OWNERSHIP</h2>
              <p>Accounts belong to Flock as a service provider.</p>
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sell, trade, or rent accounts</li>
                <li>Operate accounts for banned users</li>
                <li>Use "proxy creators" to continue illegal activity</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. ENFORCEMENT & ACTIONS</h2>
              <p>Flock may take actions including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content removal</li>
                <li>Upload restrictions</li>
                <li>Feature limitations</li>
                <li>Shadow or temporary bans</li>
                <li>Permanent suspension</li>
                <li>Monetization clawback</li>
                <li>Revenue forfeiture</li>
                <li>Legal reporting</li>
              </ul>
              <p>Severity depends on risk, repetition, and intent.</p>
              <p>We do not owe users an opportunity to violate repeatedly.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. COOPERATION WITH LAW ENFORCEMENT</h2>
              <p>We may disclose data when:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Required by subpoena or court order</li>
                <li>Investigating threats to safety</li>
                <li>Addressing child exploitation</li>
                <li>Preventing fraud or organized abuse</li>
              </ul>
              <p>We are not obligated to notify users before doing so where legally prohibited.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. APPEALS</h2>
              <p>You may appeal a moderation decision once.</p>
              <p>Appeals must include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Why you believe we made an error</li>
                <li>Supporting evidence (screenshots, context)</li>
                <li>Proof of ownership if copyright-related</li>
              </ul>
              <p>We may deny appeals where:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content is clearly illegal</li>
                <li>User has prior violations</li>
                <li>Fraud indicators are present</li>
              </ul>
              <p>Appeal decisions are final.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. GLOBAL COMPLIANCE</h2>
              <p>Users must comply with laws in their jurisdiction, including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>U.S. law (including COPPA, DMCA, SEC)</li>
                <li>GDPR (EU)</li>
                <li>CCPA (California)</li>
                <li>International child safety and online harm standards</li>
              </ul>
              <p>Using Flock to evade local laws is prohibited.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. UPDATES TO THIS POLICY</h2>
              <p>We may update this AUP at any time.</p>
              <p>Continued use of the Platform constitutes acceptance of changes.</p>
            </section>

            {/* Section 15 */}
            <section className="-space-y-1">
              <h2 className="text-3xl font-bold mb-4">15. CONTACT</h2>
              <p className="mb-2">For AUP or enforcement inquiries:</p>
              <p>Email: admin@flocktogether.xyz</p>
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
