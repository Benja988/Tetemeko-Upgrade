'use client';

import SettingsPageLayout from "@/components/admin/settings/SettingsPageLayout";
import { Setting } from "@/interfaces/Settings";


const categories = ['General', 'Notifications', 'Privacy'];

const settingsByCategory: Record<string, Setting[]> = {
  General: [
    { id: 'siteTitle', label: 'Site Title', type: 'text', value: 'My Site', category: 'General' },
    { id: 'maxUsers', label: 'Max Users', type: 'number', value: 100, category: 'General' },
  ],
  Notifications: [
    { id: 'emailAlerts', label: 'Email Alerts', type: 'toggle', value: true, category: 'Notifications' },
  ],
  Privacy: [
    { id: 'profileVisibility', label: 'Profile Visibility', type: 'select', value: 'Public', options: ['Public', 'Private'], category: 'Privacy' },
  ],
};

export default function NewsPage() {
  return (
    <SettingsPageLayout
      title="Settings Management"
      categories={categories}
      settingsByCategory={settingsByCategory}
      onSave={async (settings) => {
        console.log("Saving settings:", settings);
      }}
    />
  );
}
