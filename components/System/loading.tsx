import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
