export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_users: {
        Row: {
          auth_provider: string | null
          created_at: string
          email: string
          id: string
          is_ban: boolean
          last_login_date: string
          name: string
          updated_at: string
        }
        Insert: {
          auth_provider?: string | null
          created_at?: string
          email: string
          id?: string
          is_ban?: boolean
          last_login_date: string
          name: string
          updated_at?: string
        }
        Update: {
          auth_provider?: string | null
          created_at?: string
          email?: string
          id?: string
          is_ban?: boolean
          last_login_date?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          content: string
          created_at: string
          id: string
          image_urls: string[] | null
          replies_count: number
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          replies_count?: number
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          replies_count?: number
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      avatar_articles: {
        Row: {
          content: string
          created_at: string
          id: string
          image_urls: string[] | null
          replies_count: number
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          replies_count?: number
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          replies_count?: number
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avatar_articles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      avatar_replies: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          image_urls: string[] | null
          updated_at: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          updated_at?: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avatar_replies_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "avatar_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          body: string
          created_at: string
          email: string
          error_message: string | null
          id: string
          notification_setting_id: string
          reply_id: string
          retry_count: number
          sent_at: string | null
          status: string
          subject: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          email: string
          error_message?: string | null
          id?: string
          notification_setting_id: string
          reply_id: string
          retry_count?: number
          sent_at?: string | null
          status?: string
          subject: string
          thread_id: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          email?: string
          error_message?: string | null
          id?: string
          notification_setting_id?: string
          reply_id?: string
          retry_count?: number
          sent_at?: string | null
          status?: string
          subject?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_notification_setting_id_fkey"
            columns: ["notification_setting_id"]
            isOneToOne: false
            referencedRelation: "notification_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      free_talk_articles: {
        Row: {
          content: string
          created_at: string
          id: string
          image_urls: string[] | null
          replies_count: number
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          replies_count?: number
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          replies_count?: number
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "free_talk_articles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      free_talk_replies: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          image_urls: string[] | null
          updated_at: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          updated_at?: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "free_talk_replies_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "free_talk_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          email: string | null
          id: string
          thread_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          thread_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          thread_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          expires_at: string
          id: string
          p256dh: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          expires_at: string
          id?: string
          p256dh: string
          thread_id: string
          updated_at?: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          expires_at?: string
          id?: string
          p256dh?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      replies: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          image_urls: string[] | null
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_push_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

