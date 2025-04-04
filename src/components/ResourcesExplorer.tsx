'use client';

import { useResources } from "@/lib/api/hooks";
import ResourcesTable from "./ResourcesTable";
import { useRouter } from "next/navigation";

interface ResourcesExplorerProps {
  connectionId: string;
  resourceId?: string;
}

const ResourcesExplorer = ({ connectionId, resourceId }: ResourcesExplorerProps) => {
  const router = useRouter();
  const { data } = useResources(connectionId, resourceId);
  const resources = data?.data;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Files and Folders</h2>

      {resources ? (
        <ResourcesTable resources={resources} onDirectoryDoubleClick={(resource) => router.push(`/${connectionId}/folders/${resource.resource_id}`)} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResourcesExplorer;
