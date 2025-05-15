// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { NewsItems } from '@/data/news';
// import Link from 'next/link';

// const CategoryPage = ({ params }: { params: { category: string } }) => {
//   const [filteredNews, setFilteredNews] = useState([]);
//   const router = useRouter();
//   const { category } = params;

//   useEffect(() => {
//     const categoryNews = NewsItems.filter(
//       (news) => news.category.toLowerCase() === category.toLowerCase()
//     );
//     if (categoryNews.length === 0) {
//       router.push('/404'); // Redirect to 404 if category not found
//     } else {
//       setFilteredNews(categoryNews);
//     }
//   }, [category, router]);

//   return (
//     <div className="py-16 px-8">
//       <h2 className="text-4xl font-bold mb-6">{category} News</h2>
//       <div className="space-y-8">
//         {filteredNews.map((newsItem) => (
//           <Link href={`/news/${newsItem._id}`} key={newsItem._id}>
//             <div className="p-4 rounded-lg shadow-md hover:bg-secondary/10 transition">
//               <h3 className="text-2xl font-semibold">{newsItem.title}</h3>
//               <p className="text-sm text-gray-400">{newsItem.text}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;
