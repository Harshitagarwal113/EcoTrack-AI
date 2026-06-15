"use client";

import { useCarbonTracker } from "@/features/carbon/hooks/use-carbon-tracker.hook";

export default function TrackerPage() {
  const {
    factors,
    formData,
    setFormData,
    isSubmitting,
    submitSuccess,
    currentTotal,
    currentGrade,
    handleNumChange,
    handleSave
  } = useCarbonTracker();

  if (!factors) {
    return <div className="p-12 text-center text-on-surface-variant font-body-lg">Loading Tracker...</div>;
  }

  return (
    <div className="px-4 md:px-12 max-w-container-max mx-auto w-full flex-1 flex flex-col gap-stack-lg pt-10">
      <div className="flex flex-col stack-sm">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Carbon Tracker</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Log your daily activities to calculate and track your carbon footprint.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Form Inputs */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Transportation */}
          <div className="liquid-glass-panel rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">directions_car</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Transportation <span className="text-body-md text-on-surface-variant font-normal">(km driven today)</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['car', 'bus', 'train', 'metro', 'bike', 'walking'].map((type) => (
                <div key={type} className="flex flex-col">
                  <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 capitalize">{type}</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="0"
                    className="bg-white/50 border border-outline-variant/40 rounded-xl px-4 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onChange={(e) => handleNumChange("transportation", type, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div className="liquid-glass-panel rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">bolt</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Energy <span className="text-body-md text-on-surface-variant font-normal">(usage today)</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">Electricity (kWh)</label>
                <input 
                  type="number" min="0" placeholder="0"
                  className="bg-white/50 border border-outline-variant/40 rounded-xl px-4 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onChange={(e) => handleNumChange("energy", "electricity", e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">AC Usage (Hours)</label>
                <input 
                  type="number" min="0" placeholder="0"
                  className="bg-white/50 border border-outline-variant/40 rounded-xl px-4 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onChange={(e) => handleNumChange("energy", "acUsage", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Food */}
          <div className="liquid-glass-panel rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">restaurant</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Diet <span className="text-body-md text-on-surface-variant font-normal">(primary diet today)</span></h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {(["Vegetarian", "Mixed Diet", "Non-Vegetarian"] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="food" 
                    value={type}
                    checked={formData.food === type}
                    onChange={() => setFormData(prev => ({ ...prev, food: type }))}
                    className="w-4 h-4 text-primary bg-white border-outline-variant/40 focus:ring-primary/20"
                  />
                  <span className="font-body-md text-on-surface">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Shopping */}
          <div className="liquid-glass-panel rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">shopping_bag</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Shopping <span className="text-body-md text-on-surface-variant font-normal">(purchases today in $)</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['electronics', 'clothing', 'generalPurchases'].map((type) => (
                <div key={type} className="flex flex-col">
                  <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input 
                    type="number" min="0" placeholder="0"
                    className="bg-white/50 border border-outline-variant/40 rounded-xl px-4 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onChange={(e) => handleNumChange("shopping", type, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Summary Panel */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="ai-glass-glass rounded-[24px] p-8 sticky top-24 flex flex-col gap-6 shadow-[0_20px_40px_rgba(16,185,129,0.05)]">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Your Footprint</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Estimated daily total</p>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-[64px] font-bold gradient-text leading-none">{currentTotal.toFixed(1)}</span>
              <span className="font-body-lg text-body-lg text-on-surface-variant font-medium">kg CO2</span>
            </div>

            <div className="bg-white/60 rounded-xl p-4 border border-white/50 flex items-center justify-between">
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">Daily Grade</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Based on {currentTotal.toFixed(1)}kg</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md font-bold shadow-sm">
                {currentGrade}
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-label-md text-label-md font-semibold shadow-md hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)" }}
            >
              {isSubmitting ? "Saving Log..." : submitSuccess ? "Saved Successfully!" : "Log Activity"}
              {!isSubmitting && !submitSuccess && <span className="material-symbols-outlined">cloud_upload</span>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
