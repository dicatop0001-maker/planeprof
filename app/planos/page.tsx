'use client'
import { Suspense, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

function PlanosConteudo() {
  const searchParams = useSearchParams()
  const planoId = searchParams.get('planoId')
  const router = useRouter()

  const [step, setStep] = useState<'planos'|'pix'|'comprovante'|'aguardando'>('planos')
  const [planoSelecionado, setPlanoSelecionado] = useState<'mensal'|'anual'|null>(null)
  const [comprovanteFile, setComprovanteFile] = useState<File|null>(null)
  const [comprovantePreview, setComprovantePreview] = useState<string|null>(null)
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFreeDownload = () => {
    if (planoId) {
      router.push(`/dashboard?download=${planoId}`)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSelecionarPlano = (tipo: 'mensal'|'anual') => {
    setPlanoSelecionado(tipo)
    setStep('pix')
  }

  const handleComprovanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setComprovanteFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setComprovantePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleEnviarComprovante = async () => {
    if (!comprovanteFile) {
      setMensagem('Selecione o comprovante de pagamento primeiro.')
      return
    }
    setEnviando(true)
    setMensagem('')
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Upload do comprovante para Supabase Storage (bucket comprovantes)
      const fileName = `${user.id}_${Date.now()}_${comprovanteFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(fileName, comprovanteFile, { upsert: true })

      // Salvar registro na tabela pagamentos_pendentes
      await supabase.from('pagamentos_pendentes').insert({
        user_id: user.id,
        plano: planoSelecionado,
        comprovante_arquivo: fileName,
        plano_id: planoId,
        status: 'aguardando_confirmacao',
        valor: planoSelecionado === 'mensal' ? 9.90 : 100.00
      })

      setStep('aguardando')
    } catch (err: any) {
      setMensagem('Erro ao enviar comprovante. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (step === 'aguardando') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Aguardando Confirmação</h1>
          <p className="text-gray-600 mb-6">Seu comprovante foi enviado com sucesso! Nossa equipe irá confirmar o pagamento em até 24 horas e liberar o acesso ao download.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 text-sm">✅ Comprovante recebido</p>
            <p className="text-green-700 text-sm">⏳ Análise em andamento</p>
          </div>
          <Link href="/dashboard" className="w-full block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'comprovante') {
    const valor = planoSelecionado === 'mensal' ? 'R$ 9,90' : 'R$ 100,00'
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📎</div>
            <h1 className="text-xl font-bold text-gray-800">Enviar Comprovante</h1>
            <p className="text-gray-500 text-sm mt-1">Plano {planoSelecionado} — {valor}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-700 font-medium mb-1">📋 Instruções:</p>
            <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
              <li>Faça o pagamento via Pix para a chave abaixo</li>
              <li>Tire uma foto ou screenshot do comprovante</li>
              <li>Envie o comprovante aqui</li>
              <li>Aguarde confirmação em até 24h</li>
            </ol>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
            onClick={() => fileRef.current?.click()}>
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

          {mensagem && <p className="text-red-600 text-sm mb-4 text-center">{mensagem}</p>}

          <button onClick={handleEnviarComprovante} disabled={enviando || !comprovanteFile}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 mb-3">
            {enviando ? '⏳ Enviando...' : '📤 Enviar Comprovante'}
          </button>
          <button onClick={() => setStep('pix')} className="w-full text-gray-500 hover:text-gray-700 text-sm py-2">
            ← Voltar
          </button>
        </div>
      </div>
    )
  }

  if (step === 'pix') {
    const valor = planoSelecionado === 'mensal' ? 'R$ 9,90/mês' : 'R$ 100,00/ano'
    const valorNum = planoSelecionado === 'mensal' ? 'R$ 9,90' : 'R$ 100,00'
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">💸</div>
            <h1 className="text-xl font-bold text-gray-800">Pagamento via Pix</h1>
            <p className="text-gray-500 text-sm mt-1">Plano {planoSelecionado === 'mensal' ? 'Mensal' : 'Anual'} — {valor}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Chave Pix (Mercado Pago)</p>
            <div className="bg-white border-2 border-green-400 rounded-xl p-4 mb-3">
              <p className="text-2xl font-bold text-green-700 tracking-widest">42988880353</p>
              <p className="text-xs text-gray-400 mt-1">Telefone / Mercado Pago</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-lg font-bold text-green-800">Valor: {valorNum}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-700">
              ⚠️ Após o pagamento, envie o comprovante no próximo passo para liberarmos seu acesso.
            </p>
          </div>

          <button onClick={() => setStep('comprovante')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3 flex items-center justify-center gap-2">
            ✅ Já paguei — Enviar Comprovante
          </button>
          <button onClick={() => setStep('planos')} className="w-full text-gray-500 hover:text-gray-700 text-sm py-2">
            ← Voltar aos planos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 pt-8">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Escolha seu Plano</h1>
          <p className="text-gray-600 text-lg">Desbloqueie todos os downloads de planos de aula</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Plano Grátis */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="text-xl font-bold text-gray-700">Grátis</h3>
              <p className="text-3xl font-bold text-gray-400 mt-2">R$ 0</p>
              <p className="text-sm text-gray-400">primeiro planejamento</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> 1 download gratuito</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Plano completo BNCC</li>
              <li className="flex items-center gap-2 text-sm text-gray-500"><span className="text-red-400">✕</span> Downloads ilimitados</li>
              <li className="flex items-center gap-2 text-sm text-gray-500"><span className="text-red-400">✕</span> PDI adaptado</li>
              <li className="flex items-center gap-2 text-sm text-gray-500"><span className="text-red-400">✕</span> Biblioteca de planos</li>
            </ul>
            <button onClick={handleFreeDownload}
              className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition">
              Usar gratuito
            </button>
          </div>

          {/* Plano Mensal */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">MAIS POPULAR</span>
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="text-xl font-bold text-blue-700">Mensal</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">R$ 9,90</p>
              <p className="text-sm text-gray-400">por mês</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Downloads ilimitados</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> PDI adaptado inclusivo</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Biblioteca de planos</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> PDF e Word</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Suporte prioritário</li>
            </ul>
            <button onClick={() => handleSelecionarPlano('mensal')}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
              Assinar Mensal
            </button>
          </div>

          {/* Plano Anual */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-lg p-6 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-xl font-bold text-white">Anual</h3>
              <p className="text-3xl font-bold text-white mt-2">R$ 100</p>
              <p className="text-sm text-yellow-100">por ano — economize 15%</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              <li className="flex items-center gap-2 text-sm text-white"><span>✓</span> Tudo do plano mensal</li>
              <li className="flex items-center gap-2 text-sm text-white"><span>✓</span> Economia de R$ 18,80/ano</li>
              <li className="flex items-center gap-2 text-sm text-white"><span>✓</span> Acesso prioritário a novidades</li>
              <li className="flex items-center gap-2 text-sm text-white"><span>✓</span> 12 meses contínuos</li>
              <li className="flex items-center gap-2 text-sm text-yellow-200"><span>⭐</span> Plano mais econômico</li>
            </ul>
            <button onClick={() => handleSelecionarPlano('anual')}
              className="w-full bg-white text-orange-600 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition">
              Assinar Anual
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PlanosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Carregando planos...</p></div>}>
      <PlanosConteudo />
    </Suspense>
  )
          }
