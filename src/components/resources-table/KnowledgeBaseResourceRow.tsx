import { Resource } from "@/domain/Resource";
import KnowledgeBaseDirectoryRow from "./KnowledgeBaseDirectoryRow";
import KnowledgeBaseFileRow from "./KnowledgeBaseFileRow";

interface KnowledgeBaseResourceRowProps {
  knowledgeBaseId: string;
  resource: Resource;
  leftOffset?: number;
  isDeindexing?: boolean;
  onDeindexClick: (resourcePath: string) => void;
}

const KnowledgeBaseResourceRow = ({ knowledgeBaseId, resource, leftOffset = 0, isDeindexing, onDeindexClick }: KnowledgeBaseResourceRowProps) => {
  return resource.inode_type === 'directory' ? (
    <KnowledgeBaseDirectoryRow
      knowledgeBaseId={knowledgeBaseId}
      resource={resource}
      leftOffset={leftOffset}
    />
  ) : (
    <KnowledgeBaseFileRow
      resource={resource}
      leftOffset={leftOffset}
      isDeindexing={isDeindexing}
      onDeindexClick={onDeindexClick}
    />
  );
};

export default KnowledgeBaseResourceRow;
