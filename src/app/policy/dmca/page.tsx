"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | "ADMIN" | null;

export default function DmcaPolicyPage() {
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
              DMCA & COPYRIGHT POLICY - FLOCKTOGETHER.XYZ
            </h1>
            <p className="text-sm">Last Updated: December 9, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">
            {/* Intro */}
            <section className="space-y-4">
              <p>
                This DMCA &amp; Copyright Policy (&quot;Policy&quot;) applies to all users of
                https://flocktogether.xyz (the &quot;Platform&quot;), operated by Flock Together
                Global LLC (&quot;Flock,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
              <p>
                Flock complies with the Digital Millennium Copyright Act (DMCA), 17 U.S.C.
                §512, and respects the intellectual property rights of creators, brands,
                publishers, and copyright holders.
              </p>
              <p>By using the Platform, you agree to comply with this Policy.</p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. GENERAL PRINCIPLES</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Creators retain ownership of the content they upload unless otherwise stated.</li>
                <li>
                  Creators are solely responsible for ensuring they have the legal right to upload and
                  monetize content.
                </li>
                <li>Flock does not verify copyright ownership prior to upload.</li>
                <li>We remove infringing content upon receipt of a valid DMCA notice.</li>
                <li>We may suspend or terminate accounts of repeat infringers.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">
                2. WHAT IS COPYRIGHT INFRINGEMENT?
              </h2>
              <p>
                Copyright infringement occurs when someone uses a copyrighted work
                (e.g., video, blog, music track, artwork, written text) without
                lawful permission from the copyright holder or without a legal
                exception such as fair use or public domain.
              </p>
              <p>Examples of infringing uploads include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reposting another creator's video without permission</li>
                <li>Uploading someone's music as your own</li>
                <li>Sharing copyrighted TV clips or movies</li>
                <li>
                  Copying a blog/article from another website and publishing it as
                  original content
                </li>
                <li>
                  Uploading AI-generated work that includes recognizable
                  copyrighted content
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">
                3. WHAT IS NOT COPYRIGHT INFRINGEMENT?
              </h2>
              <p>Copyright law allows some uses without permission, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fair Use (commentary, criticism, parody, transformative review, news reporting)</li>
                <li>Public Domain works</li>
                <li>Licensed works (content you have permission to use)</li>
                <li>Original works you created yourself</li>
              </ul>
              <p>We cannot pre-judge legal defenses.</p>
              <p>We respond to properly formatted DMCA notices only.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. CONTENT YOU MAY NOT UPLOAD</h2>
              <p>Creators may not upload:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Movies, TV shows, documentaries</li>
                <li>Professional sports broadcasts</li>
                <li>Music they don't own or license</li>
                <li>Clips from other social media apps (TikTok, YouTube, Instagram, etc.)</li>
                <li>Material from streaming services</li>
                <li>Stock footage without rights</li>
                <li>Content produced by others without their permission</li>
              </ul>
              <p>
                AI-generated material trained on copyrighted assets that recreate identifiable works is also
                prohibited.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">
                5. COPYRIGHT OWNERSHIP & USER LIABILITY
              </h2>
              <p>Creators retain copyright over their original uploads, but:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  You grant Flock a limited, non-exclusive license to display &
                  distribute your content.
                </li>
                <li>You guarantee you have rights to everything uploaded.</li>
                <li>
                  You indemnify Flock against copyright claims arising from your
                  uploads.
                </li>
                <li>
                  Creators bear full legal liability for infringement, not the
                  Platform.
                </li>
              </ul>
              <p>This is core to maintaining DMCA Safe Harbor.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">
                6. HOW TO SUBMIT A VALID DMCA TAKEDOWN NOTICE
              </h2>
              <p>
                If you believe your copyrighted work has been uploaded to FLOCK
                without permission, you may file a DMCA takedown request.
              </p>
              <p>
                To comply with 17 U.S.C. §512(c)(3), your DMCA notice must include:
              </p>
              <p className="font-semibold">1. Your contact information</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your name</li>
                <li>Physical address</li>
                <li>Email (and phone is recommended)</li>
              </ul>
              <p className="font-semibold">
                2. Identification of the copyrighted work claimed to be infringed
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>A URL or description of the original work, or</li>
                <li>A detailed description if it is not available online</li>
              </ul>
              <p className="font-semibold">
                3. Identification of the material to be removed, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>URL(s) of the specific infringing content on flocktogether.xyz</li>
                <li>A screenshot or general link is not sufficient; exact URLs are required</li>
              </ul>
              <p className="font-semibold">4. Good-faith statement</p>
              <p>
                "I have a good-faith belief that the material identified is not authorized by the copyright
                owner, its agent, or applicable law."
              </p>
              <p className="font-semibold">
                5. Accuracy & authority statement under penalty of perjury
              </p>
              <p>
                "The information in this notice is accurate, and I am the owner of the copyright or
                authorized to act on behalf of the copyright owner."
              </p>
              <p className="font-semibold">6. Your electronic or physical signature</p>
              <p>Send DMCA Notices to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email: support@flocktogether.xyz</li>
                <li>Subject line: DMCA NOTICE - [Your Work Title]</li>
              </ul>
              <p>or by mail to:</p>
              <p>Flock Together Global LLC</p>
              <p>ATTN: Copyright Agent</p>
              <p>30 N Gould St #53789</p>
              <p>Sheridan, WY 82801</p>
              <p>USA</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. INVALID OR INCOMPLETE REQUESTS</h2>
              <p>We may reject takedown notices that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Lack one or more required elements</li>
                <li>Are unclear or non-specific (e.g., no exact URLs)</li>
                <li>
                  Appear to be automatically generated (e.g., bulk or AI-driven notices) without the legally
                  required statements or details
                </li>
                <li>Attempt to remove lawful transformative or fair use content</li>
                <li>Are retaliatory, abusive, or clearly filed in bad faith</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. FLOCK'S RESPONSE TO VALID NOTICES</h2>
              <p>If your DMCA notice is valid:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We will remove or disable access to the allegedly infringing content.</li>
                <li>We may notify the user who uploaded it.</li>
                <li>
                  We may provide the uploader with a copy of your complaint (excluding sensitive personal
                  details where possible).
                </li>
                <li>We may lock monetization or suspend accounts during review.</li>
              </ul>
              <p>We are not required to provide advance warning before removal.</p>
              <p>We do not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mediate disputes</li>
                <li>Provide legal advice</li>
                <li>Force parties into settlement</li>
              </ul>
              <p>We only handle the copyright compliance workflow.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. YOUR LEGAL RESPONSIBILITY</h2>
              <p>Submitting a false or malicious copyright notice may result in:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Civil liability</li>
                <li>Legal damages</li>
                <li>Platform suspension or permanent ban</li>
              </ul>
              <p>Perjury in DMCA notices may be prosecutable under U.S. federal law.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. DMCA COUNTER-NOTICE (APPEALS)</h2>
              <p>If your content was removed and you believe:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You own the rights, or</li>
                <li>The takedown was incorrect, or</li>
                <li>The content is protected by law (fair use, license, etc.)</li>
              </ul>
              <p>You may submit a Counter-Notice under 17 U.S.C. §512(g)(3).</p>
              <p>Your Counter-Notice must include:</p>
              <p className="font-semibold">1. Your full legal name</p>
              <p className="font-semibold">2. Your address and telephone number</p>
              <p className="font-semibold">
                3. Identification of the removed material and where it appeared before removal
              </p>
              <p className="font-semibold">4. A sworn statement:</p>
              <p>
                "I have a good-faith belief that the material was removed or disabled as a result of mistake
                or misidentification."
              </p>
              <p className="font-semibold">5. A jurisdiction consent statement:</p>
              <p>
                "I consent to the jurisdiction of the U.S. Federal District Court for the judicial district where I
                live, or if outside the United States, the jurisdiction of the U.S. Federal District Court of
                Wyoming."
              </p>
              <p className="font-semibold">6. Your electronic or physical signature</p>
              <p>Send Counter-Notices to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email: support@flocktogether.xyz</li>
                <li>Subject line: Counter Notice - [Content Title / URL]</li>
              </ul>
              <p>We may forward your Counter-Notice to the original complainant.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. RESTORATION PROCESS (IMPORTANT)</h2>
              <p>Upon receiving a valid Counter-Notice:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We forward it to the original complainant.</li>
                <li>
                  If they do not file a lawsuit within 10–14 business days, the content may be reinstated.
                </li>
              </ul>
              <p>This is standard under DMCA §512(g).</p>
              <p>We do not guarantee reinstatement.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. REPEAT INFRINGEMENT POLICY</h2>
              <p>To maintain Safe Harbor:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Accounts with repeated copyright violations may be suspended or permanently banned.</li>
              </ul>
              <p>We may escalate faster if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content is intentionally pirated</li>
                <li>Copyright evasion is systematic</li>
                <li>Revenue fraud or laundering is suspected</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. FAIR USE & TRANSFORMATIVE CONTENT</h2>
              <p>Examples of legitimate fair use may include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Commentary</li>
                <li>News reporting</li>
                <li>Parody</li>
                <li>Critique</li>
                <li>Documentary context</li>
                <li>Research or educational analysis</li>
              </ul>
              <p>Not fair use (typically):</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Straight reuploads with no transformation</li>
                <li>Compilation channels using large volumes of copyrighted clips</li>
                <li>"Reaction" videos with minimal or no commentary</li>
                <li>"Top 10 moments" or highlight reels from copyrighted media</li>
              </ul>
              <p>
                Transformation must be meaningful and original. Only a court can make a final decision on
                fair use.
              </p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. AI-GENERATED CONTENT</h2>
              <p>AI content is allowed only if:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>It does not recreate real actors or public figures without consent</li>
                <li>It is not trained on restricted datasets without license</li>
                <li>It does not mimic copyrighted franchises or media</li>
              </ul>
              <p>We may request proof of authorship or training data rights.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. MUSIC & SOUND RIGHTS</h2>
              <p>Creators are responsible for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Music synchronization rights</li>
                <li>Instrumental and master rights</li>
                <li>Audio license terms</li>
                <li>Sample permissions</li>
              </ul>
              <p>We do not provide blanket music licenses.</p>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">16. LIVE STREAM OR UPLOAD PIRACY</h2>
              <p>Prohibited:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Live rebroadcast of sports events</li>
                <li>Pay-per-view streams</li>
                <li>Movie theaters or concerts</li>
                <li>Copyrighted lectures</li>
                <li>Online classes or webinars you don't own</li>
              </ul>
              <p>Immediate bans may occur.</p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">17. THIRD-PARTY PLATFORMS</h2>
              <p>Do not upload:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>TikTok reposts</li>
                <li>YouTube reuploads</li>
                <li>Instagram reels</li>
                <li>Content purchased from "viral video packs"</li>
                <li>Other creators' content copied from other platforms</li>
              </ul>
              <p>Creators must provide original work.</p>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">18. NO WEAPONIZED DMCA</h2>
              <p>We do not tolerate:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Filing takedowns to harass other creators</li>
                <li>Using copyright claims against criticism, review, or satire</li>
                <li>Mass reporting campaigns</li>
              </ul>
              <p>Abuse may result in:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account penalties</li>
                <li>Legal action</li>
                <li>Perjury liability</li>
              </ul>
            </section>

            {/* Section 19 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">19. SAFE HARBOR STATEMENT</h2>
              <p>Flock qualifies under DMCA Safe Harbor because:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We do not pre-screen all content</li>
                <li>We respond in good faith to valid DMCA notices</li>
                <li>We remove infringing content upon notice</li>
                <li>We maintain repeat-infringer policies</li>
                <li>We are not the legal publisher of user-uploaded content</li>
              </ul>
            </section>

            {/* Section 20 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">20. DISCLAIMER</h2>
              <p>We do not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide copyright legal advice</li>
                <li>Determine ownership disputes</li>
                <li>Judge private contracts or licensing agreements</li>
              </ul>
              <p>Copyright disputes are between the parties, not the Platform.</p>
            </section>

            {/* Section 21 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">21. CHANGES TO THIS POLICY</h2>
              <p>We may update this Policy at any time.</p>
              <p>
                Continued use of the Platform constitutes acceptance of the updated Policy.
              </p>
            </section>

            {/* Section 22 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">22. CONTACT</h2>
              <p>Copyright Agent Email: support@flocktogether.xyz</p>
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
