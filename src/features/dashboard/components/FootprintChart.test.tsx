/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FootprintChart } from './FootprintChart'

vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts') as any
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />
  }
})

describe('FootprintChart', () => {
  const mockData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 15 },
  ]

  it('renders the chart container and elements', async () => {
    render(<FootprintChart data={mockData} />)
    expect(await screen.findByTestId('responsive-container', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(await screen.findByTestId('line-chart', {}, { timeout: 3000 })).toBeInTheDocument()
  })

  it('renders empty state if no data is provided', () => {
    render(<FootprintChart data={[]} />)
    expect(screen.getByText(/No footprint data available/i)).toBeInTheDocument()
  })
})
