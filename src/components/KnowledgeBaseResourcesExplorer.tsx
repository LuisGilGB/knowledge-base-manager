'use client';

import { SelectionProvider } from "@/contexts/SelectionContext";
import { useInfiniteKnowledgeBaseResources } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useCallback, useRef } from "react";
import ViewBoundary from "./boundaries/ViewBoundary";
import KnowledgeBaseResourcesTable from "./resources-table/KnowledgeBaseResourcesTable";

interface KnowledgeBaseResourcesExplorerProps {
  knowledgeBaseId: string;
  className?: string;
}

const KnowledgeBaseResourcesExplorer = ({ knowledgeBaseId, className }: KnowledgeBaseResourcesExplorerProps) => {
  const {
    resources,
    deindexMutate,
  } = useInfiniteKnowledgeBaseResources(
    knowledgeBaseId,
    undefined,
    {
      suspense: true,
      initialSize: 1,
      refreshInterval: 60000,
      dedupingInterval: 5000,
    }
  );
  const tableRef = useRef<HTMLTableElement>(null);

  const handleDeindexResource = useCallback(async (resourceId: string) => {
    deindexMutate(knowledgeBaseId, resourceId);
  }, [deindexMutate, knowledgeBaseId]);

  return (
    <SelectionProvider>
      {resources.length > 0 ? (
        <div className={cn("flex flex-col gap-y-2 overflow-hidden", className)}>
          <KnowledgeBaseResourcesTable ref={tableRef} knowledgeBaseId={knowledgeBaseId} resources={resources} onDeindexResourceClick={handleDeindexResource} />
        </div>
      ) : (
        <div className={cn("h-full flex flex-col items-center justify-center gap-2 p-4", className)}>
          <Info className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            No resources found
          </p>
        </div>
      )}
    </SelectionProvider>
  );
};

const KnowledgeBaseResourcesExplorerView = ({ knowledgeBaseId, className }: KnowledgeBaseResourcesExplorerProps) => {
  return (
    <ViewBoundary className={className}>
      <KnowledgeBaseResourcesExplorer knowledgeBaseId={knowledgeBaseId} />
    </ViewBoundary>
  );
};

export default KnowledgeBaseResourcesExplorerView;
