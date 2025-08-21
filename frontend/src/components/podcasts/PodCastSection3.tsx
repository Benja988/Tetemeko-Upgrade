"use client";

import { useEffect, useState } from "react";
import { Podcast } from "@/interfaces/podcasts";
import { podcastService } from "@/services/podcasts/podcastsService";

export default function PodCastSection3() {
  const [hosts, setHosts] = useState<Podcast["createdBy"][]>([]);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await podcastService.getAll({page: 1, limit: 20});
        const unique = res.podcasts
          .map((p) => p.createdBy)
          .filter((host, idx, arr) => host && arr.findIndex((h) => h._id === host._id) === idx);
        setHosts(unique);
      } catch (err) {
        console.error("Failed to load hosts", err);
      }
    };
    fetchHosts();
  }, []);

  return (
    <section className="bg-gradient-to-br from-indigo-950 to-blue-900 text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Meet the Hosts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {hosts.map((host) => (
            <div key={host._id} className="bg-white/5 p-6 rounded-xl">
              <img
                src={"/default-avatar.png"}
                alt={host.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{host.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
