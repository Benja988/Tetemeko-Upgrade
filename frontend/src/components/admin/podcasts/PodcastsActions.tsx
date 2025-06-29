'use client';

import { useState } from "react";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import AddPodcastModal from "./AddPodcastModal";
import EditPodcastModal from "./EditPodcastModal";
import DeletePodcastModal from "./DeletePodcastModal";
import ExportPodcastModal from "./ExportPodcastModal";


interface PodcastsActionsProps {
  onAddPodcast: (data?: any) => void;
  onEditPodcast: (data?: any) => void;
  onDeleteSelected: () => void;
  onExport: () => void;
}

export default function PodcastsActions({
  onAddPodcast,
  onEditPodcast,
  onDeleteSelected,
  onExport,
}: PodcastsActionsProps) {
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | "export" | null>(null);

  const closeModal = () => setOpenModal(null);

  return (
    <>
      <div className="flex flex-wrap gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <button
          onClick={() => setOpenModal("add")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Plus size={18} /> Add Podcast
        </button>

        <button
          onClick={() => setOpenModal("edit")}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Edit size={18} /> Edit Selected
        </button>

        <button
          onClick={() => setOpenModal("delete")}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Trash2 size={18} /> Delete
        </button>

        <button
          onClick={() => setOpenModal("export")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Download size={18} /> Export
        </button>
      </div>

      {/* Modals */}
      <AddPodcastModal isOpen={openModal === "add"} onClose={closeModal} onSubmit={onAddPodcast} />
      <EditPodcastModal isOpen={openModal === "edit"} onClose={closeModal} onSubmit={onEditPodcast} />
      <DeletePodcastModal isOpen={openModal === "delete"} onClose={closeModal} onConfirm={onDeleteSelected} />
      <ExportPodcastModal isOpen={openModal === "export"} onClose={closeModal} onExport={onExport} />
    </>
  );
}
