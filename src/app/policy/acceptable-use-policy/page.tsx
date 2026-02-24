"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | "ADMIN" | null;

export default function AcceptableUsePolicyPage() {
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

          const rawRole =
            res?.data?.user?.role ??
            res?.data?.role ??
            null;

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

          {/* Right Side Buttons */}
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
              FLOCK ACCEPTABLE USE POLICY (AUP)
            </h1>
            <p className="text-sm">Last Updated: December 9, 2025</p>
          </header>

          {/* CONTENT */}
          <div className="space-y-10 text-base md:text-lg leading-relaxed">
            {/* Intro */}
            <section className="space-y-4">
              <p>
                This Acceptable Use Policy ("AUP") governs how users may access and use the Flock
                platform and associated services at https://flocktogether.xyz (the "Platform"), operated by
                Flock Together Global LLC ("Flock," "we," "us," "our").
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
              <p>
                Violations of this policy may result in monetization loss, content removal, account suspension,
                or permanent ban.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">1. GENERAL PRINCIPLE</h2>
              <p>You may not use Flock in any manner that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Harms the Platform, its users, or its business interests</li>
                <li>Violates any applicable law or regulation</li>
                <li>Enables unauthorized access to accounts, systems, or data</li>
                <li>Exploits minors or vulnerable individuals</li>
                <li>Promotes or facilitates dangerous, illegal, or illicit activity</li>
                <li>Enables fraud, spam, or monetization abuse</li>
              </ul>
              <p>Flock reserves the unilateral right to determine what constitutes abuse.</p>
              <p className="font-medium">Additional rules:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Users may operate multiple creator accounts, provided they are not used to evade
                  enforcement, manipulate earnings, or artificially boost engagement.</li>
                <li>Recycled content is permitted only where the Creator owns full rights to upload and
                  monetize it.</li>
                <li>Flock may require identity verification or documentation if fraud risk, duplicate accounts,
                  or other abuse indicators are detected.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">2. PROHIBITED CONTENT</h2>
              <p>The following content is prohibited under all circumstances:</p>

              <h3 className="font-semibold">2.1 Child Exploitation</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Sexual or suggestive content involving minors</li>
                <li>Grooming, solicitation, or sexual communication with minors</li>
                <li>Underage nudity or fetishization</li>
                <li>Child endangerment, abuse, or emotional harm</li>
              </ul>
              <p>Violations will be reported to law enforcement.</p>

              <h3 className="font-semibold">2.2 Pornographic or Sexually Explicit Content</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Explicit sexual acts</li>
                <li>Fetish content</li>
                <li>Genital exposure</li>
                <li>Pornographic material</li>
              </ul>
              <p>Flock is not an adult services platform.</p>
              <p>Educational, artistic, or contextual adult-themed content may still be restricted if it risks
                exposure to minors or violates regional regulations.</p>

              <h3 className="font-semibold">2.3 Illegal Activities</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Drug sales or distribution</li>
                <li>Human trafficking</li>
                <li>Weapons manufacturing or distribution</li>
                <li>Unauthorized financial services</li>
                <li>Criminal facilitation</li>
              </ul>

              <h3 className="font-semibold">2.4 Hate or Extremism</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Advocacy of violence against individuals or groups</li>
                <li>Terrorist propaganda or recruitment</li>
                <li>Organized hate groups or extremist ideologies</li>
              </ul>

              <h3 className="font-semibold">2.5 Self-Harm & Suicide Promotion</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Encouraging or glorifying self-injury</li>
                <li>Dangerous health challenges</li>
                <li>Instructions or methods for self-harm</li>
              </ul>

              <h3 className="font-semibold">2.6 Copyright Violations</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Uploading copyrighted material without authorization</li>
                <li>Reposting content from other platforms without rights</li>
                <li>Circumventing copyright protection or detection systems</li>
              </ul>
              <p>Refer to the DMCA & Copyright Policy for procedures and penalties.</p>
              <p>Reposts from TikTok, YouTube, Instagram, or other platforms must be fully owned or rights-
                cleared by the user.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">3. PROHIBITED BEHAVIORS</h2>
              <p>You may not:</p>

              <h3 className="font-semibold">3.1 Attack the Platform</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Attempt to hack, overload, or breach systems</li>
                <li>Reverse-engineer or exploit vulnerabilities</li>
                <li>Interfere with Platform performance or stability</li>
              </ul>

              <h3 className="font-semibold">3.2 Manipulate Engagement</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Bot traffic or automated views</li>
                <li>Fake followers or engagement</li>
                <li>View farms or click farms</li>
                <li>Comment automation</li>
                <li>Click fraud or paid engagement schemes</li>
              </ul>
              <p>Monetization derived from artificial traffic is voided.</p>
              <p>Using multiple accounts together to create artificial engagement networks ("ring behavior") is
                prohibited.</p>

              <h3 className="font-semibold">3.3 Impersonation or Deception</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Impersonate another individual or entity</li>
                <li>Misrepresent identity, credentials, or affiliations</li>
                <li>Create misleading endorsements or partnerships</li>
              </ul>

              <h3 className="font-semibold">3.4 Spam</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Repetitive or low-quality posting</li>
                <li>Mass unsolicited promotions</li>
                <li>Affiliate farming without proper disclosure</li>
              </ul>

              <h3 className="font-semibold">3.5 Monetization Exploitation</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Fabricating revenue or engagement signals</li>
                <li>Filing false reports to manipulate payouts</li>
                <li>Abusing referral, bonus, or incentive programs</li>
                <li>Laundering earnings through third-party accounts</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">4. AI-RELATED RESTRICTIONS</h2>
              <p>AI-generated or AI-assisted content must not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Replicate copyrighted works</li>
                <li>Use the likeness of real individuals without consent</li>
                <li>Falsely portray public figures in a defamatory or misleading manner</li>
                <li>Generate sexual, violent, extremist, or deceptive material</li>
              </ul>
              <p>Flock may request source files, prompts, or proof of authorship.</p>
              <p>Creators must clearly disclose AI-generated content where required by law or Platform
                guidelines.</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">5. HARASSMENT & TARGETED ABUSE</h2>
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stalk, intimidate, or threaten individuals</li>
                <li>Encourage or coordinate harassment campaigns</li>
                <li>Doxx or share private personal information</li>
              </ul>
              <p>This includes creator-to-creator conflicts.</p>
              <p>Coordinated attacks or "brigading" are prohibited, regardless of intent.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">6. MISINFORMATION & FRAUD</h2>
              <p>Prohibited activities include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fake giveaways or contests</li>
                <li>Pyramid or Ponzi schemes</li>
                <li>Harmful health misinformation</li>
                <li>Investment scams (e.g., "pump and dump")</li>
                <li>Deceptive "get rich quick" coaching</li>
              </ul>
              <p>Creators must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Make truthful, substantiated claims</li>
                <li>Use appropriate disclaimers</li>
                <li>Avoid exploiting vulnerable audiences</li>
              </ul>
              <p>Financial, medical, or legal advice must comply with applicable laws and may not misrepresent
                credentials.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">7. COMMERCIAL ACTIVITIES</h2>
              <p>Allowed:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Legitimate brand deals</li>
                <li>Sponsorships</li>
                <li>Creator-owned services</li>
                <li>Merchandise sales</li>
              </ul>
              <p>Prohibited:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Illegal goods or services</li>
                <li>Counterfeit products</li>
                <li>Exploitative MLM schemes</li>
                <li>Unregistered financial offerings</li>
                <li>Sale of personal user data</li>
              </ul>
              <p>Sponsored content must include legally required disclosures (e.g., #ad, paid partnership).</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">8. PLATFORM RESOURCE ABUSE</h2>
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use automated scripts to upload or scrape data</li>
                <li>Circumvent upload, usage, or rate limits</li>
                <li>Create account networks to exploit payouts</li>
                <li>Resell, lease, or transfer accounts</li>
                <li>Share login credentials to bypass enforcement</li>
              </ul>
              <p>Multiple accounts are permitted only where they are not used to multiply earnings or evade
                restrictions.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">9. ACCOUNT OWNERSHIP</h2>
              <p>Accounts are provided as a service by Flock.</p>
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sell, trade, or rent accounts</li>
                <li>Operate accounts on behalf of banned users</li>
                <li>Use "proxy creators" to continue prohibited activity</li>
              </ul>
              <p>Creators must notify Flock immediately if unauthorized access is suspected.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">10. ENFORCEMENT & ACTIONS</h2>
              <p>Flock may take actions including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content removal</li>
                <li>Upload restrictions</li>
                <li>Feature limitations</li>
                <li>Temporary or permanent bans</li>
                <li>Monetization clawbacks</li>
                <li>Revenue forfeiture</li>
                <li>Legal reporting</li>
              </ul>
              <p>Enforcement severity depends on risk, repetition, and intent.</p>
              <p>Flock is not required to allow repeated violations.</p>
              <p>Actions may apply across all accounts linked to the same device, identity, phone number, or
                payment method.</p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">11. COOPERATION WITH LAW ENFORCEMENT</h2>
              <p>Flock may disclose user data when:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Required by subpoena or court order</li>
                <li>Investigating threats to safety</li>
                <li>Addressing child exploitation</li>
                <li>Preventing fraud or organized abuse</li>
              </ul>
              <p>User notification may be withheld where legally prohibited.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">12. APPEALS</h2>
              <p>Users may submit one appeal per enforcement action.</p>
              <p>Appeals must include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reasoning for the appeal</li>
                <li>Supporting evidence or context</li>
                <li>Proof of ownership for copyright disputes</li>
              </ul>
              <p>Appeals may be denied where:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content is clearly illegal</li>
                <li>Prior violations exist</li>
                <li>Fraud indicators are present</li>
              </ul>
              <p>Appeal decisions are final.</p>
              <p>Circumventing enforcement through new accounts may result in additional penalties.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">13. GLOBAL COMPLIANCE</h2>
              <p>Users must comply with applicable laws, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>U.S. laws (COPPA, DMCA, SEC regulations)</li>
                <li>GDPR (EU)</li>
                <li>CCPA (California)</li>
                <li>International child safety and online harm standards</li>
              </ul>
              <p>Using Flock to evade local laws is prohibited.</p>
              <p>Creators are responsible for understanding and reporting tax obligations in their jurisdiction.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">14. POLICY UPDATES</h2>
              <p>We may update this AUP at any time.</p>
              <p>Continued use of the Platform constitutes acceptance of any changes.</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">15. CONTACT</h2>
              <p>For AUP or enforcement inquiries:</p>
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
