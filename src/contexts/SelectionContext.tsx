'use client';

import { Resource } from "@/lib/api/types";
import { createContext, useContext, useState, ReactNode } from "react";

interface SelectionContextType {
  selectedResources: Record<string, Resource>;
  toggleSelection: (resource: Resource) => void;
  isSelected: (resourceId: string) => boolean;
  clearSelection: () => void;
  selectAll: (resources: Resource[]) => void;
  getSelectedCount: () => number;
  getSelectedResources: () => Resource[];
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  // Could we use a Set instead of an object? Perhaps, but given we have strings as keys, it's not such a big deal.
  const [selectedResources, setSelectedResources] = useState<Record<string, Resource>>({});

  const toggleSelection = (resource: Resource) => {
    setSelectedResources(prev => {
      const newSelection = { ...prev };
      if (newSelection[resource.resource_id]) {
        delete newSelection[resource.resource_id];
      } else {
        newSelection[resource.resource_id] = resource;
      }
      return newSelection;
    });
  };

  const isSelected = (resourceId: string) => {
    return !!selectedResources[resourceId];
  };

  const clearSelection = () => {
    setSelectedResources({});
  };

  const selectAll = (resources: Resource[]) => {
    const newSelection = { ...selectedResources };
    resources.forEach(resource => {
      newSelection[resource.resource_id] = resource;
    });
    setSelectedResources(newSelection);
  };

  const getSelectedCount = () => {
    return Object.keys(selectedResources).length;
  };

  const getSelectedResources = () => {
    return Object.values(selectedResources);
  };

  return (
    <SelectionContext
      value={{
        selectedResources,
        toggleSelection,
        isSelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedResources
      }}
    >
      {children}
    </SelectionContext>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
