import React from 'react';
import { Radio, Tv } from 'lucide-react';

const stations = [
  { name: 'Radio Piny Luo', listeners: 1200, icon: <Radio className="w-4 h-4 text-blue-500" /> },
  { name: 'Tetemeko TV', listeners: 900, icon: <Tv className="w-4 h-4 text-red-500" /> },
  { name: 'Tetemeko Radio', listeners: 600, icon: <Radio className="w-4 h-4 text-green-500" /> },
];

export default function TopStationsChart() {
  const maxListeners = Math.max(...stations.map((s) => s.listeners));

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Top Stations</h2>
      <div className="space-y-6">
        {stations.map((station) => (
          <div key={station.name}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {station.icon}
                <span className="font-medium text-gray-800">{station.name}</span>
              </div>
              <span className="text-sm text-gray-500">{station.listeners.toLocaleString()} listeners</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] transition-all duration-500"
                style={{ width: `${(station.listeners / maxListeners) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
