import React from 'react';

interface FoodCardProps {
  title: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  location?: { lat: number; lng: number };
}

const FoodCard: React.FC<FoodCardProps> = ({
  title,
  description,
  price,
  image,
  seller,
  location,
}) => {
  const formatLocation = (loc?: { lat: number; lng: number }) => {
    if (!loc) return 'Location not available';
    return `${loc.lat.toFixed(2)}, ${loc.lng.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
          ${price.toFixed(2)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{seller}</span>
          <span>{formatLocation(location)}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard; 