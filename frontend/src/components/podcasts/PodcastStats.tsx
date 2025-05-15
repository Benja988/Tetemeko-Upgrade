// PodcastStats.tsx
"use client";

export default function PodcastStats({ podcastId }: { podcastId: string }) {
  const stats = { listens: 1200, subscribers: 500, reviews: 100 }; // Example data

  return (
    <div className="mt-4 flex gap-6">
      <div className="text-center">
        <h4 className="text-sm text-gray-600">Listens</h4>
        <p className="text-xl font-semibold text-gray-900">{stats.listens}</p>
      </div>
      <div className="text-center">
        <h4 className="text-sm text-gray-600">Subscribers</h4>
        <p className="text-xl font-semibold text-gray-900">{stats.subscribers}</p>
      </div>
      <div className="text-center">
        <h4 className="text-sm text-gray-600">Reviews</h4>
        <p className="text-xl font-semibold text-gray-900">{stats.reviews}</p>
      </div>
    </div>
  );
}
