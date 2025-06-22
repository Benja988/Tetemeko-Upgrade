'use client';

import { BarChart2, CheckCircle2, XCircle } from 'lucide-react';

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface Props {
  total: number;
  published: number;
  unpublished: number;
}

function StatCard({ label, value, icon, color }: StatItem) {
  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition`}>
      <div className={`p-2 rounded-full ${color} bg-opacity-10`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function NewsStats({ total, published, unpublished }: Props) {
  const stats: StatItem[] = [
    {
      label: 'Total News',
      value: total,
      icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
      color: 'text-blue-600',
    },
    {
      label: 'Published',
      value: published,
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      color: 'text-green-600',
    },
    {
      label: 'Unpublished',
      value: unpublished,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
