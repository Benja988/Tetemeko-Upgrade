'use client';

import Image from "next/image";

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
        <div className="absolute inset-0 bg-black/80" />
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
