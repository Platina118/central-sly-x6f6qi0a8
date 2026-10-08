import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowLeft, Shield } from 'lucide-react'
import { useAuth, getRoleHomePath } from '@/contexts/AuthContext'
import { DEMO_USERS, DEMO_PASSWORD, PapelUsuario } from '@/lib/supabase'

export default function Index() {
  const { session, perfil, signIn, resetPassword, switchDemoRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Se já estiver logado e com perfil carregado, redireciona para a home do papel
  React.useEffect(() => {
    if (session && perfil) {
      const from = (location.state as any)?.from?.pathname
      const target = from && from !== '/' ? from : getRoleHomePath(perfil.papel)
      navigate(target, { replace: true })
    }
  }, [session, perfil, navigate, location])

  // Estados do formulário
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Modo "Esqueci minha senha"
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Informe seu e-mail e sua senha para continuar.')
      return
    }

    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      setErrorMessage(error.message || 'E-mail ou senha inválidos.')
      return
    }

    // O useEffect cuidará do redirecionamento ao detectar a sessão
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email) {
      setErrorMessage('Informe seu e-mail cadastrado.')
      return
    }

    setForgotLoading(true)
    const { error } = await resetPassword(email)
    setForgotLoading(false)

    if (error) {
      setErrorMessage(error.message || 'Não foi possível solicitar a recuperação.')
      return
    }

    setForgotSuccess(true)
  }

  // Preenchimento de credenciais demonstrativas para teste imediato
  const handleSelectDemo = async (papel: PapelUsuario) => {
    const user = DEMO_USERS[papel]
    setEmail(user.email)
    setPassword(DEMO_PASSWORD)
    setErrorMessage(null)

    // Opcional: efetuar login imediato via switchDemoRole
    if (switchDemoRole) {
      setLoading(true)
      const { error } = await switchDemoRole(papel)
      setLoading(false)
      if (error) {
        setErrorMessage(error.message)
      }
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-[#F6F6F6]">
      {/* 1. PAINEL ESQUERDO: Grafite Industrial Sly (#111213) - Oculto no mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#111213] text-white flex-col justify-between p-12 xl:p-16 overflow-hidden select-none border-r border-[#202020]">
        {/* Topo do painel esquerdo: Logo Sly Parts */}
        <div className="relative z-10">
          <img
            src="https://www.slyparts.com.br/wp-content/uploads/2025/01/Sly-Parts_vertical-300x171.png"
            alt="Sly Parts"
            className="w-[200px] h-auto object-contain filter contrast-125 brightness-110"
          />
        </div>

        {/* Centro do painel esquerdo: Títulos e Frase Institucional */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-figtree font-bold tracking-wider uppercase bg-[#ED1C24]/15 text-[#ED1C24] border border-[#ED1C24]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24] animate-ping" />
            Platina Indústria e Comércio
          </span>

          <h1 className="font-montserrat text-3xl xl:text-4xl font-bold text-white tracking-[-0.5px] leading-tight mb-4">
            Central de Inteligência Comercial
          </h1>

          <p className="font-figtree text-lg text-[#86B0B6] font-normal leading-relaxed">
            Sua carteira, ativa todos os dias.
          </p>

          <p className="font-figtree text-xs text-[#707980] mt-6 leading-relaxed">
            Gestão integrada de distribuidores, pistões, pinos e jogos de pistões com acompanhamento
            de metas em tempo real.
          </p>
        </div>

        {/* Rodapé do painel esquerdo: Informação técnica */}
        <div className="relative z-10 text-xs text-[#707980] font-figtree flex items-center justify-between border-t border-[#202020] pt-4">
          <span>Sly Parts © {new Date().getFullYear()}</span>
          <span>Versão 1.0 (Etapa 1 - Base)</span>
        </div>

        {/* Detalhes Gráficos Industriais (Silhueta técnica de pistão e linhas diagonais em vermelho #ED1C24) */}
        <div className="absolute -bottom-16 -right-16 w-96 h-96 pointer-events-none opacity-20">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full stroke-[#ED1C24] fill-none"
            strokeWidth="1.5"
          >
            {/* Pistão esquemático */}
            <rect x="50" y="30" width="100" height="110" rx="4" />
            <line x1="50" y1="50" x2="150" y2="50" />
            <line x1="50" y1="65" x2="150" y2="65" />
            <line x1="50" y1="80" x2="150" y2="80" />
            <circle cx="100" cy="115" r="14" />
            <line x1="86" y1="115" x2="114" y2="115" />
            <path d="M 88 128 L 75 180 L 125 180 L 112 128" />
            {/* Linhas diagonais técnicas */}
            <line x1="10" y1="10" x2="70" y2="70" strokeDasharray="4 4" />
            <line x1="130" y1="10" x2="190" y2="70" strokeDasharray="4 4" />
            <line x1="20" y1="180" x2="90" y2="180" />
          </svg>
        </div>
      </div>

      {/* 2. PAINEL DIREITO: Formulário Branco */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-[400px] bg-white p-8 sm:p-10 rounded-[10px] border border-[#D9D9D9] shadow-subtle animate-fade-in">
          {/* Logo no mobile */}
          <div className="flex lg:hidden justify-center mb-6">
            <img
              src="https://www.slyparts.com.br/wp-content/uploads/2025/01/Sly-Parts_vertical-300x171.png"
              alt="Sly Parts"
              className="w-[130px] h-auto object-contain"
            />
          </div>

          {!isForgotPassword ? (
            /* ================= FORMULÁRIO DE LOGIN ================= */
            <>
              <div className="mb-6">
                <h2 className="font-montserrat text-2xl font-bold text-[#111213] tracking-[-0.5px]">
                  Bem-vindo(a)
                </h2>
                <p className="font-figtree text-sm text-[#707980] mt-1">
                  Acesse com suas credenciais.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Campo E-mail */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-figtree font-bold text-xs uppercase tracking-[0.06em] text-[#707980] mb-1.5"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@slyparts.com.br"
                    required
                    className="w-full h-11 px-3.5 rounded-[8px] border border-[#D9D9D9] bg-white font-figtree text-sm text-[#111213] placeholder-[#707980] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                  />
                </div>

                {/* Campo Senha */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="font-figtree font-bold text-xs uppercase tracking-[0.06em] text-[#707980]"
                    >
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true)
                        setErrorMessage(null)
                        setForgotSuccess(false)
                      }}
                      className="font-figtree text-xs text-[#ED1C24] hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-11 px-3.5 pr-10 rounded-[8px] border border-[#D9D9D9] bg-white font-figtree text-sm text-[#111213] placeholder-[#707980] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707980] hover:text-[#111213] p-1"
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Mensagens de erro */}
                {errorMessage && (
                  <div className="p-3 rounded-[8px] bg-[#ED1C24]/10 border border-[#ED1C24]/30 flex items-start gap-2 text-xs text-[#ED1C24] font-figtree animate-shake">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Botão Entrar Primário Vermelho */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white font-figtree font-semibold text-sm flex items-center justify-center transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-70 shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>
              </form>

              {/* Acesso Rápido com Perfis Homologados para Avaliação */}
              <div className="mt-8 pt-6 border-t border-[#D9D9D9]">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Shield className="w-3.5 h-3.5 text-[#707980]" />
                  <span className="font-figtree font-bold text-[11px] uppercase tracking-wider text-[#707980]">
                    Acesso Rápido de Homologação
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-figtree text-[#707980] mb-3">
                  <span>Clique no papel para entrar diretamente:</span>
                  <span className="font-mono bg-[#EAEAEA] px-1.5 py-0.5 rounded text-[10px] text-[#111213]">
                    Senha demo: {DEMO_PASSWORD}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-figtree">
                  <button
                    type="button"
                    onClick={() => handleSelectDemo('vendedor')}
                    className="p-1.5 px-2 text-left rounded bg-[#F6F6F6] hover:bg-[#EAEAEA] border border-[#D9D9D9] transition-colors truncate"
                  >
                    <span className="font-semibold text-[#111213]">Vendedor</span>
                    <span className="block text-[10px] text-[#707980]">Carlos Eduardo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemo('supervisora')}
                    className="p-1.5 px-2 text-left rounded bg-[#F6F6F6] hover:bg-[#EAEAEA] border border-[#D9D9D9] transition-colors truncate"
                  >
                    <span className="font-semibold text-[#111213]">Supervisora</span>
                    <span className="block text-[10px] text-[#707980]">Renata Silveira</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemo('diretoria')}
                    className="p-1.5 px-2 text-left rounded bg-[#F6F6F6] hover:bg-[#EAEAEA] border border-[#D9D9D9] transition-colors truncate"
                  >
                    <span className="font-semibold text-[#111213]">Diretoria</span>
                    <span className="block text-[10px] text-[#707980]">Marcos Platina</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemo('pcp')}
                    className="p-1.5 px-2 text-left rounded bg-[#F6F6F6] hover:bg-[#EAEAEA] border border-[#D9D9D9] transition-colors truncate"
                  >
                    <span className="font-semibold text-[#111213]">PCP</span>
                    <span className="block text-[10px] text-[#707980]">Julio Cesar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemo('admin')}
                    className="p-1.5 px-2 text-left rounded bg-[#F6F6F6] hover:bg-[#EAEAEA] border border-[#D9D9D9] transition-colors col-span-2 truncate"
                  >
                    <span className="font-semibold text-[#111213]">Administrador</span>
                    <span className="block text-[10px] text-[#707980]">admin@slyparts.com.br</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ================= FLUXO RECUPERAÇÃO DE SENHA ================= */
            <>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false)
                  setErrorMessage(null)
                  setForgotSuccess(false)
                }}
                className="inline-flex items-center text-xs font-figtree text-[#707980] hover:text-[#111213] mb-4 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Voltar ao login
              </button>

              <div className="mb-6">
                <h2 className="font-montserrat text-2xl font-bold text-[#111213] tracking-[-0.5px]">
                  Recuperar Senha
                </h2>
                <p className="font-figtree text-sm text-[#707980] mt-1">
                  Enviaremos as instruções de redefinição para o seu e-mail cadastrado.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-[8px] bg-[#1E9E5A]/10 border border-[#1E9E5A]/30 text-xs font-figtree text-[#1E9E5A] flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#1E9E5A]" />
                    <div>
                      <p className="font-bold text-sm">Instruções enviadas com sucesso!</p>
                      <p className="mt-1 text-[#111213]">
                        Verifique a caixa de entrada de <strong>{email}</strong> para redefinir sua
                        senha.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false)
                      setForgotSuccess(false)
                    }}
                    className="w-full h-11 rounded-[8px] bg-white border border-[#D9D9D9] hover:bg-[#F6F6F6] font-figtree font-semibold text-sm text-[#111213] transition-colors"
                  >
                    Voltar ao formulário de login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="block font-figtree font-bold text-xs uppercase tracking-[0.06em] text-[#707980] mb-1.5"
                    >
                      E-mail cadastrado
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@slyparts.com.br"
                      required
                      className="w-full h-11 px-3.5 rounded-[8px] border border-[#D9D9D9] bg-white font-figtree text-sm text-[#111213] placeholder-[#707980] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-[8px] bg-[#ED1C24]/10 border border-[#ED1C24]/30 flex items-start gap-2 text-xs text-[#ED1C24] font-figtree">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-11 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white font-figtree font-semibold text-sm flex items-center justify-center transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-70 shadow-sm"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar instruções por e-mail'
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
