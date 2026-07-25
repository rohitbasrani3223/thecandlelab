import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp up to 100 virtual users
    { duration: '1m', target: 500 },  // Sustained load at 500 virtual users
    { duration: '30s', target: 1000 },// Peak spike at 1,000 virtual users
    { duration: '30s', target: 0 },   // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests must complete under 300ms
  },
};

export default function () {
  const BASE_URL = 'http://localhost:8000/api/v1';

  // 1. Health Check
  const healthRes = http.get(`${BASE_URL}/health/`);
  check(healthRes, { 'Health status 200': (r) => r.status === 200 });

  // 2. Fetch Collections
  const colRes = http.get(`${BASE_URL}/collections/`);
  check(colRes, { 'Collections status 200': (r) => r.status === 200 });

  // 3. Fetch Products
  const prodRes = http.get(`${BASE_URL}/products/`);
  check(prodRes, { 'Products status 200': (r) => r.status === 200 });

  sleep(1);
}
