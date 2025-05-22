import { createClient } from '@/utils/supabase/server';
import type { WebhookEvent } from '@clerk/nextjs/dist/types/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  // WebhookシークレットをClerkダッシュボードから取得
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  console.log('あああああああああ');
  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  // リクエストヘッダーからsvix-idとsvix-signatureとsvix-timestampを取得
  const headerPayload = headers();
  const svixId = (await headerPayload).get('svix-id');
  const svixTimestamp = (await headerPayload).get('svix-timestamp');
  const svixSignature = (await headerPayload).get('svix-signature');

  // 必要なヘッダーが存在するか確認
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: missing svix headers', { status: 400 });
  }

  // リクエストボディを取得
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // svixを使用してWebhookの署名を検証
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // イベントタイプに基づいて処理
  const eventType = event.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, username, first_name, last_name } = event.data;

    console.log(
      'あああああああああああああ',
      JSON.stringify(event.data, null, 2)
    );

    // メールアドレスとユーザー名を取得
    const emailAddress = email_addresses?.[0]?.email_address;
    const name =
      username ||
      [first_name, last_name].filter(Boolean).join(' ') ||
      'Anonymous User';

    if (!emailAddress) {
      return new Response('Error: no email address provided', { status: 400 });
    }

    try {
      // Supabaseを使用してapp_usersテーブルにユーザーを作成または更新
      const supabase = await createClient();

      // まず既存のユーザーを検索
      const { data: existingUser } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      const now = new Date().toISOString();

      if (existingUser) {
        // ユーザーが存在する場合は更新
        await supabase
          .from('app_users')
          .update({
            email: emailAddress,
            name,
            auth_provider: 'clerk',
            last_login_date: now,
            updated_at: now,
          })
          .eq('id', id);
      } else {
        // ユーザーが存在しない場合は作成
        await supabase.from('app_users').insert({
          id,
          email: emailAddress,
          name,
          auth_provider: 'clerk',
          last_login_date: now,
          created_at: now,
          updated_at: now,
        });
      }

      return new Response('User data processed successfully', { status: 200 });
    } catch (error) {
      console.error('Error saving user to database:', error);
      return new Response('Error saving user to database', { status: 500 });
    }
  }

  // サポートされていないイベントタイプの場合
  return new Response(`Webhook received: ${eventType}`, { status: 200 });
}
