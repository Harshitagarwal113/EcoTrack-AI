"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="max-w-5xl mx-auto text-center z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span className="font-label-md font-semibold text-sm">Powered by Google Gemini 3.1 Flash</span>
        </div>
        
        <h1 className="font-display-lg-mobile md:text-[72px] md:leading-[1.1] tracking-tighter font-bold text-on-surface mb-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150">
          Sustainable Intelligence. <br className="hidden md:block" />
          <span className="gradient-text">Zero Compromise.</span>
        </h1>
        
        <p className="font-body-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
          EcoTrack AI seamlessly analyzes your lifestyle, scans receipts, and provides personalized AI coaching to aggressively reduce your carbon footprint.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500">
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-label-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
          >
            Enter Dashboard
          </Link>
          <a 
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface dark:bg-inverse-surface text-on-surface border border-outline-variant/30 hover:bg-surface-variant/50 transition-colors font-label-lg font-bold"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}
