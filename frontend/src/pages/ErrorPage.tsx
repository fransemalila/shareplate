import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { XCircleIcon, HomeIcon } from '@heroicons/react/24/outline';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const isRouteError = isRouteErrorResponse(error);
  
  const getErrorDetails = () => {
    if (isRouteError) {
      return {
        status: error.status,
        title: error.status === 404 ? 'Page Not Found' : 'Server Error',
        message: error.status === 404 
          ? "The page you're looking for doesn't exist or has been moved."
          : "We're experiencing technical difficulties. Please try again later.",
        details: error.data?.message || error.statusText
      };
    }
    return {
      status: 500,
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <XCircleIcon className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {errorDetails.status}
        </h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-700">
          {errorDetails.title}
        </h2>
        <p className="mt-4 text-base text-gray-600">
          {errorDetails.message}
        </p>
        {process.env.NODE_ENV !== 'production' && (
          <p className="mt-2 text-sm text-gray-500 break-words">
            {errorDetails.details}
          </p>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}; 