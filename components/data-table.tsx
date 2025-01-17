'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const TABLE_RESPONSIVE_INDEX = 0;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isVisibleSearch: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isVisibleSearch,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  return (
    <div>
      {isVisibleSearch && (
        <div className="flex items-center">
          <Input
            placeholder={'装備・アイテムを検索'}
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className="max-w-lg mt-3"
          />
        </div>
      )}
      <div className="rounded-md border shadow mt-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        index === TABLE_RESPONSIVE_INDEX ? '' : 'max-md:hidden'
                      }
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
                        className={`${cell.column.id === 'title' ? 'w-2/3' : ''} ${index === TABLE_RESPONSIVE_INDEX ? '' : 'max-md:hidden'}`}
                        key={cell.id}
                        onClick={() => {
                          console.log(tableCells[2].getValue());
                        }}
                      >
                        <div className="flex flex-col">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                          <div className="md:hidden">
                            （{String(tableCells[2].getValue())}）
                          </div>
                        </div>
                        <div className="md:hidden flex gap-2">
                          <p>{String(tableCells[3].getValue())}</p>:
                          <p>{String(tableCells[1].getValue())}</p>
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
