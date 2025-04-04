'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Folder, FileText, Clock, Info } from "lucide-react";
import { Resource } from "@/lib/api/types";

interface ResourcesTableProps {
  resources: Resource[];
  onDirectoryDoubleClick?: (resource: Resource) => void;
}

const ResourcesTable = ({ resources, onDirectoryDoubleClick }: ResourcesTableProps) => {
  const getResourceIcon = (resource: Resource) => {
    if (resource.inode_type === 'directory') {
      return <Folder className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getResourceName = (resource: Resource) => {
    return resource.name || resource.inode_path.path.split('/').pop() || 'Unnamed';
  };

  const getStatusIndicator = (status?: string) => {
    switch (status) {
      case 'indexed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Indexed</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Not indexed</span>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources?.map((resource) => (
          <TableRow key={resource.resource_id} onDoubleClick={() => {
            if (resource.inode_type === 'directory') {
              console.log('Double clicked on directory:', resource);
              onDirectoryDoubleClick?.(resource);
            } else {
              console.log('Double clicked on file:', resource);
            }
          }}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getResourceIcon(resource)}
                <span>{getResourceName(resource)}</span>
              </div>
            </TableCell>
            <TableCell className="capitalize">{resource.inode_type}</TableCell>
            <TableCell className="text-gray-500 text-sm">{resource.inode_path.path}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="h-3 w-3" />
                <span>{resource.updated_at ? formatDate(resource.updated_at) : 'N/A'}</span>
              </div>
            </TableCell>
            <TableCell>{getStatusIndicator(resource.status)}</TableCell>
          </TableRow>
        ))}
        {!resources?.length && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
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
