'use client';

import { useState, useEffect } from 'react';
import { createPodcast, getAllPodcasts, updatePodcastById, deletePodcastById, togglePodcastStatus, addEpisode, getAllEpisodes, updateEpisodeById, deleteEpisodeById } from '@/services/podcasts/podcastsService';
import { Podcast, Episode, PodcastInput, EpisodeInput } from '@/interfaces/podcasts';

interface PodcastsPageLayoutProps {
    heading: string;
}

const PodcastsPageLayout: React.FC<PodcastsPageLayoutProps> = ({ heading }) => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [isPodcastFormOpen, setIsPodcastFormOpen] = useState(false);
    const [isEpisodeFormOpen, setIsEpisodeFormOpen] = useState(false);
    const [editingPodcast, setEditingPodcast] = useState<Partial<Podcast> | undefined>(undefined);
    const [editingEpisode, setEditingEpisode] = useState<Partial<Episode> | undefined>(undefined);

    useEffect(() => {
        fetchPodcasts();
    }, []);

    const fetchPodcasts = async () => {
        const response = await getAllPodcasts({ limit: 10 });
        if (response) setPodcasts(response.podcasts);
    };

    const fetchEpisodes = async (podcastId: string) => {
        const response = await getAllEpisodes(podcastId, { limit: 10 });
        if (response) setEpisodes(response.data);
    };

    const handleCreatePodcast = async (data: Partial<PodcastInput>) => {
        const result = editingPodcast
            ? await updatePodcastById(editingPodcast._id!, {
                ...data,
                category: data.category, // Already a string from PodcastInput
                station: data.station,
            })
            : await createPodcast(data as PodcastInput);
        if (result) {
            await fetchPodcasts();
            setIsPodcastFormOpen(false);
            setEditingPodcast(undefined);
        }
    };

    const handleCreateEpisode = async (podcastId: string, data: Partial<EpisodeInput>) => {
        const result = editingEpisode
            ? await updateEpisodeById(podcastId, editingEpisode._id!, data)
            : await addEpisode(podcastId, data as EpisodeInput);
        if (result) {
            await fetchEpisodes(podcastId);
            setIsEpisodeFormOpen(false);
            setEditingEpisode(undefined);
        }
    };

    const handleDeletePodcast = async (id: string) => {
        if (confirm('Are you sure you want to delete this podcast?')) {
            const result = await deletePodcastById(id);
            if (result) {
                await fetchPodcasts();
                if (selectedPodcast?._id === id) setSelectedPodcast(null);
            }
        }
    };

    const handleTogglePodcastStatus = async (id: string) => {
        const result = await togglePodcastStatus(id);
        if (result) await fetchPodcasts();
    };

    const handleDeleteEpisode = async (podcastId: string, episodeId: string) => {
        if (confirm('Are you sure you want to delete this episode?')) {
            const result = await deleteEpisodeById(podcastId, episodeId);
            if (result) await fetchEpisodes(podcastId);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>{heading}</h1>

            <div style={styles.layout}>
                {/* Podcast List */}
                <div style={styles.podcastList}>
                    <button
                        style={styles.button}
                        onClick={() => {
                            setEditingPodcast(undefined);
                            setIsPodcastFormOpen(true);
                        }}
                    >
                        Create New Podcast
                    </button>

                    {podcasts && podcasts.length > 0 ? (
                        podcasts.map((podcast) => (
                            <div key={podcast._id} style={styles.podcastItem}>
                                <div style={styles.podcastInfo}>
                                    <h3 style={styles.podcastTitle}>{podcast.title}</h3>
                                    <p>{podcast.description}</p>
                                    <p>Status: {podcast.isActive ? 'Active' : 'Inactive'}</p>
                                </div>
                                <div style={styles.podcastActions}>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => {
                                            setSelectedPodcast(podcast);
                                            fetchEpisodes(podcast._id);
                                        }}
                                    >
                                        View Episodes
                                    </button>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => {
                                            setEditingPodcast(podcast);
                                            setIsPodcastFormOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => handleTogglePodcastStatus(podcast._id)}
                                    >
                                        Toggle Status
                                    </button>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => handleDeletePodcast(podcast._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No podcasts available.</p>
                    )}

                </div>

                {/* Episode List */}
                {selectedPodcast && (
                    <div style={styles.episodeSection}>
                        <h2 style={styles.subHeading}>{selectedPodcast.title} - Episodes</h2>
                        <button
                            style={styles.button}
                            onClick={() => {
                                setEditingEpisode(undefined);
                                setIsEpisodeFormOpen(true);
                            }}
                        >
                            Add Episode
                        </button>

                        {episodes.map(episode => (
                            <div key={episode._id} style={styles.episodeItem}>
                                <div>
                                    <h4>{episode.title}</h4>
                                    <p>{episode.description}</p>
                                    <p>Duration: {episode.duration}s</p>
                                </div>
                                <div style={styles.episodeActions}>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => {
                                            setEditingEpisode(episode);
                                            setIsEpisodeFormOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => handleDeleteEpisode(selectedPodcast._id, episode._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Podcast Form */}
            {isPodcastFormOpen && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <PodcastForm
                            initialData={editingPodcast}
                            onSubmit={handleCreatePodcast}
                            onCancel={() => {
                                setIsPodcastFormOpen(false);
                                setEditingPodcast(undefined);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Episode Form */}
            {isEpisodeFormOpen && selectedPodcast && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <EpisodeForm
                            podcastId={selectedPodcast._id}
                            initialData={editingEpisode}
                            onSubmit={handleCreateEpisode}
                            onCancel={() => {
                                setIsEpisodeFormOpen(false);
                                setEditingEpisode(undefined);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const PodcastForm: React.FC<{
    initialData?: Partial<Podcast>;
    onSubmit: (data: Partial<PodcastInput>) => void;
    onCancel: () => void;
}> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<PodcastInput>>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        category: initialData?.category?._id || '',
        station: initialData?.station?._id || '',
        coverImage: undefined,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2>{initialData ? 'Edit Podcast' : 'Create Podcast'}</h2>

            <div style={styles.formGroup}>
                <label>Title</label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label>Description</label>
                <textarea
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={styles.textarea}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label>Category ID</label>
                <input
                    type="text"
                    value={formData.category || ''}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label>Station ID (optional)</label>
                <input
                    type="text"
                    value={formData.station || ''}
                    onChange={e => setFormData({ ...formData, station: e.target.value })}
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label>Cover Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFormData({ ...formData, coverImage: e.target.files?.[0] })}
                    style={styles.input}
                />
            </div>

            <div style={styles.formActions}>
                <button type="submit" style={styles.button}>Save</button>
                <button type="button" onClick={onCancel} style={styles.button}>Cancel</button>
            </div>
        </form>
    );
};

const EpisodeForm: React.FC<{
    podcastId: string;
    initialData?: Partial<Episode>;
    onSubmit: (podcastId: string, data: Partial<EpisodeInput>) => void;
    onCancel: () => void;
}> = ({ podcastId, initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<EpisodeInput>>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        duration: initialData?.duration || 0,
        episodeNumber: initialData?.episodeNumber || undefined,
        tags: initialData?.tags || [],
        audioUrl: undefined,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(podcastId, formData);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2>{initialData ? 'Edit Episode' : 'Create Episode'}</h2>

            <div style={styles.formGroup}>
                <label>Title</label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label>Description</label>
                <textarea
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={styles.textarea}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label>Duration (seconds)</label>
                <input
                    type="number"
                    value={formData.duration || 0}
                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label>Episode Number (optional)</label>
                <input
                    type="number"
                    value={formData.episodeNumber || ''}
                    onChange={e => setFormData({ ...formData, episodeNumber: parseInt(e.target.value) || undefined })}
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label>Tags (comma-separated)</label>
                <input
                    type="text"
                    value={formData.tags?.join(',') || ''}
                    onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label>Audio File</label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={e => setFormData({ ...formData, audioUrl: e.target.files?.[0] })}
                    style={styles.input}
                />
            </div>

            <div style={styles.formActions}>
                <button type="submit" style={styles.button}>Save</button>
                <button type="button" onClick={onCancel} style={styles.button}>Cancel</button>
            </div>
        </form>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    subHeading: {
        fontSize: '20px',
        marginBottom: '15px',
    },
    layout: {
        display: 'flex',
        gap: '20px',
    },
    podcastList: {
        flex: '1',
        maxWidth: '400px',
    },
    podcastItem: {
        border: '1px solid #ddd',
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '5px',
    },
    podcastInfo: {
        marginBottom: '10px',
    },
    podcastTitle: {
        margin: '0 0 5px 0',
        fontSize: '18px',
    },
    podcastActions: {
        display: 'flex',
        gap: '10px',
    },
    episodeSection: {
        flex: '1',
    },
    episodeItem: {
        border: '1px solid #ddd',
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    episodeActions: {
        display: 'flex',
        gap: '10px',
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        maxWidth: '500px',
        width: '100%',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    input: {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    textarea: {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '100px',
    },
    formActions: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        padding: '8px 16px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    actionButton: {
        padding: '6px 12px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default PodcastsPageLayout;