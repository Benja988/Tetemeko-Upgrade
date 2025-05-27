'use client';

import { Setting } from '@/interfaces/Settings';
import { motion } from 'framer-motion';

interface SettingsCardProps {
  setting: Setting;
  onChange: (id: string, value: string | boolean | number) => void;
}

export default function SettingsCard({ setting, onChange }: SettingsCardProps) {
  const handleInput = (value: any) => onChange(setting.id, value);

  return (
    <motion.div
      className="bg-white p-4 rounded-lg border shadow-sm space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <label className="block font-medium text-gray-800">{setting.label}</label>
      {setting.description && (
        <p className="text-sm text-gray-500">{setting.description}</p>
      )}

      {setting.type === 'text' || setting.type === 'email' ? (
        <input
          type={setting.type}
          value={String(setting.value)}
          onChange={(e) => handleInput(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      ) : setting.type === 'number' ? (
        <input
          type="number"
          value={setting.value as number}
          onChange={(e) => handleInput(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
      ) : setting.type === 'toggle' ? (
        <label className="inline-flex items-center mt-1">
          <input
            type="checkbox"
            checked={Boolean(setting.value)}
            onChange={(e) => handleInput(e.target.checked)}
            className="accent-blue-600"
          />
          <span className="ml-2 text-gray-700">
            {Boolean(setting.value) ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      ) : setting.type === 'select' ? (
        <select
          value={String(setting.value)}
          onChange={(e) => handleInput(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {setting.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : null}
    </motion.div>
  );
}
