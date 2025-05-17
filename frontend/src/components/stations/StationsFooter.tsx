"use client";

import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

export default function StationsFooter() {
  return (
    <footer className="text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-bold mb-2 font-poppins">Tetemeko Media</h2>
            <p className="text-gray-400 text-sm leading-relaxed font-inter">
              Broadcasting the voice of the people through powerful radio and TV stations across Africa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3 font-poppins">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300 font-inter">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">Stations</a></li>
              <li><a href="#" className="hover:text-white transition">Live Stream</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-3 font-poppins">Follow Us</h3>
            <div className="flex items-center space-x-4 text-xl">
              <a href="#" className="hover:text-blue-500 transition"><FaFacebookF /></a>
              <a href="#" className="hover:text-sky-400 transition"><FaTwitter /></a>
              <a href="#" className="hover:text-red-500 transition"><FaYoutube /></a>
              <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
