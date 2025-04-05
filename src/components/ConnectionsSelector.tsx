'use client';

import { useConnections } from "@/lib/api/hooks";
import Link from "next/link";
import ViewBoundary from "./boundaries/ViewBoundary";
import { Skeleton } from "./ui/skeleton";
import { CircleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const ConnectionsContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col gap-2">
      {children}
    </section>
  );
};

const ConnectionsContent = () => {
  const { data: connections } = useConnections({ suspense: true });

  return (
    <ConnectionsContentWrapper>
      {connections?.map((connection) => (
        <Link key={connection.connection_id} href={`/connections/${connection.connection_id}`}>
          <Button variant="ghost" className="w-full justify-start">
            {connection.name}
          </Button>
        </Link>
      ))}
    </ConnectionsContentWrapper>
  );
};

const ConnectionsContentErrorFallback = () => {
  return (
    <ConnectionsContentWrapper>
      <div className="flex flex-col items-center justify-center gap-2 my-4">
        <CircleAlert className="size-6 text-red-400" />
        <p className="text-red-400 text-center">Connections could not be loaded</p>
      </div>
    </ConnectionsContentWrapper>
  );
}

const ConnectionsContentFallback = () => {
  return (
    <ConnectionsContentWrapper>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-8 bg-primary/10" />
      ))}
    </ConnectionsContentWrapper>
  );
};

const ConnectionsSelector = ({ className }: { className?: string }) => {
  return (
    <section className={cn("py-4 px-2", className)}>
      <header className="text-base font-semibold mb-2"><h3>Connections</h3></header>
      <ViewBoundary
        fallback={<ConnectionsContentFallback />}
        errorFallback={<ConnectionsContentErrorFallback />}
      >
        <ConnectionsContent />
      </ViewBoundary>
    </section>
  );
};

export default ConnectionsSelector;
