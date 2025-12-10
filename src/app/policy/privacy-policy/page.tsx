"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
              PRIVACY POLICY — FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 9, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Privacy Policy describes how Flock Together Global LLC
                ("Flock," "we," "our," "us") collects, uses, shares, and protects
                your information when you access or use our website at
                <a
                  href="https://flocktogether.xyz"
                  className="text-blue-600 underline ml-1"
                >
                  https://flocktogether.xyz
                </a>, our services, features, applications, and any related communication channels
                (collectively, the "Platform").
              </p>

              <p>
                By using the Platform, you consent to this Privacy Policy.
              </p>
              <p>
                If you do not agree, do not use the Platform.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. WHO WE ARE</h2>

              <p className="font-bold">Flock Together Global LLC</p>
              <p>Registered address:</p>
              <p>30 N Gould St #53789, Sheridan, WY 82801, United States</p>
              <p>
                We operate flocktogether.xyz, a creator-first digital content
                and monetization system.
              </p>
              <p>
                We act as the data controller for information processed in connection with your use of the
                Platform. For certain functions (e.g., payouts), external payment partners may act as joint or
                independent controllers.
              </p>
            </section>

            {/* Section 2 - Information We Collect */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. INFORMATION WE COLLECT</h2>

              <p>We collect personal and non-personal information in three ways:</p>

              <h3 className="font-semibold">A. Information You Provide to Us</h3>
              <p>Examples include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Name, email address, username, date of birth</li>
                <li>Social login profile information (Google, Facebook, etc.)</li>
                <li>Creator content (videos, posts, descriptions, thumbnails)</li>
                <li>Payment and withdrawal details (PayPal, Payoneer, Stripe)</li>
                <li>Customer support communications</li>
                <li>Identity verification documents when required</li>
              </ul>

              <h3 className="font-semibold">B. Information Collected Automatically</h3>
              <p>When you access or use the Platform, we automatically collect:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Device and browser type</li>
                <li>IP address and approximate geolocation</li>
                <li>Usage logs and interactions</li>
                <li>Session analytics</li>
                <li>Referral links</li>
                <li>Uploaded file metadata and performance</li>
              </ul>
              <p>
                We use cookies, pixel tags, SDKs, log files, local storage, and similar technologies as
                described in Section 8.
              </p>
              <p>Enhanced for transparency:</p>
              <p>We may also collect fraud indicators (e.g., unusual session activity, rapid switching of IPs)
                for the purpose of protecting the Platform and creators.</p>

              <h3 className="font-semibold">C. Information From Third-Party Platforms</h3>
              <p>When you connect accounts:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google auth profile</li>
                <li>Facebook login</li>
                <li>Ezoic analytics</li>
                <li>Google AdSense</li>
                <li>Stripe / Payoneer / PayPal payout data</li>
              </ul>
              <p>
                We receive only the profile details required to authenticate you and operate the Platform.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. USE OF YOUR INFORMATION</h2>

              <p>We use your information to provide, maintain, and improve the Platform.</p>

              <h3 className="font-semibold">Core Platform Operations</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Create and manage your account</li>
                <li>Allow login and authentication</li>
                <li>Host and display your content</li>
                <li>Enable monetization features</li>
                <li>Facilitate earnings, withdrawals, and payouts</li>
                <li>Analyze performance and improve features</li>
              </ul>

              <h3 className="font-semibold">Safety & Compliance</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Enforce our Terms of Service and Community Guidelines</li>
                <li>Detect and prevent fraud and policy abuse</li>
                <li>Respond to legal requests, copyright claims, and subpoenas</li>
                <li>Protect minors and comply with global child-safety requirements</li>
              </ul>

              <h3 className="font-semibold">Communication</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Send verification emails</li>
                <li>Send password reset and security notices</li>
                <li>Contact you regarding technical, transactional, or legal matters</li>
              </ul>

              <h3 className="font-semibold">Analytics & Insights</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Measure audience engagement</li>
                <li>Track content performance</li>
                <li>Optimize Platform design</li>
                <li>Improve recommendation systems</li>
              </ul>

              <h3 className="font-semibold">Advertising</h3>
              <p>We use advertising networks (e.g., AdSense, Ezoic) to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Display ads</li>
                <li>Personalize targeting (where legally permitted)</li>
                <li>Prevent invalid traffic and ad fraud</li>
              </ul>
              <p>Enhanced for completeness:</p>
              <p>We do not use sensitive personal data for advertising purposes.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. MONETIZATION & PAYMENTS</h2>

              <p>If you participate in earning features, we process:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Payment addresses</li>
                <li>Tax information (where required)</li>
                <li>Withdrawal history</li>
                <li>Transaction IDs</li>
                <li>Revenue estimates</li>
              </ul>

              <h3 className="font-semibold">Payment Processors</h3>
              <p>We use PCI-compliant providers:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stripe</li>
                <li>PayPal</li>
                <li>Payoneer</li>
                <li>Ezoic Advertising Platform</li>
              </ul>
              <p>
                We never store your full payment credentials; we only store payout identifiers and required
                metadata.
              </p>
              <p>Enhanced addition:</p>
              <p>Creators begin earning from Day 1 after Beta, provided monetization eligibility requirements
                are met.</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. HOW WE SHARE INFORMATION</h2>

              <p className="font-bold">We do not sell your personal information.</p>

              <p>We may share your information with:</p>

              <h3 className="font-semibold">Service Providers</h3>
              <p>Only those necessary to operate the Platform:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Hosting and CDN partners</li>
                <li>Payout processors</li>
                <li>Authentication services</li>
                <li>Crash reporting and analytics tools</li>
                <li>Email delivery vendors</li>
              </ul>

              <h3 className="font-semibold">Advertising Networks</h3>
              <p>AdSense, Ezoic, or similar providers may receive:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cookies</li>
                <li>Browser/device information</li>
                <li>Placement data</li>
                <li>Country/location metadata</li>
                <li>Non-identifying usage data</li>
              </ul>

              <h3 className="font-semibold">Legal and Safety Disclosures</h3>
              <p>We may disclose information if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Required by law, subpoena, or government inquiry</li>
                <li>Necessary to prevent fraud or harm</li>
                <li>Responding to copyright/IP claims (DMCA)</li>
              </ul>

              <h3 className="font-semibold">Business Transfers</h3>
              <p>
                If we undergo merger, acquisition, restructuring, we may transfer user information as part of the transaction.
              </p>
            </section>

            {/* Section 6–18 → (All included, formatted consistently) */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. CHILD & MINOR PROTECTION</h2>
              
              <h3 className="font-semibold">Minimum Age Requirement</h3>
              <p>Users must be at least 13 years old to create an account.</p>
              <p>We do not knowingly collect information from children under 13.</p>
              <p>If you believe a minor under 13 has registered:</p>
              <p>→ Email: admin@flocktogether.xyz</p>
              <p>We will verify and remove the account.</p>

              <h3 className="font-semibold">Monetization</h3>
              <p>
                Creators must be 18+ (or legal adult) to access payment features, unless a parent/guardian manages the payout method.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. USER-GENERATED CONTENT</h2>
              <p>Anything you upload (videos, written posts, images, audio, comments):</p>
              <ul className="list-disc list-inside space-y-1">
                <li>May be visible publicly</li>
                <li>May be indexed by search engines</li>
                <li>May be shared through social previews</li>
                <li>May remain temporarily in backup systems after deletion</li>
              </ul>
              <p>Flock is not responsible for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content you choose to upload</li>
                <li>How other users interact with or share your content</li>
                <li>Off-platform distribution of your posts</li>
              </ul>
              <p>Enhanced for clarity:</p>
              <p>By uploading content, you grant Flock a license to host, display, monetize (if applicable),
                and distribute the content as required to operate the Platform.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. COOKIES & TRACKING TECHNOLOGIES</h2>
              <p>We use:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cookies (first-party and third-party)</li>
                <li>Local storage</li>
                <li>Analytics tracking</li>
                <li>Device IDs</li>
                <li>Advertising tags</li>
                <li>Pixel beacons</li>
              </ul>
              <p>Why we use them:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Authentication ("Remember Me")</li>
                <li>Analytics</li>
                <li>Revenue optimization</li>
                <li>Preventing ad fraud</li>
                <li>Improving user experience</li>
                <li>Language and UI preferences</li>
              </ul>
              <p>Third-party cookies may be set by advertising and measurement partners.</p>
              <p>A separate Cookie Policy will be published and linked from the footer.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. DATA RETENTION</h2>
              <p>We retain information only as long as needed to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide the Platform</li>
                <li>Enforce our legal obligations</li>
                <li>Maintain legitimate business interests</li>
                <li>Resolve disputes</li>
                <li>Detect fraud</li>
              </ul>
              <p>We may retain:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Logs</li>
                <li>IP addresses</li>
                <li>Account metadata</li>
                <li>Transaction records</li>
              </ul>
              <p>After account deletion, minimal records may remain for compliance, audit, and tax
                obligations.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. DATA SECURITY</h2>
              <p>We implement reasonable administrative, physical, and technical safeguards.</p>
              <p>You acknowledge that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>No system is fully secure</li>
                <li>You are responsible for protecting your login credentials</li>
                <li>We are not liable for breaches resulting from third-party integrations, compromised
                  devices, or user actions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. YOUR RIGHTS</h2>
              <p>Depending on your jurisdiction, you may have rights to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Access data</li>
                <li>Correct inaccurate information</li>
                <li>Request account deletion</li>
                <li>Restrict processing</li>
                <li>Export your information ("data portability")</li>
                <li>Object to personalized advertising</li>
              </ul>
              <p>Requests can be made through account settings or support email.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. INTERNATIONAL TRANSFERS</h2>
              <p>We are a U.S.-based company.</p>
              <p>Your data may be processed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>In the United States</li>
                <li>By service providers worldwide</li>
                <li>In countries with varying privacy laws</li>
              </ul>
              <p>By using the Platform, you consent to such transfers.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. CHANGES TO THIS POLICY</h2>
              <p>We may update this Policy from time to time.</p>
              <p>If changes are material, we may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email you</li>
                <li>Show an in-app notice</li>
                <li>Update the "Last Updated" date</li>
              </ul>
              <p>Continued use after revisions = acceptance.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. CONTACT US</h2>
              <p>If you have data-related concerns:</p>
              <p>Email: support@flocktogether.xyz</p>
              <p>Legal Entity:</p>
              <p>Flock Together Global LLC</p>
              <p>30 N Gould St #53789, Sheridan, WY 82801, USA</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. CALIFORNIA PRIVACY DISCLOSURE (CCPA/CPRA)</h2>
              <p>Flock does not sell personal data.</p>
              <p>California users may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Request access</li>
                <li>Request deletion (subject to legal requirements)</li>
                <li>Request categories of information shared</li>
              </ul>
              <p>Requests may be submitted via support email.</p>
              <p>Enhanced addition:</p>
              <p>California residents may opt out of "sharing" for cross-context behavioral advertising.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">16. EU/EEA GDPR DISCLOSURE</h2>
              <p>Legal bases for processing:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Contractual necessity</li>
                <li>Consent</li>
                <li>Legitimate interest (security, analytics, fraud prevention)</li>
                <li>Legal compliance</li>
              </ul>
              <p>Data subjects may request:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Access</li>
                <li>Correction</li>
                <li>Restriction</li>
                <li>Deletion</li>
                <li>Portability</li>
              </ul>
              <p>We will respond within the legally required timeframe.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">17. DMCA & COPYRIGHT CLAIMS</h2>
              <p>Copyright removal requests must follow our DMCA Policy and include legally required
                details.</p>
              <p>Removing infringing content may require retention of metadata and correspondence.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">18. ACCOUNT DELETION</h2>
              <p>You may request deletion via settings or email.</p>
              <p>Upon deletion:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content will be removed from public access</li>
                <li>Certain logs will remain for legal purposes</li>
                <li>Financial records may be retained for tax and audit requirements</li>
              </ul>
              <p>Deletion is irreversible.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold">CONCLUSION</h2>
              <p>
                By continuing to use the Platform, you agree to the collection, use, and disclosure of information as described in this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
