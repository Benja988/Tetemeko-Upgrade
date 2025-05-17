import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { Product } from '@/interfaces/Products';
import ProductGallery from '@/components/marketplace/ProductGallery';
import ProductDetails from '@/components/marketplace/ProductDetails';
import ProductMetaInfo from '@/components/marketplace/ProductMetaInfo';
import ProductReviews from '@/components/marketplace/ProductReviews';
import RelatedProducts from '@/components/marketplace/RelatedProducts';
import Breadcrumbs from '@/components/Breadcrumbs';

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const product: Product | undefined = products.find((p) => p.slug === params.slug);

  if (!product) return notFound();

  return (
    <main className="max-w-6xl mx-auto p-6 font-poppins text-white">
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Marketplace', href: '/marketplace' },
            { label: 'Products', href: '/marketplace/products' },
            { label: product.name }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery product={product} />
        <div>
          <ProductDetails product={product} />
          <ProductMetaInfo product={product} />
        </div>
      </div>

      <div>
        <ProductReviews product={product} />
        <RelatedProducts currentProduct={product} />
      </div>
    </main>
  );
}
