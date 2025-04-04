'use client';

import { FileResource } from "@/lib/api/types";
import { TableCell, TableRow } from "../ui/table";
import { File } from "lucide-react";
import { getResourceName, getStatusIndicator } from "./utils";

interface FileRowProps {
  connectionId: string;
  resource: FileResource;
  leftOffset?: number;
}

const FileRow = ({ resource, leftOffset = 0 }: FileRowProps) => {
  return (
    <TableRow key={resource.resource_id}>
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
      <TableCell>{getStatusIndicator(resource.status)}</TableCell>
    </TableRow>
  );
};

export default FileRow;
