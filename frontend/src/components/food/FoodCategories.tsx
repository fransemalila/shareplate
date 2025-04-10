import React from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

interface FoodCategoriesProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
  selectedCategory?: string;
}

export const FoodCategories: React.FC<FoodCategoriesProps> = ({
  categories,
  onCategorySelect,
  selectedCategory
}) => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`flex flex-col items-center p-6 rounded-xl transition-all transform hover:scale-105
              ${
                selectedCategory === category.id
                  ? 'bg-green-50 border-2 border-green-500 shadow-md'
                  : 'bg-white border border-gray-200 hover:border-green-500 hover:shadow-lg'
              }
            `}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4
                ${
                  selectedCategory === category.id
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }
              `}
            >
              <span className="text-3xl">{category.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-sm text-gray-500 text-center mb-3">{category.description}</p>
            <span className="text-sm font-medium text-gray-600">{category.count} listings</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 