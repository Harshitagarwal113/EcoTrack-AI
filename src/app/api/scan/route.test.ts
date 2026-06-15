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

vi.mock('ai', () => ({
  generateObject: vi.fn().mockResolvedValue({
    object: {
      merchant_name: 'Test Store',
      total_amount: 12.50,
      receipt_category: 'shopping',
      carbon_estimate_kg: 6.25,
      recommendations: ['Buy less']
    }
  })
}))

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn().mockReturnValue('mock-model')
}))

describe('Scan API POST', () => {
  it('returns unauthorized if no user', async () => {
    const { createClient } = await import('@/services/supabase/server')
    ;(createClient as any).mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) }
    })

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,123' })
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 if no image provided', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/No image provided|Invalid input/i)
  })

  it('successfully extracts receipt data', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,123' })
    })

    const res = await POST(req)
    const json = await res.json()
    
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.merchant_name).toBe('Test Store')
    expect(json.data.carbon_estimate_kg).toBe(6.25)
  })
})
