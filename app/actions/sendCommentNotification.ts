'use server';

import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface CommentNotificationData {
  threadId: string;
  replyId: string;
  threadTitle: string;
  commentContent: string;
}

export async function sendCommentNotification({
  threadId,
  replyId,
  threadTitle,
  commentContent,
}: CommentNotificationData) {
  const supabase = await createClient();

  try {
    // スレッドの通知設定を取得
    const { data: notificationSettings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('id, email')
      .eq('thread_id', threadId)
      .eq('type', 'email');

    if (settingsError) {
      console.error('Error fetching notification settings:', settingsError);
      return;
    }

    if (!notificationSettings || notificationSettings.length === 0) {
      console.log('No notification settings found for thread:', threadId);
      return;
    }

    // 各メールアドレスに通知を送信
    for (const setting of notificationSettings) {
      if (!setting.email) {
        console.log('No email address for setting:', setting.id);
        continue;
      }

      console.log('Sending notification to:', setting.email);

      try {
        // メール送信ログを作成（pending状態）
        const { data: logData, error: logError } = await supabase
          .from('email_logs')
          .insert({
            notification_setting_id: setting.id,
            thread_id: threadId,
            reply_id: replyId,
            email: setting.email,
            subject: `【掲示板】「${threadTitle}」に新しいコメントが投稿されました`,
            body: `スレッド「${threadTitle}」に新しいコメントが投稿されました。\n\n${commentContent}`,
            status: 'pending',
          })
          .select()
          .single();

        if (logError) {
          console.error('Error creating email log:', logError);
          continue;
        }

        console.log('Created email log:', logData);

        // メールを送信
        const mailResult = await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: setting.email,
          subject: `【掲示板】「${threadTitle}」に新しいコメントが投稿されました`,
          text: `スレッド「${threadTitle}」に新しいコメントが投稿されました。\n\n${commentContent}`,
          html: `
            <h2>新しいコメントが投稿されました</h2>
            <p>スレッド「${threadTitle}」に新しいコメントが投稿されました。</p>
            <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
              ${commentContent}
            </div>
          `,
        });

        console.log('Email sent:', mailResult);

        // 送信成功を記録
        await supabase
          .from('email_logs')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', logData.id);

        console.log('Updated email log status to sent');
      } catch (error) {
        console.error('Error sending notification email:', error);
      }
    }
  } catch (error) {
    console.error('Error in sendCommentNotification:', error);
  }
}
