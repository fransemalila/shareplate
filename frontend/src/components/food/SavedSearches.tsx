import React, { useState, useEffect } from 'react';

interface SavedSearch {
  id: string;
  name: string;
  filters: {
    category?: string;
    status?: string;
    tags?: string[];
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
    radius?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    sortBy?: string;
  };
  createdAt: string;
}

interface SavedSearchesProps {
  onApplySearch: (filters: SavedSearch['filters']) => void;
  currentFilters: SavedSearch['filters'];
}

export const SavedSearches: React.FC<SavedSearchesProps> = ({ onApplySearch, currentFilters }) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [newSearchName, setNewSearchName] = useState('');
  const [isAddingSearch, setIsAddingSearch] = useState(false);

  useEffect(() => {
    // Load saved searches from localStorage
    const searches = localStorage.getItem('savedSearches');
    if (searches) {
      setSavedSearches(JSON.parse(searches));
    }
  }, []);

  const saveSearch = (name: string) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters: currentFilters,
      createdAt: new Date().toISOString()
    };

    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
    setIsAddingSearch(false);
    setNewSearchName('');
  };

  const deleteSearch = (id: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== id);
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Saved Searches</h2>
        <button
          onClick={() => setIsAddingSearch(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Save Current Search
        </button>
      </div>

      {isAddingSearch && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <input
            type="text"
            value={newSearchName}
            onChange={(e) => setNewSearchName(e.target.value)}
            placeholder="Enter search name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddingSearch(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => saveSearch(newSearchName)}
              disabled={!newSearchName}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:border-green-500"
          >
            <div>
              <h3 className="font-medium text-gray-900">{search.name}</h3>
              <p className="text-sm text-gray-500">
                Saved on {new Date(search.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onApplySearch(search.filters)}
                className="px-3 py-1 text-green-600 hover:text-green-800"
              >
                Apply
              </button>
              <button
                onClick={() => deleteSearch(search.id)}
                className="px-3 py-1 text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {savedSearches.length === 0 && (
          <p className="text-center text-gray-500 py-4">No saved searches yet</p>
        )}
      </div>
    </div>
  );
}; 