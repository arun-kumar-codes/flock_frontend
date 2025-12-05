"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function CreatorLicensingPage() {
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
              Join Flock
            </Link>
          </div>
        </div>

        {/* Hyperlinks Row */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 text-xs md:text-sm pt-3 pb-3 border-4 border-white/50">
          <Link href="/contact" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Contact Us
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/privacy-policy" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Privacy Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/terms-of-service" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Terms of Service
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/community-guidelines" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Community Guidelines
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/acceptable-use-policy" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Acceptable Use Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/safety-policy" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            Safety Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/about-us" className="text-white/90 hover:text-white font-medium hover:underline transition-all">
            About Us
          </Link>
        </div>
      </header>

      {/* Centered White Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto py-4 md:py-6 px-6">
        <div className="bg-white/95 rounded-3xl shadow-xl px-6 py-8 md:px-10 md:py-10 theme-text-primary">
          
          {/* Header */}
          <header className="space-y-3 mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              CREATOR LICENSING & OWNERSHIP AGREEMENT — FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Creator Licensing & Ownership Agreement ("Agreement") governs the ownership, rights, licensing, distribution, monetization, and legal use of content uploaded to 
                <a
                  href="https://flocktogether.xyz"
                  className="text-blue-600 underline ml-1"
                >
                  https://flocktogether.xyz
                </a> (the "Platform") operated by <p className="font-bold">Flock Together Global LLC ("Flock," "we," "our," "us").</p>
              </p>
              <p>By uploading or publishing any content, you ("Creator," "you," "your") agree to this Agreement.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. DEFINITIONS</h2>
              
              <h3 className="font-semibold">Content</h3>
              <p>Any media uploaded to the Platform including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Video</li>
                <li>Audio</li>
                <li>Images</li>
                <li>Text</li>
                <li>Blogs / Posts</li>
                <li>AI-generated works</li>
                <li>Livestreams</li>
                <li>Thumbnails</li>
                <li>Titles, captions, and descriptions</li>
                <li>Metadata and tags</li>
              </ul>

              <h3 className="font-semibold">Creator</h3>
              <p>A person or entity who uploads Content to the Platform.</p>

              <h3 className="font-semibold">License</h3>
              <p>A legal permission allowing Flock to use and distribute Content to operate the Platform.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. OWNERSHIP OF CONTENT</h2>
              
              <h3 className="font-semibold">2.1 YOU OWN YOUR ORIGINAL WORK</h3>
              <p>If you upload original content, you retain ownership.</p>
              <p>Flock does not claim full ownership of your content.</p>
              <p>However (read carefully):</p>

              <h3 className="font-semibold">2.2 YOU GRANT FLOCK A LICENSE</h3>
              <p>Effective immediately upon upload, you grant Flock:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>✔ A worldwide</li>
                <li>✔ non-exclusive</li>
                <li>✔ royalty-free</li>
                <li>✔ transferable</li>
                <li>✔ sublicensable</li>
                <li>✔ irrevocable during the lifecycle of the content</li>
                <li>✔ license to:</li>
              </ul>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Host</li>
                <li>Store</li>
                <li>Cache</li>
                <li>Transcode</li>
                <li>Digitally distribute</li>
                <li>Display publicly</li>
                <li>Create thumbnails</li>
                <li>Surface in recommendations</li>
                <li>Promote your content</li>
                <li>Monetize via advertising or performance tools</li>
                <li>Allow access on third-party networks</li>
                <li>Deliver content through CDN partners</li>
              </ul>
              <p>This license allows Flock to operate a functioning platform and cannot be recalled after upload.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. SCOPE OF LICENSE (IMPORTANT)</h2>
              <p>You authorize Flock to display your content:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Globally</li>
                <li>On any platform interface</li>
                <li>On any Flock product or future vertical</li>
                <li>To any user or viewer</li>
                <li>Via third-party distribution or caching</li>
              </ul>
              <p>This license extends to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Search indexing</li>
                <li>Device optimization</li>
                <li>Performance optimization</li>
                <li>AI recommendation systems</li>
              </ul>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Produce preview clips</li>
                <li>Temporarily resize or reformat</li>
                <li>Crop or compress for performance</li>
                <li>Generate automated thumbnails</li>
              </ul>
              <p>All of this is standard operating procedure.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. CONTENT REMOVAL & LICENSE CONTINUITY</h2>
              <p>You may delete your content at any time.</p>
              <p>However:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Removing content does not cancel earnings earned before removal.</li>
                <li>Monetization adjustments following removal remain valid.</li>
                <li>Data and analytics tied to removed content remain Flock's property.</li>
                <li>Flock may retain copies for legal, financial, investigative, or compliance purposes.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. NON-ORIGINAL CONTENT — STRICT LIABILITY</h2>
              <p>Creators must own or have permission to upload their content.</p>
              <p>You agree that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You are the legal owner OR have a valid license</li>
                <li>You have the right to grant Flock the above license</li>
                <li>Your content does not violate copyright, trademarks, or publicity rights</li>
              </ul>
              <p>Creators are solely responsible for infringement.</p>
              <p>Flock is not required to validate licenses before displaying content.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. AI-GENERATED CONTENT</h2>
              <p>Allowed only if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own the output rights</li>
                <li>It does not replicate recognizable individuals without consent</li>
                <li>It does not infringe on existing IP universes</li>
                <li>It is not deepfake pornography or harassment</li>
              </ul>
              <p>We may request:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Source files</li>
                <li>Prompt history</li>
                <li>Training datasets</li>
                <li>Model information</li>
              </ul>
              <p>Failure to provide evidence may lead to removal.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. PROHIBITED CONTENT FOR LICENSING</h2>
              <p>You may not upload:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pornography</li>
                <li>Child sexual material</li>
                <li>Content encouraging violence</li>
                <li>Live sports or broadcast feeds</li>
                <li>Movies, TV shows, game cinematics</li>
                <li>School course recordings</li>
                <li>TikTok / YouTube / IG reposts</li>
                <li>Purchased viral packs</li>
                <li>Pirated or stolen media</li>
              </ul>
              <p>Uploading these is a violation of:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>DMCA</li>
                <li>Copyright law</li>
                <li>Platform Acceptable Use Policy</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. DISTRIBUTION BY FLOCK</h2>
              <p>You consent to your content being shown:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Worldwide</li>
                <li>Across product versions</li>
                <li>Embedded or previewed</li>
                <li>In recommendation modules</li>
                <li>In search and discovery</li>
                <li>In feeds, lists, categories, "nests"</li>
              </ul>
              <p>You grant Flock the right to display content to users without limitation to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Geography</li>
                <li>Language</li>
                <li>Device</li>
                <li>Region</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. MONETIZATION RIGHTS</h2>
              
              <h3 className="font-semibold">9.1 Platform-Controlled</h3>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Monetize content through ads</li>
                <li>Optimize ad placement</li>
                <li>Change ad providers</li>
                <li>Adjust payout formulas</li>
              </ul>
              <p>Creators do not control:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ad type</li>
                <li>Ad frequency</li>
                <li>Revenue models</li>
                <li>Regional monetization</li>
              </ul>

              <h3 className="font-semibold">9.2 Earnings Do Not Transfer Ownership</h3>
              <p>Revenue is not proof of copyright ownership.</p>
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>A clip going viral does not give the creator copyright</li>
                <li>Reposts with monetization are still illegal</li>
              </ul>

              <h3 className="font-semibold">9.3 Monetization May Be Withheld</h3>
              <p>If:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Copyright disputes arise</li>
                <li>Identity cannot be verified</li>
                <li>Fraud or risky traffic detected</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. BRANDING, TRADEMARKS & VISUAL USE</h2>
              <p>Flock may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Display your username, handle, or branding</li>
                <li>Show content previews in marketing</li>
                <li>Use excerpts in internal dashboards</li>
                <li>Publish platform statistics or anonymized data</li>
              </ul>
              <p>Creators may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use Flock's name or logo in misleading ways</li>
                <li>Claim official partnership unless formally contracted</li>
                <li>Infer employment or agency relationship</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. END OF RELATIONSHIP</h2>
              <p>If you close your account:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You may request deletion of your remaining content</li>
                <li>Backups & legal copies may remain</li>
                <li>Analytics remain owned by Flock</li>
                <li>Monetization liabilities remain enforceable</li>
              </ul>
              <p>Content posted during your time on the platform remains governed by the License active at time of upload.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. NO RETROACTIVE CLAIMS</h2>
              <p>Creators may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Demand retroactive takedowns</li>
                <li>Demand revenue on historical platform tests</li>
                <li>Claim ownership of algorithmic previews</li>
                <li>Reject discovery placement after audience growth</li>
                <li>Withdraw consent after monetization occurs</li>
              </ul>
              <p>This prevents "revisionist negotiation" tactics after viral success or testing-round inflation.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">13. DISPUTES OVER OWNERSHIP</h2>
              <p>If ownership is unclear:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Flock will remove the content temporarily</li>
                <li>Flock will ask parties to resolve legally</li>
                <li>Flock is not obligated to produce mediation</li>
                <li>Flock may permanently suspend monetization</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">14. RELATIONSHIP DISCLAIMER</h2>
              <p>Uploading content does not create:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Employment</li>
                <li>Partnership</li>
                <li>Franchise</li>
                <li>Joint venture</li>
                <li>Agency</li>
                <li>Ambassador relationships</li>
              </ul>
              <p>Creators are independent digital publishers.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">15. INDEMNIFICATION</h2>
              <p>You agree to indemnify and hold harmless Flock against claims from:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Copyright holders</li>
                <li>Brands</li>
                <li>Users</li>
                <li>Governments</li>
                <li>Payment partners</li>
                <li>Advertising networks</li>
                <li>Litigation fees</li>
              </ul>
              <p>This indemnification survives:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account closure</li>
                <li>Content deletion</li>
                <li>Termination</li>
              </ul>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">16. UPDATES TO THIS AGREEMENT</h2>
              <p>We may modify this Agreement at any time.</p>
              <p>Updates are effective once posted.</p>
              <p>Continued upload = consent.</p>
            </section>

            {/* Section 17 */}
            <section className="-space-y-1">
              <h2 className="text-2xl font-bold mb-4">17. CONTACT</h2>
              <p className="font-bold">Licensing & Ownership inquiries:</p>
              <p className="mb-2">admin@flocktogether.xyz</p>
              <p className="font-bold">Copyright inquiries:</p>
              <p className="mb-2">admin@flocktogether.xyz</p>
              <p className="font-bold">Legal Address:</p>
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
