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
    <div className="flex gap-3 border-b mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`py-2 px-4 border-b-2 ${
            selected === cat ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
