'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { navLinks } from '@/constants/navLinks';

interface NavbarProps {
  isScrolled?: boolean;
}

const Navbar = ({ isScrolled = false }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  return (
    <>
      {/* Main Navbar */}
      <header className={`fixed w-full transition-all duration-500 z-50 ${
        isScrolled ? 'bg-primary/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-10 h-10"
            >
              <Image
                src="/logo.jpg"
                alt="Tetemeko Media Group"
                width={40}
                height={40}
                className="object-contain"
              />
            </motion.div>
            <span className="text-white text-xl font-bold tracking-wide hidden sm:block">
              Tetemeko Media
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="relative group font-medium text-white/90 hover:text-white transition"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSearch}
              className="p-2 hover:text-light transition"
              aria-label="Search"
            >
              <FaSearch />
            </button>
            <Link 
              href="/account" 
              className="p-2 hover:text-secondary transition hidden sm:block"
              aria-label="Account"
            >
              <FaUser />
            </Link>
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 z-50"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-md p-4"
          >
            <div className="max-w-7xl mx-auto flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stations, shows, and more..."
                className="flex-1 px-4 py-2 border-b-2 border-primary focus:outline-none text-gray-800"
              />
              <button className="ml-4 px-4 py-2 bg-primary text-white rounded">
                Search
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 bg-primary/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center space-y-8 pt-24"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-medium text-white hover:text-secondary transition"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-8 flex gap-4">
              <Link 
                href="/account" 
                className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-primary transition"
              >
                Account
              </Link>
              <Link 
                href="/contact" 
                className="px-6 py-2 bg-white text-primary rounded-full hover:bg-gray-100 transition"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;