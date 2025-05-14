import { test, expect } from '@playwright/test';

test('Recent users API returns successful response', async ({ request }) => {
  // Fetch the recent users endpoint
  const response = await request.get('/api/users/recent');
  
  // Check the response status
  expect(response.status()).toBe(200);
  
  // Check the response structure
  const data = await response.json();
  expect(data).toHaveProperty('users');
  expect(Array.isArray(data.users)).toBeTruthy();
  
  // Logging the number of users returned (useful for debugging)
  console.log(`API returned ${data.users.length} users`);
}); 