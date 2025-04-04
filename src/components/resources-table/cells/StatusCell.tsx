'use client';

import { TableCell } from "@/components/ui/table";
import { getStatusIndicator } from "../utils";
import { Resource } from "@/lib/api/types";
import { useKnowledgeBase } from "@/contexts/KnowledgeBaseContext";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCellProps {
  resource: Resource;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    variant: "secondary" as const,
    className: "text-yellow-600 bg-yellow-50 border-yellow-200"
  },
  indexed: {
    label: "Indexed",
    icon: CheckCircle,
    variant: "secondary" as const,
    className: "text-green-600 bg-green-50 border-green-200"
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    variant: "secondary" as const,
    className: "text-red-600 bg-red-50 border-red-200"
  }
};

const StatusCell = ({ resource }: StatusCellProps) => {
  const { resourceStatusMap } = useKnowledgeBase();
  const resourceStatus = resourceStatusMap[resource.resource_id];
  const Icon = resourceStatus ? statusConfig[resourceStatus].icon : null;

  return (
    <TableCell className="text-right">
      {resourceStatus && (
        <Badge
          variant={statusConfig[resourceStatus].variant}
          className={cn("gap-1 text-xs font-normal", statusConfig[resourceStatus].className)}
        >
          {Icon && <Icon className="size-3" />}
          {statusConfig[resourceStatus].label}
        </Badge>
      )}
      {!resourceStatus && getStatusIndicator(resource.status)}
    </TableCell>
  );
};

export default StatusCell;
