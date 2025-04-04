import { TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCellProps {
  className?: string;
}

const SkeletonCell = ({ className }: SkeletonCellProps) => {
  return (
    <TableCell className={cn("p-0", className)}>
      <Skeleton className="w-full h-[37.5px] rounded-none" />
    </TableCell>
  );
};

export default SkeletonCell;
