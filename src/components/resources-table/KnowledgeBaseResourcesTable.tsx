'use client';

import { Resource } from "@/domain/Resource";
import ResourcesTable from "./ResourcesTable";
import KnowledgeBaseResourceRow from "./KnowledgeBaseResourceRow";

interface KnowledgeBaseResourcesTableProps {
  ref?: React.RefObject<HTMLTableElement | null>;
  knowledgeBaseId: string;
  resources: Resource[];
  onDeindexResourceClick: (resourcePath: string) => void;
}

const KnowledgeBaseResourcesTable = ({ knowledgeBaseId, onDeindexResourceClick, ...props }: KnowledgeBaseResourcesTableProps) => {
  return (
    <ResourcesTable
      {...props}
      renderRow={(resource) => (
        <KnowledgeBaseResourceRow
          key={resource.resource_id}
          knowledgeBaseId={knowledgeBaseId}
          resource={resource}
          onDeindexClick={onDeindexResourceClick}
        />
      )}
    />
  );
};

export default KnowledgeBaseResourcesTable;
