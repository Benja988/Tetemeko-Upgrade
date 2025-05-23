import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactSection1 from "@/components/contact/ContactSection1";
import ContactSection2 from "@/components/contact/ContactSection2";
import ContactSection3 from "@/components/contact/ContactSection3";
import FAQs from "@/components/contact/FAQs";

export default function ContactPage() {
    return (
        <>
            {/* Sticky Navbar */}
            <Navbar />


            <ContactSection1 />
            <ContactSection2 />
            <ContactSection3 />
            {/* <ContactSection4 /> */}



            {/* FAQs Section */}
            <FAQs />
            <Footer />
        </>
    );
}
