import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  threadId: z.string(),
  endpoint: z.string(),
  p256dh: z.string(),
  auth: z.string(),
});

const PUSH_NOTIFICATION_EXPIRY_DAYS = 30;

export async function POST(request: Request) {
  console.log('プッシュ通知購読リクエスト受信');
  try {
    const supabase = await createClient();

    const json = await request.json();
    const validationResult = subscribeSchema.safeParse(json);

    if (!validationResult.success) {
      console.error('バリデーションエラー:', validationResult.error);
      return NextResponse.json(
        { error: 'リクエストデータが不正です' },
        { status: 400 }
      );
    }

    const { threadId, endpoint, p256dh, auth } = validationResult.data;

    // 既存の購読をチェック
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select()
      .eq('endpoint', endpoint)
      .eq('thread_id', threadId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('購読チェックエラー:', fetchError);
      return NextResponse.json(
        { error: 'データベースエラーが発生しました' },
        { status: 500 }
      );
    }

    // 有効期限を1週間後に設定
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + PUSH_NOTIFICATION_EXPIRY_DAYS);

    if (existingSubscription) {
      // 既存の購読を更新
      const { error: updateError } = await supabase
        .from('push_subscriptions')
        .update({
          p256dh,
          auth,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSubscription.id);

      if (updateError) {
        console.error('購読更新エラー:', updateError);
        return NextResponse.json(
          { error: '購読の更新に失敗しました' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: '購読を更新しました' },
        { status: 200 }
      );
    }

    // 新規購読を作成
    const { error: insertError } = await supabase
      .from('push_subscriptions')
      .insert({
        thread_id: threadId,
        endpoint,
        p256dh,
        auth,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('購読作成エラー:', insertError);
      return NextResponse.json(
        { error: '購読の作成に失敗しました' },
        { status: 500 }
      );
    }

    console.log('プッシュ通知購読完了');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('予期せぬエラー:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
