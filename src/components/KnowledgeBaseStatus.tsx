'use client';

import { useKnowledgeBase } from "@/contexts/KnowledgeBaseContext";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2, FileText, Folder } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";

const KnowledgeBaseStatus = () => {
  const {
    currentKnowledgeBase,
    isSyncing,
    knowledgeBaseResources,
    isLoadingResources
  } = useKnowledgeBase();

  if (!currentKnowledgeBase) {
    return null;
  }

  const fileCount = knowledgeBaseResources.filter(r => r.inode_type !== 'directory').length;
  const folderCount = knowledgeBaseResources.filter(r => r.inode_type === 'directory').length;

  return (
    <Alert className={cn(
      "flex flex-col overflow-hidden",
      isSyncing ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"
    )}>
      <div className="flex items-center gap-2 self-stretch">
        {isSyncing ? (
          <Loader2 className="size-4 min-w-4 text-yellow-600 animate-spin mr-2" />
        ) : (
          <CheckCircle className="size-4 min-w-4 text-green-600 mr-2" />
        )}
        <div className="flex-1 overflow-hidden">
          <AlertTitle className="text-sm font-medium">
            {isSyncing ? "Syncing knowledge base..." : "Knowledge base created"}
          </AlertTitle>
          <AlertDescription className="text-xs truncate">
            {isSyncing
              ? `"${currentKnowledgeBase.name}" is being synced. This may take a few moments.`
              : `"${currentKnowledgeBase.name}" has been created successfully.`
            }
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2 overflow-hidden">
          {isLoadingResources ? (
            <Loader2 className="size-3 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Badge variant="outline" className="text-xs bg-white">
                <FileText className="size-3 mr-1" />
                {fileCount} {fileCount === 1 ? 'file' : 'files'}
              </Badge>
              <Badge variant="outline" className="text-xs bg-white">
                <Folder className="size-3 mr-1" />
                {folderCount} {folderCount === 1 ? 'folder' : 'folders'}
              </Badge>
            </>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default KnowledgeBaseStatus;
