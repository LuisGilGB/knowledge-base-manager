/**
 * Custom hooks for API services using SWR
 */
import useSWR, { SWRConfiguration, SWRResponse, mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { AuthService, ConnectionService, KnowledgeBaseService } from './services';
import { Connection } from '@/domain/Connection';
import { Resource } from '@/domain/Resource';
import { KnowledgeBase } from '@/domain/KnowledgeBase';
import { PaginatedResponse } from './types';

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
 * Helper function to get the cache key for resources
 * @param connectionId Connection ID
 * @param resourceId Resource ID (optional)
 * @returns Cache key for resources
 */
export const getResourcesCacheKey = (connectionId: string, resourceId?: string) => {
  return ['resources', connectionId, resourceId];
};

/**
 * Custom hook for fetching resources in a directory
 * @param connectionId Connection ID
 * @param resourceId Resource ID (optional, root if not provided)
 * @param options SWR configuration and conditionalFlagging
 * @returns SWR response with resources
 */
export const useResources = (
  connectionId: string | null,
  resourceId?: string,
  { enabled = true, ...config }: SWRConfiguration & { enabled?: boolean } = {}
): SWRResponse<PaginatedResponse<Resource>, Error> => {
  return useSWR(
    enabled && connectionId && AuthService.isAuthenticated()
      ? getResourcesCacheKey(connectionId, resourceId)
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
  config: SWRConfiguration = {}
): SWRResponse<PaginatedResponse<Resource>, Error> => {
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
 * Type for knowledge base creation parameters
 */
export interface CreateKnowledgeBaseParams {
  connectionId: string;
  connectionSourceIds: string[];
  name: string;
  description: string;
}

/**
 * Custom hook for creating a knowledge base using SWR mutation
 * @returns SWR mutation response
 */
export const useCreateKnowledgeBase = (options: {
  onBeforeCreationRequest?: (params: CreateKnowledgeBaseParams) => void;
  onCreationCompleted?: (params: CreateKnowledgeBaseParams, knowledgeBase: KnowledgeBase) => void;
  onBeforeSyncRequest?: (params: CreateKnowledgeBaseParams) => void;
  onSyncRequested?: (params: CreateKnowledgeBaseParams) => void;
} = {}) => {
  return useSWRMutation(
    'create-knowledge-base',
    async (_key: string, { arg }: { arg: CreateKnowledgeBaseParams }) => {
      const { connectionId, connectionSourceIds, name, description } = arg;
      const apiClient = AuthService.getApiClient();
      if (!apiClient) {
        throw new Error('Not authenticated');
      }
      const knowledgeBaseService = new KnowledgeBaseService(apiClient);

      if (options.onBeforeCreationRequest) {
        options.onBeforeCreationRequest(arg);
      }
      const knowledgeBase = await knowledgeBaseService.createKnowledgeBase(
        connectionId,
        connectionSourceIds,
        name,
        description
      );

      if (options.onCreationCompleted) {
        options.onCreationCompleted(arg, knowledgeBase);
      }

      if (knowledgeBase) {
        if (options.onBeforeSyncRequest) {
          options.onBeforeSyncRequest(arg);
        }
        // Trigger sync after creation
        await knowledgeBaseService.syncKnowledgeBase(knowledgeBase.knowledge_base_id);

        if (options.onSyncRequested) {
          options.onSyncRequested(arg);
        }
        // Revalidate the resources cache for the connection
        // This will refresh the resource list in the UI
        await mutate((key) => {
          // Match any cache key that starts with ['resources', connectionId]
          if (Array.isArray(key) &&
            key.length >= 2 &&
            key[0] === 'resources' &&
            key[1] === connectionId) {
            return true;
          }
          return false;
        });
      }

      return knowledgeBase;
    }
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

/**
 * Interface for de-indexing a resource
 */
export interface DeindexResourceParams {
  knowledgeBaseId: string;
  resourceId: string;
  resourcePath: string;
}

/**
 * Custom hook for de-indexing a resource using SWR mutation
 * @returns SWR mutation for de-indexing a resource
 */
export const useDeindexResource = () => {
  return useSWRMutation(
    'deindex-resource',
    async (_key: string, { arg }: { arg: DeindexResourceParams }) => {
      const { knowledgeBaseId, resourceId, resourcePath } = arg;
      const apiClient = AuthService.getApiClient();
      if (!apiClient) {
        throw new Error('Not authenticated');
      }
      const knowledgeBaseService = new KnowledgeBaseService(apiClient);

      const result = await knowledgeBaseService.deleteKnowledgeBaseResource(
        knowledgeBaseId,
        resourcePath
      );

      // Revalidate the knowledge base resources cache
      await mutate((key) => {
        // Match any cache key that starts with ['kb-resources', knowledgeBaseId]
        if (Array.isArray(key) &&
          key.length >= 2 &&
          key[0] === 'kb-resources' &&
          key[1] === knowledgeBaseId) {
          return true;
        }
        return false;
      });

      return { ...result, resourceId };
    }
  );
};
