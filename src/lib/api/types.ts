/**
 * Types for the API service layer
 */

// Authentication types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface AuthHeaders {
  Authorization: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_cursor: number | null;
  next_cursor: number | null;
}

// Connection types
export interface Connection {
  connection_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  connection_provider: string;
  connection_provider_data?: Record<string, unknown>;
}

// Resource types
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
  status?: 'pending' | 'indexed' | 'failed';
  parent_resource_id?: string;
}

export type DirectoryResource = Resource<'directory'>;
export type FileResource = Resource<'file'>;

// Knowledge Base types
export interface KnowledgeBase {
  knowledge_base_id: string;
  name: string;
  description?: string;
  connection_id: string;
  connection_source_ids: string[];
  created_at: string;
  updated_at: string;
  indexing_params?: Record<string, unknown>;
}

// API Error type
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

// API Response wrapper type
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
