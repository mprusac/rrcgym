export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      camp_reservations: {
        Row: {
          accommodation: string
          age: number | null
          arrival_date: string
          club: string | null
          country: string
          created_at: string
          departure_date: string
          dietary_notes: string | null
          discipline: Database["public"]["Enums"]["camp_discipline"]
          email: string
          experience_level: string
          extra_notes: string | null
          full_name: string
          id: string
          injuries: string | null
          phone: string
          sparring_partners: number
          weight_class: string | null
        }
        Insert: {
          accommodation: string
          age?: number | null
          arrival_date: string
          club?: string | null
          country: string
          created_at?: string
          departure_date: string
          dietary_notes?: string | null
          discipline: Database["public"]["Enums"]["camp_discipline"]
          email: string
          experience_level: string
          extra_notes?: string | null
          full_name: string
          id?: string
          injuries?: string | null
          phone: string
          sparring_partners?: number
          weight_class?: string | null
        }
        Update: {
          accommodation?: string
          age?: number | null
          arrival_date?: string
          club?: string | null
          country?: string
          created_at?: string
          departure_date?: string
          dietary_notes?: string | null
          discipline?: Database["public"]["Enums"]["camp_discipline"]
          email?: string
          experience_level?: string
          extra_notes?: string | null
          full_name?: string
          id?: string
          injuries?: string | null
          phone?: string
          sparring_partners?: number
          weight_class?: string | null
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          capacity: number
          coach: string
          created_at: string
          day_of_week: number
          discipline: Database["public"]["Enums"]["training_discipline"]
          end_time: string
          id: string
          level: string
          start_time: string
        }
        Insert: {
          capacity?: number
          coach: string
          created_at?: string
          day_of_week: number
          discipline: Database["public"]["Enums"]["training_discipline"]
          end_time: string
          id?: string
          level?: string
          start_time: string
        }
        Update: {
          capacity?: number
          coach?: string
          created_at?: string
          day_of_week?: number
          discipline?: Database["public"]["Enums"]["training_discipline"]
          end_time?: string
          id?: string
          level?: string
          start_time?: string
        }
        Relationships: []
      }
      training_signups: {
        Row: {
          age: number | null
          created_at: string
          email: string
          experience: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string
          session_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          email: string
          experience?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          session_id: string
        }
        Update: {
          age?: number | null
          created_at?: string
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_signups_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      camp_discipline: "mma" | "kickbox" | "boks" | "jiu_jitsu" | "drugo"
      training_discipline: "mma" | "kickbox" | "boks" | "jiu_jitsu"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      camp_discipline: ["mma", "kickbox", "boks", "jiu_jitsu", "drugo"],
      training_discipline: ["mma", "kickbox", "boks", "jiu_jitsu"],
    },
  },
} as const
