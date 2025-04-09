import React from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface FoodListingCategoriesProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string) => void;
}

const FoodListingCategories: React.FC<FoodListingCategoriesProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="py-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`flex flex-col items-center p-4 rounded-lg transition-colors
              ${
                selectedCategory === category.id
                  ? 'bg-green-50 border-2 border-green-500'
                  : 'bg-white border border-gray-200 hover:border-green-500'
              }
            `}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
                ${
                  selectedCategory === category.id
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }
              `}
            >
              {/* Icon placeholder - replace with actual icon component or image */}
              <span className="text-2xl">{category.icon}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{category.name}</span>
            <span className="text-xs text-gray-500 mt-1">{category.count} items</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodListingCategories; 