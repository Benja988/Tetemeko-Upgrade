import UserRow from "./UserRow"

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', createdAt: '2024-03-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', createdAt: '2024-04-01' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'User', createdAt: '2024-04-10' },
]

export default function UsersTable() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Created At</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
