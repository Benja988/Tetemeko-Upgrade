import CreateUserButton from "@/components/admin/users/CreateUserButton";
import UserSearch from "@/components/admin/users/UserSearch";
import UsersTable from "@/components/admin/users/UsersTable";


export default function UsersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-light)] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          Users Management
        </h1>

        <div className="flex gap-2">
          <UserSearch />
          <CreateUserButton />
        </div>
      </div>

      <UsersTable />
    </div>
  )
}
