'use client';

import { TableCell } from "@/components/ui/table";
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
  },
  default: {
    label: "Not indexed",
    icon: null,
    variant: "secondary" as const,
    className: "text-gray-600 bg-gray-50 border-gray-200"
  }
};

const StatusCell = ({ resource }: StatusCellProps) => {
  const { resourceStatusMap } = useKnowledgeBase();
  const resourceStatus = resourceStatusMap[resource.resource_id];
  const config = resourceStatus ? statusConfig[resourceStatus] : statusConfig.default;
  const Icon = config.icon;

  return (
    <TableCell className="text-right">
      <Badge
        variant={config.variant}
        className={cn("gap-1 text-xs font-normal", config.className)}
      >
        {Icon && <Icon className="size-3" />}
        {config.label}
      </Badge>
    </TableCell>
  );
};

export default StatusCell;
