'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { toast } from 'sonner';
import {
  FaBroadcastTower,
  FaMusic,
  FaGlobeAfrica,
  FaMicrophoneAlt,
  FaPlayCircle,
} from 'react-icons/fa';

import { getStations } from '@/services/stations';
import { Station } from '@/interfaces/Station';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay },
  }),
};

// Map station categories or types to icons
const iconMap = {
  radio: () => <FaBroadcastTower className="text-white text-xl" />,
  music: () => <FaMusic className="text-pink-400 text-xl" />,
  global: () => <FaGlobeAfrica className="text-green-400 text-xl" />,
  mic: () => <FaMicrophoneAlt className="text-orange-400 text-xl" />,
  play: () => <FaPlayCircle className="text-blue-400 text-xl" />,
};

const typeToIconKey: Record<string, keyof typeof iconMap> = {
  "Radio Station": "radio",
  "TV Station": "play",
  // Add more mappings as needed
};



export default function AboutUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      const data = await getStations();
      setStations(data);
    };

    fetchStations();
  }, []);

  return (
    <section
      id="about-us"
      ref={ref}
      className="relative bg-primary text-white py-24 px-4 sm:px-10 lg:px-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/bg/bg3.jpg"
          alt="About Tetemeko Media"
          fill
          className="object-cover opacity-25"
        />
        <div className="absolute bg-primary/40 inset-0 mix-blend-multiply" />
      </div>

      {/* Main content row */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
        {/* Left column */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {},
          }}
          className="w-full lg:w-1/2"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight"
          >
            About <span className="text-indigo-200">Tetemeko Media Group</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="text-lg text-gray-300 font-light leading-relaxed mb-5"
          >
            Tetemeko Media Group is a dynamic force in Kenya — uniting vibrant radio stations, captivating TV channels, and a thriving digital network under one visionary platform.
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={0.4}
            className="text-lg text-gray-300 font-light leading-relaxed mb-8"
          >
            From live broadcasts and on-demand programming to a cutting-edge digital marketplace and innovative advertising solutions, Tetemeko redefines how stories are shared and communities connect — merging legacy with the future, one broadcast at a time.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex gap-6 flex-wrap"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
          >
            {[
              { label: 'Radio Stations', value: `${stations.length}+`, color: 'text-yellow-400' },
              { label: 'Weekly Listeners', value: '10K+', color: 'text-cyan-400' },
              { label: 'Live Broadcasting', value: '24/7', color: 'text-green-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.2}
                className="bg-white/10 px-6 py-4 rounded-xl text-center backdrop-blur-md shadow-lg flex flex-col items-center w-[130px]"
              >
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="w-full lg:w-1/2 relative h-[360px] sm:h-[420px] lg:h-[520px] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10 group"
        >
          <Image
            src="/hero-images/network098.jpg"
            alt="Tetemeko Media Team"
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500 z-10" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute z-20 bottom-8 left-8 max-w-[80%] bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg text-white"
          >
            <p className="text-base sm:text-lg font-medium">
              Experience live radio broadcasts from our dynamic studios, anywhere in the world.
            </p>
            <p className="text-sm mt-2 text-white/80">
              Now streaming across all Tetemeko stations — radio, TV, and digital platforms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="absolute top-6 right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-xl overflow-hidden z-30"
          >
            <Image
              src="/logo.jpg"
              alt="Tetemeko Logo"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent group-hover:border-yellow-400 transition-all duration-500" />
        </motion.div>
      </div>

      {/* Stations Grid */}
      <div className="px-4 md:px-12 mt-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-white/10 pt-6">
        {stations.map((station, i) => (
          <motion.div
            key={station._id || station.name}
            variants={fadeUp}
            custom={i * 0.2}
            className="relative h-44 md:h-52 lg:h-56 rounded-xl overflow-hidden shadow-md border border-white/10 group transition-all duration-500 hover:shadow-xl bg-black/10"
          >
            <Image
              src={station.imageUrl || '/default-logo.jpg'}
              alt={`${station.name} Logo`}
              fill
              className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition duration-500" />
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-3 text-center text-white">
              <div className="w-10 h-10 md:w-12 md:h-12 mb-2 rounded-full border-4 border-white/70 shadow-md overflow-hidden transition-transform group-hover:scale-105">
                <Image
                  src={station.imageUrl || '/default-logo.jpg'}
                  alt={`${station.name} Logo`}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="text-sm md:text-base font-medium flex items-center gap-2 mb-1">
                {iconMap[typeToIconKey[station.type]]?.()}
                {station.name}
              </div>

              <p className="text-xs text-white/70">{station.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
