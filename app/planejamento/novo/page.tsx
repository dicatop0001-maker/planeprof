'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

const DISCIPLINAS = ['Matemática','Língua Portuguesa','Ciências','História','Geografia','Arte','Educação Física','Ensino Religioso','Inglês']
const SERIES = ['Berçário I','Berçário II','Infantil I','Infantil II','Infantil III','Infantil IV','Infantil V','1º Ano','2º Ano','3º Ano','4º Ano','5º Ano','6º Ano','7º Ano','8º Ano','9º Ano']

interface PlanoGerado {
  habilidades_bncc: string[]
  objetivos: string[]
  desenvolvimento: string
  conclusao: string
  dinamica: string
  pdi?: string
}

export default function NovoPlanejamentoPage() {
  const [form, setForm] = useState({
    disciplina:'', serie:'', bimestre:'1', conteudo:'', orientacoes:'',
    numObjetivos:'3', tipoLetra:'forma', numAulas:'1', numAtividades:'2', nivelAtividade:'medio'
  })
  const [logoPreview, setLogoPreview] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingSection, setLoadingSection] = useState<string|null>(null)
  const [plano, setPlano] = useState<PlanoGerado | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [compartilharBiblioteca, setCompartilharBiblioteca] = useState(false)
  const [pdiMode, setPdiMode] = useState(false)
  const [pdiAluno, setPdiAluno] = useState('')
  const [pdiNecessidades, setPdiNecessidades] = useState('')
  const [gerandoPdi, setGerandoPdi] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGerar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPlano(null)
    try {
      const resp = await fetch('/api/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Erro ao gerar plano')
      setPlano(data.plano)
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar plano.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegerar = async (secao: string) => {
    setLoadingSection(secao)
    try {
      const resp = await fetch('/api/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, regenerar: secao })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Erro')
      if (plano && data.plano) {
        setPlano(prev => prev ? { ...prev, [secao]: data.plano[secao] } : data.plano)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingSection(null)
    }
  }

  const handleGerarPDI = async () => {
    if (!plano) return
    setGerandoPdi(true)
    try {
      const resp = await fetch('/api/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, gerarPdi: true, pdiAluno, pdiNecessidades })
      })
      const data = await resp.json()
      if (data.plano?.pdi) {
        setPlano(prev => prev ? { ...prev, pdi: data.plano.pdi } : prev)
      }
    } catch(err: any) {
      setError(err.message)
    } finally {
      setGerandoPdi(false)
    }
  }

  const handleSalvar = async () => {
    if (!plano) return
    setSaving(true)
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return; }
    const titulo = form.conteudo.substring(0, 60) + ' - ' + form.disciplina + ' ' + form.serie
    const { data, error } = await supabase.from('planos_de_aula').insert({
      user_id: user.id, titulo, disciplina: form.disciplina, serie: form.serie,
      bimestre: parseInt(form.bimestre), conteudo: form.conteudo,
      habilidades_bncc: plano.habilidades_bncc, objetivos: plano.objetivos,
      desenvolvimento: plano.desenvolvimento, conclusao: plano.conclusao,
      dinamica: plano.dinamica, tipo_letra: form.tipoLetra,
      na_biblioteca: compartilharBiblioteca, status: 'concluido'
    }).select().single()
    if (error) {
      setError('Erro ao salvar. Tente novamente.')
    } else if (data) {
      router.push('/dashboard')
    }
    setSaving(false)
  }

  const fontStyle = form.tipoLetra === 'cursiva' ? { fontFamily: 'cursive' } : {}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
            <h1 className="text-xl font-bold text-blue-900">Novo Planejamento</h1>
          </div>
          {logoPreview && (
            <img src={logoPreview} alt="Logo escola" className="h-12 w-auto object-contain rounded" />
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Card Escola */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">🏫 Dados da Escola</h2>
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
            >
              📷 Upload Logo da Escola
            </button>
            <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
          </div>
          {logoPreview && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain" />
              <div>
                <p className="text-sm font-medium text-gray-700">Logo carregado com sucesso!</p>
                <button onClick={() => setLogoPreview(null)} className="text-xs text-red-500 hover:underline">Remover</button>
              </div>
            </div>
          )}
        </div>

        {/* Card Dados */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">📋 Dados do Planejamento</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleGerar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina *</label>
                <select name="disciplina" value={form.disciplina} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Selecione...</option>
                  {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Série/Ano *</label>
                <select name="serie" value={form.serie} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Selecione...</option>
                  {SERIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bimestre</label>
                <select name="bimestre" value={form.bimestre} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['1','2','3','4'].map(n => <option key={n} value={n}>{n}° Bimestre</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Aulas</label>
                <select name="numAulas" value={form.numAulas} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} aula{n>1?'s':''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Objetivos</label>
                <select name="numObjetivos" value={form.numObjetivos} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} objetivo{n>1?'s':''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Atividades</label>
                <select name="numAtividades" value={form.numAtividades} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} atividade{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>

            {/* Nível de dificuldade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Nível das Atividades</label>
              <div className="flex gap-3">
                {[
                  {val:'facil', label:'😊 Fácil', color:'green'},
                  {val:'medio', label:'🤔 Médio', color:'yellow'},
                  {val:'dificil', label:'🧠 Difícil', color:'red'}
                ].map(({val, label, color}) => (
                  <button key={val} type="button"
                    onClick={() => setForm(prev => ({...prev, nivelAtividade: val}))}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 font-semibold transition text-sm ${
                      form.nivelAtividade === val
                        ? color === 'green' ? 'border-green-500 bg-green-50 text-green-700'
                          : color === 'yellow' ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Tipo de letra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">✏️ Tipo de Letra das Atividades</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm(prev => ({ ...prev, tipoLetra: 'forma' }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition text-center ${form.tipoLetra === 'forma' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                  <span className="block text-lg mb-1" style={{fontFamily: 'sans-serif'}}>Aa</span>
                  <span className="text-sm">Letra de Forma</span>
                </button>
                <button type="button" onClick={() => setForm(prev => ({ ...prev, tipoLetra: 'cursiva' }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition text-center ${form.tipoLetra === 'cursiva' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                  <span className="block text-lg mb-1" style={{fontFamily: 'cursive'}}>Aa</span>
                  <span className="text-sm">Letra Cursiva</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo Programático *</label>
              <input type="text" name="conteudo" value={form.conteudo} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Frações - conceito e operações básicas" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">⚙️ Orientações especiais (opcional)</label>
              <textarea name="orientacoes" value={form.orientacoes} onChange={handleChange} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Incluir atividade prática, usar recursos visuais, jogos cooperativos..." />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><span>⚙️</span> Gerando com IA...</> : <>🤖 Gerar Plano Completo com IA</>}
            </button>
          </form>
        </div>

        {/* PDI Button - sempre visível se disciplina e série preenchidas */}
        {form.disciplina && form.serie && !plano && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">♿</span>
                  <h3 className="text-xl font-bold">PDI - Plano de Desenvolvimento Individual</h3>
                </div>
                <p className="text-purple-100 text-sm">Gere um plano adaptado para alunos com necessidades especiais, com recursos visuais e cronogramas ilustrados.</p>
              </div>
              <button
                type="button"
                onClick={() => setPdiMode(!pdiMode)}
                className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition shadow-md flex items-center gap-2"
              >
                {pdiMode ? '✕ Fechar PDI' : '♿ Criar PDI'}
              </button>
            </div>
            {pdiMode && (
              <div className="mt-4 space-y-3 bg-white/10 rounded-xl p-4">
                <p className="text-sm font-medium text-white">Preencha para personalizar o PDI:</p>
                <input
                  type="text"
                  value={pdiAluno}
                  onChange={e => setPdiAluno(e.target.value)}
                  placeholder="Nome do aluno (opcional)"
                  className="w-full border border-white/30 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <textarea
                  value={pdiNecessidades}
                  onChange={e => setPdiNecessidades(e.target.value)}
                  rows={3}
                  placeholder="Necessidades específicas: Ex: TEA, TDAH, baixa visão, dislexia... descreva as necessidades do aluno."
                  className="w-full border border-white/30 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <p className="text-xs text-purple-100">💡 Primeiro gere o plano principal, depois o PDI será adaptado automaticamente.</p>
              </div>
            )}
          </div>
        )}

        {plano && (
          <div className="space-y-4">
            {/* Header do plano gerado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5 text-white flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {logoPreview && <img src={logoPreview} alt="Logo" className="h-12 w-auto object-contain bg-white rounded p-1" />}
                <div>
                  <h2 className="text-xl font-bold">Plano de Aula Gerado! ✅</h2>
                  <p className="text-blue-100 text-sm">{form.disciplina} • {form.serie} • {form.bimestre}° Bimestre • {form.numAulas} aula{parseInt(form.numAulas)>1?'s':''}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold bg-white/20 ${form.tipoLetra === 'cursiva' ? 'text-purple-200' : 'text-blue-200'}`}>
                {form.tipoLetra === 'cursiva' ? '✒️ Letra Cursiva' : '🖊️ Letra de Forma'}
              </span>
            </div>

            {/* Habilidades BNCC */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-blue-700">📚 Habilidades BNCC</h2>
                <button onClick={() => handleRegerar('habilidades_bncc')} disabled={loadingSection === 'habilidades_bncc'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition border border-blue-200">
                  {loadingSection === 'habilidades_bncc' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {plano.habilidades_bncc.map((h, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-mono">{h}</span>
                ))}
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-700">🎯 Objetivos da Aula</h2>
                <button onClick={() => handleRegerar('objetivos')} disabled={loadingSection === 'objetivos'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition border border-green-200">
                  {loadingSection === 'objetivos' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <ul className="space-y-2">
                {plano.objetivos.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700" style={fontStyle}>
                    <span className="text-green-500 mt-0.5 font-bold">{i+1}.</span>{obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Desenvolvimento */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-purple-700">📖 Desenvolvimento da Aula</h2>
                <button onClick={() => handleRegerar('desenvolvimento')} disabled={loadingSection === 'desenvolvimento'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition border border-purple-200">
                  {loadingSection === 'desenvolvimento' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" style={fontStyle}>{plano.desenvolvimento}</p>
              </div>
              <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                <span>⚙️</span> Para personalizar o desenvolvimento, use o campo de orientações especiais acima e regenere.
              </div>
            </div>

            {/* Conclusão */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-orange-700">🏁 Conclusão e Reflexão</h2>
                <button onClick={() => handleRegerar('conclusao')} disabled={loadingSection === 'conclusao'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition border border-orange-200">
                  {loadingSection === 'conclusao' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed" style={fontStyle}>{plano.conclusao}</p>
              </div>
            </div>

            {/* Dinâmica / Jogo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-pink-700">🎮 Dinâmica/Jogo</h2>
                <button onClick={() => handleRegerar('dinamica')} disabled={loadingSection === 'dinamica'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition border border-pink-200">
                  {loadingSection === 'dinamica' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed" style={fontStyle}>{plano.dinamica}</p>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 font-medium">🎨 Prompt para gerar imagem desta dinâmica:</p>
                <p className="text-xs text-yellow-600 mt-1 italic">"Ilustração colorida e lúdica para crianças de {form.serie}, mostrando crianças brincando e aprendendo {form.conteudo} em sala de aula, estilo cartoon educativo brasileiro, cores vibrantes"</p>
              </div>
            </div>

            {/* PDI Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">♿</span>
                  <div>
                    <h3 className="text-xl font-bold">PDI - Plano de Desenvolvimento Individual</h3>
                    <p className="text-purple-100 text-sm">Adaptação inclusiva para alunos com necessidades especiais</p>
                  </div>
                </div>
                <button onClick={handleGerarPDI} disabled={gerandoPdi}
                  className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition shadow-md flex items-center gap-2">
                  {gerandoPdi ? '⏳ Gerando PDI...' : '♿ Gerar PDI Adaptado'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <input type="text" value={pdiAluno} onChange={e => setPdiAluno(e.target.value)}
                  placeholder="Nome do aluno (opcional)"
                  className="border border-white/30 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white text-sm" />
                <input type="text" value={pdiNecessidades} onChange={e => setPdiNecessidades(e.target.value)}
                  placeholder="Necessidades: TEA, TDAH, dislexia, baixa visão..."
                  className="border border-white/30 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white text-sm" />
              </div>
              {plano.pdi && (
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm font-semibold mb-2">📋 PDI Gerado:</p>
                  <p className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">{plano.pdi}</p>
                  <button onClick={() => handleRegerar('pdi')} disabled={loadingSection === 'pdi'}
                    className="mt-3 flex items-center gap-1 text-xs px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition">
                    {loadingSection === 'pdi' ? '⏳...' : '🔄 Regerar PDI'}
                  </button>
                </div>
              )}
              {!plano.pdi && (
                <div className="bg-white/10 rounded-xl p-4 text-sm text-white/80">
                  <p className="font-medium mb-2">O PDI incluirá:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✅ Adaptação do conteúdo "{form.conteudo}" para as necessidades específicas</li>
                    <li>✅ Recursos visuais e cronogramas ilustrados</li>
                    <li>✅ Estratégias de comunicação alternativa e aumentativa</li>
                    <li>✅ Ênfase nas potencialidades individuais do aluno</li>
                    <li>✅ Objetivos funcionais e adaptados</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Compartilhar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={compartilharBiblioteca} onChange={e => setCompartilharBiblioteca(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <span className="font-semibold text-gray-800">📚 Compartilhar na Biblioteca Pública</span>
                  <p className="text-sm text-gray-500 mt-1">Ao marcar esta opção, seu plano ficará disponível para outros professores baixarem gratuitamente.</p>
                </div>
              </label>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSalvar} disabled={saving}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                {saving ? 'Salvando...' : '💾 Salvar Planejamento'}
              </button>
              <button onClick={() => { setPlano(null); setError('') }}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition">
                🔄 Refazer Tudo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
