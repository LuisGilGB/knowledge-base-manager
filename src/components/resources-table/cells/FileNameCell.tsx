'use client';

import { FileResource } from "@/domain/Resource";
import { TableCell } from "@/components/ui/table";
import { File } from "lucide-react";
import { getResourceName } from "../utils";

const FileNameCell = ({ resource, leftOffset = 0 }: { resource: FileResource; leftOffset?: number }) => {
  return (
    <TableCell>
      <div className="flex items-center">
        <span className="block w-6" />
        {Array.from({ length: leftOffset }).map((_, index) => (
          <span key={index} className="block w-6" />
        ))}
        <File className="size-4 mx-2" />
        <span className="truncate">{getResourceName(resource)}</span>
      </div>
    </TableCell>
  );
};

export default FileNameCell;
