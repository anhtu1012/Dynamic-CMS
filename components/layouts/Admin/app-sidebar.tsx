/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Bell,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Database,
  LogOut,
  Network,
  Settings,
  Sparkles,
  Table,
  User,
} from "lucide-react";
import { useState } from "react";

import { useEntities } from "@/app/admin/entities/_hooks/useEntities";
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
import { DatabaseSchema } from "@/lib/schemas/databases/databases.schema";
import {
  selectDatabase,
  setSelectedDatabase,
} from "@/redux/store/slices/databaseSlice";
import { selectAuthLogin } from "@/redux/store/slices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSidebarHandle } from "./useSidebarHandle";
import { EntitiesListResponse } from "@/lib/schemas/entity/entity.response";

export function AppSidebar() {
  const { state } = useSidebar();
  const dispatch = useDispatch();
  const { selectedDatabase } = useSelector(selectDatabase);
  const { userProfile } = useSelector(selectAuthLogin);
  const { data: databasesData } = useSidebarHandle();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Platform: true,
  });

  const handleDatabaseChange = (database: DatabaseSchema) => {
    dispatch(setSelectedDatabase(database));
  };

  const isCollapsed = state === "collapsed";
  const { data: entitiesResponse } = useEntities(selectedDatabase?.id);
  const menuItems = [
    {
      title: "Entity",
      icon: Table,
      url: "entities",
      items: [
        { title: "Create New Entity", url: "admin/entities" },
        ...((entitiesResponse as EntitiesListResponse)?.data ?? []).map(
          (item) => ({
            title: item.displayName,
            url: `entities/${item.name}`,
          })
        ),
      ],
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

  const ActiveIcon = Database;

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
                  tooltip={selectedDatabase?.displayName}
                >
                  <div className="flex flex-none size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <ActiveIcon className="size-4 flex-none" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {selectedDatabase?.displayName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {selectedDatabase?.name}
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
                  Database
                </DropdownMenuLabel>
                {databasesData?.data.map((team) => {
                  return (
                    <DropdownMenuItem
                      key={team.id}
                      onClick={() => handleDatabaseChange(team as any)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        {team.icon}
                      </div>
                      {team.displayName}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {team.name}
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
                    <span className="truncate font-semibold">
                      {userProfile.firstName + " " + userProfile.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userProfile.email}
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
                      <span className="truncate font-semibold">
                        {" "}
                        {userProfile.firstName + " " + userProfile.lastName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userProfile.email}
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
