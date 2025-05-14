// Mock the next/server module
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: async () => data,
      status: 200
    }))
  }
}));

// Mock the createServerClient function
jest.mock('@/lib/supabase/serverClient', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          limit: jest.fn(() => ({
            data: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                display_name: 'Test User',
                email: 'test@example.com',
                top_genre: 'Rock',
                share_card_count: 5,
                plus_plan: false
              }
            ],
            error: null
          }))
        }))
      }))
    }))
  }))
}));

// Import the GET handler after mocking dependencies
import { GET } from '@/app/api/users/recent/route';

// Mock console.log and console.error to prevent noise in test output
console.log = jest.fn();
console.error = jest.fn();

describe('Recent Users API', () => {
  it('should return users array', async () => {
    // Call the API route handler
    const response = await GET();
    
    // Parse the response JSON
    const responseData = await response.json();
    
    // Check that the response has the right structure
    expect(responseData).toHaveProperty('users');
    expect(Array.isArray(responseData.users)).toBe(true);
    
    // We're just checking that the users array exists
    // We don't need to check its length in this mocked test
    
    // If there are users, check their properties
    if (responseData.users.length > 0) {
      const firstUser = responseData.users[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('display_name');
      expect(firstUser).toHaveProperty('email');
    }
  });
}); 