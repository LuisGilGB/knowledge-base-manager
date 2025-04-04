'use client';

import { TableCell } from "@/components/ui/table";
import { getStatusIndicator } from "../utils";
import { Resource } from "@/lib/api/types";

interface StatusCellProps {
  resource: Resource;
}

const StatusCell = ({ resource }: StatusCellProps) => {
  return (
    <TableCell>
      {getStatusIndicator(resource.status)}
    </TableCell>
  );
};

export default StatusCell;
