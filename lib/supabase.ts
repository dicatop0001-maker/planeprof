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
          pdi: string | null
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
          user_id: string
          nome: string
          email: string
          plano: 'free' | 'mensal' | 'anual'
          planejamentos_usados: number
          quota_mensal: number
          validade_plano: string | null
          created_at: string
        }
      }
    }
  }
}
