"use client";

import Link from "next/link";

export default function ContactSection1() {
  return (
    <section className="relative bg-gradient-to-r from-primary via-primary/90 to-secondary text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/contact-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="mb-4 text-sm text-gray-200">
          <Link href="/" className="hover:underline">Home</Link> <span className="mx-1">/</span> <span>Contact</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in Touch With Us</h1>
        <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
          Have a question, proposal, or just want to say hello? We're here to help and would love to hear from you.
        </p>
        <a
          href="#contact-form"
          className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
        >
          Contact Us Now
        </a>
      </div>
    </section>
  );
}
