'use client';

import { Resource } from "@/domain/Resource";
import { TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelection } from "@/contexts/SelectionContext";
import { getResourceName } from "../utils";

interface SelectorCellProps {
  resource: Resource;
}

const SelectorCell = ({ resource }: SelectorCellProps) => {
  const { toggleSelection, isSelected } = useSelection();
  const selected = isSelected(resource.resource_id);

  return (
    <TableCell className="w-[40px]">
      <Checkbox
        checked={selected}
        onCheckedChange={() => toggleSelection(resource)}
        aria-label={`Select ${getResourceName(resource)}`}
      />
    </TableCell>
  );
};

export default SelectorCell;
