'use client';

import { FC } from 'react';
import Link from 'next/link';
import {
    FaFacebookF,
    FaInstagram,
    FaWhatsapp,
    FaYoutube,
} from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { FaXTwitter } from 'react-icons/fa6';

const TopNav: FC = () => {
    return (
        <div className="w-full bg-gray-950 text-gray-300 text-sm px-4 sm:px-6 lg:px-10 py-2 border-b border-gray-800">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                
                {/* Left: Contact Info */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-1">
                        <IoMdMail size={16} />
                        <span>info@tetemekomedia.co.ke</span>
                    </div>
                    <span className="hidden sm:inline">|</span>
                    <div className="flex items-center gap-1">
                        <FaWhatsapp size={16} />
                        <span>+254 719 161 925</span>
                    </div>
                </div>

                {/* Right: Social Links & Navigation */}
                <div className="flex items-center justify-center gap-4 mt-2 sm:mt-0">
                    <a
                        href="https://facebook.com/tetemekomedia"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="hover:text-white transition"
                    >
                        <FaFacebookF size={16} />
                    </a>
                    <a
                        href="https://twitter.com/tetemekomedia"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="hover:text-white transition"
                    >
                        <FaXTwitter size={16} />
                    </a>
                    <a
                        href="https://instagram.com/tetemekomedia"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="hover:text-white transition"
                    >
                        <FaInstagram size={16} />
                    </a>
                    <a
                        href="https://www.youtube.com/channel/UCNwWgwfletrfQbUHzlbq4nA"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Youtube"
                        className="hover:text-white transition"
                    >
                        <FaYoutube size={16} />
                    </a>
                    <Link href="/contact" className="hover:text-white transition">
                        Support
                    </Link>
                    <Link href="/contact" className="hover:text-white transition">
                        FAQs
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
