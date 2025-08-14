'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';

export default function ReserveButton({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) {
  const buttonVariants = {
    primary: {
      background: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      text: 'text-white',
      icon: 'text-blue-200',
      shadow: 'shadow-lg hover:shadow-xl'
    },
    secondary: {
      background: 'bg-white border-2 border-blue-600 hover:bg-blue-50',
      text: 'text-blue-600 hover:text-blue-700',
      icon: 'text-blue-500',
      shadow: 'shadow-md hover:shadow-lg'
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1
        }
      }}
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
    >
      <Link href="/requestServices" passHref legacyBehavior>
        <motion.a
          whileHover={{ 
            y: -4,
            scale: 1.02,
          }}
          whileTap={{ 
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
          className={`
            flex w-full ${buttonVariants[variant].background} ${buttonVariants[variant].text}
            font-semibold text-lg px-8 py-4 rounded-xl ${buttonVariants[variant].shadow}
            transition-all duration-300 items-center justify-center gap-3
            relative overflow-hidden group
          `}
        >
          {/* Animated background effect */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10"
            initial={{ x: '-100%' }}
            whileHover={{ 
              x: '100%',
              transition: { duration: 1.2, ease: 'linear' }
            }}
          />
          
          <FiCalendar 
            className={`${buttonVariants[variant].icon} transition-transform group-hover:scale-110`} 
            size={22} 
          />
          
          <span className="relative z-10">Reserve Media Services</span>
          
          <FiArrowRight 
            className={`ml-1 transition-all duration-300 group-hover:translate-x-1 ${buttonVariants[variant].icon}`}
          />
          
          {/* Ripple effect */}
          <motion.span
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{
              scale: 2,
              opacity: 0.2,
              transition: { duration: 0.6 }
            }}
          />
        </motion.a>
      </Link>
    </motion.div>
  );
}