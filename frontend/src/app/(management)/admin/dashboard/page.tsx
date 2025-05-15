import DashboardStats from "@/components/admin/dashboard/DashboardStats";
import RecentActivities from "@/components/admin/dashboard/RecentActivities";
import RecentOrdersTable from "@/components/admin/dashboard/RecentOrdersTable";
import TopStationsChart from "@/components/admin/dashboard/TopStationsChart";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--color-light)] p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-4 sm:mb-6">
        Admin Dashboard
      </h1>

      {/* Dashboard Stats Section */}
        <DashboardStats />
      {/* Charts and Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <TopStationsChart />
        <RecentActivities />
      </div>

      {/* Recent Orders Table Section */}
      <div className="mt-6 sm:mt-8">
        <RecentOrdersTable />
      </div>
    </div>
  );
}
