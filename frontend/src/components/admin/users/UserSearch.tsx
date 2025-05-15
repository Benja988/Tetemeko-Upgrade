'use client'

import { useState } from 'react'

export default function UserSearch() {
  const [search, setSearch] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <input
      type="text"
      placeholder="Search users..."
      value={search}
      onChange={handleChange}
      className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
    />
  )
}
