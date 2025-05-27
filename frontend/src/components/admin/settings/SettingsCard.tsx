'use client';

import { Setting } from '@/interfaces/Settings';

interface SettingsCardProps {
  setting: Setting;
  onChange: (id: string, value: string | boolean | number) => void;
}

export default function SettingsCard({ setting, onChange }: SettingsCardProps) {
  return (
    <div className="border rounded p-4 bg-white shadow-sm space-y-2">
      <label className="block font-medium">{setting.label}</label>
      {setting.description && <p className="text-sm text-gray-500">{setting.description}</p>}
      {setting.type === 'text' || setting.type === 'email' ? (
        <input
          type={setting.type}
          value={setting.value as string}
          onChange={(e) => onChange(setting.id, e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
      ) : setting.type === 'number' ? (
        <input
          type="number"
          value={setting.value as number}
          onChange={(e) => onChange(setting.id, parseInt(e.target.value))}
          className="w-full p-2 border rounded mt-1"
        />
      ) : setting.type === 'toggle' ? (
        <label className="inline-flex items-center space-x-2 mt-1">
          <input
            type="checkbox"
            checked={Boolean(setting.value)}
            onChange={(e) => onChange(setting.id, e.target.checked)}
            className="accent-blue-600"
          />
          <span>{Boolean(setting.value) ? 'Enabled' : 'Disabled'}</span>
        </label>
      ) : setting.type === 'select' ? (
        <select
          value={setting.value as string}
          onChange={(e) => onChange(setting.id, e.target.value)}
          className="w-full p-2 border rounded mt-1"
        >
          {setting.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
