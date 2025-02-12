// ブラウザのWeb Crypto APIを使用した実装
async function sha256(message: string): Promise<string> {
  // テキストをバイト配列に変換
  const msgBuffer = new TextEncoder().encode(message);
  // ハッシュを計算
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  // バイト配列を16進数文字列に変換
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

// IPアドレスからクライアントIDを生成
export async function generateClientId(ip: string): Promise<string> {
  const hash = await sha256(ip);
  return hash.slice(0, 12);
}

// 定数を外部に出す
const COOKIE_NAME = '__session';
const COOKIE_OPTIONS = 'path=/; SameSite=Strict; Secure';

// CookieからクライアントのIPアドレスと元にしたUUIDを取得
export function getClientId(): string | null {
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

// クライアントIDを保存する関数
export function setClientId(clientId: string): void {
  document.cookie = `${COOKIE_NAME}=${clientId}; ${COOKIE_OPTIONS}`;
}

// バックエンドでの最終的なユーザーID生成
export async function generateFinalUserId(clientId: string) {
  const hash = await sha256(clientId);
  return hash.slice(0, 12);
}
