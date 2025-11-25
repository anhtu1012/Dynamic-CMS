import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white/50 dark:bg-slate-900/60">
      <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} — Custom Footer
      </div>
    </footer>
  );
}
