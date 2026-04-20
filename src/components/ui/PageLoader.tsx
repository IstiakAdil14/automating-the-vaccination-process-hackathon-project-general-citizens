export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-subtle)]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--accent)] animate-spin" />
        </div>
        <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
