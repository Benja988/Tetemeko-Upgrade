'use client';

interface SettingsCategoriesProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function SettingsCategories({
  categories,
  selected,
  onSelect,
}: SettingsCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b pb-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-t-md text-sm font-medium border-b-2 ${
            selected === cat
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-blue-500'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
