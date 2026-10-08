-- ==============================================================================
-- Seed de Clientes, Contatos, Ações, Interações e Alertas
-- 40 Distribuidores de Autopeças em RS, SC, PR, SP, MG, BA, PE
-- 25 Ações abertas distribuídas entre os vendedores
-- ==============================================================================

DO $$
DECLARE
  v_carlos UUID;
  v_rodrigo UUID;
  v_juliana UUID;
  v_marcelo UUID;
  v_supervisora UUID;

  c_id UUID;
  c_tonini UUID;
  c_cooper UUID;
  c_serraf UUID;
  c_uniao UUID;
  c_sulpecas UUID;
  c_platina UUID;
  c_taranto UUID;
  c_dalle UUID;
BEGIN
  SELECT id INTO v_carlos FROM public.perfis WHERE email = 'vendedor@slyparts.com.br';
  SELECT id INTO v_rodrigo FROM public.perfis WHERE email = 'rodrigo.mendes@slyparts.com.br';
  SELECT id INTO v_juliana FROM public.perfis WHERE email = 'juliana.castro@slyparts.com.br';
  SELECT id INTO v_marcelo FROM public.perfis WHERE email = 'marcelo.ferreira@slyparts.com.br';
  SELECT id INTO v_supervisora FROM public.perfis WHERE email = 'supervisora@slyparts.com.br';

  -- ==========================================================================
  -- 1. CLIENTES (40 Distribuidores)
  -- ==========================================================================
  
  -- RS (Vendedor: Carlos Eduardo)
  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000001', 'CLI-10492', 'Tonini Distribuidora de Autopeças Ltda', 'Tonini Distribuidora', '92.128.441/0001-90', 'Caxias do Sul', 'RS', 'reposicao_direta', v_carlos, 'queda', 41200.00, 18400.00, -55.34, 48, 22, 19800.00, CURRENT_DATE - 48, now() - interval '8 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000002', 'CLI-10214', 'Serraf Distribuidora de Autopeças Ltda', 'Serraf Autopeças', '89.332.110/0001-44', 'Porto Alegre', 'RS', 'reposicao_direta', v_carlos, 'atencao', 68500.00, 52100.00, -23.94, 34, 18, 31400.00, CURRENT_DATE - 34, now() - interval '2 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000003', 'CLI-10883', 'Sulpeças Comércio e Importação S/A', 'Sulpeças Distribuição', '91.442.880/0002-12', 'Novo Hamburgo', 'RS', 'reposicao_direta', v_carlos, 'ativo', 94500.00, 99800.00, 5.61, 12, 14, 45200.00, CURRENT_DATE - 12, now() - interval '1 day')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000004', 'CLI-10551', 'Cooper Peças Distribuidora Cooperativa', 'Cooper Peças', '93.771.229/0001-01', 'Passo Fundo', 'RS', 'reposicao_indireta', v_carlos, 'ativo', 52300.00, 54100.00, 3.44, 16, 20, 24800.00, CURRENT_DATE - 16, now() - interval '3 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000005', 'CLI-10332', 'Guaíba Componentes Automotivos', 'Guaíba Autopeças', '90.551.332/0001-88', 'Canoas', 'RS', 'reposicao_direta', v_carlos, 'queda', 38900.00, 19200.00, -50.64, 52, 25, 18500.00, CURRENT_DATE - 52, now() - interval '14 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000006', 'CLI-10118', 'Pampa Distribuidora de Peças Ltda', 'Pampa Peças', '88.776.554/0001-30', 'Pelotas', 'RS', 'reposicao_direta', v_carlos, 'inativo', 28400.00, 0.00, -100.00, 112, 30, 14200.00, CURRENT_DATE - 112, now() - interval '45 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000007', 'CLI-10774', 'Serra & Mar Peças Automotivas', 'Serra Peças', '91.882.339/0001-19', 'Bento Gonçalves', 'RS', 'industria', v_carlos, 'atencao', 48200.00, 39100.00, -18.88, 38, 25, 22400.00, CURRENT_DATE - 38, now() - interval '6 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000008', 'CLI-10901', 'Missões Motores e Pistões S/A', 'Missões Peças', '94.221.770/0001-55', 'Santo Ângelo', 'RS', 'reposicao_direta', v_carlos, 'ativo', 31500.00, 33200.00, 5.40, 19, 21, 15800.00, CURRENT_DATE - 19, now() - interval '4 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  -- SC (Vendedor: Rodrigo Mendes)
  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000009', 'CLI-20101', 'Catarina Distribuidora de Autopeças', 'Catarina Peças', '83.441.992/0001-12', 'Joinville', 'SC', 'reposicao_direta', v_rodrigo, 'ativo', 88400.00, 91200.00, 3.17, 14, 15, 41000.00, CURRENT_DATE - 14, now() - interval '2 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000010', 'CLI-20224', 'Vale Peças e Componentes de Motores', 'Vale Peças', '84.112.553/0001-88', 'Blumenau', 'SC', 'reposicao_direta', v_rodrigo, 'queda', 45800.00, 21900.00, -52.18, 44, 20, 21500.00, CURRENT_DATE - 44, now() - interval '9 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000011', 'CLI-20339', 'Floripa Distribuidora Automotiva', 'Floripa Autopeças', '82.990.114/0001-33', 'São José', 'SC', 'reposicao_indireta', v_rodrigo, 'ativo', 56200.00, 58400.00, 3.91, 18, 22, 26000.00, CURRENT_DATE - 18, now() - interval '5 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000012', 'CLI-20448', 'Chapecó Motores & Peças Agrícolas', 'Oeste Peças', '85.663.221/0001-90', 'Chapecó', 'SC', 'industria', v_rodrigo, 'atencao', 39400.00, 32100.00, -18.53, 36, 24, 19200.00, CURRENT_DATE - 36, now() - interval '4 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000013', 'CLI-20555', 'Itajaí Log Peças e Frotas Ltda', 'Porto Peças', '86.774.881/0001-22', 'Itajaí', 'SC', 'reposicao_direta', v_rodrigo, 'inativo', 33100.00, 0.00, -100.00, 98, 28, 16000.00, CURRENT_DATE - 98, now() - interval '38 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  -- PR (Vendedor: Rodrigo Mendes)
  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000014', 'CLI-30112', 'Paraná Peças Distribuidora Central', 'Paraná Peças', '76.331.442/0001-02', 'Curitiba', 'PR', 'reposicao_direta', v_rodrigo, 'ativo', 112000.00, 118500.00, 5.80, 11, 12, 54000.00, CURRENT_DATE - 11, now() - interval '1 day')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000015', 'CLI-30225', 'Londrina Distribuição de Componentes', 'Norte Peças Londrina', '77.882.119/0001-44', 'Londrina', 'PR', 'reposicao_direta', v_rodrigo, 'queda', 62400.00, 31200.00, -50.00, 49, 21, 29000.00, CURRENT_DATE - 49, now() - interval '11 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000016', 'CLI-30338', 'Maringá Autopeças e Linha Pesada', 'Maringá Peças', '78.991.220/0001-77', 'Maringá', 'PR', 'reposicao_indireta', v_rodrigo, 'atencao', 47600.00, 39500.00, -17.02, 33, 22, 22800.00, CURRENT_DATE - 33, now() - interval '3 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000017', 'CLI-30441', 'Cascavel Distribuidora Automotiva', 'Oeste Paraná Peças', '79.114.553/0001-11', 'Cascavel', 'PR', 'reposicao_direta', v_rodrigo, 'ativo', 51900.00, 54200.00, 4.43, 17, 20, 25100.00, CURRENT_DATE - 17, now() - interval '2 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000018', 'CLI-30556', 'Ponta Grossa Peças e Frotas', 'Campos Gerais Peças', '80.223.664/0001-50', 'Ponta Grossa', 'PR', 'industria', v_rodrigo, 'inativo', 31200.00, 0.00, -100.00, 105, 30, 15000.00, CURRENT_DATE - 105, now() - interval '50 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  -- SP (Vendedora: Juliana Castro)
  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000019', 'CLI-40110', 'Rede União de Autopeças S/A', 'Rede União', '61.442.889/0001-20', 'São Paulo', 'SP', 'reposicao_direta', v_juliana, 'queda', 145000.00, 68000.00, -53.10, 42, 12, 68000.00, CURRENT_DATE - 42, now() - interval '7 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000020', 'CLI-40221', 'Campinas Distribuidora de Peças Ltda', 'Campinas Autopeças', '62.553.991/0001-44', 'Campinas', 'SP', 'reposicao_direta', v_juliana, 'ativo', 98000.00, 104500.00, 6.63, 10, 14, 48000.00, CURRENT_DATE - 10, now() - interval '1 day')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000021', 'CLI-40332', 'Ribeirão Distribuidora de Componentes', 'Ribeirão Peças', '63.664.112/0001-77', 'Ribeirão Preto', 'SP', 'reposicao_direta', v_juliana, 'atencao', 76400.00, 61200.00, -19.90, 31, 18, 36000.00, CURRENT_DATE - 31, now() - interval '3 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000022', 'CLI-40443', 'Vale do Paraíba Comércio Automotivo', 'Vale Peças SP', '64.775.223/0001-99', 'São José dos Campos', 'SP', 'reposicao_indireta', v_juliana, 'ativo', 65200.00, 68100.00, 4.45, 15, 20, 31500.00, CURRENT_DATE - 15, now() - interval '2 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000023', 'CLI-40554', 'Sorocaba Distribuidora Mecânica', 'Sorocaba Peças', '65.886.334/0001-01', 'Sorocaba', 'SP', 'industria', v_juliana, 'queda', 54300.00, 26100.00, -51.93, 46, 22, 25000.00, CURRENT_DATE - 46, now() - interval '10 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000024', 'CLI-40665', 'ABC Paulista Distribuidora de Pistões', 'ABC Autopeças', '66.997.445/0001-33', 'Santo André', 'SP', 'reposicao_direta', v_juliana, 'ativo', 83100.00, 87400.00, 5.17, 13, 16, 40500.00, CURRENT_DATE - 13, now() - interval '4 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000025', 'CLI-40776', 'Bauru Motores e Componentes Ltda', 'Bauru Peças', '67.118.556/0001-66', 'Bauru', 'SP', 'reposicao_indireta', v_juliana, 'inativo', 36800.00, 0.00, -100.00, 120, 28, 17500.00, CURRENT_DATE - 120, now() - interval '60 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  -- MG (Vendedora: Juliana Castro)
  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000026', 'CLI-50110', 'Minas Distribuidora de Autopeças S/A', 'Minas Peças BH', '21.442.990/0001-11', 'Belo Horizonte', 'MG', 'reposicao_direta', v_juliana, 'ativo', 105000.00, 111000.00, 5.71, 9, 14, 52000.00, CURRENT_DATE - 9, now() - interval '1 day')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000027', 'CLI-50221', 'Triângulo Distribuidora Automotiva', 'Triângulo Peças', '22.553.111/0001-33', 'Uberlândia', 'MG', 'reposicao_direta', v_juliana, 'queda', 58700.00, 28400.00, -51.62, 45, 20, 28000.00, CURRENT_DATE - 45, now() - interval '8 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000028', 'CLI-50332', 'Zona da Mata Autopeças e Frotas', 'Mata Peças JF', '23.664.222/0001-55', 'Juiz de Fora', 'MG', 'reposicao_indireta', v_juliana, 'atencao', 44200.00, 36100.00, -18.33, 35, 22, 21000.00, CURRENT_DATE - 35, now() - interval '4 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000029', 'CLI-50443', 'Montes Claros Motores e Componentes', 'Norte Minas Peças', '24.775.333/0001-77', 'Montes Claros', 'MG', 'reposicao_direta', v_juliana, 'ativo', 49800.00, 52100.00, 4.62, 16, 21, 24000.00, CURRENT_DATE - 16, now() - interval '2 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000030', 'CLI-50554', 'Vale do Aço Indústria & Comércio Peças', 'Aço Peças Ipatinga', '25.886.444/0001-99', 'Ipatinga', 'MG', 'industria', v_juliana, 'inativo', 32000.00, 0.00, -100.00, 110, 30, 15500.00, CURRENT_DATE - 110, now() - interval '40 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  -- BA (Vendedor: Marcelo Ferreira)
  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000031', 'CLI-60110', 'Bahia Peças Distribuidora Salvador', 'Bahia Peças', '14.221.889/0001-02', 'Salvador', 'BA', 'reposicao_direta', v_marcelo, 'ativo', 78400.00, 82500.00, 5.23, 12, 16, 38000.00, CURRENT_DATE - 12, now() - interval '2 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000032', 'CLI-60221', 'Feira Distribuidora de Componentes', 'Feira Autopeças', '15.332.991/0001-24', 'Feira de Santana', 'BA', 'reposicao_direta', v_marcelo, 'queda', 46300.00, 22400.00, -51.62, 50, 22, 22000.00, CURRENT_DATE - 50, now() - interval '12 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000033', 'CLI-60332', 'Conquista Motores & Peças Ltda', 'Sudoeste Peças', '16.443.112/0001-46', 'Vitória da Conquista', 'BA', 'reposicao_indireta', v_marcelo, 'atencao', 38200.00, 31400.00, -17.80, 32, 24, 18500.00, CURRENT_DATE - 32, now() - interval '5 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000034', 'CLI-60443', 'Sul Baiano Distribuidora Automotiva', 'Itabuna Peças', '17.554.223/0001-68', 'Itabuna', 'BA', 'reposicao_direta', v_marcelo, 'ativo', 42100.00, 44000.00, 4.51, 17, 22, 20500.00, CURRENT_DATE - 17, now() - interval '3 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000035', 'CLI-60554', 'Juazeiro Motores & Irrigação Peças', 'Vale São Francisco Peças', '18.665.334/0001-80', 'Juazeiro', 'BA', 'industria', v_marcelo, 'inativo', 26500.00, 0.00, -100.00, 115, 30, 13000.00, CURRENT_DATE - 115, now() - interval '55 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  -- PE (Vendedor: Marcelo Ferreira)
  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000036', 'CLI-70110', 'Pernambucana de Autopeças S/A', 'Pernambuco Peças', '11.332.990/0001-14', 'Recife', 'PE', 'reposicao_direta', v_marcelo, 'ativo', 85200.00, 89400.00, 4.93, 11, 15, 41500.00, CURRENT_DATE - 11, now() - interval '1 day')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000037', 'CLI-70221', 'Agreste Distribuidora de Componentes', 'Agreste Peças Caruaru', '12.443.111/0001-36', 'Caruaru', 'PE', 'reposicao_direta', v_marcelo, 'queda', 49100.00, 23800.00, -51.53, 47, 21, 23000.00, CURRENT_DATE - 47, now() - interval '10 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000038', 'CLI-70332', 'Petrolina Peças e Motores Agrícolas', 'Petrolina Autopeças', '13.554.222/0001-58', 'Petrolina', 'PE', 'reposicao_indireta', v_marcelo, 'atencao', 36400.00, 29800.00, -18.13, 34, 25, 17500.00, CURRENT_DATE - 34, now() - interval '6 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000039', 'CLI-70443', 'Metropolitana Peças e Frotas Ltda', 'Olinda Peças', '14.665.333/0001-70', 'Olinda', 'PE', 'reposicao_direta', v_marcelo, 'ativo', 44800.00, 47100.00, 5.13, 15, 20, 21800.00, CURRENT_DATE - 15, now() - interval '3 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  INSERT INTO public.clientes (id, codigo_focco, razao_social, nome_fantasia, cnpj, cidade, uf, mercado, vendedor_id, situacao_comercial, media_mensal_6m, media_recente, variacao_pct, dias_sem_compra, intervalo_medio_dias, ticket_medio, ultima_compra, ultima_interacao)
  VALUES ('a0000001-0000-0000-0000-000000000040', 'CLI-70554', 'Sertão Peças e Componentes Pesados', 'Sertão Distribuidora', '15.776.444/0001-92', 'Serra Talhada', 'PE', 'exportacao', v_marcelo, 'inativo', 29000.00, 0.00, -100.00, 108, 30, 14000.00, CURRENT_DATE - 108, now() - interval '42 days')
  ON CONFLICT (codigo_focco) DO NOTHING;

  -- ==========================================================================
  -- 2. CONTATOS PRINCIPAIS
  -- ==========================================================================
  -- Tonini
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000001', 'Gilberto Tonini', 'Diretor Comercial & Comprador', '(54) 99124-8821', 'gilberto@tonini.com.br', true),
         ('a0000001-0000-0000-0000-000000000001', 'Fabiana Rossi', 'Gerente de Suprimentos', '(54) 99982-1144', 'fabiana.suprimentos@tonini.com.br', false)
  ON CONFLICT DO NOTHING;

  -- Serraf
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000002', 'Eduardo Serraf', 'Gerente de Compras', '(51) 98112-9900', 'eduardo@serraf.com.br', true)
  ON CONFLICT DO NOTHING;

  -- Rede União
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000019', 'Rogério Mendonça', 'Diretor de Suprimentos', '(11) 98774-2201', 'rogerio@redeuniaopecas.com.br', true),
         ('a0000001-0000-0000-0000-000000000019', 'Carla Bittencourt', 'Compradora Linha Leve', '(11) 98223-1099', 'carla.compras@redeuniaopecas.com.br', false)
  ON CONFLICT DO NOTHING;

  -- Cooper Peças
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000004', 'Paulo Sérgio Cooper', 'Coordenador Comercial', '(54) 99841-3320', 'paulo@cooperpecas.com.br', true)
  ON CONFLICT DO NOTHING;

  -- Sulpeças
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000003', 'Renato Sulbach', 'Diretor de Operações', '(51) 99201-4477', 'renato@sulpecas.com.br', true)
  ON CONFLICT DO NOTHING;

  -- Minas Peças
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000026', 'Cláudio Fonseca', 'Gerente Geral', '(31) 99401-2299', 'claudio@minaspecas.com.br', true)
  ON CONFLICT DO NOTHING;

  -- Catarina Peças
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000009', 'Valter Mueller', 'Gerente Comercial', '(47) 99192-3344', 'valter@catarinapecas.com.br', true)
  ON CONFLICT DO NOTHING;

  -- Bahia Peças
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000031', 'Antônio Carlos Bahia', 'Diretor Comercial', '(71) 99312-5500', 'antonio@bahiapecas.com.br', true)
  ON CONFLICT DO NOTHING;

  -- Pernambuco Peças
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  VALUES ('a0000001-0000-0000-0000-000000000036', 'Severino Albuquerque', 'Gerente de Compras', '(81) 99611-7788', 'severino@pepecas.com.br', true)
  ON CONFLICT DO NOTHING;

  -- Demais clientes recebem contato padrão automático
  INSERT INTO public.contatos (cliente_id, nome, cargo, telefone, email, principal)
  SELECT c.id, 'Comprador Responsável', 'Compras & Suprimentos', '(54) 3218-0000', 'compras@' || lower(replace(c.nome_fantasia, ' ', '')) || '.com.br', true
  FROM public.clientes c
  WHERE c.id NOT IN (
    'a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000019', 'a0000001-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000026',
    'a0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000031',
    'a0000001-0000-0000-0000-000000000036'
  )
  ON CONFLICT DO NOTHING;

  -- ==========================================================================
  -- 3. HISTÓRICO DE FATURAMENTO MENSAL (24 Meses por cliente)
  -- ==========================================================================
  -- Gerado deterministicamente para cada cliente nos últimos 24 meses
  INSERT INTO public.faturamento_mensal (cliente_id, mes, pecas, valor, familia)
  SELECT 
    c.id,
    m.mes_data,
    CASE 
      WHEN c.situacao_comercial = 'inativo' AND m.mes_offset < 4 THEN 0
      WHEN c.situacao_comercial = 'queda' AND m.mes_offset < 3 THEN CAST((c.media_recente / 58.0) * (0.9 + (m.mes_offset * 0.05)) AS INT)
      ELSE CAST((c.media_mensal_6m / 55.0) * (0.85 + (random() * 0.3)) AS INT)
    END AS pecas,
    CASE 
      WHEN c.situacao_comercial = 'inativo' AND m.mes_offset < 4 THEN 0.00
      WHEN c.situacao_comercial = 'queda' AND m.mes_offset < 3 THEN ROUND((c.media_recente * (0.92 + (m.mes_offset * 0.04)))::numeric, 2)
      ELSE ROUND((c.media_mensal_6m * (0.85 + (random() * 0.3)))::numeric, 2)
    END AS valor,
    (ARRAY['pistao_leve'::familia_produto, 'pistao_pesada'::familia_produto, 'pistao_jogos'::familia_produto, 'pca'::familia_produto, 'kpm'::familia_produto, 'pino'::familia_produto])[1 + (m.mes_offset % 6)] AS familia
  FROM public.clientes c
  CROSS JOIN (
    SELECT 
      (date_trunc('month', CURRENT_DATE) - (i || ' month')::interval)::date AS mes_data,
      i AS mes_offset
    FROM generate_series(0, 23) AS i
  ) m
  ON CONFLICT DO NOTHING;

  -- ==========================================================================
  -- 4. AÇÕES ABERTAS (25 Ações no total, incluindo as de hoje para Carlos)
  -- ==========================================================================
  -- Ações do Carlos Eduardo (Vendedor principal - 8 ações: Retornos, Atrasadas, Novas de hoje)
  
  -- Retorno Agendado (Carlos)
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', v_carlos, 'retorno', 'Retorno agendado: Cotação Linha Leve Fiat Fire', 'Cliente pediu para retornar hoje com a proposta atualizada de pistões e jogos Fire 1.0/1.4 flex.', 24500.00, 85, 'alta', CURRENT_DATE, CURRENT_DATE + 2, 'aberta', 'manual')
  ON CONFLICT DO NOTHING;

  -- Atrasada 1 (Carlos) - Queda forte
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', v_carlos, 'reativacao', 'Queda de 55% no volume faturado', 'Comprou **R$ 18.400** nos últimos 60 dias; média de **R$ 41.200/mês** (**−55%**). Risco de perda de share para concorrente na serra.', 32800.00, 95, 'alta', CURRENT_DATE - 3, CURRENT_DATE - 1, 'aberta', 'motor')
  ON CONFLICT DO NOTHING;

  -- Atrasada 2 (Carlos)
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000005', v_carlos, 'reativacao', 'Cliente Guaíba sem compras há 52 dias', 'Intervalo normal é de **25 dias**. Última compra foi de apenas **R$ 19.200**, variação de **−50,6%**.', 28000.00, 88, 'alta', CURRENT_DATE - 1, CURRENT_DATE, 'aberta', 'motor')
  ON CONFLICT DO NOTHING;

  -- Nova de Hoje 1 (Carlos) - Alta
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000002', v_carlos, 'pendencia', 'Alerta de queda em Serraf Autopeças', 'Média de **R$ 68.500/mês** caiu para **R$ 52.100** (**−23,9%**). Redução concentrada em pistões pesada.', 16400.00, 78, 'alta', CURRENT_DATE, CURRENT_DATE + 3, 'aberta', 'motor')
  ON CONFLICT DO NOTHING;

  -- Nova de Hoje 2 (Carlos) - Normal
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000004', v_carlos, 'pos_venda', 'Pós-venda Lote Especial Cooper Peças', 'Pedido de **R$ 38.000** faturado e entregue há 15 dias. Checar aceitação da linha KPM.', 8500.00, 60, 'normal', CURRENT_DATE, CURRENT_DATE + 5, 'aberta', 'manual')
  ON CONFLICT DO NOTHING;

  -- Nova de Hoje 3 (Carlos) - Normal
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000003', v_carlos, 'lote_cd', 'Apresentar Lote C/D para Sulpeças', 'Disponibilidade de lote C com **18% de margem extra** para peças de giro diesel.', 14200.00, 65, 'normal', CURRENT_DATE, CURRENT_DATE + 4, 'aberta', 'motor')
  ON CONFLICT DO NOTHING;

  -- Ação Concluída hoje pelo Carlos (para métrica de concluídas)
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, resultado, origem)
  VALUES ('b0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000008', v_carlos, 'pos_venda', 'Confirmação de reposição Missões', 'Cliente confirmou recebimento sem pendências técnicas.', 0.00, 50, 'normal', CURRENT_DATE, CURRENT_DATE, 'concluida', 'Pedido atendido com sucesso', 'motor')
  ON CONFLICT DO NOTHING;

  -- Demais ações distribuídas entre Rodrigo, Juliana e Marcelo (totalizando 25)
  -- Rodrigo (SC / PR)
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000010', v_rodrigo, 'reativacao', 'Vale Peças em queda crítica', 'Comprou **R$ 21.900** recentemente contra média de **R$ 45.800** (**−52,2%**).', 23900.00, 92, 'alta', CURRENT_DATE - 2, CURRENT_DATE, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000015', v_rodrigo, 'reativacao', 'Norte Peças Londrina: queda de 50%', 'Média mensal de **R$ 62.400** caiu para **R$ 31.200**. 49 dias sem faturar.', 31200.00, 94, 'alta', CURRENT_DATE - 1, CURRENT_DATE + 1, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000014', v_rodrigo, 'retorno', 'Renovação de tabela Paraná Peças', 'Agendado envio da nova tabela de pistão leve para homologação trimestral.', 45000.00, 75, 'normal', CURRENT_DATE, CURRENT_DATE + 2, 'aberta', 'manual'),
         ('b0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000012', v_rodrigo, 'lote_cd', 'Oferta de Lote D Chapecó Motores', 'Oportunidade de alocação de ponta de estoque diesel.', 12500.00, 58, 'normal', CURRENT_DATE, CURRENT_DATE + 3, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000016', v_rodrigo, 'pendencia', 'Pendência cadastral Maringá Peças', 'Ajuste de limite de crédito para liberação do pedido.', 18000.00, 68, 'normal', CURRENT_DATE, CURRENT_DATE + 1, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000009', v_rodrigo, 'pos_venda', 'Follow-up Catarina Peças', 'Revisão das metas mensais acordadas.', 0.00, 45, 'normal', CURRENT_DATE, CURRENT_DATE + 4, 'aberta', 'manual');

  -- Juliana (SP / MG)
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000014', 'a0000001-0000-0000-0000-000000000019', v_juliana, 'reativacao', 'Rede União: R$ 77.000 em risco', 'Comprou **R$ 68.000** contra média histórica de **R$ 145.000** (**−53,1%**). Ação urgente com Rogério.', 77000.00, 99, 'alta', CURRENT_DATE - 4, CURRENT_DATE - 1, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000015', 'a0000001-0000-0000-0000-000000000027', v_juliana, 'reativacao', 'Triângulo Peças em queda de 51%', 'Faturamento mensal despencou de **R$ 58.700** para **R$ 28.400**.', 30300.00, 93, 'alta', CURRENT_DATE - 2, CURRENT_DATE, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000016', 'a0000001-0000-0000-0000-000000000023', v_juliana, 'reativacao', 'Sorocaba Peças: sem pedidos há 46 dias', 'Média de **R$ 54.300** com queda de **−51,9%**.', 28200.00, 89, 'alta', CURRENT_DATE - 1, CURRENT_DATE + 1, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000017', 'a0000001-0000-0000-0000-000000000021', v_juliana, 'retorno', 'Retorno técnico Ribeirão Peças', 'Esclarecer dúvidas sobre pinos endurecidos para linha pesada.', 15000.00, 70, 'normal', CURRENT_DATE, CURRENT_DATE + 2, 'aberta', 'manual'),
         ('b0000001-0000-0000-0000-000000000018', 'a0000001-0000-0000-0000-000000000020', v_juliana, 'lote_cd', 'Lote CD Campinas Autopeças', 'Campanha de incentivo para pistão jogos.', 22000.00, 62, 'normal', CURRENT_DATE, CURRENT_DATE + 4, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000019', 'a0000001-0000-0000-0000-000000000026', v_juliana, 'pos_venda', 'Visita de alinhamento Minas Peças', 'Acompanhar testes de bancada do lote KPM.', 0.00, 52, 'normal', CURRENT_DATE, CURRENT_DATE + 5, 'aberta', 'manual');

  -- Marcelo (BA / PE)
  INSERT INTO public.acoes (id, cliente_id, vendedor_id, tipo, titulo, motivo, valor_em_risco, prioridade_pontos, faixa, data_prevista, prazo, situacao, origem)
  VALUES ('b0000001-0000-0000-0000-000000000020', 'a0000001-0000-0000-0000-000000000032', v_marcelo, 'reativacao', 'Feira Autopeças: 50 dias sem compra', 'Média de **R$ 46.300** com queda de **−51,6%**.', 23900.00, 91, 'alta', CURRENT_DATE - 3, CURRENT_DATE, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000021', 'a0000001-0000-0000-0000-000000000037', v_marcelo, 'reativacao', 'Agreste Peças Caruaru em queda', 'Volume caiu para **R$ 23.800** (média normal **R$ 49.100**).', 25300.00, 90, 'alta', CURRENT_DATE - 2, CURRENT_DATE + 1, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000022', 'a0000001-0000-0000-0000-000000000031', v_marcelo, 'retorno', 'Retorno Bahia Peças Salvador', 'Revisar cotação de pistão pesada Scania e Volvo.', 38000.00, 77, 'normal', CURRENT_DATE, CURRENT_DATE + 2, 'aberta', 'manual'),
         ('b0000001-0000-0000-0000-000000000023', 'a0000001-0000-0000-0000-000000000036', v_marcelo, 'lote_cd', 'Oferta de Lote C Pernambuco Peças', 'Alocação de pistão leve com entrega expressa.', 21000.00, 64, 'normal', CURRENT_DATE, CURRENT_DATE + 3, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000024', 'a0000001-0000-0000-0000-000000000038', v_marcelo, 'pendencia', 'Condição especial de frete Petrolina', 'Aguardando validação da supervisão comercial.', 12000.00, 66, 'normal', CURRENT_DATE, CURRENT_DATE + 2, 'aberta', 'motor'),
         ('b0000001-0000-0000-0000-000000000025', 'a0000001-0000-0000-0000-000000000034', v_marcelo, 'prospeccao', 'Expansão de linha Itabuna Peças', 'Apresentar lançamentos de anéis e pinos de alta resistência.', 14000.00, 55, 'normal', CURRENT_DATE, CURRENT_DATE + 4, 'aberta', 'manual');

  -- ==========================================================================
  -- 5. INTERAÇÕES NO HISTÓRICO
  -- ==========================================================================
  INSERT INTO public.interacoes (cliente_id, usuario_id, canal, direcao, resumo, data)
  VALUES 
    ('a0000001-0000-0000-0000-000000000001', v_carlos, 'whatsapp', 'saida', 'Enviada tabela atualizada com prazos especiais de pagamento para kits de pistão.', now() - interval '8 days'),
    ('a0000001-0000-0000-0000-000000000001', v_carlos, 'telefone', 'saida', 'Contato com Gilberto Tonini sobre queda nos pedidos de reposição direta.', now() - interval '18 days'),
    ('a0000001-0000-0000-0000-000000000002', v_carlos, 'whatsapp', 'saida', 'Confirmação do recebimento da NF e agendamento da reposição.', now() - interval '2 days'),
    ('a0000001-0000-0000-0000-000000000019', v_juliana, 'teams', 'saida', 'Reunião de alinhamento trimestral com a diretoria da Rede União sobre margem e volume.', now() - interval '7 days'),
    ('a0000001-0000-0000-0000-000000000003', v_carlos, 'visita', 'saida', 'Visita técnica presencial na matriz de Novo Hamburgo para apresentação da linha pesada Sly.', now() - interval '15 days'),
    ('a0000001-0000-0000-0000-000000000004', v_carlos, 'email', 'saida', 'Envio de laudo técnico de tolerância dos pinos e pistões fornecidos.', now() - interval '20 days')
  ON CONFLICT DO NOTHING;

  -- ==========================================================================
  -- 6. ALERTAS RELEVANTES
  -- ==========================================================================
  INSERT INTO public.alertas (tipo, destinatario_id, mensagem, referencia, situacao)
  VALUES
    ('queda_critica', v_carlos, 'Cliente Tonini Distribuidora atingiu 48 dias sem compra com queda superior a 50%.', 'Tonini Distribuidora', 'aberto'),
    ('queda_critica', v_juliana, 'Rede União está com queda de 53,1% no faturamento mensal (R$ 77.000 em risco).', 'Rede União', 'aberto'),
    ('queda_critica', v_supervisora, '4 distribuidores prioritários em queda estão sem contato há mais de 7 dias.', 'Carteira Geral', 'aberto'),
    ('estoque_lote', v_supervisora, 'Lote C/D com 1.400 peças de giro disponível para direcionamento.', 'CD Platina', 'aberto'),
    ('meta_equipe', v_supervisora, 'Meta regional RS atingiu 88% do volume previsto com 8 dias restantes.', 'Meta RS', 'lido')
  ON CONFLICT DO NOTHING;

END $$;
