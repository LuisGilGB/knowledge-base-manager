export interface InodePath {
  path: string;
}

export interface Resource<T extends 'file' | 'directory' = 'file' | 'directory'> {
  resource_id: string;
  // This seems redundant, but it's not (check typing at Resources Table if you remove this). Praise TypeScript's magic.
  inode_type: T extends 'file' ? 'file' : 'directory';
  inode_path: InodePath;
  name?: string;
  mime_type?: string;
  size?: number;
  created_at?: string;
  updated_at?: string;
  status?: 'pending' | 'indexed' | 'failed' | 'pending_delete';
  parent_resource_id?: string;
}

export type DirectoryResource = Resource<'directory'>;
export type FileResource = Resource<'file'>;

/**
   * Filters out resources that are descendants of other selected resources
   * @param resources The list of resources to filter
   * @returns A filtered list of resources without descendants
   */
export const filterOutDescendantResources = (resources: Resource[]): Resource[] => {
  // First, sort resources by path length (shortest first)
  // This ensures parent directories come before their children
  const sortedResources = [...resources].sort((a, b) =>
    a.inode_path.path.length - b.inode_path.path.length
  );

  // Keep track of paths that should be included
  const includedResources: Resource[] = [];
  const includedPaths: Set<string> = new Set();

  for (const resource of sortedResources) {
    const currentPath = resource.inode_path.path;

    // Check if this resource is a descendant of any already included resource
    let isDescendant = false;
    for (const path of includedPaths) {
      // If the current path starts with an included path and is not the same path,
      // it means it's a descendant (it's in a subfolder)
      if (
        currentPath !== path &&
        (
          currentPath.startsWith(`${path}/`) ||
          // Handle the case where the path doesn't end with a slash
          (path !== '/' && currentPath.startsWith(path) && currentPath[path.length] === '/')
        )
      ) {
        isDescendant = true;
        break;
      }
    }

    // If it's not a descendant, include it
    if (!isDescendant) {
      includedResources.push(resource);
      includedPaths.add(currentPath);
    }
  }

  return includedResources;
};