export type VynceUser = {
  id: string
  created_at: string
  display_name: string
  email: string
  spotify_id: string | null
  instagram_username: string | null
  top_genre: string | null
  average_daily_listens: number
  average_session_minutes: number
  share_card_count: number
  plus_plan: boolean
}

export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  top_genre: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export type UserConnection = {
  id: string
  user_id: string
  provider: string
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

export type UserInsight = {
  id: string
  user_id: string
  insight_type: string
  insight_data: Record<string, any>
  created_at: string
  updated_at: string
}

export type HealthCheck = {
  id: string
  created_at: string
  updated_at: string
  status: string
  message: string | null
}

export type Database = {
  public: {
    Tables: {
      Vynce_User: {
        Row: VynceUser
        Insert: Omit<VynceUser, 'id' | 'created_at'>
        Update: Partial<Omit<VynceUser, 'id' | 'created_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      user_connections: {
        Row: UserConnection
        Insert: Omit<UserConnection, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserConnection, 'id' | 'created_at' | 'updated_at'>>
      }
      user_insights: {
        Row: UserInsight
        Insert: Omit<UserInsight, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserInsight, 'id' | 'created_at' | 'updated_at'>>
      }
      health_check: {
        Row: HealthCheck
        Insert: Omit<HealthCheck, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<HealthCheck, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 