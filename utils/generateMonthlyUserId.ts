import { createHash } from 'node:crypto';
import type { DeviceInfo } from '@/types';

export function generateMonthlyUserId(deviceInfo: DeviceInfo): string {
  const currentDate = new Date();
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

  // デバイス情報を文字列化
  const deviceString = JSON.stringify({
    renderHash: deviceInfo.renderHash,
    precision: deviceInfo.precision,
    monthKey, // 月ごとに変化する要素を追加
  });

  // SHA-256でハッシュ化
  const hash = createHash('sha256').update(deviceString).digest('hex');

  // 最初の12文字を使用
  return hash.slice(0, 12);
}
