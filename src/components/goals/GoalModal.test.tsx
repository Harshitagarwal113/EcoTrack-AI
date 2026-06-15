import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GoalModal } from './GoalModal'

describe('GoalModal', () => {
  const defaultProps = {
    showGoalModal: true,
    setShowGoalModal: vi.fn(),
    newGoalTitle: '',
    setNewGoalTitle: vi.fn(),
    newGoalTarget: '10',
    setNewGoalTarget: vi.fn(),
    newGoalDuration: '7',
    setNewGoalDuration: vi.fn(),
    handleCreateGoal: vi.fn((e) => e.preventDefault()),
    isSubmitting: false,
  }

  it('renders the form inputs and buttons', () => {
    render(<GoalModal {...defaultProps} />)
    
    expect(screen.getByText('Set New Goal')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. Reduce meat consumption')).toBeInTheDocument()
    expect(screen.getByLabelText(/Target Reduction/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument()
  })

  it('calls handler when submitting the form', () => {
    render(<GoalModal {...defaultProps} />)
    
    // Fill required input
    fireEvent.change(screen.getByLabelText('Goal Title'), { target: { value: 'Test' } })
    
    const form = screen.getByLabelText('Goal Title').closest('form')
    if (form) fireEvent.submit(form)
    
    expect(defaultProps.handleCreateGoal).toHaveBeenCalled()
  })

  it('does not render if showGoalModal is false', () => {
    render(<GoalModal {...defaultProps} showGoalModal={false} />)
    expect(screen.queryByText('Set New Goal')).not.toBeInTheDocument()
  })

  it('shows loading state when isSubmitting is true', () => {
    render(<GoalModal {...defaultProps} isSubmitting={true} />)
    const submitBtn = screen.getByRole('button', { name: /sync/i })
    expect(submitBtn).toBeDisabled()
  })
})
