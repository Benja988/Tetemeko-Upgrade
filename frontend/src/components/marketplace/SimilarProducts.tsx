import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const SimilarProducts = ({ currentProductCategory, allProducts }: { currentProductCategory: string, allProducts: Product[] }) => {
  // Filter products based on the same category, excluding the current product
  const similarProducts = allProducts.filter(product => product.category === currentProductCategory && product.slug !== currentProductCategory);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {similarProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
