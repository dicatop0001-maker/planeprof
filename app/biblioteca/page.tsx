'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const DISCIPLINAS = ['','Matemática','Língua Portuguesa','Ciências','História','Geografia','Arte','Educação Física','Ensino Religioso','Inglês']
const SERIES = ['','1º Ano','2º Ano','3º Ano','4º Ano','5º Ano','6º Ano','7º Ano','8º Ano','9º Ano','Infantil I','Infantil II','Infantil III','Infantil IV','Infantil V']

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
  dinamica: string
  tipo_letra: string
  downloads: number
  created_at: string
}

function gerarDocx(plano: Plano) {
  const fontFamily = plano.tipo_letra === 'cursiva' ? 'Georgia, serif' : 'Arial, sans-serif'
  const html = `
<!DOCTYPE html>
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
  .tag { background: #f3f4f6; padding: 4px 10px; border-radius: 8px; font-size: 12px; display: inline-block; margin: 3px; }
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

export default function BibliotecaPage() {
  const [planos, setPlanos] = useState<Plano[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroDisc, setFiltroDisc] = useState('')
  const [filtroSerie, setFiltroSerie] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [baixando, setBaixando] = useState<string | null>(null)
  const [planoAberto, setPlanoAberto] = useState<Plano | null>(null)
  const limit = 12

  const fetchPlanos = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (filtroDisc) params.set('disciplina', filtroDisc)
      if (filtroSerie) params.set('serie', filtroSerie)
      const resp = await fetch(`/api/biblioteca?${params.toString()}`)
      const data = await resp.json()
      setPlanos(data.planos || [])
      setTotal(data.total || 0)
    } catch {
      setPlanos([])
    } finally {
      setLoading(false)
    }
  }, [page, filtroDisc, filtroSerie])

  useEffect(() => { fetchPlanos() }, [fetchPlanos])

  const handleBaixar = async (plano: Plano) => {
    setBaixando(plano.id)
    try {
      await fetch('/api/biblioteca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planoId: plano.id })
      })
      gerarDocx(plano)
    } catch {}
    setBaixando(null)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">← Dashboard</Link>
            <h1 className="text-xl font-bold text-blue-900">📚 Biblioteca de Planos</h1>
          </div>
          <span className="text-sm text-gray-500">{total} plano{total !== 1 ? 's' : ''} disponível{total !== 1 ? 'is' : ''}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Disciplina</label>
            <select value={filtroDisc} onChange={e => { setFiltroDisc(e.target.value); setPage(1) }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas as disciplinas</option>
              {DISCIPLINAS.filter(Boolean).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Série</label>
            <select value={filtroSerie} onChange={e => { setFiltroSerie(e.target.value); setPage(1) }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas as séries</option>
              {SERIES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {(filtroDisc || filtroSerie) && (
            <button onClick={() => { setFiltroDisc(''); setFiltroSerie(''); setPage(1) }} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {/* Lista de planos */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-4">⏳</div>
            <p>Carregando planos...</p>
          </div>
        ) : planos.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum plano encontrado</h3>
            <p className="text-sm">Seja o primeiro a compartilhar um plano na biblioteca!</p>
            <Link href="/planejamento/novo" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
              Criar Plano
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {planos.map(plano => (
              <div key={plano.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{plano.disciplina}</span>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{plano.serie}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{plano.bimestre}°B</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2">{plano.titulo}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{plano.conteudo}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(plano.habilidades_bncc || []).slice(0, 3).map((h, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono">{h}</span>
                  ))}
                  {(plano.habilidades_bncc || []).length > 3 && <span className="text-xs text-gray-400">+{plano.habilidades_bncc.length - 3}</span>}
                </div>
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                  <span>{plano.tipo_letra === 'cursiva' ? '✒️ Cursiva' : '🖊️ Letra de Forma'}</span>
                  <span>•</span>
                  <span>⬇️ {plano.downloads || 0} downloads</span>
                </div>
                <div className="mt-auto flex gap-2">
                  <button onClick={() => setPlanoAberto(plano)} className="flex-1 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium">
                    👁 Ver
                  </button>
                  <button onClick={() => handleBaixar(plano)} disabled={baixando === plano.id} className="flex-1 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50">
                    {baixando === plano.id ? '⏳' : '⬇️ Baixar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">
              ← Anterior
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">Página {page} de {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">
              Próxima →
            </button>
          </div>
        )}
      </main>

      {/* Modal de visualização */}
      {planoAberto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPlanoAberto(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 leading-snug">{planoAberto.titulo}</h2>
                <p className="text-sm text-gray-500 mt-1">{planoAberto.disciplina} · {planoAberto.serie} · {planoAberto.bimestre}° Bimestre</p>
              </div>
              <button onClick={() => setPlanoAberto(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4">✕</button>
            </div>
            <div className="p-6 space-y-5" style={planoAberto.tipo_letra === 'cursiva' ? {fontFamily: 'cursive'} : {}}>
              <div>
                <h3 className="text-sm font-semibold text-blue-700 mb-2">📚 Habilidades BNCC</h3>
                <div className="flex flex-wrap gap-2">
                  {(planoAberto.habilidades_bncc || []).map((h, i) => <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-mono">{h}</span>)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-700 mb-2">🎯 Objetivos</h3>
                <ul className="space-y-1">{(planoAberto.objetivos || []).map((o, i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-green-500">✓</span>{o}</li>)}</ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-purple-700 mb-2">📖 Desenvolvimento</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{planoAberto.desenvolvimento}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-orange-700 mb-2">🏁 Conclusão</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{planoAberto.conclusao}</p>
              </div>
              {planoAberto.dinamica && (
                <div>
                  <h3 className="text-sm font-semibold text-pink-700 mb-2">🎮 Dinâmica</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{planoAberto.dinamica}</p>
                </div>
              )}
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => { handleBaixar(planoAberto); setPlanoAberto(null) }} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                ⬇️ Baixar Plano
              </button>
              <button onClick={() => setPlanoAberto(null)} className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
