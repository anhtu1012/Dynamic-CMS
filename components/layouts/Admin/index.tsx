import { cookies } from "next/headers";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import ThemeSwitchIcon from "@/components/theme-switch-icon";

export async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = (cookieStore.get("sidebar_state")?.value ?? "true") === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex w-screen h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4 justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitchIcon />
            </div>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
