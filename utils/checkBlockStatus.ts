import type { Database } from '@/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

// 共通のブロックチェック関数
export async function checkBlockStatus(
  supabase: SupabaseClient<Database>,
  deviceUserId: string
) {
  const { data: blockData, error: blockError } = await supabase
    .from('blocks')
    .select('*')
    .eq('device_user_id', deviceUserId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  if (blockError) {
    return { error: 'ブロック状態の確認に失敗しました' };
  }

  if (blockData && blockData.length > 0) {
    const block = blockData[0];
    if (block.block_type === 'block') {
      return {
        error: block.reason,
      };
    }
    if (block.block_type === 'warning') {
      return {
        success: true,
        warning: block.reason,
      };
    }
  }

  return { success: true };
}
