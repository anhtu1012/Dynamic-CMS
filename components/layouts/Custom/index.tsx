'use client';

import React from "react";

interface CustomLayoutProps {
  children: React.ReactNode;
}

export default function CustomLayout({
  children,
}: CustomLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      {children}
    </div>
  );
}
