export default function CommunityPage() {
  const feed = [
    { id: 1, user: "Sarah J.", avatar: "eco", action: "logged a 15km bike ride", impact: "-2.8 kg CO2", time: "2 hours ago", likes: 12 },
    { id: 2, user: "Mike T.", avatar: "bolt", action: "switched to renewable energy provider", impact: "-45 kg CO2/mo", time: "5 hours ago", likes: 34 },
    { id: 3, user: "Emma W.", avatar: "restaurant", action: "went vegetarian for a week", impact: "-15 kg CO2", time: "1 day ago", likes: 28 },
    { id: 4, user: "David L.", avatar: "directions_bus", action: "took public transit instead of driving", impact: "-4.2 kg CO2", time: "2 days ago", likes: 8 },
  ];

  const leaderboard = [
    { rank: 1, user: "EcoQueen", points: 2450 },
    { rank: 2, user: "GreenGiant", points: 2120 },
    { rank: 3, user: "You", points: 1850 },
    { rank: 4, user: "EarthSaver", points: 1640 },
    { rank: 5, user: "PlanetHero", points: 1420 },
  ];

  return (
    <div className="px-4 md:px-12 max-w-6xl mx-auto w-full flex-1 flex flex-col gap-8 pt-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Community</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Connect with others and share your sustainability journey.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Feed */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Post Box */}
          <div className="liquid-glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                Y
              </div>
              <textarea 
                placeholder="Share your latest eco-win..." 
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl p-3 focus:outline-none focus:border-primary min-h-[80px] resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:opacity-90">Post</button>
            </div>
          </div>

          {/* Feed Items */}
          <div className="flex flex-col gap-4">
            {feed.map(item => (
              <div key={item.id} className="liquid-glass-panel rounded-2xl p-6 flex flex-col gap-3 transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined">{item.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface">{item.user}</h3>
                      <p className="text-xs text-on-surface-variant">{item.time}</p>
                    </div>
                  </div>
                </div>
                <p className="text-on-surface mt-2">
                  Just {item.action}! 🌍
                </p>
                <div className="inline-flex mt-1">
                   <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-sm rounded-full">
                     {item.impact}
                   </span>
                </div>
                <div className="flex items-center gap-4 mt-2 pt-4 border-t border-outline-variant/20">
                  <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                    <span className="text-sm font-semibold">{item.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    <span className="text-sm font-semibold">Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="liquid-glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">social_leaderboard</span>
              Weekly Top 5
            </h2>
            <div className="flex flex-col gap-3">
              {leaderboard.map((user, idx) => (
                <div key={user.rank} className={`flex items-center justify-between p-3 rounded-xl ${user.user === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-5 ${idx < 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                      #{user.rank}
                    </span>
                    <span className={`font-semibold ${user.user === 'You' ? 'text-primary' : 'text-on-surface'}`}>
                      {user.user}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-tertiary">{user.points} pt</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
