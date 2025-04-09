import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div 
        className={`relative ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-black' 
            : 'h-96'
        }`}
      >
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className={`${
            isFullscreen
              ? 'w-full h-full object-contain'
              : 'w-full h-full object-cover'
          }`}
          onClick={toggleFullscreen}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isFullscreen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4l7 7m0 0l7 7M4 18l7-7m0 0l7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0-4l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 ${
                currentIndex === index
                  ? 'ring-2 ring-green-500'
                  : 'hover:opacity-75'
              }`}
            >
              <img
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover rounded-md"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery; 