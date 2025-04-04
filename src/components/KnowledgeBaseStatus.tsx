'use client';

import { useKnowledgeBase } from "@/contexts/KnowledgeBaseContext";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2, FileText, Folder } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { getResourceName } from "./resources-table/utils";

const KnowledgeBaseStatus = () => {
  const {
    currentKnowledgeBase,
    isSyncing,
    knowledgeBaseResources,
    isLoadingResources
  } = useKnowledgeBase();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  if (!currentKnowledgeBase) {
    return null;
  }

  const fileCount = knowledgeBaseResources.filter(r => r.inode_type !== 'directory').length;
  const folderCount = knowledgeBaseResources.filter(r => r.inode_type === 'directory').length;

  return (
    <Alert className={cn(
      "flex flex-col",
      isSyncing ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"
    )}>
      <div className="flex items-center self-stretch">
        {isSyncing ? (
          <Loader2 className="size-4 text-yellow-600 animate-spin mr-2" />
        ) : (
          <CheckCircle className="size-4 text-green-600 mr-2" />
        )}
        <div className="flex-1">
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
        <div className="flex items-center gap-2">
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

      {knowledgeBaseResources.length > 0 && (
        <Collapsible
          open={isResourcesOpen}
          onOpenChange={setIsResourcesOpen}
          className="mt-2 self-end flex flex-col items-end"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-[120px] justify-center text-xs py-0 h-6"
            >
              {isResourcesOpen ? "Hide resources" : "Show resources"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-2 max-h-[200px] overflow-y-auto gap-y-1 pl-6">
              {knowledgeBaseResources.map((resource) => (
                <li
                  key={resource.resource_id}
                  className="flex items-center justify-end gap-2 text-xs py-1"
                >
                  {resource.inode_type === 'directory' ? (
                    <Folder className="size-3 text-blue-500 shrink-0" />
                  ) : (
                    <FileText className="size-3 shrink-0" />
                  )}
                  <span className={cn(
                    "truncate",
                    resource.inode_type === 'directory' && "font-medium"
                  )}>
                    {getResourceName(resource)}
                  </span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Alert>
  );
};

export default KnowledgeBaseStatus;
