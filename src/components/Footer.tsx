export default function Footer() {
  const links = [
    { label: "About Us", href: "/about-us" },  
    { label: "Terms of Service", href: "/policy/terms-of-service" },
    { label: "Privacy Policy", href: "/policy/privacy-policy" },
    { label: "Community Guidelines", href: "/policy/community-guidelines" },
    { label: "Acceptable Use Policy", href: "/policy/acceptable-use-policy" },
    { label: "Creator Licensing", href: "/policy/creator-licensing" },
    { label: "DMCA", href: "/policy/dmca" },
    { label: "Monetization & Earnings Policy", href: "/policy/monetization-policy" },
    { label: "Refunds & Chargebacks", href: "/policy/refunds-policy" },
    { label: "KYC / AML Policy", href: "/policy/kyc-aml-policy" },
    { label: "Contact", href: "/contact" } 
  ];

  return (
    <footer className="w-full py-3 bg-purple-900 text-white text-center border-t border-gray-700">
      <div className="space-y-2">

        <div className="flex text-xs italic flex-wrap justify-center gap-4">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:underline"
            >
              {item.label}
            </a>
          ))}
        </div>

        <p className="mt-2 text-white text-sm font-bold">
          © Flock Together Global LLC
        </p>


      </div>
    </footer>
  );
}
