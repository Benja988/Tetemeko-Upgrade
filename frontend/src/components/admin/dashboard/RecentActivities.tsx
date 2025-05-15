const activities = [
    { activity: 'New user registered', time: '2 mins ago' },
    { activity: 'Podcast "Tech Talk" uploaded', time: '30 mins ago' },
    { activity: 'Order #1235 placed', time: '1 hour ago' },
  ];
  
  export default function RecentActivities() {
    return (
      <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)] mb-5">Recent Activities</h2>
        <ul className="space-y-4">
          {activities.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm sm:text-base text-gray-700">
              <span>{item.activity}</span>
              <span className="text-gray-400">{item.time}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  