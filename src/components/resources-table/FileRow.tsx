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
      <TableCell className="w-[40px] p-0 pl-2">
        {Array.from({ length: leftOffset }).map((_, index) => (
          <span key={index} className="inline-block w-[40px]" />
        ))}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <File className="h-4 w-4" />
          <span>{getResourceName(resource)}</span>
        </div>
      </TableCell>
      <TableCell>{getStatusIndicator(resource.status)}</TableCell>
    </TableRow>
  );
};

export default FileRow;
