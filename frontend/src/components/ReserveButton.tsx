'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarCheck } from 'react-icons/fa';

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function ReserveButton() {
  return (
    <motion.div
      className="mt-16 w-full max-w-md text-center relative z-10 mx-auto"
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Link href="/requestServices">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#1a94d6] text-white font-semibold text-lg sm:text-xl px-6 py-4 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-3
          border border-[#0E2233] hover:bg-[#0E2233] hover:shadow-blue-800/40 active:scale-95"
        >
          <FaCalendarCheck size={22} className="text-blue-400" />
          <span className="tracking-wide">Reserve Our Media Services</span>
        </motion.button>
      </Link>
    </motion.div>
  );
}
