"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function CommunityGuidelinesPage() {
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
FLOCK COMMUNITY GUIDELINES
            </h1>
            <p className="text-sm">Last Updated: December 1, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">

            {/* Intro */}
            <section className="space-y-4">
              <p>
                Welcome to FLOCK — a space for creators, audiences, and communities to engage, grow, and earn responsibly.
              </p>
              <p>
                These Community Guidelines ("Guidelines") explain what is and is not allowed on Flocktogether.xyz (the "Platform"). They apply to all users, viewers, creators, advertisers, moderators, and brand partners.
              </p>
              <p>These Guidelines work together with:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>DMCA Policy</li>
                <li>Acceptable Use Policy</li>
                <li>Monetization Policy</li>
                <li>Safety & Reporting Policy</li>
              </ul>
              <p>By using FLOCK, you agree to comply with these Guidelines.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. CORE VALUES</h2>
              <p>We built FLOCK on these principles:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Safety:</strong> Every user should feel protected.</li>
                <li><strong>Authenticity:</strong> Content must not mislead, exploit, or manipulate.</li>
                <li><strong>Respect:</strong> We do not tolerate harassment, hate, or exploitation.</li>
                <li><strong>Creativity:</strong> We protect originality and intellectual property.</li>
                <li><strong>Responsibility:</strong> Monetization is a privilege, not an entitlement.</li>
              </ul>
              <p>Creators who consistently violate these Guidelines may lose:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Earnings</li>
                <li>Platform features</li>
                <li>Upload permissions</li>
                <li>Monetization eligibility</li>
                <li>Account access</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. ZERO TOLERANCE AREAS</h2>
              <p>These violations lead to immediate removal or permanent ban:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Child sexual exploitation or abuse</li>
                <li>Human trafficking or sexual coercion</li>
                <li>Extremism or terrorism advocacy</li>
                <li>Non-consensual sexual content</li>
                <li>Incitement to violence</li>
                <li>Fraudulent impersonation or account takeover</li>
                <li>Malicious hacking or data theft attempts</li>
              </ul>
              <p>Law enforcement may be contacted where required.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. SAFETY OF MINORS (CRITICAL)</h2>
              <p>Minimum age to use FLOCK: <strong>13+</strong></p>
              <p>(consistent with global digital child safety laws)</p>
              <p>Monetization: <strong>18+</strong> or legally documented guardian oversight.</p>
              <p>We remove:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content sexualizing anyone under 18</li>
                <li>Nude or suggestive depictions involving minors</li>
                <li>Underage drinking or drug promotion</li>
                <li>Dangerous challenges encouraging harm</li>
                <li>Attempts to solicit minors</li>
              </ul>
              <p>We will report suspected child abuse to authorities.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. SEXUAL CONTENT & ADULT MATERIAL</h2>
              <p className="font-bold">FLOCK is not an adult content platform.</p>
              <p>Allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Educational content about relationships or sexuality</li>
                <li>Health or medical information</li>
                <li>Art, fashion, body positivity within community standards</li>
                <li>Editorial discussion of adult themes</li>
              </ul>
              <p>Not Allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pornography</li>
                <li>Explicit sexual acts</li>
                <li>Genital display</li>
                <li>Fetish, fetish bait, or sexualized body focus</li>
                <li>Sexually exploitative posing or minors</li>
              </ul>
              <p>Repeated violations → monetization loss + permanent ban</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. HATE, ABUSE, DISCRIMINATION</h2>
              <p>We prohibit content targeting people based on:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Race or ethnicity</li>
                <li>Religion</li>
                <li>Gender or gender identity</li>
                <li>Sexual orientation</li>
                <li>Disability or health condition</li>
                <li>Nationality or immigration status</li>
                <li>Socioeconomic class</li>
                <li>Body type or age</li>
                <li>Veteran status</li>
              </ul>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Calls for harm or exclusion</li>
                <li>Harassment campaigns</li>
                <li>Slurs, dehumanization, hateful stereotypes</li>
                <li>Encouraging real-world violence</li>
              </ul>
              <p>You may criticize ideas or institutions — not identifiable groups or individuals.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. SELF-HARM, SUICIDE, DANGEROUS ACTS</h2>
              <p>We prohibit:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Encouraging self-harm or suicide</li>
                <li>Attempts at self-harm</li>
                <li>Instructions on how to commit suicide</li>
                <li>Romanticizing or aestheticizing self-harm</li>
              </ul>
              <p>Allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Recovery stories</li>
                <li>Mental health resources</li>
                <li>Educational awareness</li>
              </ul>
              <p>Creators must use trigger warnings.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. VIOLENCE, DANGEROUS BEHAVIOR & CRIMINAL ACTIVITY</h2>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Threats of violence</li>
                <li>Celebration of violent acts</li>
                <li>Real-world graphic injury footage</li>
                <li>Manufacturing weapons</li>
                <li>Promoting illegal drugs</li>
                <li>Organized criminal schemes</li>
                <li>Dangerous challenges</li>
              </ul>
              <p>Allowed (case-by-case):</p>
              <ul className="list-disc list-inside space-y-1">
                <li>News coverage</li>
                <li>Documentary reporting</li>
                <li>War or conflict commentary</li>
                <li>Educational self-defense</li>
              </ul>
              <p>Creators must maintain context and responsibility.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. MISINFORMATION & MANIPULATION</h2>
              <p>FLOCK prohibits harmful or deceptive misinformation, including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>False medical advice</li>
                <li>COVID-19 or public health misinformation</li>
                <li>Financial scams</li>
                <li>Pyramid schemes</li>
                <li>Election interference</li>
                <li>Deepfake impersonation</li>
              </ul>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Remove content</li>
                <li>Disable monetization</li>
                <li>Apply warning labels</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. SPAM, ENGAGEMENT FRAUD & PLATFORM ABUSE</h2>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Artificial inflation of views, follows, comments, or watch time</li>
                <li>Paid "engagement services"</li>
                <li>Mass posting of repetitive content</li>
                <li>Automated bot accounts</li>
                <li>Keyword stuffing</li>
                <li>"Copycat repost farms"</li>
              </ul>
              <p>We may:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Strip monetization revenue</li>
                <li>Reset stats</li>
                <li>Suspend accounts</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. COPYRIGHT & FAIR USE</h2>
              <p className="font-bold">Creators MUST upload original or licensed content.</p>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reuploads from YouTube / TikTok / IG / Patreon</li>
                <li>Movie clips, TV shows, sports highlights</li>
                <li>Stolen memes or blog posts</li>
                <li>AI-generated content using protected IP</li>
              </ul>
              <p>If content contains copyrighted elements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use commentary</li>
                <li>Analysis</li>
                <li>Education</li>
                <li>Documentary context</li>
              </ul>
              <p>Otherwise, it may be removed under the DMCA Policy.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. PRIVACY & NON-CONSENSUAL CONTENT</h2>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Doxxing</li>
                <li>Posting private phone numbers, addresses, IDs</li>
                <li>Revenge porn or intimate imagery without consent</li>
                <li>Hidden camera or voyeur recordings</li>
                <li>"Exposing" non-public individuals</li>
              </ul>
              <p>"Public figure" criticism must remain in bounds.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. SCAMS, FRAUD & COMMERCIAL DECEPTION</h2>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ponzi schemes</li>
                <li>Crypto pump-and-dump</li>
                <li>MLM recruitment</li>
                <li>Fake giveaways ("send me $20 and I'll….")</li>
                <li>Fake investment coaching</li>
                <li>Identity theft</li>
                <li>"Get rich online" campaigns</li>
              </ul>
              <p>Monetization or payout earned using fraud → revocation of all earnings.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">13. AI CONTENT POLICY</h2>
              <p>AI is permitted if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The creator discloses AI involvement where relevant</li>
                <li>The work is clearly transformative</li>
                <li>It does not replicate a person's likeness without consent</li>
                <li>It does not mimic copyrighted IP</li>
              </ul>
              <p>Deepfakes of real humans without consent are banned.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">14. CREATOR RESPONSIBILITY</h2>
              <p>Creators are responsible for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Their content</li>
                <li>Comment moderation on their accounts</li>
                <li>Community conduct in their spaces</li>
              </ul>
              <p>Creators must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Remove abusive comments</li>
                <li>Report harmful users</li>
                <li>Avoid monetizing harmful content</li>
              </ul>
              <p>Repeated negligence → loss of monetization.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">15. ENFORCEMENT ACTIONS</h2>
              <p>We may take actions including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content warnings</li>
                <li>Content removal</li>
                <li>Feature restrictions</li>
                <li>Demonetization</li>
                <li>Upload limits</li>
                <li>Account suspension</li>
                <li>IP/device bans</li>
                <li>Permanent termination</li>
                <li>Referral to authorities</li>
              </ul>
              <p>Severity depends on context, frequency, and harm potential.</p>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">16. REPORTING VIOLATIONS</h2>
              <p>If you see content that violates these Guidelines:</p>
              <p>Report it via the in-platform reporting features or email safety@flocktogether.xyz</p>
              <p>Include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>URL of the content</li>
                <li>Username(s) involved</li>
                <li>Screenshots when possible</li>
                <li>Brief description of harm/violation</li>
              </ul>
              <p>False reporting or harassment will result in penalties.</p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">17. APPEALS</h2>
              <p>You may appeal moderation actions once.</p>
              <p>Appeals must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be honest</li>
                <li>Be detailed</li>
                <li>Provide context</li>
              </ul>
              <p>Appeals may be denied if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You repeatedly violate rules</li>
                <li>The content is clearly illegal</li>
                <li>The violation falls under a zero-tolerance category</li>
              </ul>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">18. GLOBAL COMPLIANCE</h2>
              <p>FLOCK follows international online safety norms including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>COPPA (US child protection)</li>
                <li>GDPR (EU user rights)</li>
                <li>CCPA/CPRA (California privacy)</li>
                <li>Online Safety expectations in EU/UK/Caribbean</li>
              </ul>
              <p>Creators are responsible for understanding their local laws.</p>
            </section>

            {/* Section 19 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">19. CHANGES TO THESE GUIDELINES</h2>
              <p>We may update these Guidelines at any time.</p>
              <p>Updates take effect when posted.</p>
              <p>Material changes will be communicated via notice or email.</p>
            </section>

            {/* Section 20 */}
            <section className="-space-y-1">
              <h2 className="text-2xl font-bold mb-4">20. CONTACT US</h2>
              <p className="mb-3 font-bold">Questions about these Guidelines?</p>
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
