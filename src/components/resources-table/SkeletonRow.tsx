import { TableRow } from "@/components/ui/table";
import SkeletonCell from "./cells/SkeletonCell";

const SkeletonRow = () => {
  return (
    <TableRow>
      <SkeletonCell />
      <SkeletonCell />
      <SkeletonCell />
    </TableRow>
  );
};

export default SkeletonRow;