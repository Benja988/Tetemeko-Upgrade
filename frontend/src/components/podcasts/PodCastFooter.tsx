"use client";

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export default function PodCastFooter() {
  return (
    <footer className="bg-gradient-to-tr from-blue-950 to-indigo-900 text-white pt-16 pb-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-sm">
        {/* Logo & Description */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4">Tetemeko Podcasts</h3>
          <p className="text-gray-400 mb-4">
            Your daily source of inspiration, information, and impactful stories. Stream, share, and stay connected with Africa's leading voices.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="#" className="hover:text-blue-300 transition">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="hover:text-pink-400 transition">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="hover:text-blue-400 transition">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="hover:text-red-500 transition">
              <Youtube size={20} />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/" className="hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link href="/podcasts" className="hover:text-white transition">Episodes</Link>
            </li>
            <li>
              <Link href="/hosts" className="hover:text-white transition">Hosts</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <ul className="text-gray-400 space-y-2">
            <li>Email: <a href="mailto:info@tetemeko.com" className="hover:text-white">info@tetemeko.com</a></li>
            <li>Phone: <a href="tel:+254712345678" className="hover:text-white">+254 712 345 678</a></li>
            <li>Address: Nairobi, Kenya</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center mt-12 border-t border-white/10 pt-6 text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
      </div>
    </footer>
  );
}
