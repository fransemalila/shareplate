import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';

interface FoodListingFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  expiryDate?: string;
  allergens: string[];
  dietaryInfo: string[];
  images: FileList;
}

interface FoodListingFormProps {
  onSubmit: (data: FoodListingFormData) => void;
  initialData?: Partial<FoodListingFormData>;
}

const FoodListingForm: React.FC<FoodListingFormProps> = ({ onSubmit, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FoodListingFormData>({
    defaultValues: initialData
  });

  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(initialData.allergens || []);
  const [selectedDiets, setSelectedDiets] = useState<string[]>(initialData.dietaryInfo || []);

  const allergenOptions = [
    'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts',
    'Peanuts', 'Wheat', 'Soybeans'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal',
    'Kosher', 'Dairy-Free', 'Low-Carb', 'Keto'
  ];

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiets(prev =>
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Food Listing</h2>
      
      {/* Basic Information */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Available
            </label>
            <input
              type="number"
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 1, message: 'Quantity must be at least 1' }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a category</option>
            <option value="homemade">Homemade</option>
            <option value="restaurant">Restaurant</option>
            <option value="grocery">Grocery</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date (optional)
          </label>
          <input
            type="date"
            {...register('expiryDate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Allergens */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allergens
        </label>
        <div className="flex flex-wrap gap-2">
          {allergenOptions.map(allergen => (
            <button
              key={allergen}
              type="button"
              onClick={() => toggleAllergen(allergen)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${selectedAllergens.includes(allergen)
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : 'bg-gray-100 text-gray-800 border-gray-200'
                } border`}
            >
              {allergen}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Information */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Information
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map(diet => (
            <button
              key={diet}
              type="button"
              onClick={() => toggleDiet(diet)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${selectedDiets.includes(diet)
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-gray-100 text-gray-800 border-gray-200'
                } border`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          {...register('images', { required: 'At least one image is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" fullWidth>
        Create Listing
      </Button>
    </form>
  );
};

export default FoodListingForm; 