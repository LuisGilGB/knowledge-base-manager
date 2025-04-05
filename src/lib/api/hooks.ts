// Disclaimer: Mostly AI generated layer with focused edits. I don't like very much that some functions take 3 or more parameters, most of them primitives, instead
// of 1 or 2 objects. Good target for refactoring.

/**
 * Custom hooks for API services using SWR
 */
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import { AuthService, ConnectionService, KnowledgeBaseService } from './services';
import { Connection } from '@/domain/Connection';
import { Resource } from '@/domain/Resource';
import { KnowledgeBase } from '@/domain/KnowledgeBase';
import { PaginatedResponse } from './types';
import useSWRInfinite from 'swr/infinite';
import { toast } from 'sonner';
import { useCallback } from 'react';

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

  const deindexMutate = useCallback(async (knowledgeBaseId: string, resourcePath: string) => {
    const predictedData = response.data?.map(d => ({
      ...d,
      data: d.data.map((r) => r.inode_path.path === resourcePath ? { ...r, status: 'pending_delete' as Resource['status'] } : r)
    }));
    response.mutate(predictedData, false);
    try {
      const apiClient = AuthService.getApiClient();
      if (!apiClient) {
        throw new Error('Not authenticated');
      }
      const knowledgeBaseService = new KnowledgeBaseService(apiClient);
      await knowledgeBaseService.deleteKnowledgeBaseResource(
        knowledgeBaseId,
        resourcePath
      );
      toast.success('Resource de-indexed successfully');
    } catch (error) {
      console.error(error);
      response.mutate(undefined, false);
      toast.error('Failed to de-index resource');
    }
  }, [response]);

  return {
    ...response,
    resources,
    hasNextPage,
    loadMore,
    deindexMutate,
  };
};

/**
 * Type for knowledge base creation parameters
 */
export interface CreateKnowledgeBaseParams {
  connectionId: string;
  connectionSources: Resource[];
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
      const { connectionId, connectionSources, name, description } = arg;
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
        connectionSources.map(r => r.resource_id),
        name,
        description
      );

      // TODO: Mutate the resources cache for the new knowledge base optimistically
      // const expectedKey = ['kb-resources', knowledgeBase.knowledge_base_id, '/', undefined];
      // mutate(expectedKey, connectionSources.map(r => ({ ...r, status: 'pending' as Resource['status'] })));

      if (options.onCreationCompleted) {
        options.onCreationCompleted(arg, knowledgeBase);
      }
      toast("Success", {
        description: "Knowledge base created successfully. Syncing started, this may take a while...",
      });

      // Trigger sync after creation. We fire and forget because this is a background process.
      void knowledgeBaseService.syncKnowledgeBase(knowledgeBase.knowledge_base_id);
      if (options.onSyncRequested) {
        options.onSyncRequested(arg);
      }

      // Add a delay of 10 seconds to let this sync (it'd be better to optimistically set the cache for the resources list, but this is better
      // than navigating to an empty page).
      await new Promise(resolve => setTimeout(resolve, 10_000));

      return knowledgeBase;
    }
  );
};
