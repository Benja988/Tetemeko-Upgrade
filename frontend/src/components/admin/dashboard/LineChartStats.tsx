'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', users: 120 },
  { day: 'Tue', users: 200 },
  { day: 'Wed', users: 150 },
  { day: 'Thu', users: 250 },
  { day: 'Fri', users: 180 },
  { day: 'Sat', users: 300 },
  { day: 'Sun', users: 280 },
];

export default function LineChartStats() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Active Users This Week</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="var(--color-secondary)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
