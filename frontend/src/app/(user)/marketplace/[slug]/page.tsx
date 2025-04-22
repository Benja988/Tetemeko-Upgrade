import products from '@/constants/dummyProducts';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) return notFound();

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-between">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-xl font-semibold text-green-600 mt-2">${product.price.toFixed(2)}</p>

          <div className="mt-4 text-gray-700">
            <p>{product.description}</p>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out">
              Add to Cart
            </button>
            {/* Add to Cart Button */}
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="my-10 border-t-2 border-gray-300"></div>
    </main>
  );
}
