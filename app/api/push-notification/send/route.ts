import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { z } from 'zod';

const sendSchema = z.object({
  threadId: z.string(),
  title: z.string(),
  body: z.string(),
  url: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const json = await request.json();
    const validationResult = sendSchema.safeParse(json);

    if (!validationResult.success) {
      console.error('バリデーションエラー:', validationResult.error);
      return NextResponse.json(
        { error: 'リクエストデータが不正です' },
        { status: 400 }
      );
    }

    const { threadId, title, body, url } = validationResult.data;

    // VAPID設定
    webpush.setVapidDetails(
      `mailto:${process.env.VAPID_SUBJECT}`,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      process.env.VAPID_PRIVATE_KEY || ''
    );

    // 有効な購読情報を取得（特定のスレッドの購読者のみ）
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('thread_id', threadId) // 特定のスレッドの購読者のみを取得
      .gt('expires_at', new Date().toISOString());

    if (fetchError) {
      console.error('購読情報取得エラー:', fetchError);
      return NextResponse.json(
        { error: '購読情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // 各購読者に通知を送信
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify({
            title,
            body,
            url,
            threadId,
          })
        );
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        console.error('送信エラー:', subscription.endpoint, error);

        // 購読が無効な場合は削除
        if (error.statusCode === 410) {
          console.log('無効なエンドポイントを削除:', subscription.endpoint);
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', subscription.endpoint);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('予期せぬエラー:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
