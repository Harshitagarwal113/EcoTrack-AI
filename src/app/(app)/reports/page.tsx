"use client";

import { useState, useRef } from "react";
import { getReportData } from "@/features/analytics/services/analytics-report.service";
import { useCompletion } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { FootprintChart } from "@/features/dashboard/components/FootprintChart";

interface ReportGoal {
  title: string;
  target_reduction: number;
  current_progress: number;
  status: string;
}

interface ReportData {
  timeframe: 'weekly' | 'monthly';
  currentFootprint: number;
  trend: number;
  grade: string;
  carbonSaved: number;
  goalProgress: number;
  goals: ReportGoal[];
  chartData: { date: string; emissions: number }[];
}

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/report",
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    const data = await getReportData(timeframe);
    if (data) {
      setReportData(data);
      await complete("", { body: { data } });
    }
    setIsGenerating(false);
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    // Dynamically import html2pdf so it only runs on the client
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin:       10,
      filename:     `ecotrack-${timeframe}-report.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(reportRef.current).save();
  };

  return (
    <div className="px-4 md:px-12 max-w-container-max mx-auto w-full flex-1 flex flex-col gap-stack-lg pt-10 pb-20">
      <div className="flex flex-col stack-sm">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Sustainability Reports</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Generate personalized insights and export your carbon footprint data.</p>
      </div>

      <div className="liquid-glass-panel rounded-[24px] p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 bg-white/50 p-1 rounded-xl">
          <button 
            className={`px-6 py-2 rounded-lg font-label-md transition-all ${timeframe === 'weekly' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-white/50'}`}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-label-md transition-all ${timeframe === 'monthly' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-white/50'}`}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || isLoading}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-label-md font-semibold shadow-md hover:opacity-90 disabled:opacity-50"
          >
            {isGenerating || isLoading ? "Generating..." : "Generate Report"}
          </button>
          
          {reportData && !isLoading && (
            <button 
              onClick={downloadPDF}
              className="py-3 px-6 rounded-xl bg-white text-primary border border-primary/20 font-label-md font-semibold shadow-sm hover:bg-primary/5 flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Download PDF
            </button>
          )}
        </div>
      </div>

      {reportData && (
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-outline-variant/30 mb-12">
          {/* Printable Area */}
          <div ref={reportRef} className="p-4 bg-white text-on-surface flex flex-col gap-8 min-h-[800px]">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-6">
              <div>
                <h1 className="font-display-lg text-[32px] text-primary tracking-tight">EcoTrack AI</h1>
                <p className="font-body-md text-on-surface-variant capitalize mt-1">{timeframe} Sustainability Report</p>
              </div>
              <div className="text-right">
                <p className="font-label-md text-on-surface-variant">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-surface-container rounded-2xl">
                <p className="font-label-sm text-on-surface-variant mb-1">Total Footprint</p>
                <div className="flex items-baseline gap-1">
                  <p className="font-headline-md font-bold text-primary">{reportData.currentFootprint}</p>
                  <span className="text-sm">kg</span>
                </div>
              </div>
              <div className="p-5 bg-surface-container rounded-2xl">
                <p className="font-label-sm text-on-surface-variant mb-1">Trend</p>
                <p className={`font-headline-md font-bold ${reportData.trend > 0 ? 'text-error' : 'text-primary'}`}>
                  {reportData.trend > 0 ? '+' : ''}{reportData.trend}%
                </p>
              </div>
              <div className="p-5 bg-surface-container rounded-2xl">
                <p className="font-label-sm text-on-surface-variant mb-1">Current Grade</p>
                <p className="font-headline-md font-bold text-primary">{reportData.grade}</p>
              </div>
              <div className="p-5 bg-surface-container rounded-2xl">
                <p className="font-label-sm text-on-surface-variant mb-1">Goal Progress</p>
                <p className="font-headline-md font-bold text-primary">{reportData.goalProgress}%</p>
              </div>
            </div>

            {/* Analytics Chart */}
            <div className="mt-8 mb-6 bg-surface-container/30 p-6 rounded-2xl border border-outline-variant/20">
              <h3 className="font-headline-md text-on-surface mb-4">Emissions Trend</h3>
              <FootprintChart data={(reportData.chartData || []).map(item => ({ name: item.date, value: item.emissions }))} />
            </div>

            {/* Goals Progress Details */}
            {reportData.goals && reportData.goals.length > 0 && (
              <div className="mt-2 mb-6">
                <h3 className="font-headline-md text-on-surface mb-4">Active Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.goals.map((goal: ReportGoal, i: number) => {
                    const pct = Math.min(100, Math.round((goal.current_progress / goal.target_reduction) * 100));
                    return (
                      <div key={i} className="p-5 bg-surface-container rounded-2xl">
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-label-md text-on-surface font-semibold">{goal.title}</p>
                          <p className="font-label-sm text-primary font-bold">{pct}%</p>
                        </div>
                        <div className="h-2.5 w-full bg-surface-variant/80 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* AI Insights & Recommendations */}
            <div className="flex-1 mt-4">
              <div className="prose prose-green max-w-none prose-headings:font-headline-md prose-headings:text-primary prose-p:font-body-md prose-p:text-on-surface prose-li:font-body-md prose-li:text-on-surface">
                {completion ? (
                  <ReactMarkdown>{completion}</ReactMarkdown>
                ) : (
                  <div className="animate-pulse flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <div className="h-6 bg-surface-container rounded w-1/3"></div>
                      <div className="h-4 bg-surface-container rounded w-full"></div>
                      <div className="h-4 bg-surface-container rounded w-5/6"></div>
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                      <div className="h-6 bg-surface-container rounded w-1/4"></div>
                      <div className="h-4 bg-surface-container rounded w-4/6"></div>
                      <div className="h-4 bg-surface-container rounded w-3/4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-outline-variant/30 pt-6 text-center mt-auto">
              <p className="font-label-sm text-on-surface-variant">Generated by EcoTrack AI</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
