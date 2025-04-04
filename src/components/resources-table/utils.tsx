import { Resource } from "@/lib/api/types";

export const getStatusIndicator = (status?: string) => {
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

export const getResourceName = (resource: Resource) => {
  return resource.name || resource.inode_path.path.split('/').pop() || 'Unnamed';
};