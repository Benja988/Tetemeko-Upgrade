'use client';
import { FC } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const StickyShareButtons: FC = () => {
    return (
        <div className="fixed top-1/2 left-4 z-50 hidden md:flex flex-col gap-4">
            <a href="#" title="Share on Facebook"><FaFacebook className="text-blue-600 hover:scale-110 transition" size={24} /></a>
            <a href="#" title="Share on Twitter"><FaTwitter className="text-sky-500 hover:scale-110 transition" size={24} /></a>
            <a href="#" title="Share on LinkedIn"><FaLinkedin className="text-blue-700 hover:scale-110 transition" size={24} /></a>
        </div>
    );
};

export default StickyShareButtons;
