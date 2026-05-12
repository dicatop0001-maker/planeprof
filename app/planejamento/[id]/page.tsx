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

interface Questao {
  numero: number
  enunciado: string
  tipo: 'dissertativa' | 'multipla_escolha' | 'lacuna' | 'vf'
  alternativas?: string[]
  resposta_correta?: string
  linhas_resposta?: number
}

interface Atividade {
  numero: number
  titulo: string
  tipo: string
  nivel: string
  introducao?: string
  instrucao: string
  questoes?: Questao[]
  perguntas?: string[]
  gabarito?: string
  instrucaoDesenho?: string
  temDesenho?: boolean
  imagemUrl: string
  imagemDescricao?: string
  promptImagem: string
}

export default function PlanejamentoPage() {
  const [plano, setPlano] = useState<Plano | null>(null)
  const [loading, setLoading] = useState(true)
  const [pdiTexto, setPdiTexto] = useState<string | null>(null)
  const [gerandoPdi, setGerandoPdi] = useState(false)
  const [pdiAluno, setPdiAluno] = useState('')
  const [pdiNecessidades, setPdiNecessidades] = useState('')
  const [mostrarPdiForm, setMostrarPdiForm] = useState(false)
  const [atividades, setAtividades] = useState<Atividade[] | null>(null)
  const [gerandoAtiv, setGerandoAtiv] = useState(false)
  const [mostrarAtivForm, setMostrarAtivForm] = useState(false)
  const [numAtiv, setNumAtiv] = useState('5')
  const [nivelAtiv, setNivelAtiv] = useState('medio')
  const [erroAtiv, setErroAtiv] = useState<string | null>(null)
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
      if (error || !data) { router.push('/dashboard'); return }
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
          disciplina: plano.disciplina, serie: plano.serie,
          bimestre: String(plano.bimestre), conteudo: plano.conteudo,
          gerarPdi: true, pdiAluno, pdiNecessidades
        })
      })
      const data = await resp.json()
      if (data.plano?.pdi) { setPdiTexto(data.plano.pdi); setMostrarPdiForm(false) }
    } catch (e) { console.error(e) }
    finally { setGerandoPdi(false) }
  }

  const gerarAtividades = async () => {
    if (!plano) return
    setGerandoAtiv(true)
    setErroAtiv(null)
    try {
      const resp = await fetch('/api/gerar-atividade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina: plano.disciplina, serie: plano.serie,
          conteudo: plano.conteudo, nivel: nivelAtiv,
          quantidade: numAtiv, tipoLetra: plano.tipo_letra || 'forma',
          objetivos: plano.objetivos
        })
      })
      const data = await resp.json()
      if (data.atividades && Array.isArray(data.atividades)) {
        setAtividades(data.atividades)
        setMostrarAtivForm(false)
      } else if (data.error) {
        setErroAtiv(data.error)
      }
    } catch (e: any) {
      setErroAtiv('Erro ao conectar: ' + e.message)
    }
    finally { setGerandoAtiv(false) }
  }

  // Renderiza questoes de uma atividade (novo formato com alternativas)
  const renderQuestoes = (a: Atividade) => {
    // Novo formato com questoes estruturadas
    if (a.questoes && a.questoes.length > 0) {
      return a.questoes.map((q, i) => (
        <div key={i} className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-300">
          <p className="text-sm font-semibold text-gray-800 mb-2">{q.numero}. {q.enunciado}</p>
          {q.tipo === 'multipla_escolha' && q.alternativas && (
            <div className="ml-4 space-y-1">
              {q.alternativas.map((alt, j) => (
                <p key={j} className="text-sm text-gray-700 py-1 border-b border-gray-100 last:border-0">{alt}</p>
              ))}
            </div>
          )}
          {q.tipo === 'vf' && (
            <div className="ml-4 flex gap-6 mt-1">
              <label className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 border-2 border-gray-400 rounded inline-block"></span> Verdadeiro
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 border-2 border-gray-400 rounded inline-block"></span> Falso
              </label>
            </div>
          )}
          {q.tipo === 'dissertativa' && (
            <div className="ml-4 mt-2 space-y-1">
              {Array.from({ length: q.linhas_resposta || 3 }).map((_, j) => (
                <div key={j} className="border-b border-gray-400 h-6 w-full"></div>
              ))}
            </div>
          )}
          {q.tipo === 'lacuna' && (
            <p className="ml-4 mt-1 text-sm text-gray-600">Resposta: <span className="inline-block w-48 border-b-2 border-gray-500"></span></p>
          )}
        </div>
      ))
    }
    // Formato antigo (perguntas como array de strings)
    const linhas = a.perguntas || []
    return linhas.map((l, i) => (
      <p key={i} className="text-sm text-gray-600 font-mono py-0.5">{l}</p>
    ))
  }

  const temDesenho = (a: Atividade) => {
    return a.temDesenho || !!(a.instrucaoDesenho && a.instrucaoDesenho.length > 3)
  }

  const buildHtmlDoc = (comPdi: boolean, comAtiv: boolean) => {
    if (!plano) return ''
    const fontStyle = plano.tipo_letra === 'cursiva'
      ? 'font-family:cursive;'
      : 'font-family:Arial,sans-serif;'
    let atividadesHtml = ''
    if (comAtiv && atividades && atividades.length > 0) {
      atividadesHtml = `<div style="page-break-before:always">
<h2 style="color:#be185d;font-size:18px;border-bottom:2px solid #be185d;padding-bottom:6px;margin-bottom:16px">Atividades Impressas</h2>
${atividades.map(a => {
  const questoesHtml = (a.questoes && a.questoes.length > 0)
    ? a.questoes.map(q => {
        let qHtml = `<div style="margin-bottom:12px;padding:10px;background:#f9f9f9;border-left:3px solid #3b82f6;border-radius:4px">
<p style="font-weight:600;font-size:11px;color:#1f2937;margin:0 0 6px 0">${q.numero}. ${q.enunciado}</p>`
        if (q.tipo === 'multipla_escolha' && q.alternativas) {
          qHtml += q.alternativas.map(alt => `<p style="font-size:10px;color:#374151;margin:3px 0 3px 12px">&#9633; ${alt}</p>`).join('')
        } else if (q.tipo === 'vf') {
          qHtml += `<p style="font-size:10px;color:#374151;margin:3px 0 3px 12px">&#9633; Verdadeiro &nbsp;&nbsp; &#9633; Falso</p>`
        } else if (q.tipo === 'dissertativa') {
          const n2 = q.linhas_resposta || 3
          qHtml += Array(n2).fill('<div style="border-bottom:1px solid #9ca3af;height:20px;margin:4px 0"></div>').join('')
        } else {
          qHtml += `<p style="font-size:10px;color:#374151;margin:4px 0 4px 12px">Resposta: <span style="display:inline-block;width:200px;border-bottom:1px solid #374151">&nbsp;</span></p>`
        }
        qHtml += '</div>'
        return qHtml
      }).join('')
    : (a.perguntas || []).map((l: string) => `<p style="color:#4b5563;font-size:11px;margin:3px 0">${l}</p>`).join('')
  const gabaritoHtml = a.gabarito ? `<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:4px;padding:6px 10px;margin-top:8px"><p style="font-size:10px;color:#92400e;margin:0"><strong>&#128203; ${a.gabarito}</strong></p></div>` : ''
  return `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px;page-break-inside:avoid">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
<span style="background:#fdf2f8;color:#be185d;border:1px solid #fbcfe8;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600">Atividade ${a.numero}</span>
<span style="background:#f3f4f6;color:#6b7280;padding:3px 8px;border-radius:20px;font-size:11px">${a.tipo}</span>
<span style="background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:20px;font-size:11px">Nivel: ${a.nivel}</span>
</div>
<h3 style="color:#1f2937;font-size:14px;margin:0 0 8px 0">${a.titulo}</h3>
<div style="display:flex;gap:16px;align-items:flex-start">
<img src="${a.imagemUrl}" alt="Ilustracao" style="width:140px;height:100px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;flex-shrink:0" />
<div style="flex:1">
${a.introducao ? `<p style="color:#374151;font-size:11px;margin:0 0 8px 0;padding:6px;background:#eff6ff;border-radius:4px;line-height:1.5">${a.introducao}</p>` : ''}
<p style="color:#374151;font-size:11px;font-weight:600;margin:0 0 8px 0">${a.instrucao}</p>
${questoesHtml}
${gabaritoHtml}
</div>
</div>
</div>`
}).join('')}
</div>`
    }
    let pdiHtml = ''
    if (comPdi && pdiTexto) {
      pdiHtml = `<div style="page-break-before:always;padding:20px;border:2px solid #7c3aed;border-radius:8px;background:#faf5ff">
<h2 style="color:#7c3aed;font-size:16px;margin:0 0 12px 0">PDI Adaptado${pdiAluno ? ' - ' + pdiAluno : ''}</h2>
<pre style="white-space:pre-wrap;font-family:inherit;font-size:11px;color:#374151;line-height:1.6">${pdiTexto}</pre>
</div>`
    }
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${plano.titulo}</title>
<style>@page{margin:18mm 14mm;size:A4}body{${fontStyle}color:#111;line-height:1.6;font-size:11pt}</style>
</head><body>
<div style="background:#1e3a8a;color:white;padding:20px;border-radius:8px;margin-bottom:20px">
<div style="font-size:12px;opacity:0.7;margin-bottom:4px">Planeprof - Plano de Aula BNCC</div>
<h1 style="font-size:18px;margin:0 0 8px 0;color:white">${plano.titulo}</h1>
<div style="font-size:11px;opacity:0.8">Disciplina: ${plano.disciplina} | Serie: ${plano.serie} | ${plano.bimestre}. Bimestre | ${new Date(plano.created_at).toLocaleDateString('pt-BR')}</div>
</div>
<h2 style="color:#1d4ed8;font-size:13px;margin:16px 0 6px">Habilidades BNCC</h2>
<div>${(plano.habilidades_bncc || []).map(h => `<span style="background:#dbeafe;color:#1d4ed8;border:1px solid #93c5fd;padding:2px 8px;border-radius:20px;font-family:monospace;font-size:10px;margin:2px;display:inline-block">${h}</span>`).join(' ')}</div>
<h2 style="color:#1d4ed8;font-size:13px;margin:16px 0 6px">Conteudo Programatico</h2>
<div style="border-left:3px solid #1d4ed8;padding:8px 12px;background:#f8fafc"><p>${plano.conteudo}</p></div>
<h2 style="color:#1d4ed8;font-size:13px;margin:16px 0 6px">Objetivos</h2>
<div style="border-left:3px solid #16a34a;padding:8px 12px;background:#f0fdf4">${(plano.objetivos || []).map((o, i) => `<p style="margin:4px 0"><strong>${i+1}.</strong> ${o}</p>`).join('')}</div>
<h2 style="color:#1d4ed8;font-size:13px;margin:16px 0 6px">Desenvolvimento</h2>
<div style="border-left:3px solid #7c3aed;padding:8px 12px;background:#faf5ff"><pre style="white-space:pre-wrap;font-family:inherit;font-size:10pt;margin:0">${plano.desenvolvimento}</pre></div>
<h2 style="color:#1d4ed8;font-size:13px;margin:16px 0 6px">Conclusao e Reflexao</h2>
<div style="border-left:3px solid #ea580c;padding:8px 12px;background:#fff7ed"><p>${plano.conclusao}</p></div>
${plano.dinamica ? `<h2 style="color:#1d4ed8;font-size:13px;margin:16px 0 6px">Dinamica / Jogo</h2><div style="border-left:3px solid #db2777;padding:8px 12px;background:#fdf2f8"><p>${plano.dinamica}</p></div>` : ''}
${atividadesHtml}${pdiHtml}
<hr style="margin-top:30px;border-color:#e5e7eb">
<p style="font-size:10px;color:#9ca3af;text-align:center">Gerado pelo Planeprof - planeprof.vercel.app</p>
</body></html>`
  }

  const downloadWord = (comAtiv = false) => {
    if (!plano) return
    const html = buildHtmlDoc(!!pdiTexto, comAtiv)
    const blob = new Blob([html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = plano.titulo.replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, '').replace(/ /g, '_').substring(0, 50) + '.doc'
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  const downloadPDF = (comAtiv = false) => {
    if (!plano) return
    const html = buildHtmlDoc(!!pdiTexto, comAtiv) + '<script>window.onload=function(){window.print();setTimeout(function(){window.close()},1500)}<' + '/script>'
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close() }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><div className="text-4xl mb-3 animate-bounce">📚</div><p className="text-gray-600">Carregando planejamento...</p></div>
    </div>
  )
  if (!plano) return null

  const fontStyle = plano.tipo_letra === 'cursiva' ? { fontFamily: 'cursive' } : {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sticky */}
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm shrink-0">← Dashboard</Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <h1 className="text-sm font-bold text-blue-900 hidden sm:block truncate max-w-xs">{plano.titulo}</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => downloadWord(!!atividades)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">📄 Word</button>
            <button onClick={() => downloadPDF(!!atividades)} className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">🖸️ PDF</button>
            <button onClick={() => setMostrarAtivForm(!mostrarAtivForm)} className="flex items-center gap-1 bg-pink-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition">🎨 Atividade Impressa</button>
            <button onClick={() => setMostrarPdiForm(!mostrarPdiForm)} className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition">♿ PDI</button>
          </div>
        </div>

        {/* Painel: Gerar Atividades */}
        {mostrarAtivForm && (
          <div className="border-t border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-3">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm font-semibold text-pink-800 mb-2">🎨 Gerar atividade impressa de alta qualidade com questões diversificadas:</p>
              <div className="flex flex-wrap gap-2 items-end">
                <div>
                  <label className="text-xs text-pink-700 font-medium">Quantidade de Atividades</label>
                  <select value={numAtiv} onChange={e => setNumAtiv(e.target.value)} className="block mt-1 border border-pink-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} atividade{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-pink-700 font-medium">Nível</label>
                  <select value={nivelAtiv} onChange={e => setNivelAtiv(e.target.value)} className="block mt-1 border border-pink-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white">
                    <option value="facil">😊 Fácil</option>
                    <option value="medio">🤔 Médio</option>
                    <option value="dificil">🧠 Difícil</option>
                  </select>
                </div>
                <button onClick={gerarAtividades} disabled={gerandoAtiv} className="bg-pink-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-pink-700 transition disabled:opacity-50 mt-3">
                  {gerandoAtiv ? '⏳ Gerando atividades com IA...' : '✨ Gerar Atividades com IA'}
                </button>
                <button onClick={() => setMostrarAtivForm(false)} className="text-gray-400 hover:text-gray-600 text-sm px-2 py-2 mt-3">✕</button>
              </div>
              {erroAtiv && <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {erroAtiv}</p>}
              <p className="text-xs text-pink-600 mt-2">💡 As atividades são geradas pelo GPT-4o com questões específicas e aprofundadas sobre <strong>{plano.conteudo}</strong></p>
            </div>
          </div>
        )}

        {/* Painel: PDI */}
        {mostrarPdiForm && (
          <div className="border-t border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm font-semibold text-purple-800 mb-2">♿ Gerar PDI — adaptação para aluno com necessidades especiais:</p>
              <div className="flex flex-wrap gap-2 items-end">
                <input type="text" value={pdiAluno} onChange={e => setPdiAluno(e.target.value)}
                  placeholder="Nome do aluno (opcional)"
                  className="flex-1 min-w-40 border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white" />
                <input type="text" value={pdiNecessidades} onChange={e => setPdiNecessidades(e.target.value)}
                  placeholder="Necessidades: TEA, TDAH, dislexia, baixa visão..."
                  className="flex-1 min-w-48 border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white" />
                <button onClick={gerarPDI} disabled={gerandoPdi}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                  {gerandoPdi ? '⏳ Gerando...' : '✅ Gerar PDI'}
                </button>
                <button onClick={() => setMostrarPdiForm(false)} className="text-gray-400 hover:text-gray-600 text-sm px-2 py-2">✕</button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎓</span>
            <span className="text-base font-semibold opacity-75">Planeprof — Plano de Aula BNCC</span>
          </div>
          <h1 className="text-xl font-bold mb-3 leading-tight">{plano.titulo}</h1>
          <div className="flex flex-wrap gap-2 text-sm opacity-85">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {plano.disciplina}</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🏫 {plano.serie}</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">📅 {plano.bimestre}° Bimestre</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">📝 {new Date(plano.created_at).toLocaleDateString('pt-BR')}</span>
            {plano.tipo_letra && <span className="bg-white/10 px-3 py-1 rounded-full">{plano.tipo_letra === 'cursiva' ? '✂️ Letra Cursiva' : '🖊️ Letra de Forma'}</span>}
          </div>
        </div>

        {/* Habilidades BNCC */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-blue-700 mb-3">📚 Habilidades BNCC</h2>
          <div className="flex flex-wrap gap-2">
            {(plano.habilidades_bncc || []).map((h, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-mono">{h}</span>
            ))}
          </div>
        </div>

        {/* Conteudo */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-700 mb-2">📖 Conteúdo Programático</h2>
          <p className="text-gray-700" style={fontStyle}>{plano.conteudo}</p>
        </div>

        {/* Objetivos */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-green-700 mb-3">🎯 Objetivos</h2>
          <ul className="space-y-2">
            {(plano.objetivos || []).map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700" style={fontStyle}>
                <span className="text-green-500 font-bold mt-0.5 shrink-0">{i + 1}.</span>{obj}
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

        {/* Conclusao */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-orange-700 mb-3">🏁 Conclusão e Reflexão</h2>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed" style={fontStyle}>{plano.conclusao}</p>
          </div>
        </div>

        {/* Dinamica */}
        {plano.dinamica && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-bold text-pink-700 mb-3">🎮 Dinâmica / Jogo</h2>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed" style={fontStyle}>{plano.dinamica}</p>
            </div>
          </div>
        )}

        {/* ===== ATIVIDADES IMPRESSAS ===== */}
        {atividades && atividades.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gradient-to-r from-pink-600 to-rose-600 text-white p-4 rounded-2xl flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h2 className="text-lg font-bold">Atividades Impressas com IA</h2>
                  <p className="text-pink-100 text-sm">{atividades.length} atividade{atividades.length > 1 ? 's' : ''} — {plano.conteudo}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => downloadWord(true)} className="bg-white text-pink-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-pink-50 transition">📄 Word c/ Atividades</button>
                <button onClick={() => downloadPDF(true)} className="bg-white text-pink-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-pink-50 transition">🖸️ PDF c/ Atividades</button>
                <button onClick={() => { setMostrarAtivForm(true); setAtividades(null) }} className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/30 transition">🔄 Regerar</button>
              </div>
            </div>

            {atividades.map(a => (
              <div key={a.numero} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Cabecalho da Atividade */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-4 border-b border-pink-100">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">Atividade {a.numero}</span>
                    <span className="bg-white text-gray-600 border border-gray-200 px-2 py-1 rounded-full text-xs">{a.tipo}</span>
                    <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full text-xs">📊 {a.nivel}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">{a.titulo}</h3>
                </div>

                <div className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    {/* Imagem */}
                    <div className="sm:w-40 shrink-0">
                      <img
                        src={a.imagemUrl}
                        alt={a.imagemDescricao || 'Atividade ' + a.numero}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                        loading="lazy"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg'
                        }}
                      />
                      {a.imagemDescricao && <p className="text-xs text-gray-400 mt-1 leading-tight">{a.imagemDescricao}</p>}
                    </div>

                    {/* Introducao e instrucao */}
                    <div className="flex-1">
                      {a.introducao && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                          <p className="text-sm text-blue-800 leading-relaxed" style={fontStyle}>{a.introducao}</p>
                        </div>
                      )}
                      <p className="text-sm font-semibold text-gray-700 mb-3" style={fontStyle}>{a.instrucao}</p>
                    </div>
                  </div>

                  {/* Questoes */}
                  <div className="space-y-1">
                    {renderQuestoes(a)}
                  </div>

                  {/* Gabarito */}
                  {a.gabarito && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800 font-medium">📋 {a.gabarito}</p>
                    </div>
                  )}

                  {/* Desenho (formato antigo) */}
                  {temDesenho(a) && (
                    <>
                      {a.instrucaoDesenho && (
                        <p className="text-sm text-gray-600 mt-3 font-medium" style={fontStyle}>{a.instrucaoDesenho}</p>
                      )}
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400 text-sm">✏️ Espaço para desenho</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PDI */}
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
              <button onClick={() => downloadWord(!!atividades)} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">📄 Word (com PDI)</button>
              <button onClick={() => downloadPDF(!!atividades)} className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">🖸️ PDF (com PDI)</button>
              <button onClick={() => setMostrarPdiForm(true)} className="flex items-center gap-1 border-2 border-purple-400 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition">🔄 Regerar PDI</button>
            </div>
          </div>
        )}

        {/* CTA exportar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm print:hidden">
          <h3 className="font-semibold text-gray-700 mb-3">📥 Exportar este planejamento</h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => downloadWord(!!atividades)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm">📄 Baixar em Word (.doc)</button>
            <button onClick={() => downloadPDF(!!atividades)} className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-700 transition shadow-sm">🖸️ Baixar em PDF</button>
            {!atividades && <button onClick={() => setMostrarAtivForm(true)} className="flex items-center gap-2 bg-pink-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-pink-700 transition shadow-sm">🎨 Gerar Atividade Impressa</button>}
            {!pdiTexto && <button onClick={() => setMostrarPdiForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-sm">♿ Converter para PDI</button>}
          </div>
          <p className="text-xs text-gray-400 mt-3">💡 Os downloads incluem PDI e atividades geradas, se houver.</p>
        </div>
      </main>
    </div>
  )
}
