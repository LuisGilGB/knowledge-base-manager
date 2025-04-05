'use client';

import { FileResource } from "@/domain/Resource";
import { TableRow } from "../ui/table";
import FileNameCell from "./cells/FileNameCell";
import StatusCell from "./cells/StatusCell";

interface KnowledgeBaseFileRowProps {
  resource: FileResource;
  knowledgeBaseId: string;
  leftOffset?: number;
}

const KnowledgeBaseFileRow = ({ resource, leftOffset = 0, knowledgeBaseId }: KnowledgeBaseFileRowProps) => {
  return (
    <TableRow>
      <FileNameCell resource={resource} leftOffset={leftOffset} />
      <StatusCell resource={resource} knowledgeBaseId={knowledgeBaseId} />
    </TableRow>
  );
};

export default KnowledgeBaseFileRow;
