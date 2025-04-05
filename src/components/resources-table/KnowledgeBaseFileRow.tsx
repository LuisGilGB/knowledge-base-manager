'use client';

import { FileResource } from "@/domain/Resource";
import { TableRow } from "../ui/table";
import FileNameCell from "./cells/FileNameCell";
import StatusCell from "./cells/StatusCell";

interface KnowledgeBaseFileRowProps {
  resource: FileResource;
  leftOffset?: number;
}

const KnowledgeBaseFileRow = ({ resource, leftOffset = 0 }: KnowledgeBaseFileRowProps) => {
  return (
    <TableRow>
      <FileNameCell resource={resource} leftOffset={leftOffset} />
      <StatusCell resource={resource} />
    </TableRow>
  );
};

export default KnowledgeBaseFileRow;
