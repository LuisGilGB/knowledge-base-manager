'use client';

import { KnowledgeBaseProvider } from "@/contexts/KnowledgeBaseContext";
import { SelectionProvider } from "@/contexts/SelectionContext";
import { useInfiniteKnowledgeBaseResources } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useRef } from "react";
import ViewBoundary from "./boundaries/ViewBoundary";
import KnowledgeBaseResourcesTable from "./resources-table/KnowledgeBaseResourcesTable";

interface KnowledgeBaseResourcesExplorerProps {
  knowledgeBaseId: string;
  className?: string;
}

const KnowledgeBaseResourcesExplorer = ({ knowledgeBaseId, className }: KnowledgeBaseResourcesExplorerProps) => {
  const {
    resources,
  } = useInfiniteKnowledgeBaseResources(
    knowledgeBaseId,
    undefined,
    {
      suspense: true,
      initialSize: 1
    }
  );
  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <KnowledgeBaseProvider>
      <SelectionProvider>
        {resources.length > 0 ? (
          <div className={cn("flex flex-col gap-y-2 overflow-hidden", className)}>
            <KnowledgeBaseResourcesTable ref={tableRef} knowledgeBaseId={knowledgeBaseId} resources={resources} />
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
    </KnowledgeBaseProvider>
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
