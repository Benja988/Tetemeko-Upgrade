"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How can I contact your support team?",
    answer: "You can contact us through the form on this page, or email us directly at support@example.com. We're available Monday to Friday, 9am - 6pm.",
  },
  {
    question: "How long does it take to get a response?",
    answer: "We usually respond within 24 hours during business days. Please allow extra time during weekends and holidays.",
  },
  {
    question: "Can I schedule a meeting or demo?",
    answer: "Yes! Just mention your interest in a demo in the contact form and we will arrange a time that suits you.",
  },
  {
    question: "Where are you located?",
    answer: "Our headquarters are located in New York City, but we serve clients worldwide.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#07131F] mb-10 sm:mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 sm:p-6 text-left text-[#07131F] font-semibold text-base sm:text-lg focus:outline-none"
              >
                <span className="flex-1">{faq.question}</span>
                <span className="ml-4 text-xl sm:text-2xl">
                  {openIndex === index ? "-" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-600 text-sm sm:text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
