export function Features() {
  const features = [
    {
      icon: "center_focus_strong",
      title: "Smart Receipt Scanning",
      desc: "Instantly parse emissions from any receipt using Gemini Vision. No manual entry required.",
      colSpan: "md:col-span-2",
    },
    {
      icon: "psychology",
      title: "Proactive AI Coach",
      desc: "Receive actionable, hyper-personalized sustainability advice in real-time.",
      colSpan: "md:col-span-1",
    },
    {
      icon: "monitoring",
      title: "Predictive Analytics",
      desc: "Identify emission trends before they happen with advanced data visualization.",
      colSpan: "md:col-span-1",
    },
    {
      icon: "military_tech",
      title: "Gamified Streaks",
      desc: "Unlock badges and maintain streaks to stay motivated on your eco-journey.",
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 bg-surface-container-lowest/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display-md md:text-5xl font-bold text-on-surface mb-4">Enterprise-Grade Tooling.</h2>
          <p className="text-on-surface-variant text-lg">Built for speed, accuracy, and real-world impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`liquid-glass-panel p-8 rounded-3xl border border-outline-variant/20 hover:border-primary/50 transition-colors duration-500 group ${f.colSpan}`}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-[28px]">{f.icon}</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-3">{f.title}</h3>
              <p className="text-on-surface-variant text-body-lg leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
