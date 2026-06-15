import { SeedButton } from "@/features/settings/components/SeedButton";

export default function SettingsPage() {
  return (
    <div className="px-4 md:px-12 max-w-4xl mx-auto w-full flex-1 flex flex-col gap-8 pt-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Settings</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your account preferences and application settings.</p>
      </div>
      
      <div className="liquid-glass-panel rounded-[24px] p-8 flex flex-col gap-10 text-on-surface">
        
        {/* Profile Section */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Profile Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant">Full Name</label>
              <input type="text" defaultValue="Eco Warrior" className="px-4 py-3 rounded-xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant">Email Address</label>
              <input type="email" defaultValue="warrior@ecotrack.ai" readOnly className="px-4 py-3 rounded-xl bg-surface-container/50 border border-outline-variant/50 text-on-surface-variant opacity-70 cursor-not-allowed outline-none" />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            Preferences
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary/30 transition-colors">
              <div className="flex flex-col">
                <span className="font-semibold">Push Notifications</span>
                <span className="text-sm text-on-surface-variant">Receive alerts for goals and streaks</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary/30 transition-colors">
              <div className="flex flex-col">
                <span className="font-semibold">Weekly Reports</span>
                <span className="text-sm text-on-surface-variant">Detailed email summary of your footprint</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
             <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
               Save Preferences
             </button>
          </div>
        </section>

        {/* Hackathon Zone */}
        <section className="mt-6 pt-10 border-t border-error/20">
          <SeedButton />
        </section>
      </div>
    </div>
  );
}
