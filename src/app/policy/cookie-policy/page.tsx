"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <Image src={loginBg} alt="Background" fill className="object-cover" priority />
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
              COOKIE & TRACKING POLICY — FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Cookie & Tracking Policy ("Policy") explains how Flock Together Global LLC ("Flock," "we," "our," "us") uses cookies, local storage, device identifiers, and similar technologies on{" "}
                <a
                  href="https://flocktogether.xyz"
                  className="text-blue-600 underline ml-1"
                >
                  https://flocktogether.xyz
                </a> (the "Platform").
              </p>

              <p>This Policy forms part of our:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Community Guidelines</li>
              </ul>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. WHAT ARE COOKIES?</h2>
              <p>Cookies are small pieces of data stored on your browser or device when you visit a website.</p>
              <p>They help us remember your preferences, secure your session, and deliver features.</p>
              <p>Cookies may be:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Session cookies</strong> — deleted when you close your browser</li>
                <li><strong>Persistent cookies</strong> — remain until manually deleted or expired</li>
              </ul>
              <p>We also use related technologies:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>HTML5 local storage</li>
                <li>Browser fingerprinting (for fraud prevention)</li>
                <li>Device IDs (mobile environments)</li>
                <li>SDK tracking (mobile apps)</li>
                <li>Web beacons & pixels</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. WHY WE USE COOKIES</h2>
              <p>We use cookies for:</p>

              <h3 className="font-semibold">2.1 Core Platform Operations</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Account login</li>
                <li>Session continuity</li>
                <li>Creator dashboard access</li>
                <li>Upload management</li>
                <li>Performance optimization</li>
              </ul>

              <h3 className="font-semibold">2.2 Security & Abuse Prevention</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Login validation</li>
                <li>Account fraud protection</li>
                <li>Bot detection</li>
                <li>Payment/risk prevention</li>
              </ul>

              <h3 className="font-semibold">2.3 Analytics & Platform Metrics</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Visitor count tracking</li>
                <li>Time on page / engagement</li>
                <li>Drop-off points</li>
                <li>User flow</li>
                <li>Content performance</li>
              </ul>
              <p>We do not use analytics to personally identify users without consent.</p>

              <h3 className="font-semibold">2.4 Advertising & Monetization</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Displayed content relevance</li>
                <li>Ad frequency capping</li>
                <li>Demographic modeling</li>
                <li>Geographic restrictions</li>
                <li>Ad performance optimization</li>
              </ul>

              <h3 className="font-semibold">2.5 Personalization</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Saved preferences</li>
                <li>Recommended content</li>
                <li>"Follow" and subscription suggestions</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. TYPES OF COOKIES WE USE</h2>

              <h3 className="font-semibold">A. Strictly Necessary Cookies</h3>
              <p>Required for the Platform to function:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account authentication</li>
                <li>Session integrity</li>
                <li>Security features</li>
                <li>Payment processing</li>
                <li>Page routing</li>
              </ul>
              <p>You cannot opt-out of these.</p>

              <h3 className="font-semibold">B. Functional Cookies</h3>
              <p>Enable enhanced experiences:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Language preferences</li>
                <li>Theme or UI settings</li>
                <li>Device layout memory</li>
                <li>Playback settings</li>
              </ul>
              <p>Disabling them may reduce usability.</p>

              <h3 className="font-semibold">C. Analytics / Performance Cookies</h3>
              <p>Used to improve the Platform:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Visitor insights</li>
                <li>Error detection</li>
                <li>Feature usage data</li>
                <li>Average view duration</li>
                <li>Content retention</li>
              </ul>
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google Analytics</li>
                <li>Internal analytics</li>
              </ul>

              <h3 className="font-semibold">D. Advertising & Monetization Cookies</h3>
              <p>Used to deliver relevant advertisements and measure performance:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google AdSense</li>
                <li>Ezoic</li>
                <li>Programmatic ad services</li>
                <li>Brand integrations</li>
              </ul>
              <p>These may track:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Interest categories</li>
                <li>Engagement</li>
                <li>Ad views</li>
                <li>Conversions</li>
              </ul>
              <p>These are disabled by default in GDPR regions until consent is given.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. THIRD-PARTY COOKIES</h2>
              <p>We partner with third parties who may set cookies in your browser.</p>
              <p>Examples include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google AdSense</li>
                <li>Google Analytics</li>
                <li>Ezoic</li>
                <li>PayPal / Payoneer (payment verification)</li>
                <li>Stripe</li>
                <li>Cloudflare or CDN networks</li>
              </ul>
              <p>These providers may collect:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>IP address</li>
                <li>Device information</li>
                <li>Browser type</li>
                <li>Usage patterns</li>
                <li>Language</li>
                <li>Time zone</li>
                <li>Country of access</li>
              </ul>
              <p>Third-party data is used strictly for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fraud prevention</li>
                <li>Payment integrity</li>
                <li>Advertising delivery</li>
                <li>Compliance screening</li>
                <li>Platform performance</li>
                <li>Creator earnings reporting</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. MOBILE & SDK TRACKING</h2>
              <p>If you access Flock via a mobile interface or app, we may use:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>App device IDs</li>
                <li>OS-level identifiers</li>
                <li>SDK-based analytics</li>
                <li>Crash reporting frameworks</li>
              </ul>
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Firebase</li>
                <li>Meta SDK</li>
                <li>App Store analytics tools</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. COOKIE CONSENT (GDPR / EU / EEA / UK)</h2>
              <p>Users in the EU/EEA/UK receive a cookie consent banner before non-essential cookies activate.</p>
              <p>You may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize cookie categories</li>
              </ul>
              <p>We do not load advertising cookies until consent is explicitly provided.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. YOUR OPTIONS & OPT-OUT</h2>
              <p>You can control cookies in three ways:</p>

              <h3 className="font-semibold">7.1 Browser level</h3>
              <p>You may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Clear cookies</li>
                <li>Block cookies</li>
                <li>Disable tracking scripts</li>
              </ul>

              <h3 className="font-semibold">7.2 In-platform settings</h3>
              <p>Where provided, users may disable:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Recommendation cookies</li>
                <li>Personalization cookies</li>
                <li>Ad personalization</li>
              </ul>

              <h3 className="font-semibold">7.3 Third-party opt-outs</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    https://adssettings.google.com/
                  </a>
                </li>
                <li>
                  <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    https://optout.networkadvertising.org/
                  </a>
                </li>
                <li>
                  <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    https://youradchoices.com/
                  </a>
                </li>
              </ul>
              <p>Some site features may not work once disabled.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. GOOGLE ADSENSE & EZOIC SPECIFIC REQUIREMENTS</h2>
              <p>Because FLOCK uses AdSense/Ezoic or similar programmatic monetization:</p>
              <p>Cookies may be used to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Personalize ads</li>
                <li>Limit frequency</li>
                <li>Measure performance</li>
                <li>Detect invalid traffic</li>
              </ul>
              <p>Google may combine user data from:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google accounts</li>
                <li>Search history</li>
                <li>YouTube usage</li>
                <li>Browser behavior</li>
              </ul>
              <p>Users may opt out using Google controls.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. DO-NOT-TRACK</h2>
              <p>Do-Not-Track (DNT) browser signals may not be honored due to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Industry fragmentation</li>
                <li>Inconsistent technical standards</li>
              </ul>
              <p>We provide explicit opt-out controls instead.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. STORAGE DURATION</h2>
              <p>Different cookies have different lifespans:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Session cookies</strong> — deleted upon browser close</li>
                <li><strong>Persistent cookies</strong> — remain until expiration or manual deletion</li>
                <li><strong>Local storage</strong> — retained until cleared</li>
              </ul>
              <p>We do not use perpetual cookies.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. FRAUD DETECTION TECHNIQUES</h2>
              <p>To protect users and creators, we may use:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Device fingerprinting</li>
                <li>IP rate mapping</li>
                <li>Token airdrop detection</li>
                <li>Anti-bot analytics</li>
                <li>Payment token validation</li>
              </ul>
              <p>These measures are for security and monetization integrity, not personal profiling.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. CHILD PRIVACY</h2>
              <p>Minimum age to use FLOCK: 13+</p>
              <p>We do not knowingly collect:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Behavioral profiles of children</li>
                <li>Advertising identifiers of minors</li>
                <li>Personalized ads for users under required age thresholds</li>
              </ul>
              <p>Creators who violate child safety may be permanently banned.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. DATA ACCESS & DELETION REQUESTS</h2>
              <p>You may request:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Export of cookie-related data</li>
                <li>Manual deletion of stored identifiers</li>
                <li>Full account deletion</li>
              </ul>
              <p>Requests are processed under our Privacy Policy.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. CHANGES TO THIS POLICY</h2>
              <p>We may update this Policy at any time to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reflect platform changes</li>
                <li>Meet legal requirements</li>
                <li>Improve transparency</li>
              </ul>
              <p>Updates are effective when posted.</p>
            </section>

            {/* Section 15 */}
            <section className="-space-y-1">
              <h2 className="text-3xl font-bold mb-4">15. CONTACT US</h2>
              <p className="mb-2">Cookie / data questions:</p>
              <p>
                <a href="mailto:admin@flocktogether.xyz" className="text-blue-600 underline">
                  admin@flocktogether.xyz
                </a>
              </p>
              <p className="font-bold mt-4">Legal Entity:</p>
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
