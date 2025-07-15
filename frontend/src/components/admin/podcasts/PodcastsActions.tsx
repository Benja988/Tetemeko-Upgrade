// components/admin/podcasts/PodcastsActions.tsx

'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import AddPodcastModal from './AddPodcastModal';
import EditPodcastModal from './EditPodcastModal';
import DeletePodcastModal from './DeletePodcastModal';
import ExportPodcastModal from './ExportPodcastModal';
import { Podcast } from '@/interfaces/podcasts';

interface PodcastsActionsProps {
  onAddPodcast: (podcast: Podcast) => void;
  onEditPodcast: (podcast: Podcast) => void;
  onDeleteSelected: (ids: string[]) => void;
  onExport: (format: string) => void;
  selectedPodcasts: Podcast[];
}

export default function PodcastsActions({
  onAddPodcast,
  onEditPodcast,
  onDeleteSelected,
  onExport,
  selectedPodcasts,
}: PodcastsActionsProps) {
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'delete' | 'export' | null>(null);
  const selectedPodcast = selectedPodcasts.length === 1 ? selectedPodcasts[0] : null;

  const closeModal = () => setOpenModal(null);

  return (
    <>
      <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => setOpenModal('add')}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Podcast
        </button>
        <button
          onClick={() => setOpenModal('edit')}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          disabled={selectedPodcasts.length !== 1}
        >
          <Edit size={18} /> Edit Selected
        </button>
        <button
          onClick={() => setOpenModal('delete')}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
          disabled={selectedPodcasts.length === 0}
        >
          <Trash2 size={18} /> Delete Selected
        </button>
        <button
          onClick={() => setOpenModal('export')}
          className="flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          disabled={selectedPodcasts.length === 0}
        >
          <Download size={18} /> Export
        </button>
      </div>

      <AddPodcastModal isOpen={openModal === 'add'} onClose={closeModal} onPodcastAdded={onAddPodcast} />
      <EditPodcastModal
        isOpen={openModal === 'edit'}
        onClose={closeModal}
        onPodcastUpdated={onEditPodcast}
        podcast={selectedPodcast}
      />
      <DeletePodcastModal
        isOpen={openModal === 'delete'}
        onClose={closeModal}
        onPodcastDeleted={() => onDeleteSelected(selectedPodcasts.map((p) => p._id))}
        podcast={selectedPodcast}
      />
      <ExportPodcastModal
        isOpen={openModal === 'export'}
        onClose={closeModal}
        onExport={onExport}
      />
    </>
  );
}