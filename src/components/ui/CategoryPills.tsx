"use client";

import React from "react";

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-4 flex items-center gap-2">
      {categories.map((category) => {
        const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500"
                : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
