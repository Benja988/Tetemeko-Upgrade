const stats = [
    { label: 'Total Users', value: 12500 },
    { label: 'Active Listeners', value: 3200 },
    { label: 'Orders', value: 210 },
    { label: 'Revenue', value: '$12,430' },
  ];
  
  export default function DashboardStats() {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition hover:-translate-y-1"
          >
            <div className="text-3xl font-bold text-[var(--color-secondary)]">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
          </div>
        ))}
      </section>
    );
  }
  