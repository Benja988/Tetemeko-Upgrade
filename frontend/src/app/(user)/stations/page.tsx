"use client";

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
    <div className="bg-primary text-white min-h-screen">
      <Navbar />

      {/* Section 1 */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StationsSection1 />
      </motion.section>

      {/* Section 2 */}
      <StationsSection2 />

      {/* Section 3 */}
      <StationsSection3 />

      {/* Section 4 */}
      <StationsSection4 />

      {/* Section 5 */}
      <StationsSection5 />

      {/* Footer */}
      <StationsFooter />
    </div>
  );
}
