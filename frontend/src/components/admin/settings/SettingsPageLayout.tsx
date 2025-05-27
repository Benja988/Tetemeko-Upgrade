'use client';

import { useState } from 'react';
import { settings as allSettings } from '@/data/settings';
import { Setting } from '@/interfaces/Settings';
import SettingsCategories from './SettingsCategories';
import SettingsCard from './SettingsCard';

export default function SettingsPageLayout({ heading }: { heading: string }) {
  const categories = Array.from(new Set(allSettings.map((s) => s.category)));
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [formState, setFormState] = useState<Record<string, string | boolean | number>>(
    Object.fromEntries(allSettings.map((s) => [s.id, s.value]))
  );

  const handleChange = (id: string, value: string | boolean | number) => {
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const settingsToShow = allSettings.filter((s) => s.category === selectedCategory);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Profile Banner */}
      <div className="relative w-full h-40 bg-blue-100 rounded-md overflow-hidden mb-6">
        <img
          src={formState['bgImage'] as string || '/default-bg.jpg'}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 flex items-center space-x-4 p-4">
          <img
            src={formState['profileImage'] as string || '/default-avatar.png'}
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
            alt="Profile"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
            <p className="text-sm text-gray-600">Manage your company settings and preferences.</p>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800">{heading}</h1>

      {/* Category Tabs */}
      <SettingsCategories
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsToShow.map((setting) => (
          <SettingsCard
            key={setting.id}
            setting={{ ...setting, type: setting.type as "number" | "text" | "email" | "toggle" | "select", value: formState[setting.id] }}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}
