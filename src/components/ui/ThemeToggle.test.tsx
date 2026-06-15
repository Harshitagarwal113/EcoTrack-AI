import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'
import * as nextThemes from 'next-themes'

describe('ThemeToggle Component', () => {
  it('renders correctly and toggles theme', async () => {
    const setThemeMock = vi.fn()
    vi.spyOn(nextThemes, 'useTheme').mockImplementation(() => ({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: setThemeMock,
      themes: ['light', 'dark'],
      systemTheme: 'light'
    }))

    render(<ThemeToggle />)
    
    const button = await screen.findByRole('button', { name: /Toggle Dark Mode/i })
    expect(button).toBeInTheDocument()

    // It shows dark_mode icon when resolvedTheme is light
    expect(screen.getByText('dark_mode')).toBeInTheDocument()

    // Click toggles theme
    fireEvent.click(button)
    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })

  it('shows light_mode icon when theme is dark', async () => {
    const setThemeMock = vi.fn()
    vi.spyOn(nextThemes, 'useTheme').mockImplementation(() => ({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: setThemeMock,
      themes: ['light', 'dark'],
      systemTheme: 'dark'
    }))

    render(<ThemeToggle />)
    expect(await screen.findByText('light_mode')).toBeInTheDocument()
    
    const button = screen.getByRole('button', { name: /Toggle Dark Mode/i })
    fireEvent.click(button)
    expect(setThemeMock).toHaveBeenCalledWith('light')
  })
})
