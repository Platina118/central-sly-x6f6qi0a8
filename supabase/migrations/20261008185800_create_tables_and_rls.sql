-- ==============================================================================
-- Migração Completa: Central Sly (Sly Parts / Platina Autopeças)
-- Tabelas: perfis, clientes, contatos, faturamento_mensal, acoes, interacoes, alertas
-- RLS rigoroso por papel (vendedor, supervisora, diretoria, pcp, admin)
-- Seed robusto: 4 vendedores, 40 clientes, 24m faturamento, 25 ações, contatos, interações e alertas
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'papel_usuario') THEN
    CREATE TYPE papel_usuario AS ENUM ('vendedor', 'supervisora', 'diretoria', 'pcp', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mercado_cliente') THEN
    CREATE TYPE mercado_cliente AS ENUM ('reposicao_direta', 'reposicao_indireta', 'industria', 'exportacao');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'situacao_comercial') THEN
    CREATE TYPE situacao_comercial AS ENUM ('ativo', 'atencao', 'queda', 'inativo');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'familia_produto') THEN
    CREATE TYPE familia_produto AS ENUM ('pistao_leve', 'pistao_pesada', 'pistao_jogos', 'pca', 'kpm', 'pino');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_acao') THEN
    CREATE TYPE tipo_acao AS ENUM ('reativacao', 'lote_cd', 'pendencia', 'retorno', 'pos_venda', 'prospeccao', 'manual');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'faixa_acao') THEN
    CREATE TYPE faixa_acao AS ENUM ('alta', 'normal');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'situacao_acao') THEN
    CREATE TYPE situacao_acao AS ENUM ('aberta', 'concluida', 'cancelada');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'origem_acao') THEN
    CREATE TYPE origem_acao AS ENUM ('motor', 'manual', 'ia');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'canal_interacao') THEN
    CREATE TYPE canal_interacao AS ENUM ('whatsapp', 'telefone', 'teams', 'email', 'visita');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'situacao_alerta') THEN
    CREATE TYPE situacao_alerta AS ENUM ('aberto', 'lido', 'resolvido');
  END IF;
END $$;

-- 2. TABELA PERFIS
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

-- 3. TABELA CLIENTES
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_focco TEXT NOT NULL UNIQUE,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  mercado mercado_cliente NOT NULL DEFAULT 'reposicao_direta',
  vendedor_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  situacao_comercial situacao_comercial NOT NULL DEFAULT 'ativo',
  media_mensal_6m NUMERIC(12,2) NOT NULL DEFAULT 0,
  media_recente NUMERIC(12,2) NOT NULL DEFAULT 0,
  variacao_pct NUMERIC(6,2) NOT NULL DEFAULT 0,
  dias_sem_compra INT NOT NULL DEFAULT 0,
  intervalo_medio_dias INT NOT NULL DEFAULT 30,
  ticket_medio NUMERIC(12,2) NOT NULL DEFAULT 0,
  ultima_compra DATE,
  ultima_interacao TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TABELA CONTATOS
CREATE TABLE IF NOT EXISTS public.contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cargo TEXT,
  telefone TEXT,
  email TEXT,
  principal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. TABELA FATURAMENTO_MENSAL
CREATE TABLE IF NOT EXISTS public.faturamento_mensal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  mes DATE NOT NULL, -- primeiro dia do mês (ex: 2026-03-01)
  pecas INT NOT NULL DEFAULT 0,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  familia familia_produto NOT NULL DEFAULT 'pistao_leve',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. TABELA ACOES
CREATE TABLE IF NOT EXISTS public.acoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  vendedor_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  tipo tipo_acao NOT NULL DEFAULT 'manual',
  titulo TEXT NOT NULL,
  motivo TEXT NOT NULL,
  valor_em_risco NUMERIC(12,2) NOT NULL DEFAULT 0,
  prioridade_pontos INT NOT NULL DEFAULT 50,
  faixa faixa_acao NOT NULL DEFAULT 'normal',
  data_prevista DATE NOT NULL DEFAULT CURRENT_DATE,
  prazo DATE,
  situacao situacao_acao NOT NULL DEFAULT 'aberta',
  resultado TEXT,
  observacao TEXT,
  data_retorno DATE,
  origem origem_acao NOT NULL DEFAULT 'motor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. TABELA INTERACOES
CREATE TABLE IF NOT EXISTS public.interacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  acao_id UUID REFERENCES public.acoes(id) ON DELETE SET NULL,
  canal canal_interacao NOT NULL DEFAULT 'whatsapp',
  direcao TEXT NOT NULL DEFAULT 'saida', -- 'saida' ou 'entrada'
  resumo TEXT NOT NULL,
  data TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. TABELA ALERTAS
CREATE TABLE IF NOT EXISTS public.alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  destinatario_id UUID REFERENCES public.perfis(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  referencia TEXT,
  situacao situacao_alerta NOT NULL DEFAULT 'aberto',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_clientes_vendedor ON public.clientes(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_clientes_situacao ON public.clientes(situacao_comercial);
CREATE INDEX IF NOT EXISTS idx_contatos_cliente ON public.contatos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_faturamento_cliente ON public.faturamento_mensal(cliente_id, mes);
CREATE INDEX IF NOT EXISTS idx_acoes_vendedor_data ON public.acoes(vendedor_id, data_prevista, situacao);
CREATE INDEX IF NOT EXISTS idx_interacoes_cliente ON public.interacoes(cliente_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_dest ON public.alertas(destinatario_id, situacao);

-- HABILITAR RLS
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faturamento_mensal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;

-- FUNÇÃO AUXILIAR PARA PAPEL DO USUÁRIO ATUAL
CREATE OR REPLACE FUNCTION public.current_user_papel()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT papel::TEXT FROM public.perfis WHERE id = auth.uid() LIMIT 1;
$$;

-- POLÍTICAS RLS: PERFIS
DROP POLICY IF EXISTS "perfis_select" ON public.perfis;
CREATE POLICY "perfis_select" ON public.perfis
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "perfis_insert" ON public.perfis;
CREATE POLICY "perfis_insert" ON public.perfis
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id OR public.current_user_papel() IN ('supervisora', 'admin'));

DROP POLICY IF EXISTS "perfis_update" ON public.perfis;
CREATE POLICY "perfis_update" ON public.perfis
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.current_user_papel() IN ('supervisora', 'admin'))
  WITH CHECK (auth.uid() = id OR public.current_user_papel() IN ('supervisora', 'admin'));

-- POLÍTICAS RLS: CLIENTES
-- Vendedor vê clientes da própria carteira; Supervisora/Diretoria/Admin/PCP vê todos.
DROP POLICY IF EXISTS "clientes_select" ON public.clientes;
CREATE POLICY "clientes_select" ON public.clientes
  FOR SELECT TO authenticated
  USING (
    vendedor_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'diretoria', 'admin', 'pcp')
  );

DROP POLICY IF EXISTS "clientes_insert" ON public.clientes;
CREATE POLICY "clientes_insert" ON public.clientes
  FOR INSERT TO authenticated
  WITH CHECK (public.current_user_papel() IN ('supervisora', 'admin', 'vendedor'));

DROP POLICY IF EXISTS "clientes_update" ON public.clientes;
CREATE POLICY "clientes_update" ON public.clientes
  FOR UPDATE TO authenticated
  USING (
    vendedor_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'admin')
  )
  WITH CHECK (
    vendedor_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'admin')
  );

-- POLÍTICAS RLS: CONTATOS
DROP POLICY IF EXISTS "contatos_select" ON public.contatos;
CREATE POLICY "contatos_select" ON public.contatos
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = contatos.cliente_id
      AND (
        c.vendedor_id = auth.uid()
        OR public.current_user_papel() IN ('supervisora', 'diretoria', 'admin', 'pcp')
      )
    )
  );

DROP POLICY IF EXISTS "contatos_modify" ON public.contatos;
CREATE POLICY "contatos_modify" ON public.contatos
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = contatos.cliente_id
      AND (
        c.vendedor_id = auth.uid()
        OR public.current_user_papel() IN ('supervisora', 'admin')
      )
    )
  );

-- POLÍTICAS RLS: FATURAMENTO MENSAL
DROP POLICY IF EXISTS "faturamento_select" ON public.faturamento_mensal;
CREATE POLICY "faturamento_select" ON public.faturamento_mensal
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = faturamento_mensal.cliente_id
      AND (
        c.vendedor_id = auth.uid()
        OR public.current_user_papel() IN ('supervisora', 'diretoria', 'admin', 'pcp')
      )
    )
  );

DROP POLICY IF EXISTS "faturamento_modify" ON public.faturamento_mensal;
CREATE POLICY "faturamento_modify" ON public.faturamento_mensal
  FOR ALL TO authenticated
  USING (public.current_user_papel() IN ('supervisora', 'admin'));

-- POLÍTICAS RLS: ACOES
DROP POLICY IF EXISTS "acoes_select" ON public.acoes;
CREATE POLICY "acoes_select" ON public.acoes
  FOR SELECT TO authenticated
  USING (
    vendedor_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'diretoria', 'admin', 'pcp')
  );

DROP POLICY IF EXISTS "acoes_insert" ON public.acoes;
CREATE POLICY "acoes_insert" ON public.acoes
  FOR INSERT TO authenticated
  WITH CHECK (
    vendedor_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'admin')
  );

DROP POLICY IF EXISTS "acoes_update" ON public.acoes;
CREATE POLICY "acoes_update" ON public.acoes
  FOR UPDATE TO authenticated
  USING (
    vendedor_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'admin')
  )
  WITH CHECK (
    vendedor_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'admin')
  );

-- POLÍTICAS RLS: INTERACOES
DROP POLICY IF EXISTS "interacoes_select" ON public.interacoes;
CREATE POLICY "interacoes_select" ON public.interacoes
  FOR SELECT TO authenticated
  USING (
    usuario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = interacoes.cliente_id
      AND (c.vendedor_id = auth.uid() OR public.current_user_papel() IN ('supervisora', 'diretoria', 'admin'))
    )
  );

DROP POLICY IF EXISTS "interacoes_insert" ON public.interacoes;
CREATE POLICY "interacoes_insert" ON public.interacoes
  FOR INSERT TO authenticated
  WITH CHECK (
    usuario_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'admin')
  );

-- POLÍTICAS RLS: ALERTAS
DROP POLICY IF EXISTS "alertas_select" ON public.alertas;
CREATE POLICY "alertas_select" ON public.alertas
  FOR SELECT TO authenticated
  USING (
    destinatario_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'diretoria', 'admin')
  );

DROP POLICY IF EXISTS "alertas_modify" ON public.alertas;
CREATE POLICY "alertas_modify" ON public.alertas
  FOR ALL TO authenticated
  USING (
    destinatario_id = auth.uid()
    OR public.current_user_papel() IN ('supervisora', 'admin')
  );
