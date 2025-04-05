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
