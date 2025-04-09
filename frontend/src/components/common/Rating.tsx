import React from 'react';

interface RatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  size = 'medium',
  readonly = false
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const starSize = sizes[size];

  const renderStar = (index: number) => {
    const filled = index < value;
    const halfFilled = index === Math.floor(value) && value % 1 !== 0;

    return (
      <button
        key={index}
        type="button"
        onClick={() => !readonly && onChange?.(index + 1)}
        className={`focus:outline-none ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        disabled={readonly}
      >
        <svg
          className={`${starSize} ${
            filled
              ? 'text-yellow-400'
              : halfFilled
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => renderStar(index))}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating; 