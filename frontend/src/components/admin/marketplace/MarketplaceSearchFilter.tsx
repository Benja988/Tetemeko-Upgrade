'use client';

interface MarketplaceSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function MarketplaceSearchFilter({ searchTerm, onSearchChange }: MarketplaceSearchFilterProps) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
