'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { KnowledgeBaseProvider } from "@/contexts/KnowledgeBaseContext";
import { SelectionProvider, useSelection } from "@/contexts/SelectionContext";
import { useResources } from "@/lib/api/hooks";
import { Resource } from "@/lib/api/types";
import { Info, PlusCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import CreateKnowledgeBaseModal from "./CreateKnowledgeBaseModal";
import ResourcesTable from "./resources-table/ResourcesTable";
import KnowledgeBaseStatus from "./KnowledgeBaseStatus";

interface ResourcesExplorerProps {
  connectionId: string;
  resourceId?: string;
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

const ResourcesExplorer = ({ connectionId, resourceId }: ResourcesExplorerProps) => {
  const { data, error, isLoading } = useResources(connectionId, resourceId);
  const resources = data?.data || [];
  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <KnowledgeBaseProvider>
      <SelectionProvider>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Files and Folders</h2>
          <KnowledgeBaseStatus />
          {resources.length > 0 ? (
            <div className="space-y-2">
              <Toolbar
                resources={resources}
                connectionId={connectionId}
              />
              <ResourcesTable ref={tableRef} connectionId={connectionId} resources={resources} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
              <Info className="size-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                {isLoading
                  ? "Loading resources..."
                  : error
                    ? "Error loading resources"
                    : "No resources found"}
              </p>
            </div>
          )}
        </div>
      </SelectionProvider>
    </KnowledgeBaseProvider>
  );
};

export default ResourcesExplorer;
