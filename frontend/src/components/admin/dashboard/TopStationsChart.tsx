import React from 'react';

const stations = [
    { name: 'Station A', listeners: 1200 },
    { name: 'Station B', listeners: 900 },
    { name: 'Station C', listeners: 600 },
  ];
  
  export default function TopStationsChart() {
    const maxListeners = Math.max(...stations.map((s) => s.listeners));
  
    return (
      <section className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)] mb-5">Top Stations</h2>
        <div className="space-y-5">
          {stations.map((station) => (
            <div key={station.name}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{station.name}</span>
                <span className="text-gray-500">{station.listeners}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[var(--color-secondary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(station.listeners / maxListeners) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  