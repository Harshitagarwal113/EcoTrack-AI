/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { getEmissionFactors } from './emissionService'
import * as serverClient from '@/services/supabase/server'

vi.mock('@/services/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Emission Service calculations', () => {
  it('returns default factors when DB fails', async () => {
    vi.spyOn(serverClient, 'createClient').mockResolvedValue({
      from: () => ({ select: () => Promise.resolve({ data: null, error: true }) })
    } as any)

    const factors = await getEmissionFactors()
    
    expect(factors.car).toBeCloseTo(0.192)
    expect(factors.train).toBeCloseTo(0.041)
    expect(factors.electricity).toBeCloseTo(0.4)
  })

  it('merges DB factors correctly', async () => {
    vi.spyOn(serverClient, 'createClient').mockResolvedValue({
      from: () => ({
        select: () => Promise.resolve({
          data: [{ name: 'Car', carbon_factor: 0.5 }],
          error: null
        })
      })
    } as any)

    const factors = await getEmissionFactors()
    
    // Should use the DB factor
    expect(factors.car).toBe(0.5)
    // Should fallback to default for missing DB factors
    expect(factors.bus).toBeCloseTo(0.089)
  })

  it('returns default factors when exception is thrown', async () => {
    vi.spyOn(serverClient, 'createClient').mockRejectedValueOnce(new Error('DB connection error'))

    const factors = await getEmissionFactors()
    
    expect(factors.car).toBeCloseTo(0.192)
    expect(factors.train).toBeCloseTo(0.041)
  })
})
