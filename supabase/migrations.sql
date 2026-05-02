-- ============================================================
-- Planeprof - Migrations SQL
-- Execute no painel SQL do Supabase: https://nrhpphgoqxiadbptunqs.supabase.co
-- ============================================================

-- 1. Criar tabela de planos de aula
CREATE TABLE IF NOT EXISTS planos_de_aula (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  serie TEXT NOT NULL,
  bimestre INTEGER DEFAULT 1,
  conteudo TEXT,
  habilidades_bncc TEXT[] DEFAULT '{}',
  objetivos TEXT[] DEFAULT '{}',
  desenvolvimento TEXT,
  conclusao TEXT,
  dinamica TEXT,
  tipo_letra TEXT DEFAULT 'forma' CHECK (tipo_letra IN ('forma', 'cursiva')),
  na_biblioteca BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  status TEXT DEFAULT 'concluido',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de usuários (perfil)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT,
  email TEXT,
  plano TEXT DEFAULT 'free',
  planejamentos_usados INTEGER DEFAULT 0,
  quota_mensal INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  valor DECIMAL(10,2),
  tipo TEXT, -- 'mensal' ou 'anual'
  status TEXT DEFAULT 'pendente',
  comprovante_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Adicionar campos novas versões (se tabela já existir)
ALTER TABLE planos_de_aula ADD COLUMN IF NOT EXISTS tipo_letra TEXT DEFAULT 'forma';
ALTER TABLE planos_de_aula ADD COLUMN IF NOT EXISTS na_biblioteca BOOLEAN DEFAULT false;
ALTER TABLE planos_de_aula ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0;

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_planos_user_id ON planos_de_aula(user_id);
CREATE INDEX IF NOT EXISTS idx_planos_biblioteca ON planos_de_aula(na_biblioteca) WHERE na_biblioteca = true;
CREATE INDEX IF NOT EXISTS idx_planos_downloads ON planos_de_aula(downloads DESC) WHERE na_biblioteca = true;
CREATE INDEX IF NOT EXISTS idx_planos_disciplina ON planos_de_aula(disciplina);
CREATE INDEX IF NOT EXISTS idx_planos_serie ON planos_de_aula(serie);

-- 6. Habilitar RLS (Row Level Security)
ALTER TABLE planos_de_aula ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS para planos_de_aula
-- Usuário pode ver e editar apenas seus próprios planos
CREATE POLICY IF NOT EXISTS "usuarios_podem_ver_seus_planos"
  ON planos_de_aula FOR SELECT
  USING (auth.uid() = user_id OR na_biblioteca = true);

CREATE POLICY IF NOT EXISTS "usuarios_podem_inserir_planos"
  ON planos_de_aula FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "usuarios_podem_atualizar_seus_planos"
  ON planos_de_aula FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "usuarios_podem_deletar_seus_planos"
  ON planos_de_aula FOR DELETE
  USING (auth.uid() = user_id);

-- Permitir update de downloads por qualquer pessoa (para biblioteca)
CREATE POLICY IF NOT EXISTS "qualquer_um_pode_incrementar_downloads"
  ON planos_de_aula FOR UPDATE
  USING (na_biblioteca = true)
  WITH CHECK (na_biblioteca = true);

-- 8. Políticas RLS para usuários
CREATE POLICY IF NOT EXISTS "usuarios_podem_ver_seu_perfil"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "usuarios_podem_atualizar_seu_perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

-- 9. Trigger para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, nome, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nome',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FIM DAS MIGRATIONS
-- ============================================================
