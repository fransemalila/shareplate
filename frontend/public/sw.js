self.addEventListener('push', function(event) {
  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'view' && event.notification.data) {
    const data = event.notification.data;
    let url = '/';

    if (data.orderId) url = `/orders/${data.orderId}`;
    else if (data.listingId) url = `/listings/${data.listingId}`;
    else if (data.messageId) url = `/messages/${data.messageId}`;

    event.waitUntil(
      clients.openWindow(url)
    );
  }
}); 