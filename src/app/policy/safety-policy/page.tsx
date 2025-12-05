"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function SafetyPolicyPage() {
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
          <Link href="/contact" className="text-white hover:text-white font-medium hover:underline transition-all">
            Contact Us
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/privacy-policy" className="text-white hover:text-white font-medium hover:underline transition-all">
            Privacy Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/terms-of-service" className="text-white hover:text-white font-medium hover:underline transition-all">
            Terms of Service
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/community-guidelines" className="text-white hover:text-white font-medium hover:underline transition-all">
            Community Guidelines
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/acceptable-use-policy" className="text-white hover:text-white font-medium hover:underline transition-all">
            Acceptable Use Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/policy/safety-policy" className="text-white hover:text-white font-medium hover:underline transition-all">
            Safety Policy
          </Link>
          <span className="text-white/40">•</span>
          <Link href="/about-us" className="text-white hover:text-white font-medium hover:underline transition-all">
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
              SAFETY & REPORTING POLICY — FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                The Safety & Reporting Policy ("Policy") describes how users can protect themselves, report problematic content, and how Flock Together Global LLC ("Flock," "we," "our," "us") responds to threats, abuse, or harmful behavior on{" "}
                <a
                  href="https://flocktogether.xyz"
                  className="text-blue-600 underline ml-1"
                >
                  https://flocktogether.xyz
                </a> (the "Platform").
              </p>

              <p>This Policy supplements the:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Terms of Service</li>
                <li>Community Guidelines</li>
                <li>Acceptable Use Policy</li>
                <li>Earnings & Monetization Policy</li>
                <li>DMCA Policy</li>
                <li>Privacy Policy</li>
              </ul>

              <p>By using the Platform, you agree to the obligations below.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. OUR COMMITMENT TO SAFETY</h2>
              <p>Flock is committed to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Empowering creators and audiences</li>
                <li>Preventing exploitation, abuse, harassment, and misinformation</li>
                <li>Protecting minors</li>
                <li>Responding to risk in a timely manner</li>
                <li>Respecting lawful speech</li>
              </ul>
              <p>We do not moderate based on:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Opinions</li>
                <li>Political ideology</li>
                <li>Religion</li>
                <li>Artistic expression</li>
              </ul>
              <p>We do moderate based on harm, as defined in our Community Guidelines.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. DEFINITIONS</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>User</strong> — any person using the Platform.</li>
                <li><strong>Report</strong> — a formal notice of harm or violation.</li>
                <li><strong>Victim</strong> — the person targeted or affected.</li>
                <li><strong>Abusive Content</strong> — content or behavior that violates this Policy or applicable law.</li>
                <li><strong>Threat</strong> — statements involving violence, coercion, suicide, or endangerment.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. ZERO-TOLERANCE AREAS</h2>
              <p>The following result in immediate removal and escalation:</p>

              <h3 className="font-semibold">3.1 Child Safety Violations</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Grooming or sexual messaging toward minors</li>
                <li>Underage sexual content</li>
                <li>Endangerment or exploitation</li>
              </ul>
              <p>We will report incidents to law enforcement and NCMEC where required.</p>

              <h3 className="font-semibold">3.2 Suicide or Self-Harm Encouragement</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>"Kill yourself"</li>
                <li>Self-harm instructions</li>
                <li>Encouraging eating disorders</li>
                <li>Romanticizing self-harm communities</li>
              </ul>

              <h3 className="font-semibold">3.3 Terrorism & Extremism</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Recruitment</li>
                <li>Praising violent attacks</li>
                <li>Threats against protected groups</li>
              </ul>

              <h3 className="font-semibold">3.4 Violent Threats</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Targeted threats</li>
                <li>Doxxing</li>
                <li>"I will hurt you / your family"</li>
                <li>Stalking/blackmail</li>
              </ul>
              <p>These violations may result in immediate and permanent account bans.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. PROHIBITED BEHAVIOR</h2>
              <p>The following are not permitted:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Harassment, bullying, or intimidation</li>
                <li>Hate speech</li>
                <li>Invasive sexual remarks</li>
                <li>Revenge porn</li>
                <li>Non-consensual intimate content</li>
                <li>Malicious false reporting ("brigading")</li>
              </ul>
              <p>We moderate actions, not feelings.</p>
              <p>We do not penalize criticisms or opinions unless tied to harm.</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. RESPONSIBILITIES OF CREATORS</h2>
              <p>Creators agree to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Moderate the communities they grow</li>
                <li>Remove dangerous comments</li>
                <li>Block abusive accounts</li>
                <li>Report violations when necessary</li>
              </ul>
              <p>Creators who ignore repeated issues may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Lose monetization privileges</li>
                <li>Have uploads disabled</li>
                <li>Receive account restrictions</li>
              </ul>
              <p>Creators are not responsible for policing the entire platform, only their own uploads and community spaces.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. REPORTING PROCESS</h2>
              <p>To report content, users must provide:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The URL of the offending content</li>
                <li>Username(s) involved</li>
                <li>Screenshots (where applicable)</li>
                <li>Clear reason for concern</li>
              </ul>
              <p>Reports submitted without usable evidence may be ignored.</p>

              <h3 className="font-semibold">6.1 How to Report</h3>
              <p className="font-semibold">Option A — In-Platform Reporting</p>
              <p>Every piece of content will include a Report option.</p>
              <p className="font-semibold">Option B — Direct Email</p>
              <p>
                <a href="mailto:safety@flocktogether.xyz" className="text-blue-600 underline">
                  safety@flocktogether.xyz
                </a>
              </p>
              <p>Include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Full name</li>
                <li>Email</li>
                <li>Platform username</li>
                <li>Detailed description of the harm</li>
                <li>Links to content</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. PRIORITY INVESTIGATION CRITERIA</h2>
              <p>We respond fastest to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Child exploitation</li>
                <li>Threats of violence</li>
                <li>Suicide or self-harm attempts</li>
                <li>Live harassment campaigns</li>
                <li>Active scams or fraudulent monetization</li>
              </ul>
              <p>Reports related to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>UI preferences</li>
                <li>Creative disagreements</li>
                <li>Hurt feelings</li>
              </ul>
              <p>are not treated as emergencies.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. LAW ENFORCEMENT & LEGAL REQUESTS</h2>
              <p>We may disclose limited user information when:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We receive legally valid subpoenas</li>
                <li>We believe users are in danger</li>
                <li>Child Safety is in question</li>
                <li>We detect financial crime or exploitation</li>
                <li>A formal legal investigation is underway</li>
              </ul>
              <p>We will not warn a user prior to disclosure if prohibited by law.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. WHAT FLOCK DOES NOT DO</h2>
              <p>We do not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mediate interpersonal disputes</li>
                <li>Enforce personal morality</li>
                <li>Guarantee audience behavior</li>
                <li>Interfere in creator-to-creator drama</li>
                <li>Validate medical, financial, or life advice</li>
              </ul>
              <p>We take action only when safety is threatened or legal boundaries are crossed.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. FALSE OR MALICIOUS REPORTING</h2>
              <p>Weaponized reporting is prohibited.</p>
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mass-report campaigns</li>
                <li>Coordinated attempts to sabotage a competitor</li>
                <li>Abuse of legal policies to silence critics</li>
              </ul>
              <p>Penalties include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account suspension</li>
                <li>Permanent ban</li>
                <li>Legal exposure</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. ANONYMITY & RETALIATION</h2>
              <p>We may anonymize report sources to protect victims from retaliation.</p>
              <p>Creators or users found retaliating will be sanctioned.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. APPEALS</h2>
              <p>Users may appeal moderation decisions once.</p>
              <p>Appeals must include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Context</li>
                <li>Evidence</li>
                <li>URL(s)</li>
                <li>Explanation why violation did not occur</li>
              </ul>
              <p>Appeals may be denied if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Clear rule violation occurred</li>
                <li>User has repeated infractions</li>
                <li>Fraud or coordinated abuse is detected</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. PLATFORM INTERVENTION</h2>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Remove content</li>
                <li>Disable monetization</li>
                <li>Restrict uploads</li>
                <li>Limit account visibility</li>
                <li>Freeze payouts</li>
                <li>Ban accounts</li>
                <li>Ban devices or payment methods</li>
              </ul>
              <p>We act at our sole discretion.</p>
              <p>We are not required to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide warnings</li>
                <li>Negotiate with users</li>
                <li>Justify enforcement publicly</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. DO NOT HANDLE EMERGENCIES THROUGH FLOCK</h2>
              <p>Flock is not crisis intervention.</p>
              <p>For urgent matters, contact:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Local emergency services</li>
                <li>Suicide prevention agencies</li>
                <li>Cybercrime units</li>
              </ul>
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Immediate threats to life</li>
                <li>Kidnapping or danger</li>
                <li>Active doxxing with real-world risk</li>
              </ul>
              <p>Use your country's emergency channels.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. GLOBAL COMPLIANCE</h2>
              <p>This policy aligns with:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>COPPA (US child safety)</li>
                <li>CCPA/CPRA (California harm provisions)</li>
                <li>GDPR principles</li>
                <li>US Online Harms frameworks</li>
                <li>Industry standard moderation duty of care</li>
              </ul>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">16. CHANGES TO THIS POLICY</h2>
              <p>We may update this Policy at any time.</p>
              <p>Continued use of the Platform constitutes acceptance.</p>
            </section>

            {/* Section 17 */}
            <section className="-space-y-1">
              <h2 className="text-3xl font-bold mb-4">17. CONTACT</h2>
              <p className="mb-2">For safety, abuse, or urgent concerns:</p>
              <p className="font-bold">Safety Team Email:</p>
              <p>
                <a href="mailto:admin@flocktogether.xyz" className="text-blue-600 underline">
                  admin@flocktogether.xyz
                </a>
              </p>
              <p className="font-bold mt-4">Legal Address:</p>
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

