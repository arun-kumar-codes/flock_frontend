"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function DmcaPolicyPage() {
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
              DMCA COPYRIGHT POLICY — FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                The Digital Millennium Copyright Act (DMCA) provides copyright owners with a mechanism for requesting the removal of infringing material.
              </p>
              <p>
                It also protects online service providers like Flock Together Global LLC ("Flock," "we," "our," "us") when they act promptly in response to copyright complaints.
              </p>
              <p>Flock respects copyright law and expects users to do the same.</p>
              <p>This DMCA Copyright Policy explains how to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>File a copyright infringement notice</li>
                <li>Request removal of infringing content</li>
                <li>Submit a counter-notice if you believe your content was wrongly removed</li>
                <li>Understand consequences for repeat infringers</li>
              </ul>
              <p>This Policy applies to all users of the Platform, whether they are registered creators, viewers, advertisers, or guests.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. DESIGNATED DMCA AGENT</h2>
              <p>To submit copyright complaints, you must contact our designated agent:</p>
              <p className="font-bold">DMCA Agent</p>
              <p>Flock Together Global LLC</p>
              <p>30 N Gould St #53789</p>
              <p>Sheridan, WY 82801</p>
              <p>United States</p>
              <p>Email: admin@flocktogether.xyz</p>
              <p>Subject Line: "DMCA Complaint – FLOCKTOGETHER.XYZ"</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. WHAT IS COPYRIGHT INFRINGEMENT?</h2>
              <p>
                Copyright infringement occurs when someone uses a copyrighted work (e.g., video, blog, music track, artwork, written text) without lawful permission from the copyright holder or without a legal exception such as fair use or public domain.
              </p>
              <p>Examples of infringing uploads include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reposting another creator's video without permission</li>
                <li>Uploading someone's music as your own</li>
                <li>Sharing copyrighted TV clips or movies</li>
                <li>Copying a blog/article from another website and publishing it as original content</li>
                <li>Uploading AI-generated work that includes recognizable copyrighted content</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. WHAT IS NOT COPYRIGHT INFRINGEMENT?</h2>
              <p>Copyright law allows some uses without permission, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fair Use (commentary, criticism, parody, transformative review, news reporting)</li>
                <li>Public Domain Works</li>
                <li>Licensed Works (content you have permission to use)</li>
                <li>Original Works You Created Yourself</li>
              </ul>
              <p>We cannot pre-judge legal defenses.</p>
              <p>We respond to properly formatted DMCA notices only.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. HOW TO SUBMIT A VALID DMCA TAKEDOWN NOTICE</h2>
              <p>To comply with 17 U.S.C. §512(c)(3), your DMCA notice must include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your name, physical address, and contact information (email and phone recommended)</li>
                <li>Identification of the copyrighted work claimed to be infringed** (URL or detailed description if unavailable online)</li>
                <li>Identification of the material to be removed, including:
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>URL(s) of the specific infringing content on flocktogether.xyz</li>
                    <li>A screenshot or link is not sufficient; exact URLs are required</li>
                  </ul>
                </li>
                <li>A statement of good-faith belief that the use is unauthorized: "I have a good-faith belief that the material identified is not authorized by the copyright owner, its agent, or applicable law."</li>
                <li>An accuracy statement under penalty of perjury: "The information in this notice is accurate, and I am the owner of the copyright or authorized to act on behalf of the copyright owner."</li>
                <li>Your electronic or physical signature</li>
              </ul>
              <p className="font-bold">⚠️ IMPORTANT</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We cannot process takedowns missing required elements.</li>
                <li>We cannot accept notices sent to general support inboxes.</li>
                <li>We cannot remove content based on verbal claims or screenshots.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. FLOCK'S RESPONSE TO VALID NOTICES</h2>
              <p>If your DMCA notice is valid:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We will remove or disable access to the allegedly infringing content</li>
                <li>We may notify the user who uploaded it</li>
                <li>We may provide the uploader with your complaint (minus personal phone or address, if possible)</li>
                <li>We may lock monetization or suspend accounts during review</li>
              </ul>
              <p>We are not required to provide advance warning before removal.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. YOUR LEGAL RESPONSIBILITY</h2>
              <p>Submitting a false or malicious copyright notice may result in:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Civil liability</li>
                <li>Legal damages</li>
                <li>Platform suspension or permanent ban</li>
              </ul>
              <p>Perjury notices may be prosecuted under U.S. federal law.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. COUNTER-NOTIFICATIONS (APPEALS)</h2>
              <p>If your content was removed and you believe:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own the rights, or</li>
                <li>The takedown was incorrect, or</li>
                <li>The content is protected by law (fair use, license, etc.)</li>
              </ul>
              <p>You may submit a counter-notice under 17 U.S.C. §512(g)(3).</p>
              <p>Your counter-notice must include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your name, address, and telephone number</li>
                <li>A description of removed material and where it appeared before removal</li>
                <li>A sworn statement: "I have a good-faith belief that the material was removed or disabled as a result of mistake or misidentification."</li>
                <li>Consent to jurisdiction: "I consent to the jurisdiction of the U.S. Federal District Court for the judicial district where I live, or if outside the United States, the jurisdiction of the U.S. Federal District Court of Wyoming."</li>
                <li>Your signature</li>
              </ul>
              <p>Send to: admin@flocktogether.xyz</p>
              <p>We may forward your counter-notice to the original complainant.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. RESTORATION OF CONTENT</h2>
              <p>Once a valid counter-notice is received:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We restore the content within 10–14 business days, unless the copyright owner files legal action in that time.</li>
              </ul>
              <p>We will not mediate disputes between users.</p>
              <p>Only courts or arbitration can decide copyright ownership.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. REPEAT INFRINGER POLICY</h2>
              <p>We operate a zero-tolerance repeat infringer policy.</p>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Warn users</li>
                <li>Suspend monetization</li>
                <li>Disable uploads</li>
                <li>Permanently terminate accounts</li>
                <li>Destroy payout eligibility</li>
              </ul>
              <p>We may also block IPs, devices, emails, and payment methods associated with infringement.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. THIRD-PARTY RIGHTS & DISTRIBUTION</h2>
              <p>Content shared on Flock may be:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Embedded</li>
                <li>Indexed</li>
                <li>Previewed via platform tools</li>
                <li>Displayed through OpenGraph metadata</li>
              </ul>
              <p>
                DMCA takedowns cover all derivative displays controlled by the Platform, but cannot remove:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Screenshots</li>
                <li>Reposts outside the Platform</li>
                <li>User-created reshared material on third-party sites</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. NON-US COPYRIGHT CLAIMS</h2>
              <p>Non-DMCA copyright claims may also be honored.</p>
              <p>However:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Claims must still include proof of ownership</li>
                <li>We do not enforce unverifiable jurisdictional claims</li>
                <li>We respond using materially equivalent standards to DMCA</li>
              </ul>
              <p>If your country's copyright structure differs, you may still file a standard DMCA-compliant request.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. ABUSE, HARASSMENT, OR BAD-FAITH REPORTING</h2>
              <p>We treat copyright disputes seriously.</p>
              <p>Misuse may result in:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account termination</li>
                <li>Monetization loss</li>
                <li>Legal exposure</li>
                <li>Permanent banning of individuals or affiliated businesses</li>
              </ul>
              <p>This applies to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Retaliatory claims</li>
                <li>Competitor takedowns</li>
                <li>"AI copyright spam"</li>
                <li>Automated mass-submission bots</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. DISCLAIMER</h2>
              <p>Nothing in this policy constitutes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Legal advice</li>
                <li>A legal ruling</li>
                <li>A warranty of ownership or consent</li>
              </ul>
              <p>We make best efforts to comply with U.S. law but do not adjudicate:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fair use disputes</li>
                <li>Contractual disputes between creators</li>
                <li>Licensing conflicts</li>
              </ul>
              <p>Those must be resolved in court or binding arbitration.</p>
            </section>

            {/* Section 14 */}
            <section className="-space-y-1">
              <h2 className="text-3xl font-bold mb-4">14. CONTACT INFORMATION</h2>
              <p className="mb-2">If you have questions about this policy:</p>
              <p className="font-bold">DMCA Agent</p>
              <p>Flock Together Global LLC</p>
              <p>30 N Gould St #53789</p>
              <p>Sheridan, WY 82801</p>
              <p>United States</p>
              <p>Email: admin@flocktogether.xyz</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
