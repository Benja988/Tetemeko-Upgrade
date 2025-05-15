import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactSection() {
  return (
    <section className="bg-[#07131F] py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center md:text-left">
              Get in Touch
            </h2>
            <p className="text-gray-300 text-center md:text-left">
              Have a question or just want to say hi? Fill out the form or contact us through the details below.
            </p>
          </div>

          <ContactInfo />
        </div>

        {/* Contact Form */}
        <div>
          <ContactForm />
        </div>

      </div>
    </section>
  );
}
