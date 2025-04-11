import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const staticAssetTrend = new Trend('static_asset_request_time');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    'http_req_duration{staticAsset:yes}': ['p(95)<100'], // 95% of static asset requests within 100ms
    errors: ['rate<0.1'], // Error rate must be less than 10%
  },
  noConnectionReuse: true,
  userAgent: 'K6LoadTest/1.0'
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8005';

const params = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  tags: { type: 'api' }
};

export default function () {
  try {
    // Test homepage load
    const homeResponse = http.get(`${BASE_URL}/`, { 
      ...params,
      tags: { ...params.tags, name: 'homepage' }
    });
    check(homeResponse, {
      'homepage status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);

    // Test API endpoints
    const endpoints = [
      { path: '/api/listings', name: 'get_listings' },
      { path: '/api/categories', name: 'get_categories' },
      { path: '/api/featured', name: 'get_featured' },
      { path: '/api/search?q=food', name: 'search' }
    ];

    endpoints.forEach(endpoint => {
      const response = http.get(`${BASE_URL}${endpoint.path}`, {
        ...params,
        tags: { ...params.tags, name: endpoint.name }
      });
      check(response, {
        [`${endpoint.name} status is 200`]: (r) => r.status === 200,
        [`${endpoint.name} response time OK`]: (r) => r.timings.duration < 500
      }) || errorRate.add(1);
    });

    // Test authentication flow
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword'
    };

    const loginResponse = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify(loginData),
      {
        ...params,
        tags: { ...params.tags, name: 'login' }
      }
    );

    const loginSuccess = check(loginResponse, {
      'login successful': (r) => r.status === 200,
      'has auth token': (r) => {
        try {
          return JSON.parse(r.body).token !== undefined;
        } catch (e) {
          return false;
        }
      }
    });

    if (!loginSuccess) {
      errorRate.add(1);
      return;
    }

    // Test create listing (authenticated)
    const token = JSON.parse(loginResponse.body).token;
    const listingData = {
      title: 'Test Listing',
      description: 'Test Description',
      price: 10.99,
      quantity: 1,
      category: 'food',
      cuisine: 'other',
      preparationTime: 30,
      pickupWindow: {
        start: new Date(Date.now() + 3600000).toISOString(),
        end: new Date(Date.now() + 7200000).toISOString()
      }
    };

    const createListingResponse = http.post(
      `${BASE_URL}/api/listings`,
      JSON.stringify(listingData),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        tags: { ...params.tags, name: 'create_listing' }
      }
    );

    check(createListingResponse, {
      'create listing successful': (r) => r.status === 201,
    }) || errorRate.add(1);

  } catch (e) {
    console.error('Test execution error:', e);
    errorRate.add(1);
  }

  sleep(1);
} 