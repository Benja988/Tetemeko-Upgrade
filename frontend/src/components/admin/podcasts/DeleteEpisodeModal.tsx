import { deleteEpisodeById } from '@/services/episodes/episodeServices';
import BaseModal from './BaseModal';
import { Episode } from '@/interfaces/podcasts';

interface DeleteEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEpisodeDeleted: () => void;
  episode: Episode | null;
}

export default function DeleteEpisodeModal({ isOpen, onClose, onEpisodeDeleted, episode }: DeleteEpisodeModalProps) {
  const handleConfirm = async () => {
    if (!episode) return;
    const success = await deleteEpisodeById(episode.podcast, episode._id);
    if (success) {
      onEpisodeDeleted();
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Confirm Episode Deletion">
      <p className="text-sm text-gray-700">
        Are you sure you want to delete the episode <strong>{episode?.title || 'this episode'}</strong>? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Delete
        </button>
      </div>
    </BaseModal>
  );
}