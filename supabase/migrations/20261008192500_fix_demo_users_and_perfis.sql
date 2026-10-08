-- ==============================================================================
-- Migração de Alinhamento de Usuários Demo e Perfis
-- Garante:
-- 1. Usuário e perfil vendedor@slyparts.com.br alinhados ao id real de auth.users
-- 2. Clientes e ações de RS vinculados ao id de vendedor@slyparts.com.br
-- 3. Criação de pcp@slyparts.com.br (auth.users + perfis)
-- 4. Redefinição uniforme de senha para todas as contas demo (Skip@Pass)
-- ==============================================================================

DO $$
DECLARE
  v_vendedor_id UUID;
  v_pcp_id UUID := '99999999-9999-4999-8999-999999999999'::UUID;
  v_pwd TEXT := crypt('Skip@Pass', gen_salt('bf'));
BEGIN
  -- 1. vendedor@slyparts.com.br
  -- Obter o ID existente ou inserir caso não exista
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'vendedor@slyparts.com.br') THEN
    SELECT id INTO v_vendedor_id FROM auth.users WHERE email = 'vendedor@slyparts.com.br';
    UPDATE auth.users
    SET encrypted_password = v_pwd,
        raw_user_meta_data = '{"nome": "Carlos Eduardo", "papel": "vendedor"}'::jsonb,
        email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = v_vendedor_id;
  ELSE
    v_vendedor_id := '11111111-1111-4111-8111-111111111111'::UUID;
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_vendedor_id, '00000000-0000-0000-0000-000000000000',
      'vendedor@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Carlos Eduardo", "papel": "vendedor"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  -- Inserir / Atualizar perfil do vendedor Carlos Eduardo
  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (
    v_vendedor_id,
    'Carlos Eduardo',
    'vendedor@slyparts.com.br',
    'vendedor',
    'VEND-042',
    'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=42',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    papel = EXCLUDED.papel,
    email = EXCLUDED.email,
    codigo_vendedor_focco = EXCLUDED.codigo_vendedor_focco,
    avatar_url = EXCLUDED.avatar_url,
    ativo = true;

  -- Vincular clientes do RS (CLI-10492 até CLI-10901) a este vendedor
  UPDATE public.clientes
  SET vendedor_id = v_vendedor_id
  WHERE codigo_focco IN (
    'CLI-10492', 'CLI-10214', 'CLI-10883', 'CLI-10551',
    'CLI-10332', 'CLI-10118', 'CLI-10774', 'CLI-10901'
  )
  OR (vendedor_id IS NULL AND uf = 'RS');

  -- Vincular ações do Carlos a este vendedor
  UPDATE public.acoes
  SET vendedor_id = v_vendedor_id
  WHERE id IN (
    'b0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000002',
    'b0000001-0000-0000-0000-000000000003',
    'b0000001-0000-0000-0000-000000000004',
    'b0000001-0000-0000-0000-000000000005',
    'b0000001-0000-0000-0000-000000000006',
    'b0000001-0000-0000-0000-000000000007'
  )
  OR (vendedor_id IS NULL AND cliente_id IN (SELECT id FROM public.clientes WHERE vendedor_id = v_vendedor_id));

  -- Vincular interações e alertas do Carlos
  UPDATE public.interacoes
  SET usuario_id = v_vendedor_id
  WHERE (usuario_id IS NULL OR usuario_id = '11111111-1111-4111-8111-111111111111'::UUID)
    AND cliente_id IN (SELECT id FROM public.clientes WHERE vendedor_id = v_vendedor_id);

  UPDATE public.alertas
  SET destinatario_id = v_vendedor_id
  WHERE (destinatario_id IS NULL OR destinatario_id = '11111111-1111-4111-8111-111111111111'::UUID)
    AND tipo = 'queda_critica' AND referencia = 'Tonini Distribuidora';

  -- 2. pcp@slyparts.com.br
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pcp@slyparts.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_pcp_id, '00000000-0000-0000-0000-000000000000',
      'pcp@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Julio Cesar", "papel": "pcp"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_pcp_id FROM auth.users WHERE email = 'pcp@slyparts.com.br';
    UPDATE auth.users
    SET encrypted_password = v_pwd,
        raw_user_meta_data = '{"nome": "Julio Cesar", "papel": "pcp"}'::jsonb,
        email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = v_pcp_id;
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (
    v_pcp_id,
    'Julio Cesar',
    'pcp@slyparts.com.br',
    'pcp',
    'PCP-010',
    'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=10',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    papel = EXCLUDED.papel,
    email = EXCLUDED.email,
    codigo_vendedor_focco = EXCLUDED.codigo_vendedor_focco,
    avatar_url = EXCLUDED.avatar_url,
    ativo = true;

  -- 3. Garantir senhas uniformes para todas as contas demo em auth.users
  UPDATE auth.users
  SET encrypted_password = v_pwd,
      email_confirmed_at = COALESCE(email_confirmed_at, now())
  WHERE email IN (
    'vendedor@slyparts.com.br',
    'supervisora@slyparts.com.br',
    'diretoria@slyparts.com.br',
    'admin@slyparts.com.br',
    'pcp@slyparts.com.br',
    'rodrigo.mendes@slyparts.com.br',
    'juliana.castro@slyparts.com.br',
    'marcelo.ferreira@slyparts.com.br',
    'marketing2@platina.ind.br'
  );

END $$;
