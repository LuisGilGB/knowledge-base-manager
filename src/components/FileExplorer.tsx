'use client';

import { useState, useCallback } from 'react';
import { useConnections, useResources, useKnowledgeBaseOperations } from '@/lib/api/hooks';
import { Connection } from '@/domain/Connection';
import { Resource } from '@/domain/Resource';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface FileExplorerProps {
  className?: string;
}

const FileExplorer = ({ className }: FileExplorerProps) => {
  // State for resource navigation
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id?: string; name: string }>>([{ name: 'Root' }]);

  // State for selected resources
  const [selectedResources, setSelectedResources] = useState<Record<string, Resource>>({});
  const [indexedResources, setIndexedResources] = useState<Record<string, boolean>>({});

  // State for sorting and filtering
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');

  // Knowledge Base operations
  const { createKnowledgeBase, syncKnowledgeBase, deleteKnowledgeBaseResource } = useKnowledgeBaseOperations();

  // Fetch connections using the hook
  const { data: connections, error: connectionsError, isLoading: isLoadingConnections } = useConnections();

  // Fetch resources using the hook
  const {
    data: resources,
    error: resourcesError,
    isLoading: isLoadingResources
  } = useResources(connectionId, currentFolderId);

  // Handle connection selection
  const handleConnectionSelect = (connection: Connection) => {
    setConnectionId(connection.connection_id);
    setCurrentFolderId(undefined);
    setBreadcrumbs([{ name: 'Root' }]);
    setSelectedResources({});
  };

  // Handle folder navigation
  const handleFolderClick = (resource: Resource) => {
    if (resource.inode_type === 'directory') {
      setCurrentFolderId(resource.resource_id);
      setBreadcrumbs([...breadcrumbs, { id: resource.resource_id, name: resource.name || 'Unnamed' }]);
      setSelectedResources({});
    }
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolderId(index === 0 ? undefined : newBreadcrumbs[index].id);
    setSelectedResources({});
  };

  // Handle resource selection
  const handleResourceSelect = (resource: Resource) => {
    setSelectedResources((prev) => {
      const newSelected = { ...prev };
      if (newSelected[resource.resource_id]) {
        delete newSelected[resource.resource_id];
      } else {
        newSelected[resource.resource_id] = resource;
      }
      return newSelected;
    });
  };

  // Index selected resources
  const handleIndexResources = async () => {
    if (!connectionId || Object.keys(selectedResources).length === 0) {
      toast.error('Please select at least one resource to index');
      return;
    }

    try {
      const resourceIds = Object.keys(selectedResources).map(key => selectedResources[key].resource_id);
      const knowledgeBase = await createKnowledgeBase(
        connectionId,
        resourceIds,
        `KB - ${new Date().toISOString()}`,
        'Created from File Explorer'
      );

      if (knowledgeBase) {
        await syncKnowledgeBase(knowledgeBase.knowledge_base_id);

        // Mark resources as indexed
        const newIndexedResources = { ...indexedResources };
        resourceIds.forEach(id => {
          newIndexedResources[id] = true;
        });
        setIndexedResources(newIndexedResources);

        toast.success('Resources indexed successfully');
      }
    } catch (error) {
      console.error('Failed to index resources:', error);
      toast.error('Failed to index resources');
    }
  };

  // De-index selected resources
  const handleDeIndexResources = async () => {
    if (!connectionId || Object.keys(selectedResources).length === 0) {
      toast.error('Please select at least one resource to de-index');
      return;
    }

    try {
      // In a real app, you would need to know which knowledge base these resources belong to
      // For this example, we'll assume we have a knowledgeBaseId
      const knowledgeBaseId = 'example-kb-id'; // This would come from your state or context

      const resourcePaths = Object.values(selectedResources).map(resource => resource.inode_path.path);

      for (const path of resourcePaths) {
        if (path) {
          await deleteKnowledgeBaseResource(knowledgeBaseId, path);
        }
      }

      // Mark resources as not indexed
      const newIndexedResources = { ...indexedResources };
      Object.keys(selectedResources).forEach(id => {
        newIndexedResources[id] = false;
      });
      setIndexedResources(newIndexedResources);

      toast.success('Resources de-indexed successfully');
    } catch (error) {
      console.error('Failed to de-index resources:', error);
      toast.error('Failed to de-index resources');
    }
  };

  // Sort resources
  const sortedResources = useCallback(() => {
    if (!resources) return [];

    return [...resources]
      .filter(resource =>
        filterText === '' ||
        (resource.name && resource.name.toLowerCase().includes(filterText.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return sortOrder === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else {
          const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return sortOrder === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        }
      });
  }, [resources, sortBy, sortOrder, filterText]);

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">File Explorer</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setSortBy('name');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
          >
            Sort by Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSortBy('date');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
          >
            Sort by Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name..."
          className="w-full p-2 border border-gray-300 rounded"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Connections */}
      {!connectionId && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Connections</h2>
          {isLoadingConnections ? (
            <p>Loading connections...</p>
          ) : connectionsError ? (
            <p className="text-red-500">Error loading connections: {connectionsError.message}</p>
          ) : connections && connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((connection) => (
                <Card
                  key={connection.connection_id}
                  onClick={() => handleConnectionSelect(connection)}
                  className="p-4 cursor-pointer hover:bg-gray-50"
                >
                  <h3 className="font-medium">{connection.name}</h3>
                  <p className="text-sm text-gray-500">{connection.connection_provider}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p>No connections found.</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      {connectionId && Object.keys(selectedResources).length > 0 && (
        <div className="flex space-x-2 mb-4">
          <Button onClick={handleIndexResources}>
            Index Selected
          </Button>
          <Button variant="outline" onClick={handleDeIndexResources}>
            De-index Selected
          </Button>
        </div>
      )}

      {/* Breadcrumbs */}
      {connectionId && (
        <div className="flex items-center space-x-2 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className="text-blue-500 hover:underline"
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      {connectionId && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Files & Folders</h2>
          {isLoadingResources ? (
            <p>Loading resources...</p>
          ) : resourcesError ? (
            <p className="text-red-500">Error loading resources: {resourcesError.message}</p>
          ) : resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedResources().map((resource) => (
                <div
                  key={resource.resource_id}
                  className={`border border-gray-200 rounded-lg p-4 ${resource.inode_type === 'directory' ? 'cursor-pointer hover:bg-gray-50' : ''
                    } ${selectedResources[resource.resource_id] ? 'bg-blue-50 border-blue-300' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Checkbox
                        id={`resource-${resource.resource_id}`}
                        checked={!!selectedResources[resource.resource_id]}
                        onCheckedChange={() => handleResourceSelect(resource)}
                        className="mr-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => resource.inode_type === 'directory' ? handleFolderClick(resource) : handleResourceSelect(resource)}
                      >
                        {resource.inode_type === 'directory' ? (
                          <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                        )}
                        <span className="truncate">{resource.name || 'Unnamed'}</span>
                      </div>
                    </div>
                    {indexedResources[resource.resource_id] && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Indexed</span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {resource.updated_at && new Date(resource.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No resources found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
