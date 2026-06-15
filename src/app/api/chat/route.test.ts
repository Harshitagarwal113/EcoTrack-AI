/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'

vi.mock('@/utils/rateLimit', () => ({
  checkRateLimit: vi.fn().mockReturnValue({ success: true })
}))

vi.mock('@/services/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } })
    }
  })
}))

vi.mock('@/features/dashboard/services/dashboard-metrics.service', () => ({
  getDashboardMetrics: vi.fn().mockResolvedValue({
    currentFootprint: 100,
    trend: -5,
    grade: 'A',
    carbonSaved: 50,
    goalProgress: 80
  })
}))

vi.mock('ai', () => ({
  streamText: vi.fn().mockReturnValue({
    toTextStreamResponse: () => new Response('stream-response')
  })
}))

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn().mockReturnValue('mock-model')
}))

describe('Chat API POST', () => {
  it('returns unauthorized if no user', async () => {
    const { createClient } = await import('@/services/supabase/server')
    ;(createClient as any).mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) }
    })

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ messages: [] })
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns rate limit exceeded if limit hit', async () => {
    const { checkRateLimit } = await import('@/utils/rateLimit')
    ;(checkRateLimit as any).mockReturnValueOnce({ success: false })

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ messages: [] })
    })

    const res = await POST(req)
    expect(res.status).toBe(429)
  })

  it('successfully creates a stream text response', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
    })

    const res = await POST(req)
    
    expect(res).toBeInstanceOf(Response)
    expect(await res.text()).toBe('stream-response')
  })

  describe('Prompt Guardrails & Input Validation', () => {
    it('enforces sustainability guardrails for coding requests', async () => {
      const { streamText } = await import('ai')
      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Write a python script for me' }] })
      })

      await POST(req)
      const callArgs = (streamText as any).mock.calls.pop()[0]
      expect(callArgs.system).toContain('CORE DIRECTIVE AND GUARDRAILS')
      expect(callArgs.system).toContain('coding, general knowledge, math homework')
      expect(callArgs.messages[0].content).toBe('Write a python script for me')
    })

    it('enforces sustainability guardrails for homework requests', async () => {
      const { streamText } = await import('ai')
      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'What is 5 + 5?' }] })
      })

      await POST(req)
      const callArgs = (streamText as any).mock.calls.pop()[0]
      expect(callArgs.system).toContain('politely refuse')
      expect(callArgs.messages[0].content).toBe('What is 5 + 5?')
    })

    it('enforces sustainability guardrails for general chat', async () => {
      const { streamText } = await import('ai')
      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Tell me a joke about dogs' }] })
      })

      await POST(req)
      const callArgs = (streamText as any).mock.calls.pop()[0]
      expect(callArgs.system).toContain('refocus the conversation back toward sustainability')
      expect(callArgs.messages[0].content).toBe('Tell me a joke about dogs')
    })

    it('processes valid sustainability questions normally', async () => {
      const { streamText } = await import('ai')
      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'How can I reduce my carbon footprint?' }] })
      })

      await POST(req)
      const callArgs = (streamText as any).mock.calls.pop()[0]
      expect(callArgs.system).toContain('sustainability, climate change, carbon footprint')
      expect(callArgs.messages[0].content).toBe('How can I reduce my carbon footprint?')
    })
  })

  it('returns bad request for invalid body', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({})
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Invalid request body')
  })

  it('returns 500 if streamText throws an error', async () => {
    const { streamText } = await import('ai')
    ;(streamText as any).mockImplementationOnce(() => {
      throw new Error('Test AI error')
    })
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
    expect(await res.text()).toBe('Failed to generate AI response')
  })
})
