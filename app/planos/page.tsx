'use client'
import { Suspense, useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

// Chave pix e dados de pagamento
const PIX_CHAVE = '42988880353'
const PIX_NOME = 'Planeprof'
const PLANOS = {
  mensal: { label: 'Mensal', valor: 9.90, desc: 'por mês', economia: '' },
  anual: { label: 'Anual', valor: 100.00, desc: 'por ano', economia: 'economize 15%' }
}

function gerarPayloadPix(chave: string, nome: string, valor: number, txid: string) {
  const valStr = valor.toFixed(2)
  const nomeClean = nome.substring(0, 25).padEnd(1)
  function fmt(id: string, val: string) { return id + val.length.toString().padStart(2,'0') + val }
  const merchant = fmt('00','01') + fmt('01','11') + fmt('26', fmt('00','BR.GOV.BCB.PIX') + fmt('01', chave))
  const amount = fmt('54', valStr)
  const txidField = fmt('05', txid.substring(0,25))
  const addData = fmt('62', txidField)
  const body = merchant + fmt('52','0000') + fmt('53','986') + amount + fmt('58','BR') + fmt('59', nomeClean) + fmt('60','SAO PAULO') + addData + '6304'
  // CRC16
  let crc = 0xFFFF
  for (let i = 0; i < body.length; i++) {
    crc ^= body.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1
  }
  return body + (crc & 0xFFFF).toString(16).toUpperCase().padStart(4,'0')
}

function PlanosConteudo() {
  const searchParams = useSearchParams()
  const planoId = searchParams.get('planoId')
  const router = useRouter()

  // Abas: 'planos' | 'login' | 'pix' | 'comprovante' | 'aguardando'
  const [step, setStep] = useState<string>('planos')
  const [planoSelecionado, setPlanoSelecionado] = useState<'mensal'|'anual'|null>(null)
  const [txid] = useState(() => 'PLF' + Date.now().toString(36).toUpperCase())

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginSenha, setLoginSenha] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginErro, setLoginErro] = useState('')
  const [cadastroMode, setCadastroMode] = useState(false)
  const [loginNome, setLoginNome] = useState('')
  const [userLogado, setUserLogado] = useState<any>(null)

  // Pix
  const [pixPayload, setPixPayload] = useState('')
  const [pixQrUrl, setPixQrUrl] = useState('')

  // Comprovante
  const [comprovanteFile, setComprovanteFile] = useState<File|null>(null)
  const [comprovantePreview, setComprovantePreview] = useState<string|null>(null)
  const [enviando, setEnviando] = useState(false)
  const [msgErro, setMsgErro] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Verificar se já logado
  useEffect(() => {
    const check = async () => {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserLogado(user)
    }
    check()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginErro('')
    const supabase = getSupabase()
    if (cadastroMode) {
      const { error } = await supabase.auth.signUp({
        email: loginEmail, password: loginSenha,
        options: { data: { nome: loginNome } }
      })
      if (error) { setLoginErro('Erro ao cadastrar: ' + error.message) }
      else {
        // confirmar email via SQL não é possível aqui, mas avisa
        setLoginErro('')
        // Tenta login direto
        const { data, error: e2 } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginSenha })
        if (data.user) { setUserLogado(data.user); setStep('pix') }
        else setLoginErro('Cadastro feito! Verifique seu email ou tente o login.')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginSenha })
      if (error) { setLoginErro('Email ou senha incorretos.') }
      else { setUserLogado(data.user); setStep('pix') }
    }
    setLoginLoading(false)
  }

  const handleSelecionarPlano = (tipo: 'mensal'|'anual') => {
    setPlanoSelecionado(tipo)
    if (userLogado) {
      gerarPix(tipo)
      setStep('pix')
    } else {
      setStep('login')
    }
  }

  const gerarPix = (tipo: 'mensal'|'anual') => {
    const valor = PLANOS[tipo].valor
    const payload = gerarPayloadPix(PIX_CHAVE, PIX_NOME, valor, txid)
    setPixPayload(payload)
    // QR Code via API pública
    const encoded = encodeURIComponent(payload)
    setPixQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`)
  }

  const handleLoginEContinuar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginErro('')
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginSenha })
    if (error) { setLoginErro('Email ou senha incorretos.') }
    else {
      setUserLogado(data.user)
      gerarPix(planoSelecionado!)
      setStep('pix')
    }
    setLoginLoading(false)
  }

  const handleComprovanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setComprovanteFile(file)
      const reader = new FileReader()
      reader.onload = ev => setComprovantePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleEnviarComprovante = async () => {
    if (!comprovanteFile) { setMsgErro('Selecione o comprovante.'); return }
    setEnviando(true); setMsgErro('')
    try {
      const supabase = getSupabase()
      const user = userLogado
      if (!user) { router.push('/login'); return }
      const fileName = `${user.id}_${Date.now()}_${comprovanteFile.name}`
      await supabase.storage.from('comprovantes').upload(fileName, comprovanteFile, { upsert: true })
      await supabase.from('pagamentos_pendentes').insert({
        user_id: user.id, plano: planoSelecionado,
        comprovante_arquivo: fileName, plano_id: planoId,
        status: 'aguardando_confirmacao',
        valor: planoSelecionado === 'mensal' ? 9.90 : 100.00
      })
      setStep('aguardando')
    } catch { setMsgErro('Erro ao enviar. Tente novamente.') }
    finally { setEnviando(false) }
  }

  const handleFreeDownload = () => {
    router.push(planoId ? `/dashboard?download=${planoId}` : '/dashboard')
  }

  // ============ RENDER STEPS ============

  if (step === 'aguardando') return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Comprovante Enviado!</h1>
        <p className="text-gray-600 mb-6">Nossa equipe irá confirmar o pagamento em até <strong>24 horas</strong> e liberar seu download automaticamente.</p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left space-y-2">
          <p className="text-green-700 text-sm flex items-center gap-2">✅ Comprovante recebido</p>
          <p className="text-yellow-600 text-sm flex items-center gap-2">⏳ Em análise</p>
          <p className="text-gray-500 text-sm flex items-center gap-2">🔔 Você receberá acesso em breve</p>
        </div>
        <Link href="/dashboard" className="w-full block bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center">
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  )

  if (step === 'comprovante') {
    const valor = planoSelecionado === 'mensal' ? 'R$ 9,90' : 'R$ 100,00'
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          {/* Abas */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <div className="flex-1 text-center py-2 text-sm text-gray-400">1. Plano</div>
            <div className="flex-1 text-center py-2 text-sm text-gray-400">2. Login</div>
            <div className="flex-1 text-center py-2 text-sm text-gray-400">3. Pix</div>
            <div className="flex-1 bg-white rounded-lg py-2 text-sm font-semibold text-purple-700 shadow-sm">4. Comprovante</div>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl mb-2">📎</div>
            <h2 className="text-xl font-bold text-gray-800">Enviar Comprovante</h2>
            <p className="text-gray-500 text-sm mt-1">Plano {planoSelecionado} — {valor}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-sm text-blue-700">
            <p className="font-semibold mb-1">📋 Como funciona:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-600">
              <li>Pague via Pix na chave <strong>42988880353</strong></li>
              <li>Tire foto/screenshot do comprovante</li>
              <li>Faça o upload abaixo</li>
              <li>Aguarde confirmação (até 24h)</li>
            </ol>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
            onClick={() => fileRef.current?.click()}
          >
            {comprovantePreview ? (
              <div>
                <img src={comprovantePreview} alt="Comprovante" className="max-h-48 mx-auto rounded-lg object-contain mb-2" />
                <p className="text-sm text-green-600 font-medium">✅ {comprovanteFile?.name}</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-500 text-sm">Clique para selecionar o comprovante</p>
                <p className="text-gray-400 text-xs mt-1">JPG, PNG ou PDF</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleComprovanteChange} className="hidden" />
          </div>

          {msgErro && <p className="text-red-600 text-sm mb-3 text-center">{msgErro}</p>}

          <button onClick={handleEnviarComprovante} disabled={enviando || !comprovanteFile}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 mb-3">
            {enviando ? '⏳ Enviando...' : '📤 Enviar Comprovante e Aguardar Liberação'}
          </button>
          <button onClick={() => setStep('pix')} className="w-full text-gray-400 hover:text-gray-600 text-sm py-2">
            ← Voltar
          </button>
        </div>
      </div>
    )
  }

  if (step === 'pix' && planoSelecionado) {
    const info = PLANOS[planoSelecionado]
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          {/* Abas */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <div className="flex-1 text-center py-2 text-sm text-gray-400">1. Plano</div>
            <div className="flex-1 text-center py-2 text-sm text-gray-400">2. Login</div>
            <div className="flex-1 bg-white rounded-lg py-2 text-sm font-semibold text-green-700 shadow-sm">3. Pix ✓</div>
            <div className="flex-1 text-center py-2 text-sm text-gray-400">4. Comprovante</div>
          </div>

          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">💸 Pagamento via Pix</h2>
            <p className="text-gray-500 text-sm mt-1">Plano {info.label} — R$ {info.valor.toFixed(2).replace('.',',')} {info.desc}</p>
          </div>

          {/* QR Code */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-5 text-center">
            {pixQrUrl && (
              <div className="mb-3 flex justify-center">
                <div className="bg-white p-2 rounded-xl shadow-sm inline-block">
                  <img src={pixQrUrl} alt="QR Code Pix" className="w-52 h-52 object-contain" />
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mb-3">Escaneie o QR Code acima <strong>OU</strong> use a chave Pix:</p>
            <div className="bg-white border-2 border-green-400 rounded-xl p-3 mb-3">
              <p className="text-lg font-bold text-green-700 tracking-widest">{PIX_CHAVE}</p>
              <p className="text-xs text-gray-400">Telefone / Mercado Pago</p>
            </div>
            {/* Copia e cola */}
            <button
              onClick={() => { navigator.clipboard?.writeText(pixPayload); }}
              className="text-xs bg-green-100 text-green-700 border border-green-300 px-4 py-1.5 rounded-lg hover:bg-green-200 transition font-medium"
            >
              📋 Copiar código Pix Copia e Cola
            </button>
            <div className="bg-green-100 rounded-lg p-2 mt-3">
              <p className="text-base font-bold text-green-800">Valor: R$ {info.valor.toFixed(2).replace('.',',')}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5 text-sm text-yellow-700">
            ⚠️ Após pagar, clique em <strong>"Já paguei"</strong> e envie o comprovante para liberarmos seu acesso.
          </div>

          <button onClick={() => setStep('comprovante')}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition mb-3 text-base">
            ✅ Já paguei — Enviar Comprovante
          </button>
          <button onClick={() => setStep(userLogado ? 'planos' : 'login')} className="w-full text-gray-400 hover:text-gray-600 text-sm py-2">
            ← Voltar
          </button>
        </div>
      </div>
    )
  }

  if (step === 'login') return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Abas */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          <div className="flex-1 text-center py-2 text-sm text-gray-400">1. Plano</div>
          <div className="flex-1 bg-white rounded-lg py-2 text-sm font-semibold text-blue-700 shadow-sm">2. Login ✓</div>
          <div className="flex-1 text-center py-2 text-sm text-gray-400">3. Pix</div>
          <div className="flex-1 text-center py-2 text-sm text-gray-400">4. Comprovante</div>
        </div>

        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🎓</div>
          <h2 className="text-xl font-bold text-blue-900">
            {cadastroMode ? 'Criar Conta' : 'Entrar na sua conta'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Plano <strong>{planoSelecionado}</strong> — R$ {planoSelecionado ? PLANOS[planoSelecionado].valor.toFixed(2).replace('.',',') : ''}
          </p>
        </div>

        {/* Toggle login/cadastro */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
          <button
            onClick={() => setCadastroMode(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${!cadastroMode ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >Já tenho conta</button>
          <button
            onClick={() => setCadastroMode(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${cadastroMode ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >Criar conta grátis</button>
        </div>

        {loginErro && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{loginErro}</div>}

        <form onSubmit={handleLoginEContinuar} className="space-y-3">
          {cadastroMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input type="text" value={loginNome} onChange={e => setLoginNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              placeholder="seu@email.com" required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={loginSenha} onChange={e => setLoginSenha(e.target.value)}
              placeholder="••••••••" required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <button type="submit" disabled={loginLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm mt-2">
            {loginLoading ? 'Aguarde...' : (cadastroMode ? 'Criar conta e continuar →' : 'Entrar e ir para o pagamento →')}
          </button>
        </form>

        <button onClick={() => setStep('planos')} className="w-full text-gray-400 hover:text-gray-600 text-sm py-3 mt-2">
          ← Voltar aos planos
        </button>
      </div>
    </div>
  )

  // Step inicial: escolher plano
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Abas de progresso */}
        <div className="flex rounded-2xl bg-white shadow-sm p-1 mb-8 mt-6 max-w-lg mx-auto">
          <div className="flex-1 bg-blue-600 text-white rounded-xl py-2 text-sm font-semibold text-center shadow-sm">1. Plano ✓</div>
          <div className="flex-1 text-center py-2 text-sm text-gray-400">2. Login</div>
          <div className="flex-1 text-center py-2 text-sm text-gray-400">3. Pix</div>
          <div className="flex-1 text-center py-2 text-sm text-gray-400">4. Comprovante</div>
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Escolha seu Plano</h1>
          <p className="text-gray-600">Desbloqueie todos os downloads. <strong>Primeiro plano sempre grátis!</strong></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Grátis */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="text-xl font-bold text-gray-700">Grátis</h3>
              <p className="text-3xl font-bold text-gray-400 mt-2">R$ 0</p>
              <p className="text-xs text-gray-400">primeiro planejamento</p>
            </div>
            <ul className="space-y-2 flex-1 mb-5 text-sm">
              <li className="flex gap-2 text-gray-600"><span className="text-green-500">✓</span>1 download gratuito</li>
              <li className="flex gap-2 text-gray-600"><span className="text-green-500">✓</span>Plano completo BNCC</li>
              <li className="flex gap-2 text-gray-400"><span className="text-red-400">✕</span>Downloads ilimitados</li>
              <li className="flex gap-2 text-gray-400"><span className="text-red-400">✕</span>PDI adaptado</li>
            </ul>
            <button onClick={handleFreeDownload} className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
              Usar gratuito
            </button>
          </div>

          {/* Mensal */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">MAIS POPULAR</span>
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="text-xl font-bold text-blue-700">Mensal</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">R$ 9,90</p>
              <p className="text-xs text-gray-400">por mês</p>
            </div>
            <ul className="space-y-2 flex-1 mb-5 text-sm">
              <li className="flex gap-2 text-gray-600"><span className="text-green-500">✓</span>Downloads ilimitados</li>
              <li className="flex gap-2 text-gray-600"><span className="text-green-500">✓</span>PDI adaptado inclusivo</li>
              <li className="flex gap-2 text-gray-600"><span className="text-green-500">✓</span>Biblioteca de planos</li>
              <li className="flex gap-2 text-gray-600"><span className="text-green-500">✓</span>PDF e Word</li>
              <li className="flex gap-2 text-gray-600"><span className="text-green-500">✓</span>Atividades com imagens</li>
            </ul>
            <button onClick={() => handleSelecionarPlano('mensal')} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm">
              Assinar Mensal →
            </button>
          </div>

          {/* Anual */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-lg p-6 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-xl font-bold text-white">Anual</h3>
              <p className="text-3xl font-bold text-white mt-2">R$ 100</p>
              <p className="text-xs text-yellow-100">por ano — economize 15%</p>
            </div>
            <ul className="space-y-2 flex-1 mb-5 text-sm text-white">
              <li className="flex gap-2"><span>✓</span>Tudo do plano mensal</li>
              <li className="flex gap-2"><span>✓</span>Economia R$ 18,80/ano</li>
              <li className="flex gap-2"><span>✓</span>Acesso 12 meses</li>
              <li className="flex gap-2"><span>⭐</span>Melhor custo-benefício</li>
            </ul>
            <button onClick={() => handleSelecionarPlano('anual')} className="w-full bg-white text-orange-600 py-2.5 rounded-xl font-semibold hover:bg-orange-50 transition text-sm">
              Assinar Anual →
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">← Voltar ao Dashboard</Link>
        </div>
      </div>
    </div>
  )
}

export default function PlanosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Carregando...</p></div>}>
      <PlanosConteudo />
    </Suspense>
  )
                  }
