import Link from "next/link";

export function CTA() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Heavy Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-container-lowest -z-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-display-lg-mobile md:text-6xl font-bold text-on-surface mb-6 tracking-tight">
          Ready to track your impact?
        </h2>
        <p className="text-on-surface-variant text-xl mb-10 max-w-2xl mx-auto">
          Join the movement. Start scanning receipts, chatting with your AI coach, and reducing your carbon footprint today.
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-on-surface text-surface dark:bg-primary dark:text-on-primary font-headline-sm font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
        >
          Launch the App
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        
        <div className="mt-10 flex items-center justify-center gap-6 text-sm font-semibold text-on-surface-variant">
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> No credit card required</div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> Open Source</div>
        </div>
      </div>
    </section>
  );
}
