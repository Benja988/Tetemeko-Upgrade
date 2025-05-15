import Navbar from "@/components/Navbar";
import ContactHero from "@/components/contact/ContactHero";
import ContactBreadcrumb from "@/components/contact/ContactBreadcrumb";
import ContactSection from "@/components/contact/ContactSection";
import FAQs from "@/components/contact/FAQs";

export default function ContactPage() {
    return (
        <>
            {/* Sticky Navbar */}
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <Navbar />
            </div>

            {/* Breadcrumb Section */}
            <ContactBreadcrumb />


            {/* Hero Section */}
            <ContactHero />

            {/* Contact Section */}
            <div className="bg-gray-50 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <ContactSection />
                </div>
            </div>

            {/* FAQs Section */}
            <FAQs />
        </>
    );
}
