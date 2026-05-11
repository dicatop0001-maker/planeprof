import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      planos_de_aula: {
        Row: {
          id: string
          user_id: string
          titulo: string
          disciplina: string
          serie: string
          bimestre: number
          conteudo: string
          habilidades_bncc: string[]
          objetivos: string[]
          desenvolvimento: string
          conclusao: string
          dinamica: string | null
          tipo_letra: string
          na_biblioteca: boolean
          downloads: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['planos_de_aula']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['planos_de_aula']['Insert']>
      }
      usuarios: {
        Row: {
          id: string
          nome: string | null
          email: string | null
          plano: 'free' | 'mensal' | 'anual'
          planejamentos_usados: number
          quota_mensal: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['usuarios']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['usuarios']['Insert']>
      }
      pagamentos: {
        Row: {
          id: string
          user_id: string
          valor: number
          tipo: 'mensal' | 'anual' | null
          status: string
          comprovante_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pagamentos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['pagamentos']['Insert']>
      }
      pagamentos_pendentes: {
        Row: {
          id: string
          user_id: string
          plano: 'mensal' | 'anual' | null
          comprovante_arquivo: string | null
          plano_id: string | null
          status: string
          valor: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pagamentos_pendentes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['pagamentos_pendentes']['Insert']>
      }
    }
  }
}
