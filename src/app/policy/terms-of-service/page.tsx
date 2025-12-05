"use client";

import Image from "next/image";
import loginBg from "@/assets/LSbg.jpg";
import flockLogo from "@/assets/Flock-LOGO.png";
import Link from "next/link";

export default function TermsOfServicePage() {
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

      <div className="relative z-10 max-w-4xl mx-auto py-4 md:py-6 px-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-black mb-2">Terms of Service</h1>
          <p className="text-sm text-black mb-8">Last Updated: 04/12/25</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <p className="text-black leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use of the Flock platform, including our website at{" "}
                <a href="https://flocktogether.xyz" className="text-blue-600 hover:underline">
                  https://flocktogether.xyz
                </a>{" "}
                and any related tools, applications, or services (collectively, the "Platform").
              </p>
              <p className="text-black leading-relaxed mt-4">
                The Platform is operated by <strong>Flock Together Global LLC</strong>, a Wyoming limited liability company ("Flock," "we," "our," or "us").
              </p>
              <p className="text-black leading-relaxed mt-4">
                By accessing or using the Platform, creating an account, or clicking "Agree" (or similar), you agree to be bound by these Terms. If you do not agree, you must not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">1. Who We Are</h2>
              <p className="text-black leading-relaxed">
                Flock is a creator-first, invite-only content and monetization platform that enables approved creators to upload and distribute videos, blogs, and other content, build an audience, and earn revenue through advertising and other monetization tools.
              </p>
              <div className="mt-4 text-black">
                <p className="font-semibold">Flock Together Global LLC</p>
                <p>Principal Office: 30 N Gould St #53789, Sheridan, WY 82801, USA</p>
                <p className="mt-2">
                  If you have questions about these Terms, you can contact us at:{" "}
                  <a href="mailto:admin@flocktogether.xyz" className="text-blue-600 hover:underline">
                    admin@flocktogether.xyz
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">2. Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">2.1 Minimum Age</h3>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You must be at least <strong>13 years old</strong> to create an account or use the Platform.</li>
                <li>If you are under the age of majority in your jurisdiction, you may only use the Platform under the supervision of a parent or legal guardian who agrees to be bound by these Terms on your behalf.</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">2.2 Monetization & Payout Eligibility</h3>
              <p className="text-black leading-relaxed mb-3">
                To participate in any <strong>monetization</strong> features (including earning revenue from ads, payouts, sponsorship features, or other paid tools), you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Be at least <strong>18 years old</strong>, or</li>
                <li>Have documented consent and ongoing supervision from a parent/legal guardian who manages any payout method on your behalf.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                We may require <strong>identity verification</strong>, tax information, and payout method verification before enabling monetization or processing withdrawals.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">2.3 Legal Capacity</h3>
              <p className="text-black leading-relaxed mb-2">By using the Platform, you represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You have the legal capacity to enter into these Terms;</li>
                <li>You are not barred from using the Platform under any applicable law or by any prior Flock suspension/ban.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">3. Your Account</h2>
              
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">3.1 Registration</h3>
              <p className="text-black leading-relaxed mb-2">
                To use certain features, you must create an account. When you register, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Provide accurate, current, and complete information (including <strong>date of birth</strong>, email, and display name);</li>
                <li>Maintain and promptly update your information;</li>
                <li>Keep your login credentials confidential.</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                We may offer <strong>email/password</strong> signup and <strong>social logins</strong> (e.g., Google, Facebook, etc.). You authorize us to access certain information from those third-party accounts in accordance with our Privacy Policy.
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">4. The Platform & License to You</h2>
              <p className="text-black leading-relaxed">
                Subject to these Terms, we grant you a <strong>limited, non-exclusive, non-transferable, revocable</strong> license to access and use the Platform for personal, non-commercial use or, if you are a creator, for your professional creator activities on Flock.
              </p>
              <p className="text-black leading-relaxed mt-4 mb-2">You agree <strong>not</strong> to:</p>
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">5. Your Content</h2>
              
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">5.1 Definitions</h3>
              <p className="text-black leading-relaxed">
                "Content" means any video, audio, text, image, blog post, metadata, tags, comments, or other material that you upload, publish, or otherwise make available through the Platform.
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">5.2 Ownership</h3>
              <p className="text-black leading-relaxed mb-2">
                You retain all <strong>ownership rights</strong> in and to your Content, subject to the licenses you grant to us in these Terms.
              </p>
              <p className="text-black leading-relaxed mt-3 mb-2">You represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You own or have obtained all necessary rights to your Content;</li>
                <li>Your Content does not infringe any third-party rights, including copyright, trademark, privacy, or publicity rights;</li>
                <li>Your Content complies with these Terms, our Community Guidelines, and all applicable laws.</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">5.3 License to Flock</h3>
              <p className="text-black leading-relaxed mb-2">
                By using the Platform and uploading Content, you grant Flock a <strong>worldwide, non-exclusive, royalty-free, sublicensable, transferable license</strong> to:
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">6. Prohibited Conduct & Content</h2>
              <p className="text-black leading-relaxed mb-3">
                You agree that you will <strong>not</strong> use the Platform to:
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-black">
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
              </ol>
              <p className="text-black leading-relaxed mt-4">
                We will publish more detailed <strong>Community Guidelines</strong> and an <strong>Acceptable Use Policy</strong>, which are incorporated by reference into these Terms. Violation of those documents is deemed a violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">7. DMCA / Copyright & IP Complaints</h2>
              <p className="text-black leading-relaxed mb-3">
                We respect intellectual property rights and expect our users to do the same.
              </p>
              <p className="text-black leading-relaxed mb-3">
                If you believe Content on the Platform infringes your copyright, you may submit a takedown notice under the <strong>Digital Millennium Copyright Act (DMCA)</strong> to our designated agent:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-black">
                <p className="font-semibold">DMCA Agent</p>
                <p>Flock Together Global LLC</p>
                <p>Principal Office: 30 N Gould St #53789, Sheridan, WY 82801, USA</p>
                <p>
                  Email:{" "}
                  <a href="mailto:admin@flocktogether.xyz" className="text-blue-600 hover:underline">
                    admin@flocktogether.xyz
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
                We may remove or disable access to the allegedly infringing Content and, where appropriate, terminate repeat infringers' accounts. We will also provide a <strong>counter-notification process</strong> in line with applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">8. Monetization, Payments & Withdrawals</h2>
              <p className="text-black leading-relaxed mb-4">
                Certain creators may be eligible to earn revenue through advertisements, sponsorships, bonuses, or other monetization tools we may offer ("Monetization Features").
              </p>

              <h3 className="text-xl font-semibold text-black mt-6 mb-3">8.1 No Guarantee of Earnings</h3>
              <p className="text-black leading-relaxed mb-2">Flock does <strong>not guarantee</strong> that:</p>
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
                We may report estimated earnings in your creator dashboard. These numbers are <strong>estimates only</strong> and may be adjusted after reconciliation with our advertising partners and payment providers.
              </p>
              <p className="text-black leading-relaxed mb-2">
                We will publish a separate <strong>Earnings & Monetization Policy</strong>, which will describe:
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
                We may use third-party providers such as <strong>Stripe, PayPal, Payoneer, Ezoic, and others</strong> to process:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Creator earnings;</li>
                <li>Withdrawals;</li>
                <li>Refunds (where applicable).</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                By enabling a payout method, you agree to be bound by the <strong>terms of those third-party providers</strong>, and you authorize Flock to share necessary information with them.
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">9. Third-Party Services & Links</h2>
              <p className="text-black leading-relaxed mb-2">The Platform may include:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Links to third-party websites or services;</li>
                <li>Integrations with third-party tools (e.g., logins, analytics, ad networks, payout providers).</li>
              </ul>
              <p className="text-black leading-relaxed mt-4">
                We do <strong>not</strong> control or endorse third-party services and are not responsible for their content, policies, or practices. You use them at your own risk and must comply with their terms and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">10. Privacy</h2>
              <p className="text-black leading-relaxed mb-2">
                Your use of the Platform is also governed by our <strong>Privacy Policy</strong>, which explains:
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">11. Data, Security & Compliance</h2>
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
                We may be subject to <strong>US, EU, Caribbean, and other data protection laws</strong>, and will make good-faith efforts to comply with applicable obligations, including but not limited to GDPR-style and local privacy frameworks, where they apply.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">12. Beta Features & Experiments</h2>
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">13. Disclaimer of WARRANTIES</h2>
              <p className="text-black leading-relaxed mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM AND ALL CONTENT, FEATURES, AND SERVICES ARE PROVIDED <strong>"AS IS" AND "AS AVAILABLE"</strong>, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO:
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">14. Limitation of Liability</h2>
              <p className="text-black leading-relaxed mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL FLOCK, ITS OWNERS, DIRECTORS, OFFICERS, EMPLOYEES, CONTRACTORS, OR AGENTS BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES;</li>
                <li>ANY LOSS OF PROFITS, REVENUE, GOODWILL, OR DATA;</li>
                <li>ANY BUSINESS INTERRUPTION OR OTHER COMMERCIAL DAMAGES OR LOSSES,</li>
              </ul>
              <p className="text-black leading-relaxed mt-3">
                ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF (OR INABILITY TO USE) THE PLATFORM, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-black leading-relaxed mt-4 mb-2">
                IN NO EVENT WILL OUR TOTAL AGGREGATE LIABILITY ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF THE PLATFORM EXCEED THE GREATER OF:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-black">
                <li>THE AMOUNT YOU HAVE PAID TO FLOCK (IF ANY) IN THE SIX (6) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE CLAIM; OR</li>
                <li>ONE HUNDRED U.S. DOLLARS (USD $100).</li>
              </ol>
              <p className="text-black leading-relaxed mt-4">
                Some jurisdictions do not allow certain exclusions or limitations of liability, so some of the above may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">15. Indemnification</h2>
              <p className="text-black leading-relaxed mb-2">
                You agree to <strong>defend, indemnify, and hold harmless</strong> Flock and its affiliates, officers, directors, employees, contractors, and agents from and against any claims, demands, losses, liabilities, damages, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">16. Governing Law & Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">16.1 Governing Law</h3>
              <p className="text-black leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of the <strong>State of Wyoming, USA</strong>, without regard to its conflict of laws principles, and applicable federal law.
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
                Except where prohibited by law, any dispute arising out of or relating to these Terms or the Platform that cannot be resolved informally will be resolved by <strong>binding arbitration</strong> administered by a recognized arbitration body (e.g., AAA or JAMS) in English, with a single arbitrator, in a venue reasonably selected by Flock.
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">17. Changes to These Terms</h2>
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
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">18. Other Important Terms</h2>
              <ul className="list-disc pl-6 space-y-3 text-black">
                <li>
                  <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and any other referenced policies, constitute the entire agreement between you and Flock.
                </li>
                <li>
                  <strong>Severability:</strong> If any provision is held invalid or unenforceable, the remaining provisions will remain in full force and effect.
                </li>
                <li>
                  <strong>No Waiver:</strong> Our failure to enforce any provision of these Terms is not a waiver of our right to do so later.
                </li>
                <li>
                  <strong>Assignment:</strong> You may not assign these Terms or any rights or obligations under them without our prior written consent. We may assign these Terms as part of a merger, acquisition, asset sale, or by operation of law.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mt-8 mb-4">19. Contact Us</h2>
              <p className="text-black leading-relaxed mb-3">
                If you have questions about these Terms, you may contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-black">
                <p className="font-semibold">Flock Together Global LLC</p>
                <p>
                  Email:{" "}
                  <a href="mailto:admin@flocktogether.xyz" className="text-blue-600 hover:underline">
                    admin@flocktogether.xyz
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