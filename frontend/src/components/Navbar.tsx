'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { navLinks } from '@/constants/navLinks';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="w-full bg-[#07131F] text-white border-b border-primary">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-wide">
          Tetemeko Media Group
        </Link>

        {/* Desktop Nav */}
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
          {/* <Link href="/marketplace/cart">
            <FaShoppingCart className="text-lg hover:text-gray-300 transition" />
          </Link>
          <Link href="/account">
            <FaUserCircle className="text-lg hover:text-gray-300 transition" />
          </Link> */}
        </nav>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="md:hidden">
          {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-3 bg-gray-900 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="block text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* <Link href="/marketplace/cart" className="block hover:text-white">
            Cart
          </Link>
          <Link href="/account" className="block hover:text-white">
            Account
          </Link> */}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
