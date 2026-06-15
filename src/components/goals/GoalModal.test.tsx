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

  it('calls setNewGoalTitle on title change', () => {
    const setNewGoalTitle = vi.fn()
    render(<GoalModal {...defaultProps} setNewGoalTitle={setNewGoalTitle} />)
    fireEvent.change(screen.getByLabelText('Goal Title'), { target: { value: 'New Title' } })
    expect(setNewGoalTitle).toHaveBeenCalledWith('New Title')
  })

  it('calls setNewGoalTarget on target change', () => {
    const setNewGoalTarget = vi.fn()
    render(<GoalModal {...defaultProps} setNewGoalTarget={setNewGoalTarget} />)
    fireEvent.change(screen.getByLabelText(/Target Reduction/i), { target: { value: '25' } })
    expect(setNewGoalTarget).toHaveBeenCalledWith('25')
  })

  it('calls setNewGoalDuration on duration select change', () => {
    const setNewGoalDuration = vi.fn()
    render(<GoalModal {...defaultProps} setNewGoalDuration={setNewGoalDuration} />)
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '30' } })
    expect(setNewGoalDuration).toHaveBeenCalledWith('30')
  })

  it('calls setShowGoalModal(false) on Cancel or Close click', () => {
    const setShowGoalModal = vi.fn()
    render(<GoalModal {...defaultProps} setShowGoalModal={setShowGoalModal} />)
    
    // Click Cancel
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(setShowGoalModal).toHaveBeenCalledWith(false)
    
    // Click Close
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(setShowGoalModal).toHaveBeenCalledWith(false)
  })
})
