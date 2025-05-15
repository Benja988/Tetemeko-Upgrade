export default function ContactHero() {
  return (
    <section className="bg-gradient-to-br from-[#07131F] to-[#0A1F2B] text-white rounded-2xl shadow-xl px-12 py-16 lg:py-24 lg:px-16 transition-all">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch with Us
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Have questions or need assistance? Our team is here to help. Reach out to us, and we’ll get back to you as soon as possible.
          </p>
          <a
            href="#contact-form"
            className="flex items-center justify-center w-10 h-10 bg-blue-900 text-white rounded-full hover:bg-blue-700 transition duration-300"
            aria-label="Scroll Down"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
          </svg>
        </a>
      </div>

      {/* Decorative Image */}
      <div className="flex justify-center">
        <img
          src="/team.jpg" // Replace with your actual image path
          alt="Contact Us Illustration"
          className="w-full max-w-md lg:max-w-lg"
        />
      </div>
    </div>
    </section >
  );
}
