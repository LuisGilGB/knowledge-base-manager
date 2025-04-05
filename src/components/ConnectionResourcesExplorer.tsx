'use client';

import { Button } from "@/components/ui/button";
import { SelectionProvider, useSelection } from "@/contexts/SelectionContext";
import { useInfiniteResources } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import { Info, PlusCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import CreateKnowledgeBaseModal from "./CreateKnowledgeBaseModal";
import ViewBoundary from "./boundaries/ViewBoundary";
import ConnectionResourcesTable from "./resources-table/ConnectionResourcesTable";

interface ConnectionResourcesExplorerProps {
  connectionId: string;
  className?: string;
}

const Toolbar = ({
  connectionId
}: {
  connectionId: string;
}) => {
  const { getSelectedCount, getSelectedResources } = useSelection();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedCount = getSelectedCount();

  const handleCreateKnowledgeBase = () => {
    const selectedResources = getSelectedResources();
    if (selectedResources.length === 0) {
      toast("No resources selected", {
        description: "Please select at least one resource to create a knowledge base.",
      });
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-end py-1">
        <Button
          size="sm"
          disabled={selectedCount === 0}
          className="flex items-center gap-1"
          onClick={handleCreateKnowledgeBase}
        >
          <PlusCircle className="size-4" />
          <span>Create Knowledge Base</span>
        </Button>
      </div>

      <CreateKnowledgeBaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        connectionId={connectionId}
        selectedResources={getSelectedResources()}
      />
    </>
  );
};

const ConnectionResourcesExplorer = ({ connectionId, className }: ConnectionResourcesExplorerProps) => {
  const {
    resources,
  } = useInfiniteResources(
    connectionId,
    undefined,
    {
      suspense: true,
      initialSize: 1
    }
  );
  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <SelectionProvider>
      {resources.length > 0 ? (
        <div className={cn("flex flex-col gap-y-2 overflow-hidden", className)}>
          <Toolbar connectionId={connectionId} />
          <ConnectionResourcesTable ref={tableRef} connectionId={connectionId} resources={resources} />
          {
            // TODO: I'm getting 500 errors when sending the cursor as a query parameter of the resources request,
            // so for now we're not going to support infinite scrolling.
            //
            // The Load more button is a provisional solution to verify the requests of the following pages work as expected
            // without triggering huge amounts of requests while trying. It's expected to be replaces by a scroll handler or
            // an interceptor.
          }
          {/*hasNextPage && (
              <div className="flex justify-center py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMore}
                  disabled={isValidating}
                  className="text-sm"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )*/}
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

const ConnectionResourcesExplorerView = ({ connectionId, className }: ConnectionResourcesExplorerProps) => {
  return (
    <ViewBoundary className={className}>
      <ConnectionResourcesExplorer connectionId={connectionId} />
    </ViewBoundary>
  );
};

export default ConnectionResourcesExplorerView;
