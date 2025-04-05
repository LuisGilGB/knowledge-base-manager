// Disclaimer: Mostly AI generated layer with focused edits. I don't like very much that some functions take 3 or more parameters, most of them primitives, instead
// of 1 or 2 objects. Good target for refactoring.

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
import useSWRInfinite from 'swr/infinite';

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
 * @param cursor Pagination cursor (optional)
 * @returns Cache key for resources
 */
export const getResourcesCacheKey = (connectionId: string, resourceId?: string, cursor?: string) => {
  return ['resources', connectionId, resourceId, cursor];
};

/**
 * Custom hook for fetching resources in a directory
 * @param connectionId Connection ID
 * @param resourceId Resource ID (optional, root if not provided)
 * @param cursor Pagination cursor (optional)
 * @param options SWR configuration and conditionalFlagging
 * @returns SWR response with resources
 */
export const useResources = (
  connectionId: string | null,
  resourceId?: string,
  cursor?: string,
  { enabled = true, ...config }: SWRConfiguration & { enabled?: boolean } = {}
): SWRResponse<PaginatedResponse<Resource>, Error> => {
  return useSWR(
    enabled && connectionId && AuthService.isAuthenticated()
      ? getResourcesCacheKey(connectionId, resourceId, cursor)
      : null,
    async () => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient || !connectionId) {
        throw new Error('Not authenticated or missing connectionId');
      }
      const connectionService = new ConnectionService(apiClient);
      return connectionService.listResources(connectionId, resourceId, cursor);
    },
    config
  );
};

/**
 * Custom hook for fetching Knowledge Base resources
 * @param knowledgeBaseId Knowledge Base ID
 * @param resourcePath Resource path (default: root)
 * @param cursor Pagination cursor (optional)
 * @param config SWR configuration
 * @returns SWR response with Knowledge Base resources
 */
export const useKnowledgeBaseResources = (
  knowledgeBaseId: string | null,
  resourcePath: string = '/',
  cursor?: string,
  { enabled = true, ...config }: SWRConfiguration & { enabled?: boolean } = {}
): SWRResponse<PaginatedResponse<Resource>, Error> => {
  return useSWR(
    enabled && knowledgeBaseId && AuthService.isAuthenticated()
      ? ['kb-resources', knowledgeBaseId, resourcePath, cursor]
      : null,
    async () => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient || !knowledgeBaseId) {
        throw new Error('Not authenticated or missing knowledgeBaseId');
      }
      const knowledgeBaseService = new KnowledgeBaseService(apiClient);
      return knowledgeBaseService.listKnowledgeBaseResources(knowledgeBaseId, resourcePath, cursor);
    },
    config
  );
};

/**
 * Custom hook for infinite loading of resources with cursor-based pagination
 * @param connectionId Connection ID
 * @param resourceId Resource ID (optional, root if not provided)
 * @param options SWR configuration and pagination options
 * @returns SWR infinite response with resources and utility functions
 */
export const useInfiniteResources = (
  connectionId: string | null,
  resourceId?: string,
  options: {
    initialSize?: number;
    enabled?: boolean;
    onSuccess?: (data: PaginatedResponse<Resource>) => void;
  } & SWRConfiguration = {}
) => {
  const { initialSize = 1, enabled = true, onSuccess, ...config } = options;

  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Resource> | null) => {
    if (!enabled || !connectionId || !AuthService.isAuthenticated()) return null;

    if (pageIndex === 0) return getResourcesCacheKey(connectionId, resourceId);

    if (previousPageData && !previousPageData.next_cursor) return null;

    return getResourcesCacheKey(connectionId, resourceId, previousPageData?.next_cursor ?? undefined);
  };

  const response = useSWRInfinite<PaginatedResponse<Resource>, Error>(
    getKey,
    async (key) => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient || !connectionId) {
        throw new Error('Not authenticated or missing connectionId');
      }

      const [, , , cursor] = key;

      const connectionService = new ConnectionService(apiClient);
      const result = await connectionService.listResources(connectionId, resourceId, cursor);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    },
    {
      ...config,
      initialSize,
    }
  );

  const resources = response.data?.flatMap(page => page.data) || [];

  const hasNextPage = response.data ? !!response.data[response.data.length - 1]?.next_cursor : false;

  const loadMore = () => {
    if (hasNextPage && !response.isValidating) {
      response.setSize(response.size + 1);
    }
  };

  return {
    ...response,
    resources,
    hasNextPage,
    loadMore,
  };
};

/**
 * Custom hook for infinite loading of Knowledge Base resources with cursor-based pagination
 * @param knowledgeBaseId Knowledge Base ID
 * @param resourcePath Resource path (default: root)
 * @param options SWR configuration and pagination options
 * @returns SWR infinite response with resources and utility functions
 */
export const useInfiniteKnowledgeBaseResources = (
  knowledgeBaseId: string | null,
  resourcePath: string = '/',
  options: {
    initialSize?: number;
    enabled?: boolean;
    onSuccess?: (data: PaginatedResponse<Resource>) => void;
  } & SWRConfiguration = {}
) => {
  const { initialSize = 1, enabled = true, onSuccess, ...config } = options;

  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Resource> | null) => {
    if (!enabled || !knowledgeBaseId || !AuthService.isAuthenticated()) return null;
    if (pageIndex === 0) return ['kb-resources', knowledgeBaseId, resourcePath];

    if (previousPageData && !previousPageData.next_cursor) return null;

    return ['kb-resources', knowledgeBaseId, resourcePath, previousPageData?.next_cursor];
  };

  // Use SWR's useSWRInfinite hook
  const response = useSWRInfinite<PaginatedResponse<Resource>, Error>(
    getKey,
    async (key) => {
      const apiClient = AuthService.getApiClient();
      if (!apiClient || !knowledgeBaseId) {
        throw new Error('Not authenticated or missing knowledgeBaseId');
      }

      const [, , , cursor] = key;

      const knowledgeBaseService = new KnowledgeBaseService(apiClient);
      const result = await knowledgeBaseService.listKnowledgeBaseResources(knowledgeBaseId, resourcePath, cursor);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    },
    {
      ...config,
      initialSize,
    }
  );

  const resources = response.data?.flatMap(page => page.data) || [];

  const hasNextPage = response.data ? !!response.data[response.data.length - 1]?.next_cursor : false;

  const loadMore = () => {
    if (hasNextPage && !response.isValidating) {
      response.setSize(response.size + 1);
    }
  };

  return {
    ...response,
    resources,
    hasNextPage,
    loadMore,
  };
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
        // Trigger sync after creation. We fire and forget because this is a background process.
        void knowledgeBaseService.syncKnowledgeBase(knowledgeBase.knowledge_base_id);
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
