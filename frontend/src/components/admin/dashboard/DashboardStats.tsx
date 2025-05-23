import { Users, Headphones, ShoppingCart, CreditCard } from 'lucide-react';

const stats = [
  { label: 'Total Users', value: 12500, icon: <Users />, sub: 'Across all platforms', color: 'border-b-4 border-blue-500' },
  { label: 'Active Listeners', value: 3200, icon: <Headphones />, sub: 'Currently streaming', color: 'border-b-4 border-green-500' },
  { label: 'Orders', value: 210, icon: <ShoppingCart />, sub: 'This week', color: 'border-b-4 border-yellow-500' },
  { label: 'Revenue', value: 'Kshs 12,430', icon: <CreditCard />, sub: 'Monthly earnings', color: 'border-b-4 border-purple-500' },
];

export default function DashboardStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white rounded-2xl shadow-md p-6 flex flex-col items-center transition hover:shadow-lg hover:-translate-y-1 ${stat.color}`}
        >
          <div className="text-[var(--color-secondary)] bg-gray-100 p-3 rounded-full mb-2">
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
          <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          <div className="text-xs text-gray-400">{stat.sub}</div>
        </div>
      ))}
    </section>
  );
}
