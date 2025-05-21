'use client'

import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import Sidebar from '@/components/admin/dashboard/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Loader from '@/components/Loader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useAuthGuard(); // Ensure protected routes

  const { user } = useAuth();

  if (!user) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-light)]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="p-4 sm:p-6 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
