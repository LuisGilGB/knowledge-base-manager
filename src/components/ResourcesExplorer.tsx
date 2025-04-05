'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { KnowledgeBaseProvider } from "@/contexts/KnowledgeBaseContext";
import { SelectionProvider, useSelection } from "@/contexts/SelectionContext";
import { useInfiniteResources } from "@/lib/api/hooks";
import { Resource } from "@/domain/Resource";
import { Info, PlusCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import CreateKnowledgeBaseModal from "./CreateKnowledgeBaseModal";
import ResourcesTable from "./resources-table/ResourcesTable";
import ViewBoundary from "./boundaries/ViewBoundary";
import { cn } from "@/lib/utils";

interface ResourcesExplorerProps {
  connectionId: string;
  resourceId?: string;
  className?: string;
}

const Toolbar = ({
  resources,
  connectionId
}: {
  resources: Resource[];
  connectionId: string;
}) => {
  const { getSelectedCount, getSelectedResources, selectAll, clearSelection } = useSelection();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedCount = getSelectedCount();
  // The resources count is tricky here, because we haven't loaded all resources at this level due to nested resources.
  const allSelected = selectedCount >= resources.length && resources.length > 0;

  const handleSelectAllChange = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(resources);
    }
  };

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
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAllChange}
            aria-label="Select all resources"
          />
          <span className="text-sm text-muted-foreground">
            {selectedCount > 0 ? `${selectedCount} selected` : 'Select all resources'}
          </span>
        </div>
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

const ResourcesExplorer = ({ connectionId, resourceId, className }: ResourcesExplorerProps) => {
  const {
    resources,
  } = useInfiniteResources(
    connectionId,
    resourceId,
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
            <Toolbar
              resources={resources}
              connectionId={connectionId}
            />
            <ResourcesTable ref={tableRef} connectionId={connectionId} resources={resources} />
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
    </KnowledgeBaseProvider>
  );
};

const ResourcesExplorerView = ({ connectionId, resourceId, className }: ResourcesExplorerProps) => {
  return (
    <ViewBoundary className={className}>
      <ResourcesExplorer connectionId={connectionId} resourceId={resourceId} />
    </ViewBoundary>
  );
};

export default ResourcesExplorerView;
