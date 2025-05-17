"use client";

import Image from "next/image";

const hosts = [
  {
    name: "Grace Mungai",
    role: "Radio Host - Life Talk",
    image: "/prof.jpg",
    bio: "Grace brings heartfelt conversations on family, faith, and lifestyle. Her calm voice and relatable stories resonate with listeners of all ages.",
  },
  {
    name: "Mike Otieno",
    role: "Host - The Tech Edge",
    image: "/prof.jpg",
    bio: "Mike covers cutting-edge innovation, digital trends, and entrepreneurship in Africa. His deep dives spark ideas and inspire action.",
  },
  {
    name: "Sarah Mwikali",
    role: "Journalist - Behind the News",
    image: "/prof.jpg",
    bio: "Sarah breaks down current affairs with clarity and context, giving listeners insights beyond headlines.",
  },
];

export default function PodCastSection3() {
  return (
    <section className="bg-gradient-to-br from-indigo-950 to-blue-900 text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Meet the Voices Behind the Mic
        </h2>
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-12">
          Get to know the hosts behind Tetemeko’s most popular shows. Their passion and perspectives shape every conversation.
        </p>

        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto flex-nowrap scroll-smooth -mx-2 px-2 pb-4">
          {hosts.map((host, idx) => (
            <div
              key={idx}
              className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition shadow backdrop-blur-sm text-left min-w-[250px] md:min-w-0"
            >
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow">
                <Image
                  src={host.image}
                  alt={host.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold">{host.name}</h3>
              <p className="text-sm text-indigo-300 mb-2">{host.role}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{host.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
