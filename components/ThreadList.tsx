import { getThreads } from '@/app/actions/getThread';
import { columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';

export async function ThreadList() {
  const threads = await getThreads();

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={threads} isVisibleSearch={false} />
    </div>
  );
}
