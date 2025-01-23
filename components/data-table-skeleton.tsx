import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function DataTableSkeleton() {
  return (
    <div className="rounded-md border shadow mt-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">
              <Skeleton className="h-4 w-[200px]" />
            </TableHead>
            <TableHead className="max-md:hidden">
              <Skeleton className="h-4 w-[100px]" />
            </TableHead>
            <TableHead className="max-md:hidden">
              <Skeleton className="h-4 w-[50px]" />
            </TableHead>
            <TableHead className="max-md:hidden">
              <Skeleton className="h-4 w-[150px]" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={`skeleton-row-${crypto.randomUUID()}`}>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-[300px]" />
                  <div className="md:hidden">
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-md:hidden">
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell className="max-md:hidden">
                <Skeleton className="h-4 w-[50px]" />
              </TableCell>
              <TableCell className="max-md:hidden">
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
