'use client';

import { Resource } from "@/domain/Resource";
import { useCallback } from "react";
import ConnectionResourceRow from "./ConnectionResourceRow";
import ResourcesTable from "./ResourcesTable";

interface ConnectionResourcesTableProps {
  connectionId: string;
  resources: Resource[];
  ref?: React.RefObject<HTMLTableElement | null>;
}

const ConnectionResourcesTable = ({ connectionId, ...props }: ConnectionResourcesTableProps) => {
  return (
    <ResourcesTable
      {...props}
      renderRow={useCallback((resource) => (
        <ConnectionResourceRow
          key={resource.resource_id}
          connectionId={connectionId}
          resource={resource}
        />
      ), [connectionId])}
    />
  );
};

export default ConnectionResourcesTable;
