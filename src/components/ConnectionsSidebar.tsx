'use client';

import { useConnections } from "@/lib/api/hooks";
import Link from "next/link";
import ViewBoundary from "./boundaries/ViewBoundary";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import { CircleAlert } from "lucide-react";

const ConnectionsGroupContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarGroupContent className="flex flex-col gap-2">
      <SidebarMenu>
        {children}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

const ConnectionsGroupContent = () => {
  const { data: connections } = useConnections({ suspense: true });

  return (
    <ConnectionsGroupContentWrapper>
      {connections?.map((connection) => (
        <SidebarMenuItem key={connection.connection_id}>
          <Link href={`/connections/${connection.connection_id}`}>
            <SidebarMenuButton tooltip={connection.name} className="data-[slot=sidebar-menu-button]:!p-1.5">
              <span>{connection.name}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </ConnectionsGroupContentWrapper>
  );
};

const ConnectionsGroupContentErrorFallback = () => {
  return (
    <ConnectionsGroupContentWrapper>
      <div className="flex flex-col items-center justify-center gap-2 my-4">
        <CircleAlert className="size-6 text-red-400" />
        <p className="text-red-400 text-center">Connections could not be loaded</p>
      </div>
    </ConnectionsGroupContentWrapper>
  );
}

const ConnectionsGroupContentFallback = () => {
  return (
    <ConnectionsGroupContentWrapper>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-8 bg-primary/10" />
      ))}
    </ConnectionsGroupContentWrapper>
  );
};

const ConnectionsSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <h1 className="text-xl font-semibold">TestackAI</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold mb-2"><h2>Connections</h2></SidebarGroupLabel>
          <ViewBoundary
            fallback={<ConnectionsGroupContentFallback />}
            errorFallback={<ConnectionsGroupContentErrorFallback />}
          >
            <ConnectionsGroupContent />
          </ViewBoundary>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ConnectionsSidebar;
