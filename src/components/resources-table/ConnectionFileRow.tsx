'use client';

import { useSelection } from "@/contexts/SelectionContext";
import { FileResource } from "@/domain/Resource";
import { TableRow } from "../ui/table";
import FileNameCell from "./cells/FileNameCell";
import SelectorCell from "./cells/SelectorCell";

interface ConnectionFileRowProps {
  resource: FileResource;
  leftOffset?: number;
}

const ConnectionFileRow = ({ resource, leftOffset = 0 }: ConnectionFileRowProps) => {
  const { isSelected } = useSelection();
  const selected = isSelected(resource.resource_id);

  return (
    <TableRow className={selected ? "bg-muted/50" : ""}>
      <SelectorCell
        resource={resource}
      />
      <FileNameCell resource={resource} leftOffset={leftOffset} />
    </TableRow>
  );
};

export default ConnectionFileRow;
