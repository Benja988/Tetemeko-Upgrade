'use client';

import { FaTrash } from 'react-icons/fa';

const CartItem = ({ item }: { item: any }) => {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
        <div>
          <h4 className="text-lg font-semibold">{item.name}</h4>
          <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <button className="text-red-500 hover:text-red-700">
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
