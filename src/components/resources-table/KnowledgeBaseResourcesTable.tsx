'use client';

import { Resource } from "@/domain/Resource";
import ResourceRow from "./KnowledgeBaseResourceRow";
import ResourcesTable from "./ResourcesTable";

interface KnowledgeBaseResourcesTableProps {
  ref?: React.RefObject<HTMLTableElement | null>;
  knowledgeBaseId: string;
  resources: Resource[];
}

const KnowledgeBaseResourcesTable = ({ knowledgeBaseId, ...props }: KnowledgeBaseResourcesTableProps) => {
  return (
    <ResourcesTable
      {...props}
      renderRow={(resource) => (
        <ResourceRow
          key={resource.resource_id}
          knowledgeBaseId={knowledgeBaseId}
          resource={resource}
        />
      )}
    />
  );
};

export default KnowledgeBaseResourcesTable;
