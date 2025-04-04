import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";

const SkeletonRow = () => {
  return (
    <TableRow>
      <TableCell className="p-0">
        <Skeleton className="w-full h-[37.5px] rounded-none" />
      </TableCell>
      <TableCell className="p-0">
        <Skeleton className="w-full h-[37.5px] rounded-none" />
      </TableCell>
    </TableRow>
  );
};

export default SkeletonRow;