'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { navLinks } from '@/constants/navLinks';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* Normal Navbar */}
      <header className="w-full bg-[#07131F]/80 text-white border-b border-primary backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-wide">
            Tetemeko Media Group
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="hover:text-gray-300 transition"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="md:hidden">
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center space-y-6 text-white text-xl transition-all duration-300 md:hidden">
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-2xl hover:text-gray-300"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

          {/* Menu Links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className="hover:text-gray-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
