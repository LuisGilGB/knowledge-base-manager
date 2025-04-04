'use client';

import { useKnowledgeBaseResources } from "@/lib/api/hooks";
import { KnowledgeBase, Resource } from "@/lib/api/types";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface KnowledgeBaseContextType {
  currentKnowledgeBase: KnowledgeBase | null;
  setCurrentKnowledgeBase: (knowledgeBase: KnowledgeBase | null) => void;
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
  knowledgeBaseResources: Resource[];
  isLoadingResources: boolean;
  resourcesError: Error | null;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const KnowledgeBaseProvider = ({ children }: { children: ReactNode }) => {
  const [currentKnowledgeBase, setCurrentKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

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
    }
  );
  console.log({ resources, isLoading, error });
  const contextValue = useMemo(() => ({
    currentKnowledgeBase,
    setCurrentKnowledgeBase,
    isSyncing,
    setIsSyncing,
    knowledgeBaseResources: resources || [],
    isLoadingResources: isLoading,
    resourcesError: error || null,
  }), [
    currentKnowledgeBase,
    isSyncing,
    resources,
    isLoading,
    error
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
