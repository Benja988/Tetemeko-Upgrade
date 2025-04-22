'use client';

import CartItem from '@/components/marketplace/CartItem';
import products from '@/constants/dummyProducts';

export default function CartPage() {
  const cartItems = products.slice(0, 2); // Mock cart items

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
