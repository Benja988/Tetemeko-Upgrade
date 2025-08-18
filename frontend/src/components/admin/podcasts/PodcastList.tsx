// src/components/PodcastsList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getAllPodcasts } from '@/services/podcasts/podcastsService'; // adjust path if needed
import { Podcast } from '@/interfaces/podcasts';

const PodcastsList: React.FC = () => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPodcasts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getAllPodcasts({ page: 1, limit: 50 });
                if (res && res.podcasts) {
                    setPodcasts(res.podcasts);
                }
                else {
                    setError('Failed to fetch podcasts');
                }
            } catch (err) {
                console.error('Error fetching podcasts:', err);
                setError('An error occurred while fetching podcasts');
            } finally {
                setLoading(false);
            }
        };

        fetchPodcasts();
    }, []);

    if (loading) return <p>Loading podcasts...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (podcasts.length === 0) return <p>No podcasts found.</p>;

    return (
        <div className="space-y-4">
            {podcasts.map((podcast) => (
                <div
                    key={podcast._id}
                    className="border p-4 rounded shadow-sm hover:shadow-md transition flex items-center gap-4"
                >
                    {podcast.coverImage && (
                        <img
                            src={podcast.coverImage}
                            alt={podcast.title}
                            className="w-20 h-20 object-cover rounded"
                        />
                    )}
                    <div>
                        <h3 className="text-lg font-semibold">{podcast.title}</h3>
                        <p className="text-sm text-gray-600">{podcast.description}</p>
                        <p className="text-xs text-gray-500">
                            Category: {podcast.category?.name || 'N/A'} | Station: {podcast.station?.name || 'N/A'}
                        </p>
                        <p className={`text-xs font-medium ${podcast.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {podcast.isActive ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PodcastsList;
