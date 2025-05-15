'use client'

interface User {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

export default function UserRow({ user }: { user: User }) {
  const handleEdit = () => {
    alert(`Edit user ${user.name}`)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      alert('Deleted!')
    }
  }

  return (
    <tr className="border-b hover:bg-gray-100 transition">
      <td className="py-2">{user.name}</td>
      <td className="py-2">{user.email}</td>
      <td className="py-2">{user.role}</td>
      <td className="py-2">{user.createdAt}</td>
      <td className="py-2 space-x-2">
        <button
          onClick={handleEdit}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}
