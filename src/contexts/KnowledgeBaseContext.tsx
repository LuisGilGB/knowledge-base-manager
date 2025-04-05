'use client';

import { useKnowledgeBaseResources } from "@/lib/api/hooks";
import { Resource } from '@/domain/Resource';
import { KnowledgeBase } from '@/domain/KnowledgeBase';
import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";

export type ResourceStatus = NonNullable<Resource['status']>;
export type ResourceStatusMap = Record<string, ResourceStatus>;

interface KnowledgeBaseContextType {
  currentKnowledgeBase: KnowledgeBase | null;
  setCurrentKnowledgeBase: (knowledgeBase: KnowledgeBase | null) => void;
  knowledgeBaseResources: Resource[];
  isLoadingResources: boolean;
  resourcesError: Error | null;
  resourceStatusMap: ResourceStatusMap;
  setResourcesAsPending: (resourceIds: string[]) => void;
  markResourceAs: (resourceId: string, status: ResourceStatus) => void;
  clearResourceStatus: () => void;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const KnowledgeBaseProvider = ({ children }: { children: ReactNode }) => {
  const [currentKnowledgeBase, setCurrentKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [resourceStatusMap, setResourceStatusMap] = useState<ResourceStatusMap>({});

  const { data: { data: resources } = { data: [] }, error, isLoading } = useKnowledgeBaseResources(
    currentKnowledgeBase?.knowledge_base_id || null,
    '/',
    {
      // Keep previous data while loading new data
      keepPreviousData: true,
      onSuccess: (data) => {
        setResourceStatusMap(prevMap => {
          const newMap = { ...prevMap };
          data.data.forEach((resource: Resource) => {
            if (!resource.status) {
              delete newMap[resource.resource_id];
            } else {
              newMap[resource.resource_id] = resource.status;
            }
          });
          return newMap;
        });
      }
    }
  );

  const setResourcesAsPending = useCallback((resourceIds: string[]) => {
    setResourceStatusMap(prevMap => {
      const newMap = { ...prevMap };
      resourceIds.forEach(id => {
        newMap[id] = 'pending';
      });
      return newMap;
    });
  }, [setResourceStatusMap]);

  const markResourceAs = useCallback((resourceId: string, status: ResourceStatus) => {
    setResourceStatusMap(prevMap => {
      const newMap = { ...prevMap };
      newMap[resourceId] = status;
      return newMap;
    });
  }, [setResourceStatusMap]);

  const clearResourceStatus = useCallback(() => {
    setResourceStatusMap({});
  }, [setResourceStatusMap]);

  const contextValue = useMemo(() => ({
    currentKnowledgeBase,
    setCurrentKnowledgeBase,
    knowledgeBaseResources: resources || [],
    isLoadingResources: isLoading,
    resourcesError: error || null,
    resourceStatusMap,
    setResourcesAsPending,
    markResourceAs,
    clearResourceStatus
  }), [
    currentKnowledgeBase,
    resources,
    isLoading,
    error,
    resourceStatusMap,
    setResourcesAsPending,
    markResourceAs,
    clearResourceStatus
  ]);

  return (
    <KnowledgeBaseContext value={contextValue}>
      {children}
    </KnowledgeBaseContext>
  );
};

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (context === undefined) {
    throw new Error("useKnowledgeBase must be used within a KnowledgeBaseProvider");
  }
  return context;
};
