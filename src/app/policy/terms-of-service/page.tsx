"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@/api/user";

type Role = "VIEWER" | "CREATOR" | "ADMIN" | null;

export default function TermsOfServicePage() {
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

          // Normalize (handles "creator", "CREATOR", " Creator ", etc.)
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

          {/* Right side: Log in/Join OR Home */}
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

      <div className="relative z-10 max-w-4xl mx-auto py-4 md:py-6 px-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-black mb-2">
            FLOCKTOGETHER.XYZ – TERMS OF SERVICE
          </h1>
          <p className="text-sm text-black mb-8">
            Last Updated: December 9, 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* ✅ Your existing Terms content stays exactly the same below */}

            <section>
              <p className="text-black leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) govern your access to
                and use of the Flock platform, including our website at{" "}
                <a
                  href="https://flocktogether.xyz"
                  className="text-blue-600 hover:underline"
                >
                  https://flocktogether.xyz
                </a>{" "}
                and any related tools, applications, or services (collectively,
                the &quot;Platform&quot;).
              </p>
              <p className="text-black leading-relaxed mt-4">
                The Platform is operated by{" "}
                <strong>Flock Together Global LLC</strong>, a Wyoming limited
                liability company (&quot;Flock,&quot; &quot;we,&quot;
                &quot;our,&quot; or &quot;us&quot;).
              </p>
              <p className="text-black leading-relaxed mt-4">
                By accessing or using the Platform, creating an account, or
                clicking &quot;Agree&quot; (or similar), you agree to be bound by
                these Terms. If you do not agree, you must not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">1. WHO WE ARE</h2>
              <p className="text-black leading-relaxed">
                Flock is a creator-first content and monetization platform that enables creators to upload and distribute videos, blogs, and other content, build an audience, and earn revenue through advertising and other monetization tools. Following the completion of our Beta phase, eligible creators may earn from their first day on the Platform, subject to our Monetization and KYC/AML policies.
              </p>
              <div className="mt-4 text-black">
                <p className="font-semibold">Flock Together Global LLC</p>
                <p>Principal Office: 30 N Gould St #53789, Sheridan, WY 82801, USA</p>
                <p className="mt-2">
                  If you have questions about these Terms, you can contact us at:{" "}
                  <a href="mailto:support@flocktogether.xyz" className="text-blue-600 hover:underline">
                    support@flocktogether.xyz
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">2. ELIGIBILITY</h2>
              
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">2.1 Minimum Age</h3>
              <p className="text-black leading-relaxed">
                You must be at least 13 years old to create an account or use the Platform.
              </p>
              <p className="text-black leading-relaxed">
                If you are under the age of majority in your jurisdiction, you may only use the Platform under the supervision of a parent or legal guardian who agrees to be bound by these Terms on your behalf.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">2.2 Monetization & Payout Eligibility</h3>
              <p className="text-black leading-relaxed mb-3">
                To participate in any monetization features (including earning revenue from ads, payouts, sponsorship features, or other paid tools), you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Be at least 18 years old, or</li>
                <li>Have documented consent and ongoing supervision from a parent/legal guardian who manages any payout method on your behalf.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                We may require identity verification, tax information, and payout method verification before enabling monetization or processing withdrawals.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">2.3 Legal Capacity</h3>
              <p className="text-black leading-relaxed mb-2">By using the Platform, you represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You have the legal capacity to enter into these Terms;</li>
                <li>You are not barred from using the Platform under any applicable law or by any prior Flock suspension/ban.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">3. YOUR ACCOUNT</h2>
              
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">3.1 Registration</h3>
              <p className="text-black leading-relaxed mb-2">
                To use certain features, you must create an account. When you register, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Provide accurate, current, and complete information (including date of birth, email, and display name);</li>
                <li>Maintain and promptly update your information;</li>
                <li>Keep your login credentials confidential.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                We may offer email/password signup and social logins (e.g., Google, Facebook, etc.). You authorize us to access certain information from those third-party accounts in accordance with our Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">3.2 Security</h3>
              <p className="text-black leading-relaxed mb-2">
                You are responsible for all activity under your account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Immediately notify us if you suspect any unauthorized access or security breach;</li>
                <li>Not share your password or allow others to use your account;</li>
                <li>Use secure passwords and, where available, enable additional security features (e.g., 2FA, when rolled out).</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                We are not liable for any loss or damage arising from unauthorized access to your account where we have implemented reasonable security measures.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">3.3 Account Suspension & Termination</h3>
              <p className="text-black leading-relaxed mb-2">
                We may, at our discretion and without prior notice, suspend or terminate your account or restrict access to any part of the Platform if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>We believe you have violated these Terms, our Community Guidelines, or any applicable law;</li>
                <li>We need to do so to protect the Platform, other users, or third parties;</li>
                <li>We are required to do so by law, regulation, or a court order.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                You may close your account at any time via your settings or by contacting support.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">4. THE PLATFORM & LICENSE TO YOU</h2>
              <p className="text-black leading-relaxed">
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for personal, non-commercial use or, if you are a creator, for your professional creator activities on Flock.
              </p>
              <p className="text-black leading-relaxed mt-4 mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Reverse engineer, decompile, or attempt to extract the source code of any part of the Platform;</li>
                <li>Bypass or circumvent any security or access controls;</li>
                <li>Use any automated system (bots, scrapers, etc.) to access the Platform except as expressly allowed by us.</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                We may modify, suspend, or discontinue any portion of the Platform at any time, with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">5. YOUR CONTENT</h2>
              
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">5.1 Definitions</h3>
              <p className="text-black leading-relaxed">
                "Content" means any video, audio, text, image, blog post, metadata, tags, comments, or other material that you upload, publish, or otherwise make available through the Platform.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">5.2 Ownership</h3>
              <p className="text-black leading-relaxed mb-2">
                You retain all ownership rights in and to your Content, subject to the licenses you grant to us in these Terms.
              </p>
              <p className="text-black leading-relaxed mt-3 mb-2">You represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You own or have obtained all necessary rights to your Content;</li>
                <li>Your Content does not infringe any third-party rights, including copyright, trademark, privacy, or publicity rights;</li>
                <li>Your Content complies with these Terms, our Community Guidelines, and all applicable laws.</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">5.3 License to Flock</h3>
              <p className="text-black leading-relaxed mb-2">
                By using the Platform and uploading Content, you grant Flock a worldwide, non-exclusive, royalty-free, sublicensable, transferable license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Host, store, reproduce, adapt, modify, format, distribute, publicly display, publicly perform, and otherwise make your Content available in connection with operating, improving, marketing, and promoting the Platform;</li>
                <li>Create derivative works (e.g., thumbnails, previews, promotional cuts) solely for Platform-related use.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                This license continues for as long as your Content is available on the Platform, and for a commercially reasonable period thereafter for backup, audit, dispute resolution, legal compliance, and archival purposes.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">5.4 License to Other Users</h3>
              <p className="text-black leading-relaxed">
                You also grant other users a limited license to access and view your Content through the Platform, and to share it using Platform-provided sharing features, subject to these Terms and our policies.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">5.5 Removal of Content</h3>
              <p className="text-black leading-relaxed mb-2">
                You may delete your Content at any time (subject to reasonable technical and operational limits). However:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Cached or backed-up copies may continue to exist for a limited time;</li>
                <li>If your Content has been used in Platform promotional materials, it may continue to appear until such materials are updated.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                We may remove or restrict access to any Content if we reasonably believe it violates these Terms, Community Guidelines, law, or third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">6. PROHIBITED CONDUCT & CONTENT</h2>
              <p className="text-black leading-relaxed mb-3">
                You agree that you will not use the Platform to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Violate any law, regulation, or third-party rights;</li>
                <li>
                  Post or share Content that is:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Illegal, defamatory, libelous, hateful, discriminatory, or harassing;</li>
                    <li>Sexually explicit, exploitative of minors, or otherwise harmful to children;</li>
                    <li>Inciting violence, terrorism, or self-harm;</li>
                    <li>Fraudulent, misleading, or deceptive (including scams and impersonation);</li>
                    <li>Infringing intellectual property rights (copyright, trademark, etc.);</li>
                  </ul>
                </li>
                <li>
                  Engage in:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Spamming, bots, fake likes/views, or engagement manipulation;</li>
                    <li>Unauthorized scraping of user data or Content;</li>
                    <li>Attempted security breaches, hacking, or denial-of-service;</li>
                    <li>Any activity that disrupts or overloads the Platform.</li>
                  </ul>
                </li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                We will publish more detailed Community Guidelines and an Acceptable Use Policy, which are incorporated by reference into these Terms. Violation of those documents is deemed a violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">7. DMCA / COPYRIGHT & IP COMPLAINTS</h2>
              <p className="text-black leading-relaxed mb-3">
                We respect intellectual property rights and expect our users to do the same.
              </p>
              <p className="text-black leading-relaxed mb-3">
                If you believe Content on the Platform infringes your copyright, you may submit a takedown notice under the Digital Millennium Copyright Act (DMCA) to our designated agent:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-black">
                <p className="font-semibold">DMCA Agent</p>
                <p>Flock Together Global LLC</p>
                <p>Principal Office: 30 N Gould St #53789, Sheridan, WY 82801, USA</p>
                <p>
                  Email:{" "}
                  <a href="mailto:support@flocktogether.xyz" className="text-blue-600 hover:underline">
                    support@flocktogether.xyz
                  </a>
                </p>
              </div>
              <p className="text-black leading-relaxed mt-4 mb-2">Your notice must include:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Your contact information;</li>
                <li>Identification of the copyrighted work claimed to be infringed;</li>
                <li>Identification of the infringing material and its location on the Platform;</li>
                <li>A statement that you have a good-faith belief that use is not authorized;</li>
                <li>A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorized agent;</li>
                <li>Your physical or electronic signature.</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                We may remove or disable access to the allegedly infringing Content and, where appropriate, terminate repeat infringers' accounts. We will also provide a counter-notification process in line with applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">8. MONETIZATION, PAYMENTS & WITHDRAWALS</h2>
              <p className="text-black leading-relaxed mb-4">
                Certain creators may be eligible to earn revenue through advertisements, sponsorships, bonuses, or other monetization tools we may offer ("Monetization Features").
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">8.1 No Guarantee of Earnings</h3>
              <p className="text-black leading-relaxed mb-2">Flock does not guarantee that:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You will be approved for Monetization Features;</li>
                <li>You will earn any minimum amount;</li>
                <li>Any particular ad or campaign will run on your Content.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                Earnings depend on multiple factors including audience size, engagement, advertiser demand, geography, and Platform policies.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">8.2 Revenue Calculation & Reporting</h3>
              <p className="text-black leading-relaxed mb-3">
                We may report estimated earnings in your creator dashboard. These numbers are estimates only and may be adjusted after reconciliation with our advertising partners and payment providers.
              </p>
              <p className="text-black leading-relaxed mb-2">
                We will publish a separate Earnings & Monetization Policy, which will describe:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Eligible content and traffic;</li>
                <li>Revenue models (e.g., ad revenue share, RPM/CPM logic);</li>
                <li>Grounds for withholding or adjusting earnings (e.g., invalid traffic, policy violations).</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                That policy, as updated, is incorporated by reference into these Terms.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">8.3 Payout Methods</h3>
              <p className="text-black leading-relaxed mb-2">
                We may use third-party providers such as Stripe, PayPal, Payoneer, and others to process:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Creator earnings;</li>
                <li>Withdrawals;</li>
                <li>Refunds (where applicable).</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                By enabling a payout method, you agree to be bound by the terms of those third-party providers, and you authorize Flock to share necessary information with them.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">8.4 Thresholds & Timing</h3>
              <p className="text-black leading-relaxed mb-2">We may:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Set minimum payout thresholds;</li>
                <li>Use monthly or other periodic payout cycles;</li>
                <li>Delay payouts to verify transactions, combat fraud, or comply with legal/financial obligations.</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">8.5 Suspensions, Chargebacks & Withholding</h3>
              <p className="text-black leading-relaxed mb-2">We may withhold, delay, or adjust payouts if:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>We suspect fraud, invalid traffic, or policy violations;</li>
                <li>We receive chargebacks, disputes, or legal claims related to your activity;</li>
                <li>You breach these Terms or other Platform policies.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                If your account is terminated for cause, you may forfeit some or all accrued but unpaid earnings, subject to applicable law and our Monetization Policy.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">9. THIRD-PARTY SERVICES & LINKS</h2>
              <p className="text-black leading-relaxed mb-2">The Platform may include:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Links to third-party websites or services;</li>
                <li>Integrations with third-party tools (e.g., logins, analytics, ad networks, payout providers).</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                We do not control or endorse third-party services and are not responsible for their content, policies, or practices. You use them at your own risk and must comply with their terms and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">10. PRIVACY</h2>
              <p className="text-black leading-relaxed mb-2">
                Your use of the Platform is also governed by our Privacy Policy, which explains:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>What data we collect;</li>
                <li>How we use, share, store, and protect that data;</li>
                <li>Your rights and choices (including consent, cookies, and data requests).</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                The Privacy Policy is incorporated by reference into these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">11. DATA, SECURITY & COMPLIANCE</h2>
              <p className="text-black leading-relaxed mb-4">
                We implement commercially reasonable administrative, technical, and physical safeguards to protect your data and the Platform's integrity.
              </p>
              <p className="text-black leading-relaxed mb-2">
                However, no system is completely secure. By using the Platform, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You transmit data at your own risk;</li>
                <li>We cannot guarantee 100% security;</li>
                <li>You are responsible for maintaining backups of your own Content where appropriate.</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                We may be subject to US, EU, Caribbean, and other data protection laws, and will make good-faith efforts to comply with applicable obligations, including but not limited to GDPR-style and local privacy frameworks, where they apply.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">12. BETA FEATURES & EXPERIMENTS</h2>
              <p className="text-black leading-relaxed mb-2">
                From time to time, we may experiment with new features, interfaces, or monetization tools ("Beta Features"). These may be:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Available to a limited subset of users;</li>
                <li>Unstable or incomplete;</li>
                <li>Subject to change or removal at any time.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                You use Beta Features at your own risk and "as is," with no guarantees of continued availability.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">13. DISCLAIMER OF WARRANTIES</h2>
              <p className="text-black leading-relaxed mb-3">
                To the maximum extent permitted by law, the Platform and all content, features, and services are provided "as is" and "as available," without warranties of any kind, whether express, implied, or statutory, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT;</li>
                <li>ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE;</li>
                <li>ANY WARRANTY THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF HARMFUL COMPONENTS;</li>
                <li>ANY WARRANTY REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY CONTENT OR DATA.</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">Your use of the Platform is at your sole risk.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">14. LIMITATION OF LIABILITY</h2>
              <p className="text-black leading-relaxed mb-3">
                To the maximum extent permitted by law, in no event will Flock, its owners, directors, officers, employees, contractors, or agents be liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>any indirect, incidental, consequential, special, punitive, or exemplary damages;</li>
                <li>any loss of profits, revenue, goodwill, or data;</li>
                <li>any business interruption or other commercial damages or losses,</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                arising out of or in connection with your use of (or inability to use) the Platform, even if we have been advised of the possibility of such damages.
              </p>
              <p className="text-black leading-relaxed mt-4 mb-2">
                In no event will our total aggregate liability arising out of or in connection with these Terms or your use of the Platform exceed the greater of:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>the amount you have paid to Flock (if any) in the six (6) months prior to the event giving rise to the claim; or</li>
                <li>one hundred U.S. dollars (USD $100).</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                Some jurisdictions do not allow certain exclusions or limitations of liability, so some of the above may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">15. INDEMNIFICATION</h2>
              <p className="text-black leading-relaxed mb-2">
                You agree to defend, indemnify, and hold harmless Flock and its affiliates, officers, directors, employees, contractors, and agents from and against any claims, demands, losses, liabilities, damages, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Your use of the Platform;</li>
                <li>Your Content;</li>
                <li>Your breach of these Terms or any other applicable policy;</li>
                <li>Your violation of any law or third-party right.</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                We reserve the right, at your expense, to assume exclusive defense and control of any matter subject to indemnification, and you agree to cooperate with our defense.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">16. GOVERNING LAW & DISPUTE RESOLUTION</h2>
              
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">16.1 Governing Law</h3>
              <p className="text-black leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of the State of Wyoming, USA, without regard to its conflict of laws principles, and applicable federal law.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">16.2 Informal Resolution</h3>
              <p className="text-black leading-relaxed">
                Before filing any formal claim, you agree to first contact us at{" "}
                <a href="mailto:admin@flocktogether.xyz" className="text-blue-600 hover:underline">
                  admin@flocktogether.xyz
                </a>{" "}
                and attempt to resolve the dispute informally.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">16.3 Arbitration</h3>
              <p className="text-black leading-relaxed mb-3">
                Except where prohibited by law, any dispute arising out of or relating to these Terms or the Platform that cannot be resolved informally will be resolved by binding arbitration administered by a recognized arbitration body (e.g., AAA or JAMS) in English, with a single arbitrator, in a venue reasonably selected by Flock.
              </p>
              <p className="text-black leading-relaxed mb-2">You and Flock agree that:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Arbitration will be on an individual basis only;</li>
                <li>Class actions and class arbitrations are not permitted.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                If this class action waiver is found unenforceable, the entire arbitration clause will be void, and disputes will instead be heard in the state or federal courts located in Wyoming, USA.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">17. CHANGES TO THESE TERMS</h2>
              <p className="text-black leading-relaxed mb-2">
                We may update these Terms from time to time. When we do:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>We will change the "Last Updated" date at the top;</li>
                <li>Where required by law or where changes are material, we will provide additional notice (e.g., banner, email, or in-app notice).</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                If you continue to use the Platform after updated Terms become effective, you agree to be bound by the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">18. OTHER IMPORTANT TERMS</h2>
              <p className="text-black leading-relaxed">
                <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and any other referenced policies, constitute the entire agreement between you and Flock.
              </p>
              <p className="text-black leading-relaxed">
                <strong>Severability:</strong> If any provision is held invalid or unenforceable, the remaining provisions will remain in full force and effect.
              </p>
              <p className="text-black leading-relaxed">
                <strong>No Waiver:</strong> Our failure to enforce any provision of these Terms is not a waiver of our right to do so later.
              </p>
              <p className="text-black leading-relaxed">
                <strong>Assignment:</strong> You may not assign these Terms or any rights or obligations under them without our prior written consent. We may assign these Terms as part of a merger, acquisition, asset sale, or by operation of law.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">19. CONTACT US</h2>
              <p className="text-black leading-relaxed mb-3">
                If you have questions about these Terms, you may contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-black">
                <p className="font-semibold">Flock Together Global LLC</p>
                <p>
                  Email:{" "}
                  <a href="mailto:support@flocktogether.xyz" className="text-blue-600 hover:underline">
                    support@flocktogether.xyz
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
