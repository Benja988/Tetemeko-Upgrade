'use client';

import { useState } from "react";

const tabs = ["All", "Latest", "Popular", "Featured"];

export default function NewsTabs() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex space-x-4 border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 text-sm font-medium ${
            activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
