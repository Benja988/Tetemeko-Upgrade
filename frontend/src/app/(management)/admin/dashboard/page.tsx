// admin/dashboard/page.tsx
// src/app/(management)/admin/dashboard/page.tsx

'use client'

import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RecentActivities from '@/components/admin/dashboard/RecentActivities';
import RecentOrdersTable from '@/components/admin/dashboard/RecentOrdersTable';
import TopStationsChart from '@/components/admin/dashboard/TopStationsChart';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  useAuthGuard(); // Ensure protected routes

  const { user, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(true);
  }, []);

  if (!user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-light)] p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
          Welcome, {user.name || 'Admin'}!
        </h1>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <TopStationsChart />
        <RecentActivities />
      </div>
      <div className="mt-6 sm:mt-8">
        <RecentOrdersTable />
      </div>
    </div>
  );
}
