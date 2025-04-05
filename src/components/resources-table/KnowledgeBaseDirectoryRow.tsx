'use client';

import { DirectoryResource } from "@/domain/Resource";
import useNestedResources from "@/hooks/useNestedResources";
import { useInfiniteKnowledgeBaseResources } from "@/lib/api/hooks";
import { TableRow } from "../ui/table";
import DirectoryNameCell from "./cells/DirectoryNameCell";
import StatusCell from "./cells/StatusCell";
import KnowledgeBaseFileRow from "./KnowledgeBaseFileRow";
import SkeletonRow from "./SkeletonRow";
import { useCallback } from "react";

interface KnowledgeBaseDirectoryRowProps {
  knowledgeBaseId: string;
  resource: DirectoryResource;
  leftOffset?: number;
}

const KnowledgeBaseDirectoryRow = ({ knowledgeBaseId, resource, leftOffset = 0 }: KnowledgeBaseDirectoryRowProps) => {
  const { expanded, toggleExpanded, prefetchTriggered, prefetchChildren } = useNestedResources();

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
  const {
    resources: childrenResources,
    isLoading: isLoadingChildren,
    deindexMutate,
  } = useInfiniteKnowledgeBaseResources(
    knowledgeBaseId,
    resource.inode_path.path,
    {
      enabled: expanded || prefetchTriggered,
      initialSize: 1,
      refreshInterval: 60000,
      dedupingInterval: 5000,
    }
  );

  const handleDeindexChildrenResource = useCallback(async (resourceId: string) => {
    deindexMutate(knowledgeBaseId, resourceId);
  }, [deindexMutate, knowledgeBaseId]);

  return (
    <>
      <TableRow key={resource.resource_id} onMouseEnter={prefetchChildren}>
        <DirectoryNameCell
          resource={resource}
          leftOffset={leftOffset}
          expanded={expanded}
          onToggleExpandClick={toggleExpanded}
          onToggleExpandFocus={prefetchChildren}
        />
        <StatusCell resource={resource} />
      </TableRow>
      {expanded && isLoadingChildren && <SkeletonRow />}
      {expanded && childrenResources?.length > 0 && (
        // Two things to notice, because we may be playing with fire if we don't handle this carefully:
        // 1. We don't use ResourceRow because that would create a circular dependency (further research is needed to check how ES modules handle this)
        // 2. RECURSION. Source data is not infinite (I think we can presume) and the defaults are kind of sane (collapsed by default).
        //    I mean, recursion is great to work with trees, but a dangerous tool if not used carefully.
        <>
          {childrenResources?.map((childResource) => (
            childResource.inode_type === 'directory' ? (
              <KnowledgeBaseDirectoryRow
                key={childResource.resource_id}
                knowledgeBaseId={knowledgeBaseId}
                resource={childResource}
                leftOffset={leftOffset + 1}
              />
            ) : (
              <KnowledgeBaseFileRow
                key={childResource.resource_id}
                resource={childResource}
                leftOffset={leftOffset + 1}
                onDeindexClick={handleDeindexChildrenResource}
              />
            )
          ))}
        </>
      )}
    </>
  );
};

export default KnowledgeBaseDirectoryRow;
