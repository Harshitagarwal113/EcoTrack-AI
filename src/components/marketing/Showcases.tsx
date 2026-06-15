export function Showcases() {
  return (
    <section className="py-32 px-4 overflow-hidden relative">
      <div className="max-w-6xl mx-auto space-y-32">
        
        {/* Showcase 1: AI Coach */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm font-bold border border-tertiary/20">
              <span className="material-symbols-outlined text-[16px]">forum</span>
              Context-Aware Coaching
            </div>
            <h2 className="font-display-md md:text-5xl font-bold text-on-surface leading-tight">
              An AI that actually knows you.
            </h2>
            <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed">
              Unlike generic calculators, our Gemini-powered Coach reads your live database metrics. It knows your streaks, your weekly carbon output, and your exact dietary inputs to give advice that matters.
            </p>
          </div>
          
          <div className="flex-1 w-full">
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-primary/30 to-tertiary/30 shadow-2xl shadow-primary/10">
              <div className="bg-surface dark:bg-inverse-surface rounded-[22px] p-6 h-full border border-white/10">
                <div className="flex gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-tl-none border border-outline-variant/20 shadow-sm text-on-surface">
                    <p className="font-medium text-sm">I noticed your transport emissions spiked 15% this week. Given your "Eco Warrior" streak, I recommend swapping your Friday commute for the Metro to stay under your 10kg limit.</p>
                  </div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-tertiary/20 flex-shrink-0 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-md">
                    <p className="font-medium text-sm">Good call. Set that as my active goal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase 2: Scanner */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 text-error font-label-sm font-bold border border-error/20">
              <span className="material-symbols-outlined text-[16px]">document_scanner</span>
              Frictionless Entry
            </div>
            <h2 className="font-display-md md:text-5xl font-bold text-on-surface leading-tight">
              Scan it and forget it.
            </h2>
            <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed">
              Manually logging purchases is dead. Snap a photo of any receipt, and EcoTrack AI automatically categorizes the vendor, calculates the USD-to-Carbon ratio, and logs it into your monthly footprint.
            </p>
          </div>
          
          <div className="flex-1 w-full">
            <div className="relative p-8 rounded-3xl bg-surface-container border border-outline-variant/30 flex justify-center items-center overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <div className="relative z-10 w-64 bg-white dark:bg-[#1a1c19] rounded-xl shadow-2xl p-6 border border-outline-variant/20 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                  <span className="font-bold font-mono">GROCERY MART</span>
                  <span className="text-xs text-on-surface-variant">12:42 PM</span>
                </div>
                <div className="space-y-2 font-mono text-sm mb-6">
                  <div className="flex justify-between"><span>Produce</span><span>$14.50</span></div>
                  <div className="flex justify-between"><span>Dairy</span><span>$8.20</span></div>
                  <div className="flex justify-between font-bold border-t border-outline-variant/20 pt-2 mt-2"><span>TOTAL</span><span>$22.70</span></div>
                </div>
                <div className="bg-primary/10 text-primary p-3 rounded-lg text-center font-bold text-sm animate-pulse border border-primary/20">
                  + 11.3 kg CO2 Logged
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
