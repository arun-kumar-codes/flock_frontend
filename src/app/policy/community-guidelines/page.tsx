"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | "ADMIN" | null;

export default function CommunityGuidelinesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setAuthChecked(false);

      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      if (!accessToken) {
        setIsLoggedIn(false);
        setRole(null);
        setAuthChecked(true);
        return;
      }

      try {
        const res = await getUserProfile();

        if (res?.status === 200) {
          setIsLoggedIn(true);

          // role might be in res.data.user.role OR res.data.role depending on your API
          const rawRole = res?.data?.user?.role ?? res?.data?.role ?? null;

          // Normalize to avoid "creator"/"CREATOR"/" Creator "
          const normalized =
            typeof rawRole === "string" ? rawRole.trim().toUpperCase() : null;

          if (normalized === "CREATOR" || normalized === "VIEWER" || normalized === "ADMIN") {
            setRole(normalized);
          } else {
            setRole(null);
          }
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setRole(null);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const homeHref = useMemo(() => {
    if (role === "ADMIN") return "/admin";
    if (role === "CREATOR") return "/dashboard";
    if (role === "VIEWER") return "/viewer";
    return null;
  }, [role]);
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
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

          {/* Right Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            {!authChecked ? null : !isLoggedIn ? (
              <>
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
              </>
            ) : homeHref ? (
              <Link
                href={homeHref}
                className="bg-white/95 text-black font-semibold px-4 md:px-6 py-2 rounded-xl hover:bg-white hover:text-purple-900 transition-all shadow-lg"
              >
                Home
              </Link>
            ) : (
              <button
                disabled
                className="bg-white/70 text-black font-semibold px-4 md:px-6 py-2 rounded-xl shadow-lg opacity-70 cursor-not-allowed"
              >
                Home
              </button>
            )}
          </div>
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
            <p className="text-sm">Last Updated: December 9, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">
            {/* Intro */}
            <section className="space-y-4">
              <p>
                Welcome to FLOCK — a space for creators, audiences, and communities to engage, grow, and
                earn responsibly.
              </p>
              <p>
                These Community Guidelines ("Guidelines") explain what is and is not allowed on
                Flocktogether.xyz (the "Platform"). They apply to all users, including viewers, creators,
                advertisers, moderators, and brand partners.
              </p>
              <p>These Guidelines work together with our:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>DMCA & Copyright Policy</li>
                <li>Acceptable Use Policy</li>
                <li>Monetization Policy</li>
                <li>Safety & Reporting Policy</li>
              </ul>
              <p>By using FLOCK, you agree to comply with these Guidelines.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. CORE VALUES</h2>
              <p>FLOCK is built on the following principles:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Safety:</strong> Every user should feel protected.</li>
                <li><strong>Authenticity:</strong> Content must not mislead, exploit, or manipulate.</li>
                <li><strong>Respect:</strong> Harassment, hate, and exploitation are not tolerated.</li>
                <li><strong>Creativity:</strong> Originality and intellectual property are protected.</li>
                <li><strong>Responsibility:</strong> Monetization is a privilege, not an entitlement.</li>
              </ul>
              <p>Creators who consistently violate these Guidelines may lose access to:</p>
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
              <h2 className="text-2xl font-bold">2. ZERO-TOLERANCE VIOLATIONS</h2>
              <p>The following violations may result in immediate removal or permanent ban:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Child sexual exploitation or abuse</li>
                <li>Human trafficking or sexual coercion</li>
                <li>Extremism or terrorism advocacy</li>
                <li>Non-consensual sexual content</li>
                <li>Incitement to violence</li>
                <li>Fraudulent impersonation or account takeover</li>
                <li>Malicious hacking or data theft attempts</li>
              </ul>
              <p>Law enforcement may be contacted where required by law.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. SAFETY OF MINORS (CRITICAL)</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Minimum age to use FLOCK: 13+ (consistent with global child safety laws)</li>
                <li>Monetization eligibility: 18+ or legally documented guardian oversight</li>
              </ul>
              <p>We remove content involving:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sexualization of anyone under 18</li>
                <li>Nude or suggestive depictions of minors</li>
                <li>Underage drinking or drug promotion</li>
                <li>Dangerous challenges encouraging harm</li>
                <li>Attempts to solicit or groom minors</li>
              </ul>
              <p>Suspected child abuse will be reported to authorities.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. SEXUAL CONTENT & ADULT MATERIAL</h2>
              <p>FLOCK is not an adult content platform.</p>
              <p>Allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Educational content about relationships or sexuality</li>
                <li>Health or medical information</li>
                <li>Art, fashion, and body positivity within community standards</li>
                <li>Editorial or journalistic discussion of adult themes</li>
              </ul>
              <p>Not Allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pornography</li>
                <li>Explicit sexual acts</li>
                <li>Genital display</li>
                <li>Fetish content or sexualized body focus</li>
                <li>Sexual exploitation or sexualized depictions of minors</li>
              </ul>
              <p>Repeated violations may result in monetization loss and permanent ban.</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. HATE, ABUSE & DISCRIMINATION</h2>
              <p>We prohibit content targeting individuals or groups based on:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Race or ethnicity</li>
                <li>Religion</li>
                <li>Gender or gender identity</li>
                <li>Sexual orientation</li>
                <li>Disability or health condition</li>
                <li>Nationality or immigration status</li>
                <li>Socioeconomic status</li>
                <li>Body type, age, or veteran status</li>
              </ul>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Calls for harm or exclusion</li>
                <li>Harassment or intimidation campaigns</li>
                <li>Slurs, dehumanization, or hateful stereotypes</li>
                <li>Encouragement of real-world violence</li>
              </ul>
              <p>Criticism of ideas or institutions is allowed; attacks on identifiable individuals or protected groups
                are not.</p>
            </section>

             {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. SELF-HARM, SUICIDE & DANGEROUS ACTS</h2>
              <p>Prohibited:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Encouragement of self-harm or suicide</li>
                <li>Depictions of suicide attempts</li>
                <li>Instructions or methods for self-harm</li>
                <li>Romanticizing or aestheticizing self-harm</li>
              </ul>
              <p>Allowed with care:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Recovery stories</li>
                <li>Mental health education</li>
                <li>Support resources</li>
              </ul>
              <p>Creators must use appropriate trigger warnings where applicable.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. VIOLENCE, DANGEROUS BEHAVIOR & CRIMINAL ACTIVITY</h2>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Threats or glorification of violence</li>
                <li>Celebration of violent acts</li>
                <li>Graphic real-world injury footage</li>
                <li>Manufacturing or use of weapons</li>
                <li>Promotion of illegal drugs</li>
                <li>Organized criminal schemes</li>
                <li>Dangerous challenges</li>
              </ul>
              <p>Allowed on a case-by-case basis:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>News reporting</li>
                <li>Documentary content</li>
                <li>War or conflict analysis</li>
                <li>Educational self-defense</li>
              </ul>
              <p>Context and responsibility are required.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. MISINFORMATION & MANIPULATION</h2>
              <p>FLOCK prohibits harmful or deceptive misinformation, including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>False medical or health advice</li>
                <li>Public health misinformation (e.g., COVID-19)</li>
                <li>Financial scams or false investment claims</li>
                <li>Pyramid schemes</li>
                <li>Election interference</li>
                <li>Deepfake impersonation</li>
              </ul>
              <p>We may remove content, disable monetization, or apply warning labels.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. SPAM, ENGAGEMENT FRAUD & PLATFORM ABUSE</h2>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Artificial inflation of views, follows, comments, or watch time</li>
                <li>Paid engagement services</li>
                <li>Mass repetitive posting</li>
                <li>Automated bot accounts</li>
                <li>Keyword stuffing</li>
                <li>"Copycat repost farms"</li>
              </ul>
              <p>Enforcement may include revenue removal, stat resets, or account suspension.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. COPYRIGHT & FAIR USE</h2>
              <p>Creators must upload only original or properly licensed content.</p>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reuploads from YouTube, TikTok, Instagram, Patreon, or similar platforms</li>
                <li>Movie clips, TV shows, or sports highlights</li>
                <li>Stolen memes, articles, or blog posts</li>
                <li>AI-generated content using protected intellectual property</li>
              </ul>
              <p>Permitted uses must be clearly transformative, such as:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Commentary</li>
                <li>Analysis</li>
                <li>Educational or documentary context</li>
              </ul>
              <p>Otherwise, content may be removed under the DMCA Policy.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. PRIVACY & NON-CONSENSUAL CONTENT</h2>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Doxxing</li>
                <li>Posting private phone numbers, addresses, or IDs</li>
                <li>Revenge porn or intimate imagery without consent</li>
                <li>Hidden camera or voyeur recordings</li>
                <li>"Exposing" private individuals</li>
              </ul>
              <p>Criticism of public figures must remain lawful and non-abusive.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. SCAMS, FRAUD & COMMERCIAL DECEPTION</h2>
              <p>Not allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ponzi or pyramid schemes</li>
                <li>Crypto pump-and-dump activity</li>
                <li>MLM recruitment</li>
                <li>Fake giveaways</li>
                <li>Fraudulent investment coaching</li>
                <li>Identity theft</li>
                <li>"Get rich online" deception campaigns</li>
              </ul>
              <p>Any monetization earned through fraud will be fully revoked.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">13. AI CONTENT POLICY</h2>
              <h3 className="text-lg font-semibold">13.1 Allowed Use</h3>
              <p>AI content is permitted if it is:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Properly disclosed where required</li>
                <li>Transformative</li>
                <li>Non-infringing</li>
                <li>Not impersonating real individuals</li>
              </ul>
              <h3 className="text-lg font-semibold">13.2 Prohibited Use</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Deepfakes of real people without consent</li>
                <li>Use of copyrighted characters or likenesses</li>
              </ul>
              <h3 className="text-lg font-semibold">13.3 Review & Monetization</h3>
              <p>AI content may be subject to manual review before monetization approval.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">14. CREATOR RESPONSIBILITY</h2>
              <p>Creators are responsible for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All content they publish</li>
                <li>Moderating their community spaces</li>
                <li>Reporting harmful behavior or users</li>
              </ul>
              <p>Repeated negligence may result in demonetization or enforcement action.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">15. ENFORCEMENT ACTIONS</h2>
              <p>Possible actions include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Warnings</li>
                <li>Content removal</li>
                <li>Feature restrictions</li>
                <li>Demonetization</li>
                <li>Upload limits</li>
                <li>Account suspension</li>
                <li>IP or device bans</li>
                <li>Permanent termination</li>
                <li>Law enforcement referrals</li>
              </ul>
              <p>Severity is determined by harm, repetition, intent, and scale. Enforcement may apply across
                linked accounts.</p>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">16. REPORTING VIOLATIONS</h2>
              <p>Reports may be submitted via in-platform tools or by email to safety@flocktogether.xyz.</p>
              <p>Please include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>URLs</li>
                <li>Usernames</li>
                <li>Screenshots</li>
                <li>A brief description</li>
              </ul>
              <p>False or abusive reporting may result in penalties.</p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">17. APPEALS</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Users may appeal enforcement actions once.</li>
                <li>Appeals must be honest, detailed, and contextual.</li>
              </ul>
              <p>Appeals may be denied for repeat violations, illegal content, or zero-tolerance breaches.</p>
              <p>Circumventing enforcement voids appeal rights.</p>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">18. GLOBAL COMPLIANCE</h2>
              <p>FLOCK complies with applicable laws, including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>COPPA</li>
                <li>GDPR</li>
                <li>CCPA / CPRA</li>
                <li>International online safety regulations</li>
              </ul>
              <p>Creators are responsible for understanding and complying with local laws and tax obligations.</p>
            </section>

            {/* Section 19 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">19. CHANGES TO THESE GUIDELINES</h2>
              <p>Updates take effect upon posting.</p>
              <p>Material changes may be communicated via notice or email.</p>
            </section>

            {/* Section 20 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">20. CONTACT</h2>
              <p>Email: support@flocktogether.xyz</p>
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
