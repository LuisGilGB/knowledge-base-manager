'use client';

import { KnowledgeBase } from "@/lib/api/types";
import { createContext, useContext, useState, ReactNode } from "react";

interface KnowledgeBaseContextType {
  currentKnowledgeBase: KnowledgeBase | null;
  setCurrentKnowledgeBase: (knowledgeBase: KnowledgeBase | null) => void;
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const KnowledgeBaseProvider = ({ children }: { children: ReactNode }) => {
  const [currentKnowledgeBase, setCurrentKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <KnowledgeBaseContext
      value={{
        currentKnowledgeBase,
        setCurrentKnowledgeBase,
        isSyncing,
        setIsSyncing
      }}
    >
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
