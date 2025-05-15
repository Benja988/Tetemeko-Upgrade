"use client";

export default function PodcastCategories() {
  const categories = ["Tech", "Health", "Business", "Entertainment", "Education"];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Browse by Category</h3>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <button
            key={category}
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-200 ease-in-out text-sm font-medium"
            onClick={() => alert(`Showing podcasts for ${category}`)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
