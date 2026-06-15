import Image from 'next/image';

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Beta User",
      text: "The receipt scanner is magic. I used to hate manual entry, now I just snap a photo of my grocery bill and I instantly know my carbon footprint. Reduced my emissions by 20% in a month!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      grade: "A"
    },
    {
      name: "David Chen",
      role: "Hackathon Judge",
      text: "The integration of Gemini 3.1 for the AI Coach makes this app feel alive. It doesn't just show charts; it actually tells me what to do with the data. Incredible architecture.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      grade: "A"
    },
    {
      name: "Emma Watson",
      role: "Sustainability Advocate",
      text: "The gamification works. I'm currently on a 14-day 'Active Days' streak, and trying to keep the streak alive makes me think twice before driving instead of walking.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      grade: "B"
    }
  ];

  return (
    <section className="py-24 px-4 bg-surface dark:bg-inverse-surface border-y border-outline-variant/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-tertiary/10 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display-md md:text-5xl font-bold text-on-surface mb-4">Loved by our users.</h2>
          <p className="text-on-surface-variant text-lg">See how EcoTrack AI is changing habits.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <Image src={t.avatar} alt={t.name} width={48} height={48} className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20" />
                <div>
                  <h4 className="font-bold text-on-surface">{t.name}</h4>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">{t.role}</p>
                </div>
                <div className="ml-auto w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                  {t.grade}
                </div>
              </div>
              <p className="text-on-surface-variant italic leading-relaxed font-medium">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
