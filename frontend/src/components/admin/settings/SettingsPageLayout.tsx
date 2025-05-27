'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { AnimatePresence, motion } from 'framer-motion';

import CollapsibleSection from './CollapsibleSection';
import SettingsCategories from './SettingsCategories';
import SettingsCard from './SettingsCard';
import Notification from './Notification';
import SaveCancelButtons from './SaveCancelButtons';
import ProfileBanner from './ProfileBanner';

import { Setting } from '@/interfaces/Settings';

interface SettingsPageLayoutProps {
  profileImage?: string;
  title: string;
  subtitle?: string;
  categories: string[];
  settingsByCategory: Record<string, Setting[]>;
  onSave: (settings: Setting[]) => Promise<void>;
}

export default function SettingsPageLayout({
  profileImage,
  title,
  subtitle,
  categories,
  settingsByCategory,
  onSave,
}: SettingsPageLayoutProps) {
  // If no categories provided, just render the heading + optional subtitle + profile image
  if (!categories.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <ProfileBanner imageUrl={profileImage} title={title} subtitle={subtitle} />
      </div>
    );
  }

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [originalSettings, setOriginalSettings] = useState<Setting[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [debouncedSettings] = useDebounce(settings, 1000);

  useEffect(() => {
    const currentSettings = settingsByCategory[selectedCategory] || [];
    setSettings(currentSettings);
    setOriginalSettings(JSON.parse(JSON.stringify(currentSettings)));
  }, [selectedCategory, settingsByCategory]);

  useEffect(() => {
    if (JSON.stringify(debouncedSettings) !== JSON.stringify(originalSettings)) {
      handleAutoSave(debouncedSettings);
    }
  }, [debouncedSettings]);

  const handleAutoSave = async (updatedSettings: Setting[]) => {
    try {
      await onSave(updatedSettings);
      setOriginalSettings(JSON.parse(JSON.stringify(updatedSettings)));
      setNotification({ type: 'success', message: 'Settings auto-saved.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Auto-save failed. Please try again.' });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleChange = (id: string, value: string | boolean | number) => {
    const updated = settings.map((s) => (s.id === id ? { ...s, value } : s));
    setSettings(updated);
  };

  const handleSave = async () => {
    try {
      await onSave(settings);
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
      setNotification({ type: 'success', message: 'Settings saved successfully.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Save failed. Please try again.' });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCancel = () => {
    setSettings(JSON.parse(JSON.stringify(originalSettings)));
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {notification && (
        <motion.div
          key={notification.message}
          className="mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Notification type={notification.type} message={notification.message} />
        </motion.div>
      )}

      <ProfileBanner imageUrl={profileImage} title={title} subtitle={subtitle} />

      <SettingsCategories
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <CollapsibleSection title={`Settings - ${selectedCategory}`}>
        <motion.div
          className="space-y-4"
          layout
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {settings.map((setting) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsCard setting={setting} onChange={handleChange} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <SaveCancelButtons onSave={handleSave} onCancel={handleCancel} />
      </CollapsibleSection>
    </motion.div>
  );
}
