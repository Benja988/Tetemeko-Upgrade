'use client'

import Link from 'next/link'
import { FC } from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { FaXTwitter } from 'react-icons/fa6'

const TopNav: FC = () => {
  return (
    <header className="w-full bg-gray-950 text-gray-300 text-sm border-b border-gray-800 px-4 sm:px-6 lg:px-10 py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <IoMdMail className="text-blue-400" size={16} />
            <span>info@tetemekomedia.co.ke</span>
          </div>
          <span className="hidden sm:inline text-gray-500">|</span>
          <div className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500" size={16} />
            <span>+254 719 161 925</span>
          </div>
        </div>

        {/* Social Links & Nav */}
        <div className="flex items-center justify-center gap-6 mt-2 sm:mt-0">
          <a
            href="https://facebook.com/tetemekomedia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:scale-110 transition"
          >
            <FaFacebookF size={16} className="text-blue-600 hover:text-blue-700" />
          </a>

          <a
            href="https://twitter.com/tetemekomedia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:scale-110 transition"
          >
            <FaXTwitter size={16} className="text-black dark:text-white hover:text-blue-400" />
          </a>

          <a
            href="https://instagram.com/tetemekomedia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:scale-110 transition"
          >
            <FaInstagram size={16} className="text-pink-500 hover:text-pink-600" />
          </a>

          <a
            href="https://www.youtube.com/channel/UCNwWgwfletrfQbUHzlbq4nA"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:scale-110 transition"
          >
            <FaYoutube size={16} className="text-red-600 hover:text-red-700" />
          </a>

          <Link href="/contact" className="hover:text-white hover:underline transition">
            Support
          </Link>

          {/* <Link href="/contact" className="hover:text-white hover:underline transition">
            FAQs
          </Link> */}
        </div>
      </div>
    </header>
  )
}

export default TopNav
