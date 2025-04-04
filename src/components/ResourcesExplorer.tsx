'use client';

import { useResources } from "@/lib/api/hooks";
import ResourcesTable from "./resources-table/ResourcesTable";

interface ResourcesExplorerProps {
  connectionId: string;
  resourceId?: string;
}

const ResourcesExplorer = ({ connectionId, resourceId }: ResourcesExplorerProps) => {
  const { data } = useResources(connectionId, resourceId);
  const resources = data?.data;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Files and Folders</h2>

      {resources ? (
        <ResourcesTable connectionId={connectionId} resources={resources} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResourcesExplorer;
