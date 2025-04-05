/**
 * API services for Google Drive connection and Knowledge Base operations
 */
import { ApiClient, getAuthHeaders } from './client';
import { Connection } from '@/domain/Connection';
import { Resource } from '@/domain/Resource';
import { KnowledgeBase } from '@/domain/KnowledgeBase';
import { AuthCredentials, PaginatedResponse } from './types';

/**
 * Service for authentication operations
 */
export class AuthService {
  private static apiClient: ApiClient | null = null;

  /**
   * Login with credentials
   * @param credentials Authentication credentials
   * @returns Whether login was successful
   */
  static async login(credentials: AuthCredentials, { onSuccess, onError }: { onSuccess?: (apiClient: ApiClient) => void; onError?: (error: unknown) => void } = {}): Promise<boolean> {
    try {
      const headers = await getAuthHeaders(credentials);
      this.apiClient = new ApiClient(headers);
      await this.apiClient.initialize();

      onSuccess?.(this.apiClient);

      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      onError?.(error);
      return false;
    }
  }

  /**
   * Logout the current user
   */
  static logout(): void {
    this.apiClient = null;
  }

  /**
   * Get the API client
   * @returns The API client or null if not authenticated
   */
  static getApiClient(): ApiClient | null {
    return this.apiClient;
  }

  /**
   * Check if the user is authenticated
   * @returns Whether the user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.apiClient !== null;
  }
}

/**
 * Service for Google Drive connection operations
 */
export class ConnectionService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get Google Drive connections for the current user
   * @returns List of Google Drive connections
   */
  async getConnections(): Promise<Connection[]> {
    try {
      return await this.client.get<Connection[]>('/connections', {
        connection_provider: 'gdrive',
        limit: '10',
      });
    } catch (error) {
      console.error('Failed to get connections:', error);
      throw error;
    }
  }

  /**
   * Get a specific connection by ID
   * @param connectionId Connection ID
   * @returns Connection details
   */
  async getConnection(connectionId: string): Promise<Connection> {
    try {
      const connections = await this.client.get<Connection[]>('/connections', {
        connection_provider: 'gdrive',
        limit: '1',
      });

      const connection = connections.find(conn => conn.connection_id === connectionId);

      if (!connection) {
        throw new Error(`Connection with ID ${connectionId} not found`);
      }

      return connection;
    } catch (error) {
      console.error(`Failed to get connection ${connectionId}:`, error);
      throw error;
    }
  }

  /**
   * List resources (files/folders) in a directory
   * @param connectionId Connection ID
   * @param resourceId Resource ID of the directory (optional, root if not provided)
   * @param cursor Pagination cursor (optional)
   * @returns List of resources in the directory
   */
  async listResources(
    connectionId: string, 
    resourceId?: string, 
    cursor?: string
  ): Promise<PaginatedResponse<Resource>> {
    try {
      const endpoint = `/connections/${connectionId}/resources/children`;
      const queryParams: Record<string, string> = {};

      if (resourceId) {
        queryParams.resource_id = resourceId;
      }
      
      if (cursor) {
        queryParams.cursor = cursor;
      }

      return await this.client.get<PaginatedResponse<Resource>>(endpoint, queryParams);
    } catch (error) {
      console.error('Failed to list resources:', error);
      throw error;
    }
  }

  /**
   * Get details of a specific resource
   * @param connectionId Connection ID
   * @param resourceId Resource ID
   * @returns Resource details
   */
  async getResource(connectionId: string, resourceId: string): Promise<Resource> {
    try {
      const endpoint = `/connections/${connectionId}/resources`;
      const resources = await this.client.get<Resource[]>(endpoint, {
        resource_id: resourceId,
      });

      if (!resources || resources.length === 0) {
        throw new Error(`Resource with ID ${resourceId} not found`);
      }

      return resources[0];
    } catch (error) {
      console.error(`Failed to get resource ${resourceId}:`, error);
      throw error;
    }
  }
}

/**
 * Service for Knowledge Base operations
 */
export class KnowledgeBaseService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Create a new Knowledge Base
   * @param connectionId Connection ID
   * @param connectionSourceIds List of resource IDs to index
   * @param name Knowledge Base name
   * @param description Knowledge Base description
   * @returns Created Knowledge Base
   */
  async createKnowledgeBase(
    connectionId: string,
    connectionSourceIds: string[],
    name: string,
    description: string
  ): Promise<KnowledgeBase> {
    try {
      const data = {
        connection_id: connectionId,
        connection_source_ids: connectionSourceIds,
        name,
        description,
        indexing_params: {
          ocr: false,
          unstructured: true,
          embedding_params: { embedding_model: "text-embedding-ada-002", api_key: null },
          chunker_params: { chunk_size: 1500, chunk_overlap: 500, chunker: "sentence" },
        },
        org_level_role: null,
        cron_job_id: null,
      };

      return await this.client.post<KnowledgeBase>('/knowledge_bases', data);
    } catch (error) {
      console.error('Failed to create Knowledge Base:', error);
      throw error;
    }
  }

  /**
   * Sync a Knowledge Base to index the resources
   * @param knowledgeBaseId Knowledge Base ID
   * @returns Sync status
   */
  async syncKnowledgeBase(knowledgeBaseId: string): Promise<{ status: string }> {
    try {
      const orgId = this.client.getOrgId();
      const endpoint = `/knowledge_bases/sync/trigger/${knowledgeBaseId}/${orgId}`;

      return await this.client.get<{ status: string }>(endpoint);
    } catch (error) {
      console.error(`Failed to sync Knowledge Base ${knowledgeBaseId}:`, error);
      throw error;
    }
  }

  /**
   * List resources in a Knowledge Base
   * @param knowledgeBaseId Knowledge Base ID
   * @param resourcePath Path to the directory (default: root)
   * @param cursor Pagination cursor (optional)
   * @returns List of resources in the Knowledge Base
   */
  async listKnowledgeBaseResources(
    knowledgeBaseId: string,
    resourcePath: string = '/',
    cursor?: string
  ): Promise<PaginatedResponse<Resource>> {
    try {
      const endpoint = `/knowledge_bases/${knowledgeBaseId}/resources/children`;
      const queryParams: Record<string, string> = {
        resource_path: resourcePath,
      };
      
      if (cursor) {
        queryParams.cursor = cursor;
      }

      return await this.client.get<PaginatedResponse<Resource>>(endpoint, queryParams);
    } catch (error) {
      console.error(`Failed to list Knowledge Base resources for ${knowledgeBaseId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a resource from a Knowledge Base
   * @param knowledgeBaseId Knowledge Base ID
   * @param resourcePath Path to the resource
   * @returns Delete status
   */
  async deleteKnowledgeBaseResource(
    knowledgeBaseId: string,
    resourcePath: string
  ): Promise<{ status: string }> {
    try {
      const endpoint = `/knowledge_bases/${knowledgeBaseId}/resources`;

      return await this.client.delete<{ status: string }>(endpoint, {
        resource_path: resourcePath,
      });
    } catch (error) {
      console.error(`Failed to delete Knowledge Base resource ${resourcePath}:`, error);
      throw error;
    }
  }
}
