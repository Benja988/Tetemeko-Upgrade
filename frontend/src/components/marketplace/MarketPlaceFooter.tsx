'use client';

import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const shortcutLinks = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'About Us', href: '/about' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export default function MarketPlaceFooter() {
  return (
    <footer className="bg-primary text-white py-12 px-6 md:px-10 font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Shortcut Links */}
          <nav aria-label="Footer Shortcut Links" className="flex flex-col space-y-3">
            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
            {shortcutLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="hover:text-indigo-400 transition-colors"
                tabIndex={0}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* About / Description */}
          <div>
            <h3 className="font-semibold text-lg mb-3">About Tetemeko</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tetemeko Media Group is your go-to platform for quality products and services. We bring
              you the best brands and an amazing shopping experience.
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
            <div className="flex space-x-5 text-xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-indigo-400 transition-colors"
              >
                <FiFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-indigo-400 transition-colors"
              >
                <FiTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-indigo-400 transition-colors"
              >
                <FiInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-indigo-400 transition-colors"
              >
                <FiLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-indigo-600 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
