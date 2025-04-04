'use client';

import { useConnections } from "@/lib/api/hooks";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent } from "./ui/sidebar";
import Link from "next/link";

const ConnectionsSidebar = () => {
  const { data: connections } = useConnections();

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
                <h1 className="text-base font-semibold">Integrations</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {connections?.map((connection) => (
                <SidebarMenuItem key={connection.connection_id}>
                  <Link href={`/${connection.connection_id}`}>
                    <SidebarMenuButton tooltip={connection.name}>
                      <span>{connection.name}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ConnectionsSidebar;
