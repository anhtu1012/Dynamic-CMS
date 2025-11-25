import React from "react";

export default function Error({ reset }: { reset?: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="p-6 rounded-md border bg-white/60 dark:bg-slate-900/60">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. You can try again.
        </p>
        <div className="mt-4">
          <button
            onClick={() => (reset ? reset() : location.reload())}
            className="px-3 py-2 rounded bg-primary text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
