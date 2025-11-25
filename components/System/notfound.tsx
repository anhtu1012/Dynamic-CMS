import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="p-6 rounded-md border bg-white/60 dark:bg-slate-900/60 text-center">
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not find that page.
        </p>
        <div className="mt-4">
          <Link href="/" className="text-primary underline">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
