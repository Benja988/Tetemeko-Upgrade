'use client';

interface AuthorFilterBarProps {
  onFilter: (role: string) => void;
}

export default function AuthorFilterBar({ onFilter }: AuthorFilterBarProps) {
  return (
    <select
      onChange={(e) => onFilter(e.target.value)}
      className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
    >
      <option value="">All Roles</option>
      <option value="author">Authors</option>
    </select>
  );
}
