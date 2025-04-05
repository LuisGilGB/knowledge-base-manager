import { Resource } from "@/domain/Resource";
import KnowledgeBaseDirectoryRow from "./KnowledgeBaseDirectoryRow";
import KnowledgeBaseFileRow from "./KnowledgeBaseFileRow";

interface KnowledgeBaseResourceRowProps {
  knowledgeBaseId: string;
  resource: Resource;
  leftOffset?: number;
}

const KnowledgeBaseResourceRow = ({ knowledgeBaseId, resource, leftOffset = 0 }: KnowledgeBaseResourceRowProps) => {
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
    />
  );
};

export default KnowledgeBaseResourceRow;
