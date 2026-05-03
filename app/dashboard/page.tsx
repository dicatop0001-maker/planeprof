'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

interface Planejamento {
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
  dinamica: string
  tipo_letra: string
  na_biblioteca: boolean
  created_at: string
  status: string
}

function gerarDocx(plano: Planejamento) {
  const fontFamily = plano.tipo_letra === 'cursiva' ? 'Georgia, serif' : 'Arial, sans-serif'
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${plano.titulo}</title>
<style>
  body { font-family: ${fontFamily}; max-width: 800px; margin: 40px auto; padding: 20px; color: #222; }
  h1 { color: #1e3a5f; font-size: 22px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px; }
  h2 { color: #2563eb; font-size: 16px; margin-top: 24px; }
  .badge { background: #dbeafe; color: #1d4ed8; padding: 4px 10px; border-radius: 20px; font-size: 13px; display: inline-block; margin: 3px; font-family: monospace; }
  .info { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px 16px; margin: 16px 0; border-radius: 4px; }
  li { margin: 6px 0; }
  p { line-height: 1.7; }
</style>
</head>
<body>
<h1>${plano.titulo}</h1>
<div class="info">
  <strong>Disciplina:</strong> ${plano.disciplina} &nbsp;|&nbsp;
  <strong>Série:</strong> ${plano.serie} &nbsp;|&nbsp;
  <strong>${plano.bimestre}º Bimestre</strong> &nbsp;|&nbsp;
  <strong>Tipo de Letra:</strong> ${plano.tipo_letra === 'cursiva' ? 'Cursiva' : 'Letra de Forma'}
</div>
<h2>📚 Habilidades BNCC</h2>
<div>${(plano.habilidades_bncc || []).map(h => `<span class="badge">${h}</span>`).join('')}</div>
<h2>🎯 Objetivos da Aula</h2>
<ul>${(plano.objetivos || []).map(o => `<li>${o}</li>`).join('')}</ul>
<h2>📖 Desenvolvimento da Aula</h2>
<p style="white-space: pre-wrap">${plano.desenvolvimento}</p>
<h2>🏁 Conclusão e Reflexão</h2>
<p>${plano.conclusao}</p>
${plano.dinamica ? `<h2>🎮 Dinâmica/Jogo</h2><p>${plano.dinamica}</p>` : ''}
<hr style="margin-top:40px;border-color:#e5e7eb">
<p style="font-size:12px;color:#9ca3af;text-align:center">Gerado pelo Planeprof &bull; planeprof.vercel.app</p>
</body>
</html>`
  const blob = new Blob([html], { type: 'application/vnd.ms-word' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = plano.titulo.replace(/[^a-zA-Z0-9À-ÿ ]/g, '').replace(/\s+/g, '_').substring(0, 50) + '.doc'
  a.click()
  URL.revokeObjectURL(url)
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return; }
      setUser(user)
      try {
        const { data } = await supabase
          .from('planos_de_aula')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)
        if (data) setPlanejamentos(data)
      } catch(e) {}
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    router.push('/')
  }

  // Redireciona para /planos passando o ID; 1º plano é grátis
  const handleBaixar = (plano: Planejamento) => {
    const isPrimeiro = planejamentos.indexOf(plano) === planejamentos.length - 1
    if (isPrimeiro) {
      gerarDocx(plano)
    } else {
      router.push(`/planos?planoId=${plano.id}&acao=download`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <h1 className="text-xl font-bold text-blue-900">Planeprof</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.user_metadata?.nome || user?.email}
            </span>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1 rounded-lg transition">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Planejamentos</p>
            <p className="text-3xl font-bold text-blue-600">{planejamentos.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Na Biblioteca</p>
            <p className="text-3xl font-bold text-green-600">{planejamentos.filter(p => p.na_biblioteca).length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Disponíveis</p>
            <p className="text-3xl font-bold text-purple-600">40</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Plano</p>
            <p className="text-lg font-bold text-orange-600">Free</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Criar Novo Planejamento</h2>
              <p className="text-blue-100 text-sm mt-1">Use IA para gerar um plano BNCC</p>
            </div>
            <Link href="/planejamento/novo" className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition whitespace-nowrap text-sm">
              + Novo Plano
            </Link>
          </div>
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">📚 Biblioteca de Planos</h2>
              <p className="text-emerald-100 text-sm mt-1">Baixe planos prontos de outros professores</p>
            </div>
            <Link href="/biblioteca" className="bg-white text-emerald-600 px-5 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition whitespace-nowrap text-sm">
              Ver Biblioteca
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Meus Planejamentos</h2>
          {planejamentos.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum planejamento ainda</h3>
              <p className="text-gray-500 mb-6">Crie seu primeiro plano de aula com inteligência artificial</p>
              <Link href="/planejamento/novo" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition inline-block">
                Criar Primeiro Plano
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planejamentos.map((plano, idx) => {
                const isPrimeiro = idx === planejamentos.length - 1
                return (
                  <div key={plano.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">📋</span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {isPrimeiro && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🎁 Grátis</span>
                        )}
                        {plano.na_biblioteca && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">📚 Biblioteca</span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {plano.status || 'Concluído'}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{plano.titulo}</h3>
                    <p className="text-sm text-gray-500">{plano.disciplina} • {plano.serie}</p>
                    {plano.tipo_letra && (
                      <p className="text-xs text-gray-400 mt-1">{plano.tipo_letra === 'cursiva' ? '✒️ Letra Cursiva' : '🖊️ Letra de Forma'}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(plano.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="mt-auto pt-4 flex gap-2">
                      <Link href={"/planejamento/" + plano.id} className="flex-1 text-center text-sm py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium">
                        👁 Ver
                      </Link>
                      <button
                        onClick={() => handleBaixar(plano)}
                        className={`flex-1 text-sm py-2 rounded-lg font-semibold transition ${isPrimeiro ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                      >
                        {isPrimeiro ? '🎁 Baixar Grátis' : '⬇️ Baixar'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
