'use client';
import { FC } from 'react';

const categories = ['Technology', 'Business', 'Health', 'Design', 'AI', 'Travel'];

const CategoriesSidebar: FC = () => {
    return (
        <aside className="bg-white p-4 border rounded-md shadow-sm">
            <h4 className="text-lg font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-blue-700">
                {categories.map((cat) => (
                    <li key={cat} className="hover:underline cursor-pointer">
                        {cat}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default CategoriesSidebar;
