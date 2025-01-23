import type { Payment } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import type { ColumnDef } from '@tanstack/react-table';

interface ThreadListProps {
  columns: ColumnDef<Payment, string | number>[];
  getThreads: () => Promise<Payment[]>;
}

export async function ThreadList({ columns, getThreads }: ThreadListProps) {
  const threads = await getThreads();

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={threads}
        isVisibleCreateWithSearch={true}
      />
    </div>
  );
}
