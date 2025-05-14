import { GET } from '@/app/api/users/recent/route';
import { NextResponse } from 'next/server';

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

// Mock console.log and console.error to prevent noise in test output
console.log = jest.fn();
console.error = jest.fn();

describe('Recent Users API', () => {
  it('should return at least one user', async () => {
    // Call the API route handler
    const response = await GET();
    
    // Parse the response JSON
    const responseData = await response.json();
    
    // Check that the response has the right structure
    expect(response).toBeInstanceOf(NextResponse);
    expect(responseData).toHaveProperty('users');
    expect(Array.isArray(responseData.users)).toBe(true);
    
    // Check that there is at least one user
    expect(responseData.users.length).toBeGreaterThanOrEqual(1);
    
    // Check the user has the expected properties
    const firstUser = responseData.users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('display_name');
    expect(firstUser).toHaveProperty('email');
  });
}); 