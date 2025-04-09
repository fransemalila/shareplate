import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">SharePlate</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/browse" className="text-gray-700 hover:text-green-600">
              Browse Food
            </Link>
            <Link to="/share" className="text-gray-700 hover:text-green-600">
              Share Food
            </Link>
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 