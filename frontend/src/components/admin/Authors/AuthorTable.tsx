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
  const toggleAuthorSelection = (id: string) => {
    if (selectedAuthorIds.includes(id)) {
      onSelectAuthors(selectedAuthorIds.filter((aid) => aid !== id));
    } else {
      onSelectAuthors([...selectedAuthorIds, id]);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow-md">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={selectedAuthorIds.length === authors.length}
                onChange={onToggleSelectAll}
              />
            </th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Verified</th>
            <th className="p-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author._id} className="border-t text-sm hover:bg-gray-50">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedAuthorIds.includes(author._id)}
                  onChange={() => toggleAuthorSelection(author._id)}
                />
              </td>
              <td className="p-3">{author.name}</td>
              <td className="p-3">{author.email ?? '—'}</td>
              <td className="p-3">
                {author.isVerified ? (
                  <span className="text-green-600 font-medium">Yes</span>
                ) : (
                  <span className="text-red-500 font-medium">No</span>
                )}
              </td>
              <td className="p-3">
                {new Date(author.createdAt ?? '').toLocaleDateString()}
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
