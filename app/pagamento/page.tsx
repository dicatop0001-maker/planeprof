'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

export default function PagamentoPage() {
  const [plano, setPlano] = useState<'mensal' | 'anual'>('mensal')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comprovanteFile) {
      setErro('Selecione o comprovante de pagamento.')
      return
    }
    setEnviando(true)
    setErro('')
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/cadastro')
        return
      }
      const fileName = `${user.id}_${Date.now()}_${comprovanteFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(fileName, comprovanteFile, { upsert: true })
      if (uploadError) throw uploadError

      const { error: insertError } = await supabase
        .from('pagamentos')
        .insert({
          user_id: user.id,
          valor: plano === 'mensal' ? 9.90 : 100.00,
          tipo: plano,
          status: 'pendente',
          comprovante_url: fileName,
        })
      if (insertError) throw insertError

      setEnviado(true)
    } catch (err: any) {
      setErro('Erro ao enviar comprovante. Tente novamente.')
      console.error('Erro pagamento:', err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
          <h1 className="text-xl font-bold text-blue-900">Pagamento</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        {enviado ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Comprovante enviado!</h2>
            <p className="text-gray-600 mb-6">Seu pagamento será verificado em até 24 horas.</p>
            <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block">
              Voltar ao Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Escolha seu Plano</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => setPlano('mensal')}
                className={"p-4 rounded-xl border-2 transition " + (plano === 'mensal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300')}>
                <p className="font-bold text-lg">Mensal</p>
                <p className="text-2xl font-bold text-blue-600">R$ 9,90</p>
                <p className="text-sm text-gray-500">40 planos/mês</p>
              </button>
              <button onClick={() => setPlano('anual')}
                className={"p-4 rounded-xl border-2 transition " + (plano === 'anual' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300')}>
                <p className="font-bold text-lg">Anual</p>
                <p className="text-2xl font-bold text-blue-600">R$ 100,00</p>
                <p className="text-sm text-gray-500">40 planos/mês</p>
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Como pagar via PIX:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Selecione pagamento via PIX</li>
                <li>Use a chave: <strong>42988880353</strong></li>
                <li>Valor: <strong>{plano === 'mensal' ? 'R$ 9,90' : 'R$ 100,00'}</strong></li>
                <li>Tire foto do comprovante e envie abaixo</li>
              </ol>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Chave PIX</p>
              <p className="text-2xl font-bold text-gray-800 font-mono">42988880353</p>
            </div>
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{erro}</div>
            )}
            <form onSubmit={handleEnviar}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comprovante de Pagamento</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setComprovanteFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {enviando ? 'Enviando...' : 'Enviar Comprovante'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
