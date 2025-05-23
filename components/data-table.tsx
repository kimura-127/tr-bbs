'use client';

import { PAGINATION_PAGE_SIZE } from '@/app/constant';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SignedIn, SignedOut } from '@clerk/nextjs';
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
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isVisibleCreateWithSearch: boolean;
  threadType: 'free-talk' | 'avatar' | 'trade';
}

// ダイナミックインポートの設定
const PlaceholdersAndVanishInput = dynamic(
  () =>
    import('./ui/placeholder-and-vinish-input').then(
      (mod) => mod.PlaceholdersAndVanishInput
    ),
  {
    ssr: false, // クライアントサイドのみでレンダリング
  }
);

export function DataTable<TData, TValue>({
  columns,
  data,
  isVisibleCreateWithSearch,
  threadType,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: PAGINATION_PAGE_SIZE,
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const title = String(row.getValue('title')).toLowerCase();
      const content = String(row.getValue('content')).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();
      return title.includes(searchValue) || content.includes(searchValue);
    },
    state: {
      columnFilters,
      globalFilter,
    },
  });

  const router = useRouter();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      router.refresh();
      toast.info('記事一覧を更新しました');
    } catch (error) {
      toast.warning('更新中にエラーが発生しました');
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex justify-start gap-6">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="max-md:hidden bg-gray-700 hover:bg-gray-800 font-semibold text-base dark:text-white"
          >
            <RotateCw className={isRefreshing ? 'animate-spin' : ''} />
            更新
          </Button>
          {isVisibleCreateWithSearch && (
            <div>
              <SignedIn>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gray-700 hover:bg-gray-800 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide max-md:text-xs dark:text-white">
                      <SquarePen className="max-sm:hidden" />
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
                    <CreateThreadForm
                      threadType={threadType}
                      setIsDialogOpen={setIsDialogOpen}
                    />
                  </DialogContent>
                </Dialog>
              </SignedIn>
              <SignedOut>
                <Button
                  onClick={() =>
                    toast.warning('ログインしてから作成してください')
                  }
                  className="bg-gray-700 hover:bg-gray-800 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide max-md:text-xs dark:text-white"
                >
                  <SquarePen className="max-sm:hidden" />
                  新規作成
                </Button>
              </SignedOut>
            </div>
          )}
        </div>
        <div>
          <PlaceholdersAndVanishInput
            placeholders={['装備を検索', 'アイテムを検索']}
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              setGlobalFilter('');
            }}
          />
        </div>
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
      <div className="rounded-md border shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-nowrap
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
                            <div className="md:hidden text-xs text-muted-foreground py-1 px-4 bg-gray-50 dark:bg-gray-900">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex gap-2">
                                    <span>
                                      {tableCells[2].getValue()?.toString()}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {tableCells[4].getValue()?.toString() ??
                                        '0'}
                                      件
                                    </span>
                                  </div>
                                  <div>
                                    閲覧数:
                                    {tableCells[3].getValue()?.toString()}
                                  </div>
                                </div>
                                {tableCells[5] && (
                                  <div className="py-1">
                                    {flexRender(
                                      tableCells[tableCells.length - 1].column
                                        .columnDef.cell,
                                      tableCells[
                                        tableCells.length - 1
                                      ].getContext()
                                    )}
                                  </div>
                                )}
                              </div>
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
