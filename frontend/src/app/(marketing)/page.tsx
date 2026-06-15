import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Showcases } from "@/components/marketing/Showcases";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTA } from "@/components/marketing/CTA";

export default function MarketingLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">energy_savings_leaf</span>
          <span className="font-headline-md font-bold text-on-surface tracking-tight">EcoTrack AI</span>
        </div>
        <nav className="hidden md:flex gap-8 font-label-md font-semibold text-on-surface-variant">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">Testimonials</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a>
        </nav>
      </header>

      <main className="flex-1">
        <Hero />
        <Features />
        <Showcases />
        <Testimonials />
        <CTA />
      </main>

      <footer className="py-8 text-center text-on-surface-variant text-sm border-t border-outline-variant/20">
        <p>© {new Date().getFullYear()} EcoTrack AI. Built for the Hackathon.</p>
      </footer>
    </div>
  );
}
