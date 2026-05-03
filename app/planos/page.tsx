'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

function PlanosConteudo() {
  const [planoSelecionado, setPlanoSelecionado] = useState<'mensal' | 'anual'>('anual')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const planoId = searchParams.get('planoId')

  useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login') }
    }
    checkUser()
  }, [router])

  const handleAssinar = (tipo: 'mensal' | 'anual') => {
    setLoading(true)
    const params = new URLSearchParams()
    if (planoId) params.set('planoId', planoId)
    params.set('tipo', tipo)
    router.push(`/pagamento?${params.toString()}`)
  }

  const handleDownloadGratis = () => {
    if (planoId) {
      router.push(`/planejamento/${planoId}?download=1`)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🎉 Seu planejamento está pronto!
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-3">
            Baixe agora ou assine para acesso completo
          </h1>
          <p className="text-gray-500 text-lg">
            O primeiro download é <strong className="text-green-600">100% gratuito</strong>. Para continuar usando, escolha um plano.
          </p>
        </div>

        {/* Grátis */}
        <div className="bg-white border-2 border-green-400 rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎁</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Download Gratuito</h2>
              <p className="text-gray-500 text-sm mt-1">Baixe este planejamento sem custo. Válido para o primeiro plano.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">✓ Download imediato</span>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">✓ Sem cartão</span>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">✓ Formato Word</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDownloadGratis}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition whitespace-nowrap shadow"
          >
            ⬇️ Baixar Grátis
          </button>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm font-medium">ou assine e tenha acesso ilimitado</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div
            onClick={() => setPlanoSelecionado('mensal')}
            className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition shadow-sm hover:shadow-md ${planoSelecionado === 'mensal' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Mensal</h3>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${planoSelecionado === 'mensal' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {planoSelecionado === 'mensal' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-bold text-blue-600">R$&nbsp;9,90</span>
              <span className="text-gray-400 text-sm ml-1">/ mês</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500">✓</span> 40 planejamentos por mês</li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span> Download PDF e Word</li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span> Biblioteca de planos</li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span> Suporte por e-mail</li>
            </ul>
          </div>

          <div
            onClick={() => setPlanoSelecionado('anual')}
            className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition shadow-sm hover:shadow-md relative ${planoSelecionado === 'anual' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full uppercase">Mais Popular</span>
            </div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Anual</h3>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${planoSelecionado === 'anual' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {planoSelecionado === 'anual' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
            <div className="mb-1">
              <span className="text-4xl font-bold text-blue-600">R$&nbsp;100,00</span>
              <span className="text-gray-400 text-sm ml-1">/ ano</span>
            </div>
            <p className="text-green-600 text-sm font-semibold mb-4">Economia de R$ 18,80 vs mensal</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500">✓</span> 40 planejamentos por mês</li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span> Download PDF e Word</li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span> Biblioteca de planos</li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span> Suporte prioritário</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => handleAssinar(planoSelecionado)}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition disabled:opacity-50 shadow-lg"
        >
          {loading ? 'Aguarde...' : `Assinar ${planoSelecionado === 'mensal' ? 'Mensal — R$ 9,90/mês' : 'Anual — R$ 100,00/ano'}`}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Pagamento via PIX • Ativação imediata após confirmação
        </p>

        <div className="text-center mt-6">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PlanosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando planos...</p>
        </div>
      </div>
    }>
      <PlanosConteudo />
    </Suspense>
  )
}
