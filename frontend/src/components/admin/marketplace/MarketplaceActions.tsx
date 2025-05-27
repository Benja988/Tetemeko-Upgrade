'use client';

interface MarketplaceActionsProps {
  onAddProduct: () => void;
  onEditProduct: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
}

export default function MarketplaceActions({
  onAddProduct,
  onEditProduct,
  onDeleteSelected,
  onExport,
}: MarketplaceActionsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={onAddProduct} className="bg-blue-600 text-white px-4 py-2 rounded">
        Add
      </button>
      <button onClick={onEditProduct} className="bg-yellow-500 text-white px-4 py-2 rounded">
        Edit
      </button>
      <button onClick={onDeleteSelected} className="bg-red-600 text-white px-4 py-2 rounded">
        Delete
      </button>
      <button onClick={onExport} className="bg-gray-700 text-white px-4 py-2 rounded">
        Export
      </button>
    </div>
  );
}
