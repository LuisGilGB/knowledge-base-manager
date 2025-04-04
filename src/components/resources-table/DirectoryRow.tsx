'use client';

import { DirectoryResource } from "@/lib/api/types";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { getResourceName, getStatusIndicator } from "./utils";
import useToggle from "@/hooks/useToggle";
import { useResources } from "@/lib/api/hooks";
import FileRow from "./FileRow";
import SkeletonRow from "./SkeletonRow";

interface DirectoryRowProps {
  connectionId: string;
  resource: DirectoryResource;
  leftOffset?: number;
}

const DirectoryRow = ({ connectionId, resource, leftOffset = 0 }: DirectoryRowProps) => {
  const [expanded, toggleExpanded] = useToggle(false);

  const { data: childrenResources, isLoading: isLoadingChildren } = useResources(connectionId, resource.resource_id, { enabled: expanded });

  return (
    <>
      <TableRow key={resource.resource_id}>
        <TableCell>
          <div className="flex items-center">
            {Array.from({ length: leftOffset }).map((_, index) => (
              <span key={index} className="block w-6" />
            ))}
            {resource.inode_type === 'directory' ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleExpanded();
                }}
              >
                {expanded ?
                  <ChevronDown className="h-4 w-4" /> :
                  <ChevronRight className="h-4 w-4" />
                }
              </Button>
            ) : null}
            <Folder className="size-4 mx-2 text-blue-500" />
            <span>{getResourceName(resource)}</span>
          </div>
        </TableCell>
        <TableCell>{getStatusIndicator(resource.status)}</TableCell>
      </TableRow>
      {expanded && isLoadingChildren && <SkeletonRow />}
      {expanded && childrenResources?.data?.length && (
        // Two things to notice, because we may be playing with fire if we don't handle this carefully:
        // 1. We don't use ResourceRow because that would create a circular dependency (further research is needed to check how ES modules handle this)
        // 2. RECURSION. Source data is not infinite (I think we can presume) and the defaults are kind of sane (collapsed by default).
        //    I mean, recursion is great to work with trees, but a dangerous tool if not used carefully.
        <>
          {childrenResources?.data?.map((childResource) => (
            childResource.inode_type === 'directory' ? (
              <DirectoryRow
                key={childResource.resource_id}
                connectionId={connectionId}
                resource={childResource}
                leftOffset={leftOffset + 1}
              />
            ) : (
              <FileRow
                key={childResource.resource_id}
                resource={childResource}
                connectionId={connectionId}
                leftOffset={leftOffset + 1}
              />
            )
          ))}
        </>
      )}
    </>
  );
};

export default DirectoryRow;
