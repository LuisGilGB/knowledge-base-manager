'use client';

import { Button } from "@/components/ui/button";
import { SelectionProvider, useSelection } from "@/contexts/SelectionContext";
import { useResources } from "@/lib/api/hooks";
import { Resource } from "@/lib/api/types";
import { Info, PlusCircle } from "lucide-react";
import ResourcesTable from "./resources-table/ResourcesTable";
import { Checkbox } from "./ui/checkbox";
import { useRef } from "react";

interface ResourcesExplorerProps {
  connectionId: string;
  resourceId?: string;
}

const Toolbar = ({ resources, renderedRows }: { resources: Resource[]; renderedRows: number }) => {
  const { getSelectedCount, selectAll, clearSelection } = useSelection();
  const selectedCount = getSelectedCount();
  // The resources count is tricky here, because we haven't loaded all resources at this level due to nested resources.
  const allSelected = selectedCount >= renderedRows && renderedRows > 0;

  const handleSelectAllChange = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(resources);
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
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
      >
        <PlusCircle className="size-4" />
        <span className="text-sm">Create Knowledge Base</span>
      </Button>
    </div>
  );
};

const ResourcesExplorer = ({ connectionId, resourceId }: ResourcesExplorerProps) => {
  const { data } = useResources(connectionId, resourceId);
  const resources = data?.data || [];
  const tableRef = useRef<HTMLTableElement>(null);

  const renderedRows = tableRef.current?.querySelectorAll('tbody tr').length || 0;

  return (
    <SelectionProvider>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Files and Folders</h2>
        {resources.length > 0 ? (
          <>
            <Toolbar resources={resources} renderedRows={renderedRows} />
            <ResourcesTable ref={tableRef} connectionId={connectionId} resources={resources} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <Info className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground">No resources found</p>
          </div>
        )}
      </div>
    </SelectionProvider>
  );
};

export default ResourcesExplorer;
