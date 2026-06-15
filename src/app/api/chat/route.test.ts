import { describe, it, expect, vi, beforeEach } from 'vitest'
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
})
