import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { StreakCards } from './StreakCards'
import * as gamification from '@/features/dashboard/services/gamification.service'

vi.mock('@/features/dashboard/services/gamification.service', () => ({
  getStreaks: vi.fn(),
}))

describe('StreakCards Component', () => {
  it('renders correctly with given streak data', async () => {
    vi.spyOn(gamification, 'getStreaks').mockResolvedValue([
      { id: '2', streak_type: 'completed_goals', current_streak: 12, longest_streak: 15 },
      { id: '3', streak_type: 'carbon_reductions', current_streak: 3, longest_streak: 3 },
    ] as any)

    render(<StreakCards />)
    
    await waitFor(() => {
      expect(screen.getByText('Goals Completed')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Goals Completed')).toBeInTheDocument()
    expect(screen.getAllByText('12')[0]).toBeInTheDocument()
    expect(screen.getByText('Weeks Reduced')).toBeInTheDocument()
    expect(screen.getAllByText('3')[0]).toBeInTheDocument()
  })

  it('renders default values when streaks are 0', async () => {
    vi.spyOn(gamification, 'getStreaks').mockResolvedValue([
      { id: '2', streak_type: 'completed_goals', current_streak: 0, longest_streak: 0 },
    ] as any)

    render(<StreakCards />)
    
    await waitFor(() => {
      expect(screen.getByText('Goals Completed')).toBeInTheDocument()
    })
    
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThan(0)
  })
})
