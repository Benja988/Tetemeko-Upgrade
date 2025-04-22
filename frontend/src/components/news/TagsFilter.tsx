// src/components/news/TagsFilter.tsx
'use client';

import { FC, useState } from 'react';
import { posts } from '@/constants/post';

const TagsFilter: FC = () => {
  const uniqueTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {uniqueTags.map((tag, i) => (
        <button
          key={i}
          onClick={() => setActiveTag(tag === activeTag ? null : tag)}
          className={`px-4 py-1 text-sm rounded-full border ${
            tag === activeTag ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};

export default TagsFilter;
