"use client";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  ShoppingBag,
  BookOpen,
  Network,
  User,
  Sparkles,
  CheckCircle,
  CreditCard,
  Bell,
  LogOut,
  BarChart3,
  Boxes,
  Table,
  icons,
} from "lucide-react";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { url } from "inspector";
const data = [
  {
    _id: "69256a36812495b2266ce404",
    name: "products",
    displayName: "Products",
    description: "Product catalog management",
    icon: "shopping-cart",
    timestamps: true,
    softDelete: true,
    enableApi: true,
    version: 1,
    createdAt: "2025-11-25T08:35:02.327Z",
    updatedAt: "2025-11-25T08:35:02.327Z",
    __v: 0,
  },
];
// Menu items with collapsible sections
const menuItems = [
  {
    title: "Entity",
    icon: Table,
    url: "entities",
    items: data.map((item) => ({
      title: item.displayName,
      url: `entities/${item.name}`,
    })),
  },
  {
    title: "Models",
    icon: Network,
    url: "#",
  },
  {
    title: "Documentation",
    icon: BookOpen,
    url: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#",
  },
];

// Teams data
const teams = [
  { name: "Acme Inc", icon: ShoppingBag, shortcut: "⌘1" },
  { name: "Acme Corp.", icon: BarChart3, shortcut: "⌘2" },
  { name: "Evil Corp.", icon: Boxes, shortcut: "⌘3" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Platform: true,
  });
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  const isCollapsed = state === "collapsed";

  const ActiveIcon = activeTeam.icon;

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={activeTeam.name}
                >
                  <div className="flex flex-none size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <ActiveIcon className="size-4 flex-none" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Enterprise
                    </span>
                  </div>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isCollapsed ? "right" : "bottom"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Teams
                </DropdownMenuLabel>
                {teams.map((team) => {
                  const TeamIcon = team.icon;
                  return (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <TeamIcon className="size-4 flex-none" />
                      </div>
                      {team.name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {team.shortcut}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible
                    open={openSections[item.title]}
                    onOpenChange={() => toggleSection(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="w-full"
                        tooltip={item.title}
                      >
                        <ItemIcon className="size-4 flex-none" />
                        <span>{item.title}</span>
                        {openSections[item.title] ? (
                          <ChevronDown className="ml-auto size-4" />
                        ) : (
                          <ChevronRight className="ml-auto size-4" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <ItemIcon className="size-4 flex-none" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip="shadcn"
                >
                  <div className="flex flex-none size-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                    <User className="size-4 text-white flex-none" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">shadcn</span>
                    <span className="truncate text-xs text-muted-foreground">
                      m@example.com
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isCollapsed ? "right" : "bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                      <User className="size-4 text-white" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">shadcn</span>
                      <span className="truncate text-xs text-muted-foreground">
                        m@example.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <Sparkles className="size-4" />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <CheckCircle className="size-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <CreditCard className="size-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Bell className="size-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
