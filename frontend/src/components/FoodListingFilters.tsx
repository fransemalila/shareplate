interface FoodListingFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const FoodListingFilters: React.FC<FoodListingFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedTags,
  onTagsChange
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          <option value="meals">Meals</option>
          <option value="groceries">Groceries</option>
          <option value="produce">Produce</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <select
          multiple
          value={selectedTags}
          onChange={(e) => onTagsChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
          <option value="dairy-free">Dairy Free</option>
        </select>
      </div>
    </div>
  );
}; 