export default function HistoryPage() {
  return (
    <div className="px-4 md:px-12 max-w-container-max mx-auto w-full flex-1 flex flex-col gap-stack-lg pt-10">
      <div className="flex flex-col stack-sm">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Activity History</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Review your past sustainability activities and trends.</p>
      </div>
      <div className="liquid-glass-panel flex-1 rounded-[24px] p-8 min-h-[500px] flex items-center justify-center text-on-surface-variant font-body-lg">
        Activity History Timeline
      </div>
    </div>
  );
}
