"use client";

import { motion } from "framer-motion";
import ReserveButton from "../ReserveButton";

const features = [
  {
    id: 1,
    title: "24/7 Live Streaming",
    description:
      "Stay in tune day or night — catch our broadcasts anytime, anywhere on any device.",
    icon: (
      <svg
        className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 transition duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Diverse Content",
    description:
      "From music to breaking news — enjoy a wide range of radio and TV programming.",
    icon: (
      <svg
        className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 transition duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Community Connection",
    description:
      "Join the conversation with interactive shows, local news, and audience participation.",
    icon: (
      <svg
        className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 transition duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 20h5v-2a4 4 0 0 0-3-3.87" />
        <path d="M9 20H4v-2a4 4 0 0 1 3-3.87" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "On-Demand Access",
    description:
      "Rewind, replay, and relive your favorite shows whenever it suits you.",
    icon: (
      <svg
        className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 transition duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
];

export default function StationsSection4() {
  return (
    <section className="bg-primary py-20 px-6 md:px-16 text-white">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <motion.h2
          className="text-3xl md:text-4xl font-poppins font-semibold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Choose Tetemeko Media?
        </motion.h2>
        <motion.p
          className="text-gray-300 font-inter max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          We're more than just media — we’re your platform for culture, creativity, and connection.
        </motion.p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {features.map(({ id, title, description, icon }, i) => (
          <motion.div
            key={id}
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center shadow-md border border-white/10 hover:shadow-xl hover:border-white/20 transition duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-300 font-light">{description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <ReserveButton />
      </div>
    </section>
  );
}
