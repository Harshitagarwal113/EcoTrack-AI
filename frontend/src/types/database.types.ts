export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          total_carbon_saved: number
          sustainability_grade: string
          points: number
          badges: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          total_carbon_saved?: number
          sustainability_grade?: string
          points?: number
          badges?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          total_carbon_saved?: number
          sustainability_grade?: string
          points?: number
          badges?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          name: string
          category: string
          carbon_factor: number
          unit: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          carbon_factor: number
          unit: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          carbon_factor?: number
          unit?: string
          created_at?: string
        }
      }
      carbon_entries: {
        Row: {
          id: string
          user_id: string
          activity_id: string
          amount: number
          carbon_calculated: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_id: string
          amount: number
          carbon_calculated: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_id?: string
          amount?: number
          carbon_calculated?: number
          date?: string
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          target_reduction: number
          current_progress: number
          deadline: string
          status: 'active' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_reduction: number
          current_progress?: number
          deadline: string
          status?: 'active' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          target_reduction?: number
          current_progress?: number
          deadline?: string
          status?: 'active' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          participants_count: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          participants_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          participants_count?: number
          created_at?: string
        }
      }
      user_challenges: {
        Row: {
          user_id: string
          challenge_id: string
          progress: number
          joined_at: string
        }
        Insert: {
          user_id: string
          challenge_id: string
          progress?: number
          joined_at?: string
        }
        Update: {
          user_id?: string
          challenge_id?: string
          progress?: number
          joined_at?: string
        }
      }
      receipts: {
        Row: {
          id: string
          user_id: string
          image_url: string
          merchant_name: string | null
          total_amount: number | null
          carbon_estimate: number | null
          status: 'processing' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          merchant_name?: string | null
          total_amount?: number | null
          carbon_estimate?: number | null
          status?: 'processing' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          merchant_name?: string | null
          total_amount?: number | null
          carbon_estimate?: number | null
          status?: 'processing' | 'completed' | 'failed'
          created_at?: string
        }
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
