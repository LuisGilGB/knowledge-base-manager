'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { Resource } from "@/lib/api/types";
import { Info } from "lucide-react";
import ResourceRow from "./ResourceRow";

interface ResourcesTableProps {
  connectionId: string;
  resources: Resource[];
}

const ResourcesTable = ({ connectionId, resources }: ResourcesTableProps) => {
  return (
    <Table>
      <TableBody>
        {resources?.map((resource) => (
          <ResourceRow
            key={resource.resource_id}
            connectionId={connectionId}
            resource={resource}
          />
        ))}
        {!resources?.length && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                <Info className="h-8 w-8 mb-2" />
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
