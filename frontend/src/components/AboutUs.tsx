'use client';

import Image from "next/image";
import Link from "next/link";
import { FaBroadcastTower, FaMusic, FaGlobeAfrica, FaMicrophoneAlt, FaPlayCircle } from 'react-icons/fa';

export default function AboutUs() {
  return (
    <section id="about-us" className="relative bg-gray-950 text-white py-24 px-4 sm:px-10 lg:px-24">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg/bg3.jpg"
          alt="About Tetemeko Media"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary opacity-80" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-14">
        {/* Text Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            About Tetemeko Media Group
          </h2>
          <p className="text-lg text-gray-300 font-light leading-relaxed mb-5">
            Tetemeko Media Group is a dynamic media powerhouse, home to a family of vibrant radio stations, innovative content creators, and a thriving digital ecosystem. We are redefining how stories are told, how communities engage, and how brands connect with audiences across borders.
          </p>
          <p className="text-lg text-gray-300 font-light leading-relaxed mb-6">
            With live radio streaming, on-demand podcasts, a digital marketplace, and a powerful advertising engine, we are committed to empowering voices, entertaining audiences, and driving impactful conversations. Our tech-forward platform bridges tradition and innovation — one broadcast at a time.
          </p>

          {/* Optional stats or highlights */}
          <div className="mt-10 flex gap-6 flex-wrap">
            <div className="bg-white/10 px-6 py-4 rounded-xl text-center backdrop-blur-md shadow-md">
              <h3 className="text-3xl font-bold text-yellow-400">10+</h3>
              <p className="text-sm text-gray-300">Radio Stations</p>
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-xl text-center backdrop-blur-md shadow-md">
              <h3 className="text-3xl font-bold text-cyan-400">100K+</h3>
              <p className="text-sm text-gray-300">Weekly Listeners</p>
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-xl text-center backdrop-blur-md shadow-md">
              <h3 className="text-3xl font-bold text-green-400">24/7</h3>
              <p className="text-sm text-gray-300">Live Broadcasting</p>
            </div>
          </div>

          {/* List of Stations */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4 text-white">Our Stations</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <FaBroadcastTower className="text-white" />
                Radio PinyLuo – Community voices, local power.
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <FaMusic className="text-pink-400" />
                Vibe Radio – Non-stop music and urban culture.
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <FaGlobeAfrica className="text-green-400" />
                Swahili Nation – Bridging East African stories.
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <FaMicrophoneAlt className="text-yellow-300" />
                Youth Talk – Bold voices. Big ideas.
              </li>

              {/* Listen Live Button */}
              <div className="mt-8">
                <Link
                  href="/stations"
                  className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-300"
                >
                  <FaPlayCircle className="text-lg" />
                  Listen Live
                </Link>
              </div>


            </ul>
          </div>
        </div>

        {/* Team or Broadcasting Image */}
        <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/team.jpg"
            alt="Tetemeko Media Team"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
