'use client'
import { useState } from 'react'
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
const SERIES = ['1º Ano','2º Ano','3º Ano','4º Ano','5º Ano','6º Ano','7º Ano','8º Ano','9º Ano','Infantil I','Infantil II','Infantil III','Infantil IV','Infantil V']

interface PlanoGerado {
  habilidades_bncc: string[]
  objetivos: string[]
  desenvolvimento: string
  conclusao: string
  dinamica: string
}

export default function NovoPlanejamentoPage() {
  const [form, setForm] = useState({
    disciplina:'',
    serie:'',
    bimestre:'1',
    conteudo:'',
    orientacoes:'',
    numObjetivos:'3',
    tipoLetra:'forma'
  })
  const [loading, setLoading] = useState(false)
  const [plano, setPlano] = useState<PlanoGerado | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [compartilharBiblioteca, setCompartilharBiblioteca] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
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

  const handleSalvar = async () => {
    if (!plano) return
    setSaving(true)
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return; }
    const titulo = form.conteudo.substring(0, 60) + ' - ' + form.disciplina + ' ' + form.serie
    const { data, error } = await supabase.from('planos_de_aula').insert({
      user_id: user.id,
      titulo,
      disciplina: form.disciplina,
      serie: form.serie,
      bimestre: parseInt(form.bimestre),
      conteudo: form.conteudo,
      habilidades_bncc: plano.habilidades_bncc,
      objetivos: plano.objetivos,
      desenvolvimento: plano.desenvolvimento,
      conclusao: plano.conclusao,
      dinamica: plano.dinamica,
      tipo_letra: form.tipoLetra,
      na_biblioteca: compartilharBiblioteca,
      status: 'concluido'
    }).select().single()
    if (error) {
      setError('Erro ao salvar. Tente novamente.')
    } else if (data) {
      router.push('/dashboard')
    }
    setSaving(false)
  }

  const fontClass = form.tipoLetra === 'cursiva' ? 'font-cursive' : ''

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
          <h1 className="text-xl font-bold text-blue-900">Novo Planejamento</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">📋 Dados do Planejamento</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleGerar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina *</label>
                <select name="disciplina" value={form.disciplina} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Selecione...</option>
                  {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Série/Ano *</label>
                <select name="serie" value={form.serie} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Selecione...</option>
                  {SERIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bimestre</label>
                <select name="bimestre" value={form.bimestre} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['1','2','3','4'].map(n => <option key={n} value={n}>{n}° Bimestre</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Objetivos</label>
                <select name="numObjetivos" value={form.numObjetivos} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} objetivo{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">✏️ Tipo de Letra das Atividades</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, tipoLetra: 'forma' }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition text-center ${form.tipoLetra === 'forma' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  <span className="block text-lg mb-1" style={{fontFamily: 'sans-serif'}}>Aa</span>
                  <span className="text-sm">Letra de Forma</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, tipoLetra: 'cursiva' }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition text-center ${form.tipoLetra === 'cursiva' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  <span className="block text-lg mb-1" style={{fontFamily: 'cursive'}}>Aa</span>
                  <span className="text-sm">Letra Cursiva</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo Programático *</label>
              <input type="text" name="conteudo" value={form.conteudo} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Frações - conceito e operações básicas" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orientações especiais (opcional)</label>
              <textarea name="orientacoes" value={form.orientacoes} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Incluir atividade prática, usar recursos visuais..." />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><span>⚙️</span> Gerando com IA...</> : <>🤖 Gerar Plano com IA</>}
            </button>
          </form>
        </div>

        {plano && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-blue-700">📚 Habilidades BNCC</h2>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${form.tipoLetra === 'cursiva' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {form.tipoLetra === 'cursiva' ? '✒️ Letra Cursiva' : '🖊️ Letra de Forma'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {plano.habilidades_bncc.map((h, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-mono">{h}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 text-green-700">🎯 Objetivos da Aula</h2>
              <ul className="space-y-2">
                {plano.objetivos.map((obj, i) => (
                  <li key={i} className={`flex items-start gap-2 text-gray-700 ${fontClass}`} style={form.tipoLetra === 'cursiva' ? {fontFamily: 'cursive'} : {}}>
                    <span className="text-green-500 mt-0.5">✓</span>{obj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 text-purple-700">📖 Desenvolvimento da Aula</h2>
              <p className={`text-gray-700 whitespace-pre-wrap leading-relaxed ${fontClass}`} style={form.tipoLetra === 'cursiva' ? {fontFamily: 'cursive'} : {}}>{plano.desenvolvimento}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 text-orange-700">🏁 Conclusão e Reflexão</h2>
              <p className={`text-gray-700 leading-relaxed ${fontClass}`} style={form.tipoLetra === 'cursiva' ? {fontFamily: 'cursive'} : {}}>{plano.conclusao}</p>
            </div>

            {plano.dinamica && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 text-pink-700">🎮 Dinâmica/Jogo</h2>
                <p className={`text-gray-700 leading-relaxed ${fontClass}`} style={form.tipoLetra === 'cursiva' ? {fontFamily: 'cursive'} : {}}>{plano.dinamica}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={compartilharBiblioteca}
                  onChange={e => setCompartilharBiblioteca(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-gray-800">📚 Compartilhar na Biblioteca Pública</span>
                  <p className="text-sm text-gray-500 mt-1">Ao marcar esta opção, seu plano ficará disponível para outros professores baixarem gratuitamente na Biblioteca de Planos.</p>
                </div>
              </label>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSalvar} disabled={saving} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                {saving ? 'Salvando...' : '💾 Salvar Planejamento'}
              </button>
              <button onClick={() => setPlano(null)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition">
                Refazer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
