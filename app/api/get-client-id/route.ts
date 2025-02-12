import { generateClientId } from '@/utils/generateUserIdentifier';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // X-Forwarded-ForヘッダーからIPアドレスを取得
    const headersList = headers();
    const forwardedFor = (await headersList).get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // クライアントIDを生成
    const clientId = await generateClientId(ip);

    return new Response(JSON.stringify({ clientId }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('クライアントID生成エラー:', error);
    return new Response(
      JSON.stringify({ error: 'クライアントIDの生成に失敗しました' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
