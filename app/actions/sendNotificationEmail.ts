'use server';

import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

// メール送信用のトランスポーター設定
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface NotificationEmailSettings {
  threadId: string;
  email: string;
}

export async function subscribeToEmailNotifications({
  threadId,
  email,
}: NotificationEmailSettings) {
  try {
    const supabase = await createClient();

    // 既存の通知設定をチェック
    const { data: existingSettings } = await supabase
      .from('notification_settings')
      .select('id')
      .eq('thread_id', threadId)
      .eq('email', email)
      .eq('type', 'email')
      .single();

    if (existingSettings) {
      return { error: 'このメールアドレスはすでに通知設定されています' };
    }

    // メールアドレスの検証メールを送信
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: '【掲示板】メール通知の設定確認',
      text: `メール通知を設定していただき、ありがとうございます。
このメールは設定の確認のために送信されています。

スレッドへの新しいコメントがあった際に、このメールアドレスに通知が送信されます。`,
      html: `
        <h2>メール通知を設定していただき、ありがとうございます。</h2>
        <p>このメールは設定の確認のために送信されています。</p>
        <p>スレッドへの新しいコメントがあった際に、このメールアドレスに通知が送信されます。</p>
      `,
    });

    // メール通知設定をDBに保存
    const { error } = await supabase.from('notification_settings').insert({
      thread_id: threadId,
      email,
      type: 'email',
    });

    if (error) {
      if (error.code === '23505') {
        // 一意制約違反のエラーコード
        return { error: 'このメールアドレスはすでに通知設定されています' };
      }
      console.error('Error saving notification settings:', error);
      return { error: '通知設定の保存に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in subscribeToEmailNotifications:', error);
    return { error: 'メール通知の設定に失敗しました' };
  }
}
