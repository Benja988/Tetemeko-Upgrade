'use client';

import Link from 'next/link';
import { FaCartPlus } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-300 hover:shadow-xl hover:border-gray-400 transition duration-300 w-64">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <div className="mt-2">
        <h3 className="text-sm font-semibold">{product.name}</h3>
        <p className="text-gray-600 mb-2 text-sm">${product.price.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <Link href={`/marketplace/${product.slug}`} className="text-blue-600 hover:underline text-xs">
            View Details
          </Link>
          <button className="text-green-600 hover:text-green-800">
            <FaCartPlus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
