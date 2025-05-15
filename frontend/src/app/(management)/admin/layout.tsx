import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'

export const metadata = {
  title: 'Dashboard | Tetemeko',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
  )
}
