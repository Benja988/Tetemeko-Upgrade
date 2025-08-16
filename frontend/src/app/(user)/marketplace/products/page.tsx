'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/interfaces/Products';

import { products as sampleProducts } from '@/data/products';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryFilter from '@/components/marketplace/CategoryFilter';
import SearchBar from '@/components/marketplace/SearchBar';

// import ProductCard from '@/components/marketplace/ProductCard';
import SidebarFilters from '@/components/marketplace/SidebarFilters';
import ProductsGrid from '@/components/marketplace/ProductsGrid';
import MarketPlaceFooter from '@/components/marketplace/MarketPlaceFooter';





const getCategories = (products: Product[]) => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...cats];
};

const getBrands = (products: Product[]) => {
    return Array.from(new Set(products.map((p) => p.brand)));
};

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);

    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

    const categories = getCategories(sampleProducts);
    const brands = getBrands(sampleProducts);

    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        let filtered = sampleProducts;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        if (selectedBrands.length) {
            filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
        }

        filtered = filtered.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query)
            );
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, selectedBrands, priceRange, searchQuery]);

    const handleFilterChange = (filters: {
        categories: string[];
        brands: string[];
        priceRange: [number, number];
    }) => {
        setSelectedBrands(filters.brands);
        setPriceRange(filters.priceRange);
        // `filters.categories` is not used since category filtering is already handled separately
    };

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Marketplace', href: '/marketplace' },
        { label: 'Products' },
    ];

    return (
        <main className="max-w-7xl mx-auto px-2 py-12 font-poppins">
            <Breadcrumbs items={breadcrumbItems} />

            <h1 className="text-3xl font-bold mb-8 text-center text-white">Shop</h1>

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <div className="flex flex-col md:flex-row gap-6">
                <div className="hidden md:block w-full md:w-1/4">
                    <SidebarFilters
                        categories={categories}
                        brands={brands}
                        onFilterChange={handleFilterChange}
                    />
                </div>


                <div className="flex-1">
                    <ProductsGrid products={filteredProducts} variant="grid" />
                </div>

            </div>
            <MarketPlaceFooter />
        </main>

    );
}
