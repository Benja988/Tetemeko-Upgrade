'use client';

import { useState } from 'react';
import { Product } from '@/interfaces/Products';
import { products as allProducts } from '@/data/products';

import MarketplaceActions from './MarketplaceActions';
import MarketplaceTabs from './MarketplaceTabs';
import MarketplaceSearchFilter from './MarketplaceSearchFilter';
import MarketplaceTable from './MarketplaceTable';

export default function MarketplacePageLayout({ heading }: { heading: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || product.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = () => {
    // TODO: Add product logic
  };
  const handleEditProduct = () => {
    // TODO: Edit product logic
  };
  const handleDeleteSelected = () => {
    // TODO: Delete selected logic
  };
  const handleExport = () => {
    // TODO: Export logic
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-semibold">{heading}</h1>

      <MarketplaceActions
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteSelected={handleDeleteSelected}
        onExport={handleExport}
      />

      <MarketplaceTabs currentFilter={statusFilter} onChangeFilter={setStatusFilter} />

      <MarketplaceSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <MarketplaceTable products={filteredProducts} />
    </div>
  );
}
