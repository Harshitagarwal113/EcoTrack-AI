/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ScannerPage from './page'
import * as useReceiptScannerHook from '@/features/scanner/hooks/use-receipt-scanner.hook'

vi.mock('@/features/scanner/hooks/use-receipt-scanner.hook', () => ({
  useReceiptScanner: vi.fn()
}))

describe('ScannerPage', () => {
  const mockProcessReceipt = vi.fn()
  const mockReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useReceiptScannerHook.useReceiptScanner as any).mockReturnValue({
      isScanning: false,
      result: null,
      error: null,
      processReceipt: mockProcessReceipt,
      reset: mockReset
    })
  })

  it('renders the scanner page interface', () => {
    render(<ScannerPage />)
    expect(screen.getByText('Receipt Scanner')).toBeInTheDocument()
    expect(screen.getByText(/Upload electricity bills, fuel receipts/i)).toBeInTheDocument()
  })

  it('shows error state when hook returns an error', () => {
    ;(useReceiptScannerHook.useReceiptScanner as any).mockReturnValue({
      isScanning: false,
      result: null,
      error: 'Failed to parse image',
      processReceipt: mockProcessReceipt,
      reset: mockReset
    })
    
    render(<ScannerPage />)
    expect(screen.getByText('Failed to parse image')).toBeInTheDocument()
  })

  it('shows loading state when isScanning is true', () => {
    ;(useReceiptScannerHook.useReceiptScanner as any).mockReturnValue({
      isScanning: true,
      result: null,
      error: null,
      processReceipt: mockProcessReceipt,
      reset: mockReset
    })
    
    render(<ScannerPage />)
    expect(screen.getByText('Gemini Vision is analyzing your receipt...')).toBeInTheDocument()
  })

  it('shows result state when processing succeeds', () => {
    ;(useReceiptScannerHook.useReceiptScanner as any).mockReturnValue({
      isScanning: false,
      scanResult: {
        merchant_name: 'SuperMart',
        total_amount: 50.00,
        receipt_category: 'shopping',
        carbon_estimate_kg: 25.5,
        recommendations: ['Bring your own bag', 'Buy local produce']
      },
      error: null,
      processReceipt: mockProcessReceipt,
      reset: mockReset
    })
    
    render(<ScannerPage />)
    expect(screen.getByText('SuperMart')).toBeInTheDocument()
    expect(screen.getByText('$50')).toBeInTheDocument()
    expect(screen.getByText('25.5 kg')).toBeInTheDocument()
    expect(screen.getByText('Bring your own bag')).toBeInTheDocument()
    expect(screen.getByText('Buy local produce')).toBeInTheDocument()
  })

  it('allows uploading a different receipt when preview exists', () => {
    const mockClick = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
    ;(useReceiptScannerHook.useReceiptScanner as any).mockReturnValue({
      imagePreview: 'http://example.com/receipt.jpg',
      isScanning: false,
      isSaving: false,
      scanResult: null,
      error: null,
      fileInputRef: { current: null },
      handleImageUpload: vi.fn(),
      handleSave: vi.fn()
    })

    render(<ScannerPage />)
    const button = screen.getByText('Upload Different Receipt')
    fireEvent.click(button)
    expect(mockClick).toHaveBeenCalled()
    mockClick.mockRestore()
  })
})
