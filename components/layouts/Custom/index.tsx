import React from "react";
import Header from "./header";
import Footer from "./footer";

export default function CustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
