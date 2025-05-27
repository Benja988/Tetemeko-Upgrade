'use client';

import { useState } from 'react';
import { Product } from '@/interfaces/Products';

interface MarketplaceTableProps {
  products: Product[];
}

export default function MarketplaceTable({ products }: MarketplaceTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100 text-left text-sm font-semibold">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <>
              <tr key={product.id} className="border-t text-sm hover:bg-gray-50 transition-all duration-200">
                <td className="p-3">
                  <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.brand}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3">{product.countInStock}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleExpanded(product.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expanded === product.id ? 'Hide Details' : 'View Details'}
                  </button>
                </td>
              </tr>

              {expanded === product.id && (
                <tr className="bg-gray-50 text-sm">
                  <td colSpan={8} className="p-4">
                    <div className="space-y-4">
                      <p><strong>Description:</strong> {product.description}</p>
                      <p><strong>SKU:</strong> {product.sku}</p>
                      <p><strong>Weight:</strong> {product.weight}</p>
                      <p><strong>Dimensions:</strong> {product.dimensions}</p>
                      <p><strong>Tags:</strong> {product.tags?.join(', ')}</p>
                      <div className="flex space-x-2 mt-2">
                        {product.media?.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`${product.name} media ${idx + 1}`}
                            className="h-20 w-20 rounded object-cover border"
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
