// 'use client';

// import React from 'react';
// import { Podcast } from '@/interfaces/podcasts';
// import PodcastCard from './PodcastCard';

// interface PodcastListProps {
//   podcasts: Podcast[];
//   onEdit?: (id: string) => void;
//   onDelete?: (id: string) => void;
// }

// const PodcastList: React.FC<PodcastListProps> = ({ podcasts, onEdit, onDelete }) => {
//   if (podcasts.length === 0) {
//     return <p className="text-gray-500">No podcasts available.</p>;
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {podcasts.map((podcast) => (
//         <PodcastCard
//           key={podcast._id}
//           podcast={podcast}
//           onEdit={onEdit}
//           onDelete={onDelete}
//         />
//       ))}
//     </div>
//   );
// };

// export default PodcastList;
