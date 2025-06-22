// import { CompanyInfo } from './CompanyInfo';
// import { QuickLinks } from './QuickLinks';
// import { ContactInfo } from './ContactInfo';
// import { SocialLinks } from './SocialLinks';

// export default function Footer() {
//   return (
//     <footer className="bg-primary text-gray-300 pt-48 pb-36 px-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
//         <CompanyInfo />
//         <QuickLinks />
//         <ContactInfo />
//         <SocialLinks />
//       </div>
//       <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
//         © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
//       </div>
//     </footer>
//   );
// }


'use client';

import Link from 'next/link';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import { SocialLinks } from './SocialLinks';
import { QuickLinks } from './QuickLinks';
import { CompanyInfo } from './CompanyInfo';

export default function Footer() {
  return (
    <footer className="bg-[#07131F] text-white pt-16 pb-10 px-4 sm:px-8 lg:px-20 relative z-10">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Tetemeko Media</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            Bridging communities through media. Streaming radio, on-demand content, and empowering East Africa’s voice.
          </p>
          <div className="flex space-x-4 mt-4">
            <SocialLinks />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <QuickLinks />
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-gray-300 mb-4">Subscribe to receive the latest news and show updates.</p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md bg-white/10 text-white placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <CompanyInfo />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
      </div>
    </footer>
  );
}
