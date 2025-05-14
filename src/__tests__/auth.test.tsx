import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import SignInForm from '@/components/auth/SignInForm'

// Mock modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}))

jest.mock('@heroicons/react/24/outline', () => ({
  ExclamationCircleIcon: () => <svg data-testid="error-icon" />,
}))

describe('SignInForm', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })
  
  it('should render the form correctly', () => {
    render(<SignInForm />)
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
  
  it('should handle successful sign in and redirect to dashboard', async () => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue({
      data: {
        user: { id: 'user-123' },
      },
      error: null,
    })
    
    // @ts-ignore
    require('@/lib/supabase/client').supabase.auth.signInWithPassword = mockSignInWithPassword
    
    render(<SignInForm />)
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    })
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })
  
  it('should show error message when sign in fails', async () => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    })
    
    // @ts-ignore
    require('@/lib/supabase/client').supabase.auth.signInWithPassword = mockSignInWithPassword
    
    render(<SignInForm />)
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    })
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid login credentials/i)).toBeInTheDocument()
    })
    
    expect(mockPush).not.toHaveBeenCalled()
  })
}) 