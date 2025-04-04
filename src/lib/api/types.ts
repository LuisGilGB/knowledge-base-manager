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

export interface Resource {
  resource_id: string;
  inode_type: 'file' | 'directory';
  inode_path: InodePath;
  name?: string;
  mime_type?: string;
  size?: number;
  created_at?: string;
  updated_at?: string;
  status?: 'pending' | 'indexed' | 'failed';
  parent_resource_id?: string;
}

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
