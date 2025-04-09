import React from 'react';

interface FoodCardProps {
  title: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  location: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  title,
  description,
  price,
  image,
  seller,
  location,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-green-600 font-bold">${price.toFixed(2)}</span>
          <div className="text-sm text-gray-500">
            <p>{seller}</p>
            <p>{location}</p>
          </div>
        </div>
        <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Order Now
        </button>
      </div>
    </div>
  );
};

export default FoodCard; 