'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { Resource } from "@/domain/Resource";
import { Info } from "lucide-react";

interface ResourcesTableProps {
  ref?: React.RefObject<HTMLTableElement | null>;
  resources: Resource[];
  renderRow: (resource: Resource) => React.ReactNode;
}

const ResourcesTable = ({ resources, ref, renderRow }: ResourcesTableProps) => {
  return (
    <Table ref={ref}>
      <TableBody>
        {resources?.map(renderRow)}
        {!resources?.length && (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                <Info className="size-8 mb-2" />
                <p>No resources found</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ResourcesTable;
