import { Resource } from "@/domain/Resource";
import DirectoryRow from "./DirectoryRow";
import FileRow from "./FileRow";

interface ResourceRowProps {
  connectionId: string;
  resource: Resource;
  leftOffset?: number;
}

const ResourceRow = ({ connectionId, resource, leftOffset = 0 }: ResourceRowProps) => {
  return resource.inode_type === 'directory' ? (
    <DirectoryRow
      connectionId={connectionId}
      resource={resource}
      leftOffset={leftOffset}
    />
  ) : (
    <FileRow
      connectionId={connectionId}
      resource={resource}
      leftOffset={leftOffset}
    />
  );
};

export default ResourceRow;
