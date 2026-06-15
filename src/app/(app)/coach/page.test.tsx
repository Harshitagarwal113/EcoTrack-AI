/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CoachPage from './page'

// Mock the ai/react hook
const mockSendMessage = vi.fn()
const mockUseChat = vi.fn(() => ({
  messages: [] as any[],
  sendMessage: mockSendMessage,
  status: 'ready'
}))

vi.mock('@ai-sdk/react', () => ({
  useChat: () => mockUseChat()
}))

// Mock matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
}))

describe('CoachPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      status: 'ready'
    })
  })

  it('renders the initial welcome screen', () => {
    render(<CoachPage />)
    expect(screen.getByText("I'm your Sustainability Coach")).toBeInTheDocument()
  })

  it('allows user to type and send a message', async () => {
    render(<CoachPage />)
    const input = screen.getByPlaceholderText('Ask about your footprint or request a goal...')
    const form = input.closest('form')
    
    fireEvent.change(input, { target: { value: 'How can I reduce emissions?' } })
    expect(input).toHaveValue('How can I reduce emissions?')
    
    // Submit form
    if (form) {
      fireEvent.submit(form)
    }

    expect(mockSendMessage).toHaveBeenCalledWith({
      role: 'user',
      parts: [{ type: 'text', text: 'How can I reduce emissions?' }]
    })
    
    // Input should be cleared
    expect(input).toHaveValue('')
  })

  it('sends message via suggestion buttons', () => {
    render(<CoachPage />)
    const suggestionButton = screen.getByText('Analyze footprint')
    
    fireEvent.click(suggestionButton)
    
    expect(mockSendMessage).toHaveBeenCalledWith({
      role: 'user',
      parts: [{ type: 'text', text: 'Analyze my carbon footprint this month.' }]
    })
  })

  it('renders chat messages correctly', () => {
    mockUseChat.mockReturnValue({
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello coach' }] },
        { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Hello! Ask me anything.' }] }
      ],
      sendMessage: mockSendMessage,
      status: 'ready'
    })

    render(<CoachPage />)
    expect(screen.getByText('Hello coach')).toBeInTheDocument()
    expect(screen.getByText('Gemini Coach')).toBeInTheDocument()
    expect(screen.getByText('Hello! Ask me anything.')).toBeInTheDocument()
  })

  it('renders loading dots when status is submitted/streaming', () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      status: 'submitted'
    })

    const { container } = render(<CoachPage />)
    expect(container.querySelector('.animate-bounce')).toBeInTheDocument()
  })
})
