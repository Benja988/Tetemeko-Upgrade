import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-primary text-white h-full p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav className="space-y-4">
        <Link href="/dashboard" className="block hover:text-gray-300">Home</Link>
        <Link href="/dashboard/analytics" className="block hover:text-gray-300">Analytics</Link>
        <Link href="/dashboard/users" className="block hover:text-gray-300">Users</Link>
        <Link href="/dashboard/settings" className="block hover:text-gray-300">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
