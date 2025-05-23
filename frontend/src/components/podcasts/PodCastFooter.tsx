"use client";

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { SocialLinks } from "../SocialLinks";
import { QuickLinks } from "../QuickLinks";
import { ContactInfo } from "../ContactInfo";

export default function PodCastFooter() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-sm">
        {/* Logo & Description */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4">Tetemeko Podcasts</h3>
          <p className="text-gray-400 mb-4">
            Your daily source of inspiration, information, and impactful stories. Stream, share, and stay connected with Africa's leading voices.
          </p>
          <SocialLinks />
        </div>

        {/* Navigation */}
        <div>
          <QuickLinks />
        </div>

        {/* Contact */}
        <div>
          <ContactInfo />
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center mt-12 border-t border-white/10 pt-6 text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
      </div>
    </footer>
  );
}
