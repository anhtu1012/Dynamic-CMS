'use client';

import CustomLayout from "@/components/layouts/Custom";
import { createContext, useContext, useState } from "react";

type SectionType = 'hero' | 'features' | 'fieldTypes' | 'howItWorks' | 'cta';

interface NavigationContextType {
  currentSection: SectionType;
  setCurrentSection: (section: SectionType) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

export default function CustomRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSection, setCurrentSection] = useState<SectionType>('hero');

  return (
    <NavigationContext.Provider value={{ currentSection, setCurrentSection }}>
      <CustomLayout>
        {children}
      </CustomLayout>
    </NavigationContext.Provider>
  );
}
