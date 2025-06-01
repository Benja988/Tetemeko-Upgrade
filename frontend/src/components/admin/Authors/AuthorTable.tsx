'use client';

import { Author } from '@/types/author';

interface AuthorTableProps {
  authors: Author[];
  selectedAuthorIds: string[];
  onSelectAuthors: (ids: string[]) => void;
  onToggleSelectAll: () => void;
  search: string;
  filter: string;
}

export default function AuthorTable({
  authors,
  selectedAuthorIds,
  onSelectAuthors,
  onToggleSelectAll,
}: AuthorTableProps) {
  const sortedAuthors = [...authors].sort((a, b) => {
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });

  const toggleAuthorSelection = (id: string) => {
    if (selectedAuthorIds.includes(id)) {
      onSelectAuthors(selectedAuthorIds.filter((aid) => aid !== id));
    } else {
      onSelectAuthors([...selectedAuthorIds, id]);
    }
  };

  const allSelected = authors.length > 0 && selectedAuthorIds.length === authors.length;

  // Helper to truncate bio text nicely
  const truncate = (text: string, maxLength = 60) =>
    text.length > maxLength ? text.slice(0, maxLength) + '…' : text;

  return (
    <div className="overflow-x-auto bg-white rounded shadow-md">
      <table className="w-full table-auto border-collapse" aria-label="Authors table">
        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                className="custom-checkbox"
                aria-label="Select all authors"
                checked={allSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            <th className="p-3">Avatar</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Bio</th>
            <th className="p-3">Verified</th>
            <th className="p-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {sortedAuthors.map((author) => (
            <tr key={author._id} className="border-t text-sm hover:bg-gray-50">
              <td className="p-3">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  aria-label={`Select author ${author.name}`}
                  checked={selectedAuthorIds.includes(author._id)}
                  onChange={() => toggleAuthorSelection(author._id)}
                />
              </td>
              <td className="p-3">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={`${author.name} avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    {author.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                )}
              </td>
              <td className="p-3">{author.name}</td>
              <td className="p-3">{author.email ?? '—'}</td>
              <td className="p-3">{author.bio ? truncate(author.bio) : '—'}</td>
              <td className="p-3">
                {author.isVerified ? (
                  <span className="text-green-600 font-medium">Yes</span>
                ) : (
                  <span className="text-red-500 font-medium">No</span>
                )}
              </td>
              <td className="p-3">
                {author.createdAt
                  ? new Date(author.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {authors.length === 0 && (
        <div className="p-6 text-center text-sm text-gray-500">No authors found.</div>
      )}
    </div>
  );
}
