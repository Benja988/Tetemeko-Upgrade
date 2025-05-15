'use client';

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBroadcastTower,  // Ensure this import is included
  FaNewspaper,      // Ensure this import is included
  FaPodcast,        // Ensure this import is included
  FaStore           // Ensure this import is included
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-primary text-gray-300 pt-48 pb-36 px-6">
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
        {/* About Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Tetemeko Media Group</h2>
          <p className="text-sm text-gray-400">
            Your one-stop platform for streaming, news, podcasts, and an exclusive marketplace. We bring the world closer to you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/stations" className="flex items-center gap-2 hover:text-white transition">
                <FaBroadcastTower /> Stations
              </a>
            </li>
            <li>
              <a href="/news" className="flex items-center gap-2 hover:text-white transition">
                <FaNewspaper /> News
              </a>
            </li>
            <li>
              <a href="/podcasts" className="flex items-center gap-2 hover:text-white transition">
                <FaPodcast /> Podcasts
              </a>
            </li>
            <li>
              <a href="/marketplace" className="flex items-center gap-2 hover:text-white transition">
                <FaStore /> Marketplace
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <FaEnvelope /> <a href="mailto:info@tetemeko.com" className="hover:text-white transition">info@tetemeko.com</a>
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <FaPhone /> +255-XXX-XXXXXX
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <FaMapMarkerAlt /> 123 Tetemeko Street, Dar es Salaam, Tanzania
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition text-xl">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-xl">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
      </div>
    </footer>
  );
}
