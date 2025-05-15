'use client';

import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';

const StickyShareButtons: React.FC = () => {
  // **List of Share Buttons**
  const shareButtons = [
    {
      icon: <FaFacebookF />,
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
      color: '#4267B2',
    },
    {
      icon: <FaTwitter />,
      url: 'https://twitter.com/intent/tweet?url=',
      color: '#1DA1F2',
    },
    {
      icon: <FaLinkedinIn />,
      url: 'https://www.linkedin.com/shareArticle?mini=true&url=',
      color: '#0077B5',
    },
    {
      icon: <FaWhatsapp />,
      url: 'https://api.whatsapp.com/send?text=',
      color: '#25D366',
    },
    {
      icon: <FaTelegramPlane />,
      url: 'https://t.me/share/url?url=',
      color: '#0088cc',
    },
  ];

  // **Get the current URL**
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="fixed left-4 top-1/3 z-50 flex flex-col space-y-3">
      {shareButtons.map((button, index) => (
        <a
          key={index}
          href={`${button.url}${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-white hover:opacity-80 transition-all duration-200"
          style={{ backgroundColor: button.color }}
        >
          {button.icon}
        </a>
      ))}
    </div>
  );
};

export default StickyShareButtons;
