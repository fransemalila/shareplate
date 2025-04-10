import React, { useState } from 'react';
import { FoodListing } from '../../types';

interface ContentItem {
  id: string;
  type: 'listing' | 'review' | 'comment';
  title: string;
  content: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  reportCount: number;
  createdAt: string;
}

const ContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const [contentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'listing',
      title: 'Homemade Pasta',
      content: 'Fresh homemade pasta available...',
      author: 'John Doe',
      status: 'pending',
      reportCount: 2,
      createdAt: '2024-04-10T10:00:00Z',
    },
    // Add more mock content items
  ]);

  const handleAction = (action: 'approve' | 'reject' | 'delete', item: ContentItem) => {
    // Implement content moderation actions
    console.log(`${action} content:`, item);
  };

  const filteredItems = contentItems.filter(item => item.status === activeTab);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Moderation</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content List */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reports
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">by {item.author}</div>
                    <div className="text-sm text-gray-500 mt-1 truncate max-w-md">
                      {item.content}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${item.type === 'listing' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'review' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.reportCount > 0 && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {item.reportCount} reports
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction('approve', item)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction('reject', item)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-indigo-600 hover:text-indigo-900 ml-3"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Content Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{selectedItem.title}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Posted by {selectedItem.author} on {new Date(selectedItem.createdAt).toLocaleString()}
              </p>
              <div className="mt-4 prose max-w-none">
                {selectedItem.content}
              </div>
              {selectedItem.reportCount > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <h3 className="text-red-800 font-medium">Reports ({selectedItem.reportCount})</h3>
                  {/* Add report details here */}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              {selectedItem.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleAction('approve', selectedItem)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction('reject', selectedItem)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPage; 