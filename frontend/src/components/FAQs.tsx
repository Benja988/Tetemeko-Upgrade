'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReserveButton from './ReserveButton'

const faqs = [
  {
    question: "How can I contact your support team?",
    answer: "You can contact us through the form on this page, or email us directly at support@tetemeko.com. We're available Monday to Friday, 9am - 6pm EAT.",
    icon: "📞"
  },
  {
    question: "How long does it take to get a response?",
    answer: "We usually respond within 24 hours during business days. For urgent matters, please call our hotline at +254 700 000 000.",
    icon: "⏱️"
  },
  {
    question: "Can I schedule a meeting or demo?",
    answer: "Absolutely! Use our booking system to schedule a consultation or mention your interest in a demo in the contact form and we'll arrange a time that suits you.",
    icon: "📅"
  },
  {
    question: "Where are your studios located?",
    answer: "Our main studio is in Nairobi, with regional studios in Kisumu and Mombasa. We also offer remote broadcasting services across East Africa.",
    icon: "📍"
  },
  {
    question: "How can I advertise with Tetemeko Media?",
    answer: "We offer various advertising packages across our radio, TV, and digital platforms. Contact our sales team at sales@tetemeko.com for a customized proposal.",
    icon: "📢"
  }
]

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Floating question marks */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 0.1, y: '100vh' }}
            transition={{ duration: 15 + Math.random() * 10, delay: Math.random() * 5, repeat: Infinity }}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ?
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about our services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden border ${openIndex === index ? 'border-blue-300 shadow-lg' : 'border-gray-200'} transition-all`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{faq.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <ReserveButton />
        </div>
      </div>
    </section>
  )
}