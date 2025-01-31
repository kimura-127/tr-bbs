import type { Payment } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import type { ThreadType } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

interface ThreadListProps {
  columns: ColumnDef<Payment, string | number>[];
  getThreads: () => Promise<Payment[]>;
  threadType: ThreadType;
}

export async function ThreadList({
  columns,
  getThreads,
  threadType,
}: ThreadListProps) {
  const threads = await getThreads();

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={threads}
        isVisibleCreateWithSearch={true}
        threadType={threadType}
      />
    </div>
  );
}
