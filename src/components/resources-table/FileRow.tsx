'use client';

import { useSelection } from "@/contexts/SelectionContext";
import { FileResource } from "@/domain/Resource";
import { File } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import SelectorCell from "./cells/SelectorCell";
import StatusCell from "./cells/StatusCell";
import { getResourceName } from "./utils";

interface FileRowProps {
  connectionId: string;
  resource: FileResource;
  leftOffset?: number;
}

const FileRow = ({ resource, leftOffset = 0 }: FileRowProps) => {
  const { isSelected } = useSelection();
  const selected = isSelected(resource.resource_id);

  return (
    <TableRow className={selected ? "bg-muted/50" : ""}>
      <SelectorCell
        resource={resource}
      />
      <TableCell>
        <div className="flex items-center">
          <span className="block w-6" />
          {Array.from({ length: leftOffset }).map((_, index) => (
            <span key={index} className="block w-6" />
          ))}
          <File className="size-4 mx-2" />
          <span>{getResourceName(resource)}</span>
        </div>
      </TableCell>
      <StatusCell resource={resource} />
    </TableRow>
  );
};

export default FileRow;
