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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number | null
        }
        Relationships: []
      }
      activity_results: {
        Row: {
          activity_type: string
          correct: boolean
          created_at: string | null
          hints_used: number | null
          id: string
          phonemes_tested: string[] | null
          student_id: string
          time_seconds: number | null
          word: string | null
        }
        Insert: {
          activity_type: string
          correct: boolean
          created_at?: string | null
          hints_used?: number | null
          id?: string
          phonemes_tested?: string[] | null
          student_id: string
          time_seconds?: number | null
          word?: string | null
        }
        Update: {
          activity_type?: string
          correct?: boolean
          created_at?: string | null
          hints_used?: number | null
          id?: string
          phonemes_tested?: string[] | null
          student_id?: string
          time_seconds?: number | null
          word?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_results: {
        Row: {
          attempts: number | null
          challenge_id: string | null
          completion_id: string | null
          correct: boolean
          created_at: string | null
          hints_used: number | null
          id: string
          time_seconds: number | null
        }
        Insert: {
          attempts?: number | null
          challenge_id?: string | null
          completion_id?: string | null
          correct: boolean
          created_at?: string | null
          hints_used?: number | null
          id?: string
          time_seconds?: number | null
        }
        Update: {
          attempts?: number | null
          challenge_id?: string | null
          completion_id?: string | null
          correct?: boolean
          created_at?: string | null
          hints_used?: number | null
          id?: string
          time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_results_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_results_completion_id_fkey"
            columns: ["completion_id"]
            isOneToOne: false
            referencedRelation: "quest_completions"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_order: number
          challenge_type: string
          content: Json
          created_at: string | null
          id: string
          pass_threshold: number | null
          quest_id: string | null
        }
        Insert: {
          challenge_order: number
          challenge_type: string
          content: Json
          created_at?: string | null
          id?: string
          pass_threshold?: number | null
          quest_id?: string | null
        }
        Update: {
          challenge_order?: number
          challenge_type?: string
          content?: Json
          created_at?: string | null
          id?: string
          pass_threshold?: number | null
          quest_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_progress: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_daily_champion: boolean | null
          is_super_champion: boolean | null
          quests_completed: number | null
          student_id: string
          total_time_minutes: number | null
          total_xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          is_daily_champion?: boolean | null
          is_super_champion?: boolean | null
          quests_completed?: number | null
          student_id: string
          total_time_minutes?: number | null
          total_xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_daily_champion?: boolean | null
          is_super_champion?: boolean | null
          quests_completed?: number | null
          student_id?: string
          total_time_minutes?: number | null
          total_xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_email_preferences: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_report_sent_at: string | null
          parent_user_id: string
          updated_at: string | null
          weekly_reports_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_report_sent_at?: string | null
          parent_user_id: string
          updated_at?: string | null
          weekly_reports_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_report_sent_at?: string | null
          parent_user_id?: string
          updated_at?: string | null
          weekly_reports_enabled?: boolean | null
        }
        Relationships: []
      }
      parent_reward_goals: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          goal_type: string
          id: string
          is_claimed: boolean | null
          parent_user_id: string
          reward_description: string
          student_id: string
          target_value: number
          title: string
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          goal_type?: string
          id?: string
          is_claimed?: boolean | null
          parent_user_id: string
          reward_description: string
          student_id: string
          target_value: number
          title: string
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          goal_type?: string
          id?: string
          is_claimed?: boolean | null
          parent_user_id?: string
          reward_description?: string
          student_id?: string
          target_value?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_reward_goals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      phoneme_performance: {
        Row: {
          correct_count: number
          created_at: string | null
          id: string
          incorrect_count: number
          last_practiced: string | null
          phoneme: string
          phoneme_type: string
          student_id: string
          wilson_step: number
        }
        Insert: {
          correct_count?: number
          created_at?: string | null
          id?: string
          incorrect_count?: number
          last_practiced?: string | null
          phoneme: string
          phoneme_type: string
          student_id: string
          wilson_step?: number
        }
        Update: {
          correct_count?: number
          created_at?: string | null
          id?: string
          incorrect_count?: number
          last_practiced?: string | null
          phoneme?: string
          phoneme_type?: string
          student_id?: string
          wilson_step?: number
        }
        Relationships: [
          {
            foreignKeyName: "phoneme_performance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quest_completions: {
        Row: {
          completed_at: string | null
          hints_used: number | null
          id: string
          overall_accuracy: number
          quest_id: string
          star_rating: number | null
          student_id: string
          total_time_seconds: number
          treasure_found: boolean | null
          xp_earned: number
        }
        Insert: {
          completed_at?: string | null
          hints_used?: number | null
          id?: string
          overall_accuracy: number
          quest_id: string
          star_rating?: number | null
          student_id: string
          total_time_seconds: number
          treasure_found?: boolean | null
          xp_earned: number
        }
        Update: {
          completed_at?: string | null
          hints_used?: number | null
          id?: string
          overall_accuracy?: number
          quest_id?: string
          star_rating?: number | null
          student_id?: string
          total_time_seconds?: number
          treasure_found?: boolean | null
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "quest_completions_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_completions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          base_xp: number | null
          created_at: string | null
          description: string | null
          difficulty: number
          estimated_minutes: number
          id: string
          is_active: boolean | null
          name: string
          region: string
          story_conclusion: string | null
          story_intro: string | null
          wilson_step: number
        }
        Insert: {
          base_xp?: number | null
          created_at?: string | null
          description?: string | null
          difficulty: number
          estimated_minutes?: number
          id?: string
          is_active?: boolean | null
          name: string
          region: string
          story_conclusion?: string | null
          story_intro?: string | null
          wilson_step: number
        }
        Update: {
          base_xp?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: number
          estimated_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          region?: string
          story_conclusion?: string | null
          story_intro?: string | null
          wilson_step?: number
        }
        Relationships: []
      }
      student_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          student_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          student_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_achievements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          active_accessory: string | null
          active_pet: string | null
          active_theme: string | null
          audio_speed: number | null
          avatar_config: Json | null
          avatar_emoji: string | null
          background_preference: string | null
          character_name: string
          created_at: string | null
          current_level: number | null
          current_region: string | null
          current_streak: number | null
          current_wilson_step: number | null
          font_preference: string | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          owned_items: string[] | null
          parent_user_id: string | null
          streak_freeze_tokens: number | null
          total_xp: number | null
          treasures_collected: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active_accessory?: string | null
          active_pet?: string | null
          active_theme?: string | null
          audio_speed?: number | null
          avatar_config?: Json | null
          avatar_emoji?: string | null
          background_preference?: string | null
          character_name?: string
          created_at?: string | null
          current_level?: number | null
          current_region?: string | null
          current_streak?: number | null
          current_wilson_step?: number | null
          font_preference?: string | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          owned_items?: string[] | null
          parent_user_id?: string | null
          streak_freeze_tokens?: number | null
          total_xp?: number | null
          treasures_collected?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active_accessory?: string | null
          active_pet?: string | null
          active_theme?: string | null
          audio_speed?: number | null
          avatar_config?: Json | null
          avatar_emoji?: string | null
          background_preference?: string | null
          character_name?: string
          created_at?: string | null
          current_level?: number | null
          current_region?: string | null
          current_streak?: number | null
          current_wilson_step?: number | null
          font_preference?: string | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          owned_items?: string[] | null
          parent_user_id?: string | null
          streak_freeze_tokens?: number | null
          total_xp?: number | null
          treasures_collected?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "parent" | "student"
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
      app_role: ["admin", "parent", "student"],
    },
  },
} as const
