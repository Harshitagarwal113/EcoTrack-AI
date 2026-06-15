import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from './page'
import { createClient } from '@/services/supabase/client'

vi.mock('@/services/supabase/client', () => ({
  createClient: vi.fn()
}))

describe('LoginPage', () => {
  let mockSignInWithOAuth: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockSignInWithOAuth = vi.fn().mockResolvedValue({ data: null, error: null })
    ;(createClient as any).mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth
      }
    })
  })

  it('renders the login page correctly', () => {
    render(<LoginPage />)
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('calls Supabase signInWithOAuth when clicking the login button', async () => {
    render(<LoginPage />)
    const loginButton = screen.getByText('Continue with Google')
    
    fireEvent.click(loginButton)
    
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.any(String),
      }
    })
  })

  it('disables the button while loading', () => {
    render(<LoginPage />)
    const loginButton = screen.getByRole('button')
    
    fireEvent.click(loginButton)
    
    expect(loginButton).toBeDisabled()
  })
})
