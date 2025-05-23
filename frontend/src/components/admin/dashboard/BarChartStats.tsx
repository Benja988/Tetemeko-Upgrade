'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', podcasts: 4 },
  { name: 'Tue', podcasts: 6 },
  { name: 'Wed', podcasts: 2 },
  { name: 'Thu', podcasts: 7 },
  { name: 'Fri', podcasts: 5 },
  { name: 'Sat', podcasts: 3 },
  { name: 'Sun', podcasts: 8 },
];

export default function BarChartStats() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Podcasts Uploaded This Week</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="podcasts" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
