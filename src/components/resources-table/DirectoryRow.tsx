'use client';

import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { useSelection } from "@/contexts/SelectionContext";
import { DirectoryResource } from "@/domain/Resource";
import useToggle from "@/hooks/useToggle";
import { useResources } from "@/lib/api/hooks";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { useCallback, useState } from "react";
import { TableRow } from "../ui/table";
import SelectorCell from "./cells/SelectorCell";
import StatusCell from "./cells/StatusCell";
import FileRow from "./FileRow";
import SkeletonRow from "./SkeletonRow";
import { getResourceName } from "./utils";

interface DirectoryRowProps {
  connectionId: string;
  resource: DirectoryResource;
  leftOffset?: number;
}

const DirectoryRow = ({ connectionId, resource, leftOffset = 0 }: DirectoryRowProps) => {
  const [expanded, toggleExpanded] = useToggle(false);
  const [prefetchTriggered, setPrefetchTriggered] = useState(false);
  const { isSelected } = useSelection();
  const selected = isSelected(resource.resource_id);

  // Notice how we don't necessarily wait to expanded to be true to fetch the children. This is a UX decision
  // to offer the user a smoother experience by prefetching the children. Otherwise, the user must wait to the fetch
  // to finish right after clicking on the expand button.
  //
  // There are many different policies we could use here, all of them with their set of trade-offs:
  // - We may prefetch all by default, no matter expanded or hovering states -> We grant availability of children ASAP but with a higher initial load and very likely overfetching.
  // - We may prefetch only when the user hovers -> We grant availability of children when there's a likelier chance of the user wanting to expand the directory. Some overfetching, but not as much.
  //    - We have some range with this option, as we can choose the hover of the full row or the expand button itself.
  //    - Should be paired with focus enter events for accessibility.
  // - We may prefetch only when the user clicks to expand -> Children aren't fetched until it's sure the user wants to see them; but there's no prefetching at all and the user must wait for the fetch to finish. No overfetching.
  //
  // For more dine-grained configuration or AB testing, we can create a childrenPrefetchStrategy prop to manage this behavior.
  const { data: childrenResources, isLoading: isLoadingChildren } = useResources(
    connectionId,
    resource.resource_id,
    undefined, // No cursor for initial load
    { enabled: expanded || prefetchTriggered }
  );

  const prefetchChildren = useCallback(() => {
    setPrefetchTriggered(true);
  }, []);

  const onToggleExpandClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleExpanded();
  }, [toggleExpanded]);

  return (
    <>
      <TableRow key={resource.resource_id} className={selected ? "bg-muted/50" : ""} onMouseEnter={prefetchChildren}>
        <SelectorCell
          resource={resource}
        />
        <TableCell>
          <div className="flex items-center">
            {Array.from({ length: leftOffset }).map((_, index) => (
              <span key={index} className="block w-6" />
            ))}
            {resource.inode_type === 'directory' ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-5"
                onFocus={prefetchChildren}
                onClick={onToggleExpandClick}
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
        <StatusCell resource={resource} />
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
