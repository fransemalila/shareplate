import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdditionalService } from '../services/additionalService';
import { FAQCategory, FAQItem } from '../types';
import { api } from '../services/api';

const HelpPage: React.FC = () => {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [items, setItems] = useState<{ [categoryId: string]: FAQItem[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const additionalService = new AdditionalService(api);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadItems(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await additionalService.getFAQCategories();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Error loading FAQ categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (categoryId: string) => {
    try {
      const data = await additionalService.getFAQItems(categoryId);
      setItems(prev => ({ ...prev, [categoryId]: data }));
    } catch (error) {
      console.error('Error loading FAQ items:', error);
    }
  };

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        <p className="mt-2 text-gray-600">
          Find answers to common questions and learn how to make the most of SharePlate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {category.title}
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Need more help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Can't find what you're looking for? Contact our support team.
            </p>
            <Link
              to="/support"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="md:col-span-3">
          {selectedCategory && items[selectedCategory]?.map((item) => (
            <div key={item.id} className="mb-4">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-lg font-medium text-gray-900">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedItems.has(item.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedItems.has(item.id) && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 whitespace-pre-wrap">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/legal/terms"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Terms of Service</h3>
          <p className="text-gray-600">Read our terms and conditions.</p>
        </Link>
        <Link
          to="/legal/privacy"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Policy</h3>
          <p className="text-gray-600">Learn how we handle your data.</p>
        </Link>
        <Link
          to="/legal/guidelines"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Guidelines</h3>
          <p className="text-gray-600">Understand our community standards.</p>
        </Link>
      </div>
    </div>
  );
};

export default HelpPage; 