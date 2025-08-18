// // app/podcasts/[id]/page.tsx
// "use client";

// import { Episode, Podcast } from "@/interfaces/podcasts";
// import { getPodcastById } from "@/services/podcasts/podcastsService";
// import { useEffect, useState } from "react";

// export default function PodcastDetailPage({ params }: { params: { id: string } }) {
//   const [podcast, setPodcast] = useState<Podcast | null>(null);
//   const [episodes, setEpisodes] = useState<Episode[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const podcastData = await getPodcastById(params.id);
//       if (podcastData) setPodcast(podcastData);

//       const episodeData = await getEpisodesByPodcastId(params.id, { page: 1, limit: 20 });
//       if (episodeData && episodeData.episodes) setEpisodes(episodeData.episodes);
//     };
//     fetchData();
//   }, [params.id]);

//   if (!podcast) return <p className="text-center text-gray-500">Loading...</p>;

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-6">
//       {/* Podcast Header */}
//       <div className="flex items-center gap-6 mb-8">
//         <img
//           src={podcast.coverImage}
//           alt={podcast.title}
//           className="w-32 h-32 rounded-xl object-cover"
//         />
//         <div>
//           <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
//             {podcast.title}
//           </h1>
//           <p className="text-sm text-neutral-500 dark:text-neutral-400">
//             Hosted by {podcast.station} • {podcast.category}
//           </p>
//           <p className="mt-2 text-neutral-700 dark:text-neutral-300 line-clamp-3">
//             {podcast.description}
//           </p>
//         </div>
//       </div>

//       {/* Episodes */}
//       <h2 className="text-xl font-semibold mb-4">Episodes</h2>
//       <div className="space-y-4">
//         {episodes.map((ep) => (
//           <EpisodeCard key={ep._id} episode={ep} />
//         ))}
//       </div>
//     </div>
//   );
// }
