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
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-4 sm:mb-6">
        Welcome, {user.name || 'Admin'}!
      </h1>

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
