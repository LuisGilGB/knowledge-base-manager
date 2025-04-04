'use client';

import { useResources } from "@/lib/api/hooks";

interface ConnectionFileExplorerProps {
  connectionId: string;
}

const ConnectionFileExplorer = ({ connectionId }: ConnectionFileExplorerProps) => {
  const { data } = useResources(connectionId);
  const resources = data?.data;

  return (
    <div>
      <h2>ConnectionFileExplorer {connectionId}</h2>
      <ul>
        {resources?.map((resource) => (
          <li key={resource.resource_id}>{resource.inode_path.path}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionFileExplorer;