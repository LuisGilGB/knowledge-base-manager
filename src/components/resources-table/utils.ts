import { Resource } from "@/lib/api/types";

export const getResourceName = (resource: Resource) => {
  return resource.name || resource.inode_path.path.split('/').pop() || 'Unnamed';
};