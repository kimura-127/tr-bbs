'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { RotateCw } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreateThreadForm } from './CreateThreadForm';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isVisibleCreateWithSearch: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isVisibleCreateWithSearch,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const router = useRouter();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      router.refresh();
      toast({
        description: '記事一覧を更新しました',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: '更新中にエラーが発生しました',
      });
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }
  };

  return (
    <div>
      <div className="flex justify-start gap-6">
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="max-md:hidden bg-gray-700 hover:bg-gray-800 font-semibold text-base"
        >
          <RotateCw className={isRefreshing ? 'animate-spin' : ''} />
          更新
        </Button>

        {isVisibleCreateWithSearch && (
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h- bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
                  <SquarePen />
                  新規作成
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-screen overflow-auto pb-32">
                <DialogHeader>
                  <DialogTitle>新規スレッド作成</DialogTitle>
                  <DialogDescription className="py-2">
                    タイトルとコメントを入力してください
                  </DialogDescription>
                </DialogHeader>
                <CreateThreadForm setIsDialogOpen={setIsDialogOpen} />
              </DialogContent>
            </Dialog>
          </div>
        )}
        <Input
          placeholder={'装備・アイテムを検索'}
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="rounded-md border shadow mt-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`
                        ${index === 0 ? 'w-[60%]' : ''} 
                        ${index > 0 ? 'max-md:hidden' : ''}
                      `}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const tableCells = row.getVisibleCells();

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {tableCells.map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`
                          ${index === 0 ? 'w-[60%] p-0' : ''} 
                          ${index > 0 ? 'max-md:hidden' : ''}
                          ${cell.row.getIsExpanded() ? 'pb-0' : ''}
                        `}
                      >
                        <div className="flex flex-col">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                          {index === 0 && (
                            <div className="md:hidden text-xs text-muted-foreground py-1 px-4 bg-gray-50">
                              <div className="flex gap-2">
                                <span>
                                  {tableCells[1].getValue() as string}
                                </span>
                                <span>•</span>
                                <span>
                                  {tableCells[2].getValue() as string}件
                                </span>
                              </div>
                              <div>{tableCells[3].getValue() as string}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  結果が取得できませんでした
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          前へ
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          次へ
        </Button>
      </div>
    </div>
  );
}
