-- ==============================================================================
-- Migração: Criação da tabela 'perfis' e políticas de RLS
-- Central Sly - Sly Parts (Platina Indústria e Comércio de Autopeças)
-- ==============================================================================

-- 1. Tipo Enum para papéis de usuário
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'papel_usuario') THEN
    CREATE TYPE papel_usuario AS ENUM ('vendedor', 'supervisora', 'diretoria', 'pcp', 'admin');
  END IF;
END $$;

-- 2. Tabela perfis vinculada ao auth.users
CREATE TABLE IF NOT EXISTS public.perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  papel papel_usuario NOT NULL DEFAULT 'vendedor',
  codigo_vendedor_focco TEXT,
  avatar_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- 4. Função auxiliar de segurança para checar se o usuário atual é admin ou gestão
CREATE OR REPLACE FUNCTION public.current_user_papel()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT papel::TEXT FROM public.perfis WHERE id = auth.uid() LIMIT 1;
$$;

-- 5. Políticas RLS:
-- - Cada usuário pode ler seu próprio perfil
-- - supervisora, diretoria e admin podem ler todos os perfis
CREATE POLICY "Leitura de perfis: proprio perfil ou supervisora/diretoria/admin"
ON public.perfis
FOR SELECT
USING (
  auth.uid() = id
  OR
  EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = auth.uid()
    AND p.papel IN ('supervisora', 'diretoria', 'admin')
  )
);

-- - Apenas admin pode inserir novos perfis manualmente (além do trigger de signup)
CREATE POLICY "Insercao de perfis: apenas admin"
ON public.perfis
FOR INSERT
WITH CHECK (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = auth.uid()
    AND p.papel = 'admin'
  )
);

-- - Apenas admin pode atualizar perfis de outros usuários, ou usuário pode atualizar dados cosméticos
CREATE POLICY "Atualizacao de perfis: apenas admin ou proprio avatar/nome"
ON public.perfis
FOR UPDATE
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = auth.uid()
    AND p.papel = 'admin'
  )
);

-- - Apenas admin pode deletar perfis
CREATE POLICY "Delecao de perfis: apenas admin"
ON public.perfis
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = auth.uid()
    AND p.papel = 'admin'
  )
);

-- 6. Trigger para auto-criação de perfil ao cadastrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, email, papel, ativo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'papel')::papel_usuario, 'vendedor'::papel_usuario),
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      nome = COALESCE(EXCLUDED.nome, perfis.nome);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
