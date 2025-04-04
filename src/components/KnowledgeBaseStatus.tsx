'use client';

import { useKnowledgeBase } from "@/contexts/KnowledgeBaseContext";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const KnowledgeBaseStatus = () => {
  const { currentKnowledgeBase, isSyncing } = useKnowledgeBase();

  if (!currentKnowledgeBase) {
    return null;
  }

  return (
    <Alert className={cn(
      "flex items-center",
      isSyncing ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"
    )}>
      {isSyncing ? (
        <Loader2 className="size-4 text-yellow-600 animate-spin mr-2" />
      ) : (
        <CheckCircle className="size-4 text-green-600 mr-2" />
      )}
      <div>
        <AlertTitle className="text-sm font-medium">
          {isSyncing ? "Syncing knowledge base..." : "Knowledge base created"}
        </AlertTitle>
        <AlertDescription className="text-xs">
          {isSyncing
            ? `"${currentKnowledgeBase.name}" is being synced. This may take a few moments.`
            : `"${currentKnowledgeBase.name}" has been created successfully.`
          }
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default KnowledgeBaseStatus;
