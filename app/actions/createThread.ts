"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"

export async function createThread(formData: {
  title: string
  content: string
}) {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  // 現在のユーザーを取得
//   const { data: { user } } = await supabase.auth.getUser()
  
//   if (!user) {

//     return {
//       error: "ログインが必要です"
//     }
//   }

  // スレッドを作成
//   const { data: thread, error: threadError } = await supabase
//     .from("threads")
//     .insert({
//       title: formData.title,
//       user_id: user.id,
//     })
//     .select()
//     .single()

//   if (threadError) {
//     return {
//       error: "スレッドの作成に失敗しました"
//     }
//   }


// ユーザーを作成       
const { data: user, error } = await supabase
.from("app_users")  // テーブル名がapp_usersに変更
.insert({
  name: "テスト",
  email: "テストemail",
  auth_provider: 'EMAIL',
  last_login_date: new Date().toISOString(),
  // created_atとupdated_atはデフォルト値で自動設定
})
.select()
.single()
console.log(user)
if (error) {
console.error('Error details:', error)  // デバッグ用


return {
  error: "ユーザーの作成に失敗しました",
  details: error.message
}}                              

  // 最初の投稿を作成
//   const { error: postError } = await supabase
//     .from("posts")
//     .insert({
//       content: formData.content,
//       thread_id: thread.id,
//       user_id: user.id,
//     })

//   if (postError) {
//     return {
//       error: "投稿の作成に失敗しました"
//     }
//   }  
                     

// 以下に記事テーブル作成のコードを実装

    
  revalidatePath("/")
  return { success: true }
} 