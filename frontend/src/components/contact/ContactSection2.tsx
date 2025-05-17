"use client";

import { FaPhoneAlt, FaEnvelope, FaUserTie, FaClock } from "react-icons/fa";

export default function ContactSection2() {
  const contacts = [
    {
      department: "General Inquiries",
      person: "Customer Support",
      phone: "+255 700 123 456",
      email: "info@tetemekomedia.com",
      hours: "Mon–Fri, 9AM–5PM",
    },
    {
      department: "Technical Support",
      person: "Joshua M.",
      phone: "+255 744 555 111",
      email: "support@tetemekomedia.com",
      hours: "24/7 Support Available",
    },
    {
      department: "Advertising & Sales",
      person: "Zainab K.",
      phone: "+255 711 333 222",
      email: "ads@tetemekomedia.com",
      hours: "Mon–Fri, 10AM–6PM",
    },
    {
      department: "Studio Bookings",
      person: "Kelvin R.",
      phone: "+255 786 888 000",
      email: "booking@tetemekomedia.com",
      hours: "Mon–Sat, 8AM–8PM",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6 md:px-16 text-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Contact Directory</h2>

        {/* Table-like layout for medium+ screens */}
        <div className="hidden md:grid grid-cols-5 bg-primary text-white font-semibold rounded-t-xl overflow-hidden">
          <div className="py-3 px-4">Department</div>
          <div className="py-3 px-4">Contact Person</div>
          <div className="py-3 px-4">Phone</div>
          <div className="py-3 px-4">Email</div>
          <div className="py-3 px-4">Availability</div>
        </div>

        {contacts.map((c, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 md:grid-cols-5 bg-white md:border-t border-gray-200 rounded-xl md:rounded-none shadow-sm md:shadow-none mb-4 md:mb-0`}
          >
            <div className="py-4 px-4 border-b md:border-none font-medium">{c.department}</div>
            <div className="py-4 px-4 border-b md:border-none flex items-center gap-2">
              <FaUserTie className="text-primary" />
              {c.person}
            </div>
            <div className="py-4 px-4 border-b md:border-none flex items-center gap-2">
              <FaPhoneAlt className="text-primary" />
              {c.phone}
            </div>
            <div className="py-4 px-4 border-b md:border-none flex items-center gap-2">
              <FaEnvelope className="text-primary" />
              {c.email}
            </div>
            <div className="py-4 px-4 flex items-center gap-2">
              <FaClock className="text-primary" />
              {c.hours}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
