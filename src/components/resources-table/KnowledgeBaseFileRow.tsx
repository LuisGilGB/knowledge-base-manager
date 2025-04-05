'use client';

import { FileResource } from "@/domain/Resource";
import { useCallback } from "react";
import { TableRow } from "../ui/table";
import FileNameCell from "./cells/FileNameCell";
import StatusCell from "./cells/StatusCell";

interface KnowledgeBaseFileRowProps {
  resource: FileResource;
  leftOffset?: number;
  isDeindexing?: boolean;
  onDeindexClick: (resourcePath: string) => void;
}

const KnowledgeBaseFileRow = ({ resource, leftOffset = 0, isDeindexing, onDeindexClick: onDeindexClickProp }: KnowledgeBaseFileRowProps) => {
  const handleDeindexClick = useCallback(() => {
    onDeindexClickProp(resource.inode_path.path);
  }, [onDeindexClickProp, resource.inode_path.path]);

  return (
    <TableRow>
      <FileNameCell resource={resource} leftOffset={leftOffset} />
      <StatusCell resource={resource} isDeindexing={isDeindexing} onDeindexClick={handleDeindexClick} />
    </TableRow>
  );
};

export default KnowledgeBaseFileRow;
