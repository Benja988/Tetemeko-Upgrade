'use client'

export default function CreateUserButton() {
  const handleCreate = () => {
    alert('Open Create User Modal (coming soon!)')
  }

  return (
    <button
      onClick={handleCreate}
      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-secondary)] transition"
    >
      + New User
    </button>
  )
}
