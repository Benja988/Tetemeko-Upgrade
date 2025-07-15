// components/admin/podcasts/ExportPodcastModal.tsx

'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';

interface ExportPodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

export default function ExportPodcastModal({ isOpen, onClose, onExport }: ExportPodcastModalProps) {
  const [format, setFormat] = useState('json');

  const handleExport = () => {
    onExport(format);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Export Podcasts">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">Select the format to export the selected podcasts.</p>
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700">
            Export Format
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Export
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
