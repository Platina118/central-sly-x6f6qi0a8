-- ==============================================================================
-- Seed Completo de Usuários e Perfis
-- Central Sly - Sly Parts (Platina Autopeças)
-- ==============================================================================

DO $$
DECLARE
  v_vendedor1_id UUID := '11111111-1111-4111-8111-111111111111'::UUID;
  v_vendedor2_id UUID := '22222222-2222-4222-8222-222222222222'::UUID;
  v_vendedor3_id UUID := '33333333-3333-4333-8333-333333333333'::UUID;
  v_vendedor4_id UUID := '44444444-4444-4444-8444-444444444444'::UUID;
  v_supervisora_id UUID := '55555555-5555-4555-8555-555555555555'::UUID;
  v_diretoria_id UUID := '66666666-6666-4666-8666-666666666666'::UUID;
  v_admin_id UUID := '77777777-7777-4777-8777-777777777777'::UUID;
  v_current_user_id UUID := '88888888-8888-4888-8888-888888888888'::UUID;
  v_pwd TEXT := crypt('Skip@Pass', gen_salt('bf'));
BEGIN
  -- 1. Vendedor 1: Carlos Eduardo (VEND-042 - vendedor principal)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vendedor@slyparts.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_vendedor1_id, '00000000-0000-0000-0000-000000000000',
      'vendedor@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Carlos Eduardo", "papel": "vendedor"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_vendedor1_id FROM auth.users WHERE email = 'vendedor@slyparts.com.br';
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (v_vendedor1_id, 'Carlos Eduardo', 'vendedor@slyparts.com.br', 'vendedor', 'VEND-042', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=42', true)
  ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, papel = EXCLUDED.papel, codigo_vendedor_focco = EXCLUDED.codigo_vendedor_focco;

  -- 2. Vendedor 2: Rodrigo Mendes (VEND-018 - Vendedor Sul/SC-PR)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'rodrigo.mendes@slyparts.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_vendedor2_id, '00000000-0000-0000-0000-000000000000',
      'rodrigo.mendes@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Rodrigo Mendes", "papel": "vendedor"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_vendedor2_id FROM auth.users WHERE email = 'rodrigo.mendes@slyparts.com.br';
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (v_vendedor2_id, 'Rodrigo Mendes', 'rodrigo.mendes@slyparts.com.br', 'vendedor', 'VEND-018', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=18', true)
  ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, papel = EXCLUDED.papel, codigo_vendedor_focco = EXCLUDED.codigo_vendedor_focco;

  -- 3. Vendedor 3: Juliana Castro (VEND-031 - Vendedora Sudeste/SP-MG)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'juliana.castro@slyparts.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_vendedor3_id, '00000000-0000-0000-0000-000000000000',
      'juliana.castro@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Juliana Castro", "papel": "vendedor"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_vendedor3_id FROM auth.users WHERE email = 'juliana.castro@slyparts.com.br';
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (v_vendedor3_id, 'Juliana Castro', 'juliana.castro@slyparts.com.br', 'vendedor', 'VEND-031', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=31', true)
  ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, papel = EXCLUDED.papel, codigo_vendedor_focco = EXCLUDED.codigo_vendedor_focco;

  -- 4. Vendedor 4: Marcelo Ferreira (VEND-055 - Vendedor Nordeste/BA-PE)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marcelo.ferreira@slyparts.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_vendedor4_id, '00000000-0000-0000-0000-000000000000',
      'marcelo.ferreira@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Marcelo Ferreira", "papel": "vendedor"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_vendedor4_id FROM auth.users WHERE email = 'marcelo.ferreira@slyparts.com.br';
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (v_vendedor4_id, 'Marcelo Ferreira', 'marcelo.ferreira@slyparts.com.br', 'vendedor', 'VEND-055', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=55', true)
  ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, papel = EXCLUDED.papel, codigo_vendedor_focco = EXCLUDED.codigo_vendedor_focco;

  -- 5. Supervisora: Renata Silveira
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'supervisora@slyparts.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_supervisora_id, '00000000-0000-0000-0000-000000000000',
      'supervisora@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Renata Silveira", "papel": "supervisora"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_supervisora_id FROM auth.users WHERE email = 'supervisora@slyparts.com.br';
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (v_supervisora_id, 'Renata Silveira', 'supervisora@slyparts.com.br', 'supervisora', 'SUP-001', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=99', true)
  ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, papel = EXCLUDED.papel;

  -- 6. Diretoria: Marcos Platina
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'diretoria@slyparts.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_diretoria_id, '00000000-0000-0000-0000-000000000000',
      'diretoria@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Marcos Platina", "papel": "diretoria"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_diretoria_id FROM auth.users WHERE email = 'diretoria@slyparts.com.br';
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (v_diretoria_id, 'Marcos Platina', 'diretoria@slyparts.com.br', 'diretoria', NULL, 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=88', true)
  ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, papel = EXCLUDED.papel;

  -- 7. Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@slyparts.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000',
      'admin@slyparts.com.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Administrador", "papel": "admin"}',
      true, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@slyparts.com.br';
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (v_admin_id, 'Administrador do Sistema', 'admin@slyparts.com.br', 'admin', NULL, 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1', true)
  ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, papel = EXCLUDED.papel;

  -- 8. Current user seed: marketing2@platina.ind.br (Supervisora / Gestora)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marketing2@platina.ind.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_current_user_id, '00000000-0000-0000-0000-000000000000',
      'marketing2@platina.ind.br', v_pwd, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Marketing & Inteligência", "papel": "supervisora"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_current_user_id FROM auth.users WHERE email = 'marketing2@platina.ind.br';
  END IF;

  INSERT INTO public.perfis (id, nome, email, papel, codigo_vendedor_focco, avatar_url, ativo)
  VALUES (v_current_user_id, 'Marketing Platina', 'marketing2@platina.ind.br', 'supervisora', 'SUP-002', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=77', true)
  ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, papel = EXCLUDED.papel;

END $$;
