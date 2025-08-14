'use client'
import { motion } from 'framer-motion'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import { useState } from 'react'

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a
    href={href}
    whileHover={{ x: 5, color: '#3b82f6' }}
    className="block text-gray-400 hover:text-blue-500 transition-colors mb-3"
  >
    {children}
  </motion.a>
)

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="relative bg-[#07131F] text-white pt-20 pb-12 overflow-hidden">
      {/* Floating media elements */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 1, delay: i * 0.2 }}
            className="absolute border border-white/10 rounded-full"
            style={{
              width: `${50 + Math.random() * 150}px`,
              height: `${50 + Math.random() * 150}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-white">
                T
              </span>
              Tetemeko Media
            </h3>
            <p className="text-gray-400 mb-6">
              Bridging communities through innovative media solutions across East Africa.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ y: -5 }}
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook size={18} />
              </motion.a>
              <motion.a
                whileHover={{ y: -5 }}
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter size={18} />
              </motion.a>
              <motion.a
                whileHover={{ y: -5 }}
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ y: -5 }}
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <FaYoutube size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/services">Our Services</FooterLink>
            <FooterLink href="/stations">Radio Stations</FooterLink>
            <FooterLink href="/podcasts">Podcasts</FooterLink>
            <FooterLink href="/news">News</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
            <div className="flex items-start gap-3 text-gray-400 mb-4">
              <MdLocationOn className="text-blue-500 mt-1 flex-shrink-0" />
              <p>Tetemeko Plaza, Nairobi, Kenya</p>
            </div>
            <div className="flex items-center gap-3 text-gray-400 mb-4">
              <MdPhone className="text-blue-500" />
              <p>+254 700 000 000</p>
            </div>
            <div className="flex items-center gap-3 text-gray-400 mb-6">
              <MdEmail className="text-blue-500" />
              <p>info@tetemeko.com</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h5 className="text-sm font-medium text-white mb-2">Emergency Broadcast</h5>
              <p className="text-xs text-gray-400">For urgent matters, call our 24/7 hotline: +254 711 000 000</p>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to receive the latest news, shows, and updates from Tetemeko Media.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}