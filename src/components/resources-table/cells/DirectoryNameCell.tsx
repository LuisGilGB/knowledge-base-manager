'use client';

import { DirectoryResource } from "@/domain/Resource";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getResourceName } from "../utils";
import { useCallback } from "react";

interface DirectoryNameCellProps {
  resource: DirectoryResource;
  leftOffset?: number;
  expanded?: boolean;
  onToggleExpandClick?: (e: React.MouseEvent) => void;
  onToggleExpandFocus?: (e: React.FocusEvent) => void;
}

const DirectoryNameCell = ({ resource, leftOffset = 0, expanded = false, onToggleExpandClick: onToggleExpandClickProp, onToggleExpandFocus }: DirectoryNameCellProps) => {
  const onToggleExpandClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleExpandClickProp?.(e);
  }, [onToggleExpandClickProp]);

  return (
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
            onFocus={onToggleExpandFocus}
            onClick={onToggleExpandClick}
          >
            {expanded ?
              <ChevronDown className="h-4 w-4" /> :
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
        ) : null}
        <Folder className="size-4 mx-2 text-blue-500" />
        <span className="truncate">{getResourceName(resource)}</span>
      </div>
    </TableCell>
  );
};

export default DirectoryNameCell;