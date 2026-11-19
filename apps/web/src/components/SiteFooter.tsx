import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="border-t border-[#1E293B] bg-[#06090F] py-16 px-6 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <BrandLogo size="md" variant="dark" href="/" />
          <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
            HuboVerse is the enterprise SaaS platform uniting HubSpot learning, live coaching studios, and Anna AI—delivering autonomous consulting and safe CRM execution.
          </p>
          <div className="text-[11px] text-gray-400 pt-2">
            Built by certified HubSpot specialists at <strong>HuboExperts</strong>.
          </div>
        </div>

        {/* Column 1: Platform */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Platform</div>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/features" className="hover:text-[#FF5C00] transition-colors">
                Platform Architecture
              </Link>
            </li>
            <li>
              <Link href="/anna" className="hover:text-[#FF5C00] transition-colors">
                Anna AI (Chat &amp; Build)
              </Link>
            </li>
            <li>
              <Link href="/features#registry" className="hover:text-[#FF5C00] transition-colors">
                Action Capability Registry
              </Link>
            </li>
            <li>
              <Link href="/features#vault" className="hover:text-[#FF5C00] transition-colors">
                AES-256 Scoped Vault
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Education */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Education</div>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/academy" className="hover:text-[#FF5C00] transition-colors">
                Learning Academy
              </Link>
            </li>
            <li>
              <Link href="/academy#livekit" className="hover:text-[#FF5C00] transition-colors">
                LiveKit Studio Workshops
              </Link>
            </li>
            <li>
              <Link href="/academy#certifications" className="hover:text-[#FF5C00] transition-colors">
                Certifications
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-[#FF5C00] transition-colors">
                Enterprise Subscriptions
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Company</div>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/about" className="hover:text-[#FF5C00] transition-colors">
                About HuboVerse
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#FF5C00] transition-colors">
                Book a Demo
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#FF5C00] transition-colors">
                Contact &amp; Support
              </Link>
            </li>
            <li>
              <Link href="/app" className="hover:text-[#FF5C00] transition-colors">
                Client Workspace &amp; Anna AI
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
        <div>&copy; {new Date().getFullYear()} HuboVerse by HuboExperts. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-white">Security &amp; RLS</Link>
          <Link href="/about" className="hover:text-white">Privacy Policy</Link>
          <Link href="/about" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
