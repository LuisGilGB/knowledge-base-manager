import useToggle from "@/hooks/useToggle";
import { useCallback, useState } from "react";

const useNestedResources = (initialExpanded = false) => {
  const [expanded, toggleExpanded] = useToggle(initialExpanded);
  const [prefetchTriggered, setPrefetchTriggered] = useState(false);

  const prefetchChildren = useCallback(() => {
    setPrefetchTriggered(true);
  }, []);

  return {
    expanded,
    prefetchTriggered,
    toggleExpanded,
    prefetchChildren
  };
};

export default useNestedResources;
