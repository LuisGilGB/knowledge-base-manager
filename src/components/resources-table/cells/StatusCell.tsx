'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResourceStatus } from "@/contexts/KnowledgeBaseContext";
import { Resource } from "@/domain/Resource";
import { useDeindexResource } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, PinOff, XCircle } from "lucide-react";
import { ComponentProps } from "react";
import { toast } from "sonner";

interface StatusCellProps {
  knowledgeBaseId: string;
  resource: Resource;
}

const statusConfig: Record<ResourceStatus | 'default', { label: string; icon: React.ComponentType<{ className?: string }> | null; variant: ComponentProps<typeof Badge>['variant']; className: string }> = {
  pending: {
    label: "Pending...",
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
  pending_delete: {
    label: "De-indexed",
    icon: null,
    variant: "secondary" as const,
    className: "text-gray-600 bg-orange-50 border-orange-200"
  },
  default: {
    label: "Not indexed",
    icon: null,
    variant: "secondary" as const,
    className: "text-gray-600 bg-gray-50 border-gray-200"
  }
};

const StatusCell = ({ knowledgeBaseId, resource }: StatusCellProps) => {
  const { trigger: deindexResource, isMutating: isDeindexing } = useDeindexResource();

  const isFile = resource.inode_type === 'file';
  const config = statusConfig[resource.status!] || statusConfig.default;
  const Icon = config.icon;

  const handleDeindex = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event

    try {
      await deindexResource({
        knowledgeBaseId,
        resourceId: resource.resource_id,
        resourcePath: resource.inode_path.path
      });

      toast.success("Resource de-indexed successfully");
    } catch (error) {
      console.error("Failed to de-index resource:", error);
      toast.error("Failed to de-index resource");
    }
  };

  return (
    <TableCell className="text-right">
      <div className="flex items-center justify-end gap-2">
        <Badge
          variant={config.variant}
          className={cn("gap-1 text-xs font-normal", config.className)}
        >
          {Icon && <Icon className="size-3" />}
          {config.label}
        </Badge>
        {isFile && resource.status === 'indexed' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="handle-5 size-5 rounded-full hover:bg-red-100 hover:text-red-600"
                onClick={handleDeindex}
                disabled={isDeindexing}
                title="De-index this resource"
              >
                <PinOff className="size-3" />
                <span className="sr-only">De-index</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>De-index this resource</span>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TableCell>
  );
};

export default StatusCell;
