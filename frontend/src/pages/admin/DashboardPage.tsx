import React from 'react';

const DashboardPage: React.FC = () => {
  const metrics = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: '👥' },
    { label: 'Active Listings', value: '456', change: '+5%', icon: '🍽️' },
    { label: 'Open Tickets', value: '23', change: '-15%', icon: '🎫' },
    { label: 'Revenue', value: '$12,345', change: '+8%', icon: '💰' },
  ];

  const recentActivity = [
    { type: 'user_joined', user: 'John Doe', time: '2 minutes ago' },
    { type: 'listing_created', user: 'Jane Smith', time: '15 minutes ago' },
    { type: 'ticket_resolved', user: 'Support Team', time: '1 hour ago' },
    { type: 'review_posted', user: 'Mike Johnson', time: '2 hours ago' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{metric.icon}</span>
              <span className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">{metric.label}</h3>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y">
          {recentActivity.map((activity, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center">
                <span className="text-xl mr-3">
                  {activity.type === 'user_joined' && '👤'}
                  {activity.type === 'listing_created' && '📝'}
                  {activity.type === 'ticket_resolved' && '✅'}
                  {activity.type === 'review_posted' && '⭐'}
                </span>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    {activity.type === 'user_joined' && 'joined the platform'}
                    {activity.type === 'listing_created' && 'created a new listing'}
                    {activity.type === 'ticket_resolved' && 'resolved a support ticket'}
                    {activity.type === 'review_posted' && 'posted a new review'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 