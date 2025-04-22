'use client';

import ProductCard from './ProductCard';
import { useState } from 'react';
import products from '@/constants/dummyProducts';

// Define the Product type interface
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const ProductList = ({ categoryFilter }: { categoryFilter: string }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSearchTerm =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  // Group products by category
  const groupedProducts = filteredProducts.reduce((groups, product) => {
    if (!groups[product.category]) {
      groups[product.category] = [];
    }
    groups[product.category].push(product);
    return groups;
  }, {} as { [key: string]: Product[] });

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full bg-white"
        />
      </div>

      {Object.keys(groupedProducts).map((category) => (
        <div key={category}>
          <h2 className="text-xl font-semibold mt-6 mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {groupedProducts[category].map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Line separator between categories */}
          <hr className="my-6 border-t-2 border-gray-300" />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
