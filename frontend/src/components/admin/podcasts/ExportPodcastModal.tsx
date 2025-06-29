'use client';

import BaseModal from './BaseModal';

export default function ExportPodcastModal({ isOpen, onClose, onExport }: {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Export Podcasts">
      <p className="text-sm text-gray-700">Export selected podcasts to your preferred format.</p>
      <div className="flex justify-end gap-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={() => { onExport(); onClose(); }} className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700">Export</button>
      </div>
    </BaseModal>
  );
}
