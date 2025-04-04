'use client';

import { useKnowledgeBaseResources } from "@/lib/api/hooks";
import { KnowledgeBase, Resource } from "@/lib/api/types";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export type ResourceStatus = Resource['status'];
export type ResourceStatusMap = Record<string, ResourceStatus>;

interface KnowledgeBaseContextType {
  currentKnowledgeBase: KnowledgeBase | null;
  setCurrentKnowledgeBase: (knowledgeBase: KnowledgeBase | null) => void;
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
  knowledgeBaseResources: Resource[];
  isLoadingResources: boolean;
  resourcesError: Error | null;
  resourceStatusMap: ResourceStatusMap;
  setResourcesAsPending: (resourceIds: string[]) => void;
  clearResourceStatus: () => void;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const KnowledgeBaseProvider = ({ children }: { children: ReactNode }) => {
  const [currentKnowledgeBase, setCurrentKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [resourceStatusMap, setResourceStatusMap] = useState<ResourceStatusMap>({});

  const { data: { data: resources } = { data: [] }, error, isLoading } = useKnowledgeBaseResources(
    currentKnowledgeBase?.knowledge_base_id || null,
    '/',
    {
      // Refresh data every 5 seconds while syncing
      refreshInterval: isSyncing ? 5000 : 0,
      // Don't revalidate on focus while syncing to avoid too many requests
      revalidateOnFocus: !isSyncing,
      // Keep previous data while loading new data
      keepPreviousData: true,
      onSuccess: (data) => {
        setResourceStatusMap(prevMap => {
          const newMap = { ...prevMap };
          data.data.forEach((resource: Resource) => {
            newMap[resource.resource_id] = resource.status;
          });
          return newMap;
        });
      }
    }
  );

  const setResourcesAsPending = (resourceIds: string[]) => {
    setResourceStatusMap(prevMap => {
      const newMap = { ...prevMap };
      resourceIds.forEach(id => {
        newMap[id] = 'pending';
      });
      return newMap;
    });
  };

  const clearResourceStatus = () => {
    setResourceStatusMap({});
  };

  const contextValue = useMemo(() => ({
    currentKnowledgeBase,
    setCurrentKnowledgeBase,
    isSyncing,
    setIsSyncing,
    knowledgeBaseResources: resources || [],
    isLoadingResources: isLoading,
    resourcesError: error || null,
    resourceStatusMap,
    setResourcesAsPending,
    clearResourceStatus
  }), [
    currentKnowledgeBase,
    isSyncing,
    resources,
    isLoading,
    error,
    resourceStatusMap
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
