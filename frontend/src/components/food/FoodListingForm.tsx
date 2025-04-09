import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FoodListing, Tag, ListingStatus } from '../../types';
import ImageUpload from '../common/ImageUpload';
import TagInput from '../common/TagInput';
import DatePicker from '../common/DatePicker';
import Button from '../common/Button';

interface FoodListingFormProps {
  initialData?: Partial<FoodListing>;
  onSubmit: (data: Partial<FoodListing>) => Promise<void>;
  isLoading?: boolean;
}

const FoodListingForm: React.FC<FoodListingFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [tags, setTags] = useState<Tag[]>(initialData?.tags || []);
  const [isDraft, setIsDraft] = useState(initialData?.isDraft || false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<Partial<FoodListing>>({
    defaultValues: {
      ...initialData,
      status: initialData?.status || 'active',
      expiresAt: initialData?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  });

  const handleFormSubmit = async (data: Partial<FoodListing>) => {
    await onSubmit({
      ...data,
      images,
      tags,
      isDraft,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          {...register('price', { required: 'Price is required', min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="">Select a category</option>
          <option value="homemade">Homemade</option>
          <option value="restaurant">Restaurant</option>
          <option value="grocery">Grocery</option>
          <option value="bakery">Bakery</option>
          <option value="desserts">Desserts</option>
          <option value="drinks">Drinks</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          maxImages={5}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="expired">Expired</option>
            </select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
        <Controller
          name="expiresAt"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              className="mt-1 block w-full"
              minDate={new Date()}
            />
          )}
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => setIsDraft(true)}
          className={`px-4 py-2 rounded-md ${
            isDraft
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Save as Draft
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : isDraft ? 'Save Draft' : 'Publish Listing'}
        </button>
      </div>
    </form>
  );
};

export default FoodListingForm; 