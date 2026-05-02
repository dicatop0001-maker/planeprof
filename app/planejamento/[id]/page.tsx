'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

interface Plano {
  id: string
  titulo: string
  disciplina: string
  serie: string
  bimestre: number
  conteudo: string
  habilidades_bncc: string[]
  objetivos: string[]
  desenvolvimento: string
  conclusao: string
  dinamica: string | null
  created_at: string
}

export default function PlanejamentoPage() {
  const [plano, setPlano] = useState<Plano | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchPlano = async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('planos_de_aula')
        .select('*')
        .eq('id', params.id)
        .single()
      if (error || !data) { router.push('/dashboard'); return; }
      setPlano(data)
      setLoading(false)
    }
    fetchPlano()
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Carregando...</p></div>
  }
  if (!plano) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
            <h1 className="text-lg font-bold text-blue-900 hidden sm:block">Planejamento</h1>
          </div>
          <button onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            🖨️ Imprimir / PDF
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 print:py-4 print:px-8">
        <div className="bg-blue-900 text-white p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-2"><span className="text-3xl">🎓</span><span className="text-lg font-semibold opacity-80">Planeprof</span></div>
          <h1 className="text-2xl font-bold mb-2">{plano.titulo}</h1>
          <div className="flex flex-wrap gap-4 text-sm opacity-80">
            <span>📚 {plano.disciplina}</span>
            <span>🏫 {plano.serie}</span>
            <span>📅 {plano.bimestre}° Bimestre</span>
            <span>📝 {new Date(plano.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-blue-700 mb-3">📚 Habilidades BNCC</h2>
            <div className="flex flex-wrap gap-2">
              {plano.habilidades_bncc?.map((h, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-mono">{h}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-gray-700 mb-2">📖 Conteúdo</h2>
            <p className="text-gray-700">{plano.conteudo}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-green-700 mb-3">🎯 Objetivos</h2>
            <ul className="space-y-2">
              {plano.objetivos?.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700"><span className="text-green-500 font-bold mt-0.5">{i+1}.</span>{obj}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-purple-700 mb-3">📝 Desenvolvimento</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{plano.desenvolvimento}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-orange-700 mb-3">🏁 Conclusão</h2>
            <p className="text-gray-700 leading-relaxed">{plano.conclusao}</p>
          </div>
          {plano.dinamica && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-bold text-pink-700 mb-3">🎮 Dinâmica</h2>
              <p className="text-gray-700 leading-relaxed">{plano.dinamica}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
