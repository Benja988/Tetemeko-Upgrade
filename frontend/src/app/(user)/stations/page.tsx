'use client';

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StationsFooter from "@/components/stations/StationsFooter";
import StationsSection1 from "@/components/stations/StationsSection1";
import StationsSection2 from "@/components/stations/StationsSection2";
import StationsSection3 from "@/components/stations/StationsSection3";
import StationsSection4 from "@/components/stations/StationsSection4";
import StationsSection5 from "@/components/stations/StationsSection5";
import { motion } from "framer-motion";

export default function StationsPage() {
  return (
    <div className="relative bg-primary text-white min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/netvid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (optional for contrast) */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Page Content */}
      <div className="relative z-20">
        <Navbar />

        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StationsSection1 />
        </motion.section>

        {/* Sections 2-5 */}
        <StationsSection2 />
        <StationsSection3 />
        <StationsSection4 />
        <StationsSection5 />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
