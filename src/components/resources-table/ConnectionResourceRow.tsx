import { Resource } from "@/domain/Resource";
import ConnectionDirectoryRow from "./ConnectionDirectoryRow";
import ConnectionFileRow from "./ConnectionFileRow";

interface ConnectionResourceRowProps {
  connectionId: string;
  resource: Resource;
  leftOffset?: number;
}

const ConnectionResourceRow = ({ connectionId, resource, leftOffset = 0 }: ConnectionResourceRowProps) => {
  return resource.inode_type === 'directory' ? (
    <ConnectionDirectoryRow
      connectionId={connectionId}
      resource={resource}
      leftOffset={leftOffset}
    />
  ) : (
    <ConnectionFileRow
      resource={resource}
      leftOffset={leftOffset}
    />
  );
};

export default ConnectionResourceRow;
