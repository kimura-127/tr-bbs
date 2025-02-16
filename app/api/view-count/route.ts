import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { threadId, threadType } = await req.json();
    const supabase = await createClient();

    let tableName = 'articles';
    if (threadType === 'free-talk') {
      tableName = 'free_talk_articles';
    } else if (threadType === 'avatar') {
      tableName = 'avatar_articles';
    }

    const { error } = await supabase.rpc('increment_views_count', {
      table_name: tableName,
      record_id: threadId,
    });

    if (error) {
      console.error('Error updating views count:', error);
      return NextResponse.json(
        { error: 'Failed to update views count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in views API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
