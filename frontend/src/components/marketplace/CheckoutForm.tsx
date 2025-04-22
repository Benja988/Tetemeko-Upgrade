'use client';

const CheckoutForm = () => {
  return (
    <form className="bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Checkout</h2>
      <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
      <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
      <input type="text" placeholder="Shipping Address" className="w-full p-2 border rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Proceed to Payment
      </button>
    </form>
  );
};

export default CheckoutForm;
