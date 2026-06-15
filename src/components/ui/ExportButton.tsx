"use client";

import { useState } from "react";

interface ExportButtonProps {
  targetId: string;
  filename: string;
  label?: string;
  className?: string;
}

export function ExportButton({ targetId, filename, label = "Export PDF", className = "" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      console.error(`Export target element with id '${targetId}' not found.`);
      return;
    }

    setIsExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin:       10,
        filename:     filename,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport}
      disabled={isExporting}
      className={`py-2 px-4 rounded-xl bg-white text-primary border border-primary/20 font-label-md font-semibold shadow-sm hover:bg-primary/5 flex items-center gap-2 transition-colors disabled:opacity-50 ${className}`}
    >
      <span className="material-symbols-outlined text-[18px]">download</span>
      {isExporting ? "Exporting..." : label}
    </button>
  );
}
