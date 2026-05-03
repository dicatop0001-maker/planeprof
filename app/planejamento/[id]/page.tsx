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
  tipo_letra?: string
  created_at: string
}

export default function PlanejamentoPage() {
  const [plano, setPlano] = useState<Plano | null>(null)
  const [loading, setLoading] = useState(true)
  const [pdiTexto, setPdiTexto] = useState<string | null>(null)
  const [gerandoPdi, setGerandoPdi] = useState(false)
  const [pdiAluno, setPdiAluno] = useState('')
  const [pdiNecessidades, setPdiNecessidades] = useState('')
  const [mostrarPdiForm, setMostrarPdiForm] = useState(false)
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

  const gerarPDI = async () => {
    if (!plano) return
    setGerandoPdi(true)
    try {
      const resp = await fetch('/api/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina: plano.disciplina,
          serie: plano.serie,
          bimestre: String(plano.bimestre),
          conteudo: plano.conteudo,
          gerarPdi: true,
          pdiAluno,
          pdiNecessidades
        })
      })
      const data = await resp.json()
      if (data.plano?.pdi) {
        setPdiTexto(data.plano.pdi)
        setMostrarPdiForm(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setGerandoPdi(false)
    }
  }

  const downloadWord = () => {
    if (!plano) return
    const fontStyle = plano.tipo_letra === 'cursiva' ? 'font-family: cursive;' : 'font-family: Arial, sans-serif;'
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${plano.titulo}</title>
<style>
  body { ${fontStyle} margin: 40px; color: #111; line-height: 1.6; }
  h1 { color: #1e3a8a; font-size: 20px; border-bottom: 3px solid #1e3a8a; padding-bottom: 8px; }
  h2 { color: #1d4ed8; font-size: 15px; margin-top: 24px; margin-bottom: 6px; }
  .header { background: #1e3a8a; color: white; padding: 20px; margin-bottom: 24px; border-radius: 8px; }
  .header h1 { color: white; border-bottom: 1px solid rgba(255,255,255,0.3); }
  .header p { color: rgba(255,255,255,0.85); font-size: 13px; margin: 4px 0; }
  .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; padding: 2px 10px; border-radius: 20px; font-family: monospace; font-size: 12px; margin: 2px; }
  .section { margin-bottom: 20px; padding: 16px; border-left: 4px solid #1d4ed8; background: #f8fafc; }
  .objetivo { margin: 6px 0; }
  .pdi-section { margin-top: 32px; padding: 20px; border: 2px solid #7c3aed; border-radius: 8px; background: #faf5ff; }
  .pdi-section h2 { color: #7c3aed; }
  pre { white-space: pre-wrap; font-family: inherit; }
</style>
</head>
<body>
<div class="header">
  <h1>${plano.titulo}</h1>
  <p>📚 ${plano.disciplina} &nbsp;|&nbsp; 🏫 ${plano.serie} &nbsp;|&nbsp; 📅 ${plano.bimestre}° Bimestre</p>
  <p>Gerado em: ${new Date(plano.created_at).toLocaleDateString('pt-BR')}</p>
</div>

<h2>📚 Habilidades BNCC</h2>
<div>${plano.habilidades_bncc?.map(h => `<span class="badge">${h}</span>`).join(' ')}</div>

<h2>📖 Conteúdo Programático</h2>
<div class="section"><p>${plano.conteudo}</p></div>

<h2>🎯 Objetivos da Aula</h2>
<div class="section">
${plano.objetivos?.map((obj, i) => `<p class="objetivo"><strong>${i+1}.</strong> ${obj}</p>`).join('')}
</div>

<h2>📝 Desenvolvimento</h2>
<div class="section"><pre>${plano.desenvolvimento}</pre></div>

<h2>🏁 Conclusão e Reflexão</h2>
<div class="section"><p>${plano.conclusao}</p></div>

${plano.dinamica ? `<h2>🎮 Dinâmica / Jogo</h2><div class="section"><p>${plano.dinamica}</p></div>` : ''}

${pdiTexto ? `
<div class="pdi-section">
<h2>♿ PDI - Plano de Desenvolvimento Individual${pdiAluno ? ' — ' + pdiAluno : ''}</h2>
<pre>${pdiTexto}</pre>
</div>
` : ''}

</body>
</html>`

    const blob = new Blob([html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = plano.titulo.replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, '').replace(/ /g, '_').substring(0, 50) + '.doc'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadPDF = () => {
    if (!plano) return
    // Criar janela de impressão com CSS otimizado para PDF
    const fontStyle = plano.tipo_letra === 'cursiva' ? 'font-family: cursive;' : 'font-family: Arial, sans-serif;'
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${plano.titulo}</title>
<style>
  @page { margin: 20mm 15mm; size: A4; }
  * { box-sizing: border-box; }
  body { ${fontStyle} color: #111; line-height: 1.6; font-size: 11pt; }
  .header { background: #1e3a8a; color: white; padding: 16px 20px; margin-bottom: 16px; border-radius: 6px; }
  .header h1 { font-size: 16pt; margin: 0 0 6px 0; color: white; }
  .header .meta { font-size: 10pt; opacity: 0.85; }
  h2 { font-size: 12pt; color: #1d4ed8; margin: 16px 0 6px 0; border-bottom: 1px solid #bfdbfe; padding-bottom: 3px; }
  .section { margin-bottom: 12px; padding: 10px 14px; border-left: 3px solid #1d4ed8; background: #f8fafc; border-radius: 0 4px 4px 0; }
  .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; padding: 2px 8px; border-radius: 20px; font-family: monospace; font-size: 9pt; margin: 2px; }
  .objetivo { margin: 4px 0; page-break-inside: avoid; }
  .pdi-section { margin-top: 24px; padding: 14px; border: 2px solid #7c3aed; border-radius: 6px; background: #faf5ff; page-break-before: always; }
  .pdi-section h2 { color: #7c3aed; border-bottom-color: #ddd6fe; }
  pre { white-space: pre-wrap; font-family: inherit; font-size: 10pt; margin: 0; }
  .logo-area { display: flex; justify-content: space-between; align-items: center; }
  .planeprof-logo { font-size: 22px; }
</style>
</head>
<body>
<div class="header">
  <div class="logo-area">
    <div>
      <h1>${plano.titulo}</h1>
      <div class="meta">
        📚 ${plano.disciplina} &nbsp;|&nbsp; 🏫 ${plano.serie} &nbsp;|&nbsp; 📅 ${plano.bimestre}° Bimestre &nbsp;|&nbsp; 📝 ${new Date(plano.created_at).toLocaleDateString('pt-BR')}
      </div>
    </div>
    <div class="planeprof-logo">🎓</div>
  </div>
</div>

<h2>📚 Habilidades BNCC</h2>
<div>${plano.habilidades_bncc?.map(h => `<span class="badge">${h}</span>`).join(' ')}</div>

<h2>📖 Conteúdo Programático</h2>
<div class="section"><p>${plano.conteudo}</p></div>

<h2>🎯 Objetivos da Aula</h2>
<div class="section">
${plano.objetivos?.map((obj, i) => `<p class="objetivo"><strong>${i+1}.</strong> ${obj}</p>`).join('')}
</div>

<h2>📝 Desenvolvimento</h2>
<div class="section"><pre>${plano.desenvolvimento}</pre></div>

<h2>🏁 Conclusão e Reflexão</h2>
<div class="section"><p>${plano.conclusao}</p></div>

${plano.dinamica ? `<h2>🎮 Dinâmica / Jogo</h2><div class="section"><p>${plano.dinamica}</p></div>` : ''}

${pdiTexto ? `
<div class="pdi-section">
<h2>♿ PDI — Plano de Desenvolvimento Individual${pdiAluno ? ': ' + pdiAluno : ''}</h2>
<pre>${pdiTexto}</pre>
</div>
` : ''}

<script>window.onload = function(){ window.print(); setTimeout(function(){ window.close(); }, 1000); }</script>
</body>
</html>`

    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) {
      w.document.write(html)
      w.document.close()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">📋</div>
          <p className="text-gray-600 font-medium">Carregando planejamento...</p>
        </div>
      </div>
    )
  }

  if (!plano) return null

  const fontStyle = plano.tipo_letra === 'cursiva' ? { fontFamily: 'cursive' } : {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botões de ação */}
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
              ← Dashboard
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-sm font-bold text-blue-900 hidden sm:block truncate max-w-xs">{plano.titulo}</h1>
          </div>

          {/* Botões de download e PDI */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={downloadWord}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              📄 Baixar Word
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition shadow-sm"
            >
              🖨️ Baixar PDF
            </button>
            <button
              onClick={() => setMostrarPdiForm(!mostrarPdiForm)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-sm"
            >
              ♿ Converter para PDI
            </button>
          </div>
        </div>

        {/* Formulário PDI expansível */}
        {mostrarPdiForm && (
          <div className="border-t border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm font-semibold text-purple-800 mb-2">♿ Gerar PDI para aluno com necessidades especiais:</p>
              <div className="flex flex-wrap gap-2 items-end">
                <input
                  type="text"
                  value={pdiAluno}
                  onChange={e => setPdiAluno(e.target.value)}
                  placeholder="Nome do aluno (opcional)"
                  className="flex-1 min-w-40 border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                />
                <input
                  type="text"
                  value={pdiNecessidades}
                  onChange={e => setPdiNecessidades(e.target.value)}
                  placeholder="Necessidades: TEA, TDAH, dislexia, baixa visão..."
                  className="flex-1 min-w-48 border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                />
                <button
                  onClick={gerarPDI}
                  disabled={gerandoPdi}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50 whitespace-nowrap"
                >
                  {gerandoPdi ? '⏳ Gerando...' : '✅ Gerar PDI'}
                </button>
                <button
                  onClick={() => setMostrarPdiForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm px-2 py-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 print:py-4 print:px-8 space-y-4">
        {/* Banner do plano */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎓</span>
            <span className="text-base font-semibold opacity-75">Planeprof — Plano de Aula BNCC</span>
          </div>
          <h1 className="text-xl font-bold mb-3 leading-tight">{plano.titulo}</h1>
          <div className="flex flex-wrap gap-3 text-sm opacity-85">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {plano.disciplina}</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🏫 {plano.serie}</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">📅 {plano.bimestre}° Bimestre</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">📝 {new Date(plano.created_at).toLocaleDateString('pt-BR')}</span>
            {plano.tipo_letra && (
              <span className="bg-white/10 px-3 py-1 rounded-full">
                {plano.tipo_letra === 'cursiva' ? '✒️ Letra Cursiva' : '🖊️ Letra de Forma'}
              </span>
            )}
          </div>
        </div>

        {/* Habilidades BNCC */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-blue-700 mb-3">📚 Habilidades BNCC</h2>
          <div className="flex flex-wrap gap-2">
            {plano.habilidades_bncc?.map((h, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-mono">{h}</span>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-700 mb-2">📖 Conteúdo Programático</h2>
          <p className="text-gray-700" style={fontStyle}>{plano.conteudo}</p>
        </div>

        {/* Objetivos */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-green-700 mb-3">🎯 Objetivos da Aula</h2>
          <ul className="space-y-2">
            {plano.objetivos?.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700" style={fontStyle}>
                <span className="text-green-500 font-bold mt-0.5 shrink-0">{i+1}.</span>{obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Desenvolvimento */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-purple-700 mb-3">📝 Desenvolvimento</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" style={fontStyle}>{plano.desenvolvimento}</p>
          </div>
        </div>

        {/* Conclusão */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-orange-700 mb-3">🏁 Conclusão e Reflexão</h2>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed" style={fontStyle}>{plano.conclusao}</p>
          </div>
        </div>

        {/* Dinâmica */}
        {plano.dinamica && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-bold text-pink-700 mb-3">🎮 Dinâmica / Jogo</h2>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed" style={fontStyle}>{plano.dinamica}</p>
            </div>
          </div>
        )}

        {/* PDI Gerado */}
        {pdiTexto && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">♿</span>
              <div>
                <h2 className="text-lg font-bold text-purple-800">PDI — Plano de Desenvolvimento Individual</h2>
                {pdiAluno && <p className="text-sm text-purple-600">Aluno: {pdiAluno}</p>}
                {pdiNecessidades && <p className="text-sm text-purple-600">Necessidades: {pdiNecessidades}</p>}
              </div>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-purple-200">
              <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm" style={fontStyle}>{pdiTexto}</pre>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={downloadWord}
                className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                📄 Baixar Tudo em Word (com PDI)
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
              >
                🖨️ Baixar Tudo em PDF (com PDI)
              </button>
              <button
                onClick={() => { setPdiTexto(null); setMostrarPdiForm(true) }}
                className="flex items-center gap-1.5 border-2 border-purple-400 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition"
              >
                🔄 Regerar PDI
              </button>
            </div>
          </div>
        )}

        {/* CTA Baixar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm print:hidden">
          <h3 className="font-semibold text-gray-700 mb-3">📥 Exportar este planejamento</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadWord}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              📄 Baixar em Word (.doc)
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-700 transition shadow-sm"
            >
              🖨️ Baixar em PDF
            </button>
            {!pdiTexto && (
              <button
                onClick={() => setMostrarPdiForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-sm"
              >
                ♿ Converter para PDI
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3">💡 O Word pode ser editado no seu computador. O PDF é ideal para imprimir ou compartilhar.</p>
        </div>
      </main>
    </div>
  )
                }
