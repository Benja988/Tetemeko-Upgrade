import products from '@/constants/dummyProducts';
import { notFound } from 'next/navigation';
import ProductList from '@/components/marketplace/ProductList';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi'; // Importing the back arrow icon from react-icons

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) return notFound();

  // Limit the description to 150 characters
  const limitedDescription =
    product.description.length > 150
      ? product.description.slice(0, 150) + '...'
      : product.description;

  // Filter similar products by category, excluding the current product
  const similarProducts = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      {/* Back Arrow */}
      <div className="mb-6">
        <Link href="/marketplace" className="flex items-center text-gray-600 hover:text-gray-800 transition duration-300">
          <BiArrowBack className="h-5 w-5 mr-2" />
          Back to Marketplace
        </Link>
      </div>

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
            <p>{limitedDescription}</p>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="my-10 border-t-2 border-gray-300"></div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Similar Products</h2>
          <ProductList categoryFilter={product.category} />
        </section>
      )}
    </main>
  );
}