import { useState, useRef, useCallback } from "react";
import { saveReceiptData } from "@/features/scanner/services/receipt-processing.service";
import type { ScanResult } from "@/types";

export function useReceiptScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanReceipt = useCallback(async (base64Data: string) => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data })
      });

      const json = await response.json();
      
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to scan receipt');
      }

      setScanResult(json.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during scanning.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (JPEG, PNG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setScanResult(null);
      setError(null);
      
      await scanReceipt(base64);
    };
    reader.readAsDataURL(file);
  }, [scanReceipt]);

  const handleSave = useCallback(async () => {
    if (!scanResult) return;
    
    setIsSaving(true);
    setError(null);

    const res = await saveReceiptData(scanResult);
    
    if (!res.success) {
      setError(res.error || 'Failed to save receipt to dashboard.');
    } else {
      alert("Receipt saved successfully! Your dashboard has been updated.");
      // Reset
      setImagePreview(null);
      setScanResult(null);
    }
    
    setIsSaving(false);
  }, [scanResult]);

  return {
    imagePreview,
    isScanning,
    isSaving,
    scanResult,
    error,
    fileInputRef,
    handleImageUpload,
    handleSave
  };
}
