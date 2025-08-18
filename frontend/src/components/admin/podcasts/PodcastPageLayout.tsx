// // src/app/dashboard/podcasts/PodcastPageLayout.tsx
// "use client";

// import React, { useState } from "react";
// import { Podcast } from "@/interfaces/podcasts";
// import PodcastHeader from "@/components/podcasts/PodcastHeader";
// import PodcastSearch from "@/components/podcasts/PodcastSearch";
// import PodcastTable from "@/components/podcasts/PodcastTable";
// import PodcastForm from "@/components/podcasts/PodcastForm";

// const PodcastPageLayout: React.FC = () => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [showForm, setShowForm] = useState(false);

//   const handleAddPodcast = () => setShowForm(true);

//   const handleSavePodcast = (data: any) => {
//     // Later, connect with createPodcast service
//     const newPodcast: Podcast = {
//       _id: String(Date.now()),
//       title: data.title,
//       description: data.description,
//       coverImage: data.coverImage ? URL.createObjectURL(data.coverImage) : "",
//       category: { _id: "1", name: data.category },
//       station: data.station ? { _id: "2", name: data.station } : undefined,
//       isActive: true,
//     };
//     setPodcasts((prev) => [...prev, newPodcast]);
//     setShowForm(false);
//   };

//   const handleSearch = (query: string) => {
//     console.log("Search query:", query);
//     // later connect to getAllPodcasts({ search: query })
//   };

//   return (
//     <div className="p-6">
//       <PodcastHeader onAddPodcast={handleAddPodcast} />
//       <PodcastSearch onSearch={handleSearch} />
//       {showForm && <PodcastForm onSubmit={handleSavePodcast} />}
//       <PodcastTable podcasts={podcasts} />
//     </div>
//   );
// };

// export default PodcastPageLayout;
