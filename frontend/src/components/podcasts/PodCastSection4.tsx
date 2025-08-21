"use client";

import { podcastService } from "@/services/podcasts/podcastsService";
import { useEffect, useState } from "react";

export default function PodCastSection4() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await podcastService.getAll({page: 1, limit: 50});
        const unique = res.podcasts
          .map((p) => p.category)
          .filter(
            (c, idx, arr) => c && arr.findIndex((x) => x._id === c._id) === idx
          )
          .map((c) => ({ id: c._id, name: c.name }));
        setCategories(unique);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="bg-slate-900 text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Browse by Categories</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-xl font-semibold">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
