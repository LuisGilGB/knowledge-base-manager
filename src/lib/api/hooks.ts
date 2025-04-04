/**
 * Custom hooks for API services using SWR
 */
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { AuthService, ConnectionService, KnowledgeBaseService } from './services';
import { Connection, KnowledgeBase, PaginatedResponse, Resource } from './types';

/**
 * Custom hook for fetching Google Drive connections
 * @param config SWR configuration
 * @returns SWR response with connections
 */
export const useConnections = (
  config?: SWRConfiguration
): SWRResponse<Connection[], Error> => {
  return useSWR(
    AuthService.isAuthenticated() ? 'connections' : null,
    async () => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient) {
        throw new Error('Not authenticated');
      }
      const connectionService = new ConnectionService(apiClient);
      return connectionService.getConnections();
    },
    config
  );
};

/**
 * Custom hook for fetching resources in a directory
 * @param connectionId Connection ID
 * @param resourceId Resource ID (optional, root if not provided)
 * @param config SWR configuration
 * @returns SWR response with resources
 */
export const useResources = (
  connectionId: string | null,
  resourceId?: string,
  config?: SWRConfiguration
): SWRResponse<PaginatedResponse<Resource>, Error> => {
  return useSWR(
    connectionId && AuthService.isAuthenticated()
      ? ['resources', connectionId, resourceId]
      : null,
    async () => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient || !connectionId) {
        throw new Error('Not authenticated or missing connectionId');
      }
      const connectionService = new ConnectionService(apiClient);
      return connectionService.listResources(connectionId, resourceId);
    },
    config
  );
};

/**
 * Custom hook for fetching Knowledge Base resources
 * @param knowledgeBaseId Knowledge Base ID
 * @param resourcePath Resource path (default: root)
 * @param config SWR configuration
 * @returns SWR response with Knowledge Base resources
 */
export const useKnowledgeBaseResources = (
  knowledgeBaseId: string | null,
  resourcePath: string = '/',
  config?: SWRConfiguration
): SWRResponse<Resource[], Error> => {
  return useSWR(
    knowledgeBaseId && AuthService.isAuthenticated()
      ? ['kb-resources', knowledgeBaseId, resourcePath]
      : null,
    async () => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient || !knowledgeBaseId) {
        throw new Error('Not authenticated or missing knowledgeBaseId');
      }
      const knowledgeBaseService = new KnowledgeBaseService(apiClient);
      return knowledgeBaseService.listKnowledgeBaseResources(knowledgeBaseId, resourcePath);
    },
    config
  );
};

/**
 * Custom hook for Knowledge Base operations
 * @returns Knowledge Base operations
 */
export const useKnowledgeBaseOperations = () => {
  return {
    createKnowledgeBase: async (
      connectionId: string,
      connectionSourceIds: string[],
      name: string,
      description: string
    ): Promise<KnowledgeBase | null> => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient) {
        throw new Error('Not authenticated');
      }
      const knowledgeBaseService = new KnowledgeBaseService(apiClient);
      return knowledgeBaseService.createKnowledgeBase(
        connectionId,
        connectionSourceIds,
        name,
        description
      );
    },

    syncKnowledgeBase: async (
      knowledgeBaseId: string
    ): Promise<{ status: string } | null> => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient) {
        throw new Error('Not authenticated');
      }
      const knowledgeBaseService = new KnowledgeBaseService(apiClient);
      return knowledgeBaseService.syncKnowledgeBase(knowledgeBaseId);
    },

    deleteKnowledgeBaseResource: async (
      knowledgeBaseId: string,
      resourcePath: string
    ): Promise<{ status: string } | null> => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient) {
        throw new Error('Not authenticated');
      }
      const knowledgeBaseService = new KnowledgeBaseService(apiClient);
      return knowledgeBaseService.deleteKnowledgeBaseResource(knowledgeBaseId, resourcePath);
    },
  };
};
