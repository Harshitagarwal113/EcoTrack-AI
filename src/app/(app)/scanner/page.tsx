"use client";

import { useReceiptScanner } from "@/features/scanner/hooks/use-receipt-scanner.hook";

export default function ScannerPage() {
  const {
    imagePreview,
    isScanning,
    isSaving,
    scanResult,
    error,
    fileInputRef,
    handleImageUpload,
    handleSave
  } = useReceiptScanner();

  return (
    <div className="px-4 md:px-12 max-w-container-max mx-auto w-full flex-1 flex flex-col gap-stack-lg pt-10 pb-8">
      <div className="flex flex-col stack-sm">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Receipt Scanner</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Upload electricity bills, fuel receipts, or shopping invoices to estimate your carbon impact.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter">
        
        {/* Upload Area */}
        <section className="flex-1 liquid-glass-panel rounded-[24px] p-8 flex flex-col items-center justify-center min-h-[400px] relative border-2 border-dashed border-white/40 hover:border-primary/50 transition-colors">
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
          />
          
          {imagePreview ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <img src={imagePreview} alt="Receipt preview" className="max-h-64 object-contain rounded-xl shadow-lg mb-6" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/50 text-on-surface-variant font-label-md px-6 py-2 rounded-full hover:bg-white/80 transition-colors"
                disabled={isScanning || isSaving}
              >
                Upload Different Receipt
              </button>
            </div>
          ) : (
            <div className="text-center cursor-pointer flex flex-col items-center" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 shadow-inner">
                <span className="material-symbols-outlined text-[40px]">document_scanner</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Click to Upload</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                Supported formats: JPEG, PNG. Gemini Vision will automatically extract the details.
              </p>
            </div>
          )}
        </section>

        {/* Results Area */}
        <section className="flex-1 ai-glass-glass rounded-[24px] p-8 shadow-[0_20px_40px_rgba(16,185,129,0.05)] flex flex-col">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Analysis Results</h3>

          {isScanning && (
            <div className="flex-1 flex flex-col items-center justify-center text-primary animate-pulse space-y-4">
              <span className="material-symbols-outlined text-[48px] animate-spin">eco</span>
              <p className="font-label-md">Gemini Vision is analyzing your receipt...</p>
            </div>
          )}

          {error && (
            <div className="bg-error/10 text-error p-4 rounded-xl font-body-md border border-error/20 flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5">error</span>
              <p>{error}</p>
            </div>
          )}

          {!isScanning && !scanResult && !error && (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant/60 font-body-md text-center">
              Upload a receipt to see the extracted data and carbon estimation here.
            </div>
          )}

          {scanResult && !isScanning && (
            <div className="flex-1 flex flex-col space-y-6">
              <div className="bg-white/60 rounded-xl p-6 border border-white/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-label-sm text-on-surface-variant">Merchant</p>
                    <p className="font-headline-sm text-on-surface">{scanResult.merchant_name}</p>
                  </div>
                  <div>
                    <p className="font-label-sm text-on-surface-variant">Total Amount</p>
                    <p className="font-headline-sm text-on-surface">${scanResult.total_amount}</p>
                  </div>
                  <div>
                    <p className="font-label-sm text-on-surface-variant">Category</p>
                    <p className="font-label-md text-primary capitalize bg-primary/10 inline-block px-2 py-0.5 rounded-md mt-1">{scanResult.receipt_category}</p>
                  </div>
                  <div>
                    <p className="font-label-sm text-on-surface-variant">Carbon Estimate</p>
                    <div className="flex items-baseline gap-1 mt-1 text-error">
                      <span className="material-symbols-outlined text-[18px]">co2</span>
                      <p className="font-headline-sm">{scanResult.carbon_estimate_kg} kg</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                  AI Recommendations
                </h4>
                <ul className="space-y-3">
                  {scanResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/40 p-3 rounded-lg border border-white/30">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">lightbulb</span>
                      <span className="font-body-md text-on-surface">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-primary text-white font-label-md py-3 rounded-full shadow-md shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Save to Dashboard
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
