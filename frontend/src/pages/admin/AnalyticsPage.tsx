import React, { useState } from 'react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Mock data - replace with real data from API
  const metrics = {
    totalUsers: 1234,
    activeUsers: 789,
    newListings: 45,
    completedOrders: 123,
    revenue: 4567.89,
    averageRating: 4.5,
  };

  const chartData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Users',
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
      },
      {
        label: 'Orders',
        data: [8, 15, 12, 20, 18, 25, 22],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
      },
    ],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex space-x-2">
          {(['day', 'week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeRange === range
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold mt-1">{metrics.totalUsers}</p>
          <div className="text-sm text-green-600 mt-2">
            +12% from last {timeRange}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Active Users</h3>
          <p className="text-2xl font-bold mt-1">{metrics.activeUsers}</p>
          <div className="text-sm text-green-600 mt-2">
            +8% from last {timeRange}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">New Listings</h3>
          <p className="text-2xl font-bold mt-1">{metrics.newListings}</p>
          <div className="text-sm text-green-600 mt-2">
            +15% from last {timeRange}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Completed Orders</h3>
          <p className="text-2xl font-bold mt-1">{metrics.completedOrders}</p>
          <div className="text-sm text-red-600 mt-2">
            -3% from last {timeRange}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Revenue</h3>
          <p className="text-2xl font-bold mt-1">${metrics.revenue.toFixed(2)}</p>
          <div className="text-sm text-green-600 mt-2">
            +10% from last {timeRange}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Average Rating</h3>
          <p className="text-2xl font-bold mt-1">{metrics.averageRating}</p>
          <div className="text-sm text-gray-600 mt-2">
            No change from last {timeRange}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="aspect-[16/9] bg-gray-50 rounded flex items-center justify-center">
            {/* Add Chart.js or other charting library here */}
            <p className="text-gray-500">User Growth Chart</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Trends</h3>
          <div className="aspect-[16/9] bg-gray-50 rounded flex items-center justify-center">
            {/* Add Chart.js or other charting library here */}
            <p className="text-gray-500">Order Trends Chart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 